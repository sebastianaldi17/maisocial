import { Difficulty } from "./difficulty";

export class Song {
  _id: string;
  title: string;
  artist: string;
  category: string;
  version: string;
  cover: string;
  difficulties: Difficulty[];

  constructor(
    _id: string,
    title: string,
    artist: string,
    category: string,
    version: string,
    cover: string,
    difficulties: Difficulty[],
  ) {
    this._id = _id;
    this.title = title;
    this.artist = artist;
    this.category = category;
    this.version = version;
    this.cover = cover;
    this.difficulties = difficulties;
  }
}
