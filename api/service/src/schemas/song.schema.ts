import mongoose, { Types } from "mongoose";

export const SongSchema = new mongoose.Schema({
  _id: Types.ObjectId,
  artist: String,
  title: String,
  version: String,
  category: String,
  cover: String,
  difficulties: [
    {
      difficulty: String,
      level: String,
      internalLevel: Number,
    },
  ],
});
