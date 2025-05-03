import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Chart } from "src/interfaces/chart.interface";
import { Song, SongQuery } from "src/interfaces/song.interface";
import { escapeRegex, shuffleArray } from "src/utils";

@Injectable()
export class SongsService {
  constructor(
    @Inject("SONG_MODEL")
    private songsModel: Model<Song>,
  ) {}

  async findSongs(
    title: string,
    artist: string,
    nextId: string,
    category: string,
    version: string,
    minLevel: number,
    maxLevel: number,
    fuzzy: boolean,
  ): Promise<Song[]> {
    const sanitizedTitle = escapeRegex(title);
    const sanitizedArtist = escapeRegex(artist);

    const query: SongQuery = {
      artist: { $regex: sanitizedArtist, $options: "i" },
    };

    if (fuzzy) {
      query.alternateTitle = { $regex: sanitizedTitle, $options: "i" };
    } else {
      query.title = { $regex: sanitizedTitle, $options: "i" };
    }

    if (nextId) {
      query._id = { $lt: nextId };
    }

    if (category) {
      query.category = category;
    }

    if (version) {
      query.version = version;
    }

    if (minLevel || maxLevel) {
      query.difficulties = {
        $elemMatch: {},
      };

      if (minLevel) {
        query.difficulties.$elemMatch.internalLevel = { $gte: minLevel };
      }

      if (maxLevel) {
        query.difficulties.$elemMatch.internalLevel =
          query.difficulties.$elemMatch.internalLevel || {};
        query.difficulties.$elemMatch.internalLevel.$lte = maxLevel;
      }
    }

    const songs = await this.songsModel.find(query).sort({ _id: -1 }).limit(10);

    const filteredSongs = songs.map((song) => {
      const filteredDifficulties = song.difficulties.filter(
        (difficulty) =>
          difficulty.internalLevel >= minLevel &&
          difficulty.internalLevel <= maxLevel,
      );
      return { ...song.toObject(), difficulties: filteredDifficulties };
    });

    return filteredSongs as Song[];
  }

  async getRandomSongs(
    minLevel: number,
    maxLevel: number,
    songCount: number,
  ): Promise<Chart[]> {
    const songs: Song[] = await this.songsModel.aggregate([
      {
        $match: {
          difficulties: {
            $elemMatch: {
              internalLevel: {
                $lte: maxLevel,
                $gte: minLevel,
              },
            },
          },
        },
      },
      { $sample: { size: songCount } },
    ]);

    const charts: Chart[] = [];
    for (const song of songs) {
      for (const difficulty of song.difficulties) {
        if (
          difficulty.internalLevel < minLevel ||
          difficulty.internalLevel > maxLevel
        ) {
          continue;
        }
        charts.push({
          artist: song.artist,
          category: song.category,
          version: song.version,
          title: song.title,
          cover: song.cover,
          difficulty: difficulty.difficulty,
          level: difficulty.level,
          internalLevel: difficulty.internalLevel,
          songId: song._id,
        });
      }
    }

    return shuffleArray(charts).slice(0, songCount);
  }

  async getSongById(id: string): Promise<Song | null> {
    const song = await this.songsModel.findById(id);
    return song;
  }

  async getVersions(): Promise<string[]> {
    const versions = await this.songsModel.distinct("version");
    return versions;
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.songsModel.distinct("category");
    return categories;
  }
}
