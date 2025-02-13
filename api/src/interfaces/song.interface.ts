import { Document } from "mongoose";

export interface Song extends Document {
  readonly artist: string;
  readonly title: string;
  readonly version: string;
  readonly category: string;
  readonly cover: string;
  readonly difficulties: [
    {
      difficulty: string;
      level: string;
      internalLevel: number;
    },
  ];
  readonly _id: string;
}

export interface DifficultyQuery {
  internalLevel?: { $gte?: number; $lte?: number };
}

export interface SongQuery {
  title?: { $regex: string; $options: string };
  artist?: { $regex: string; $options: string };
  _id?: { $lt: string };
  category?: string;
  version?: string;
  difficulties?: { $elemMatch: DifficultyQuery };
}
