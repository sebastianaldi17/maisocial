import { Inject, Injectable } from "@nestjs/common";
import { Model, RootFilterQuery } from "mongoose";
import { Song } from "src/interfaces/song.interface";

@Injectable()
export class SongsService {
  constructor(
    @Inject("SONG_MODEL")
    private songsModel: Model<Song>,
  ) {}

  async find(title: string, artist: string, nextId: string): Promise<Song[]> {
    const query: RootFilterQuery<any> = {
      title: { $regex: title, $options: "i" },
      artist: { $regex: artist, $options: "i" },
    };

    if (nextId) {
      query._id = { $lt: nextId };
    }

    const songs = await this.songsModel
      .find(query)
      .sort({ _id: -1 })
      .limit(10)
      .exec();

    return songs;
  }
}
