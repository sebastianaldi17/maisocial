import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Song, SongQuery } from "src/interfaces/song.interface";
import { escapeRegex } from "src/utils";

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
  ): Promise<Song[]> {
    const sanitizedTitle = escapeRegex(title);
    const sanitizedArtist = escapeRegex(artist);

    const query: SongQuery = {
      title: { $regex: sanitizedTitle, $options: "i" },
      artist: { $regex: sanitizedArtist, $options: "i" },
    };

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
