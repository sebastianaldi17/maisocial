import { Inject, Injectable } from "@nestjs/common";
import { Model, RootFilterQuery } from "mongoose";
import { Song } from "src/interfaces/song.interface";

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
  ): Promise<Song[]> {
    const query: RootFilterQuery<any> = {
      title: { $regex: title, $options: "i" },
      artist: { $regex: artist, $options: "i" },
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

    const songs = await this.songsModel.find(query).sort({ _id: -1 }).limit(10);

    return songs;
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
