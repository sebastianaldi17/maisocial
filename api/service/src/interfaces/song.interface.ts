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
}
