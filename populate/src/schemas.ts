import mongoose from "mongoose";

export const songSchema = new mongoose.Schema({
  artist: String,
  alternateTitle: String,
  title: String,
  version: String,
  category: String,
  cover: String,
  bpm: String,
  difficulties: [
    {
      difficulty: String,
      level: String,
      internalLevel: Number,
    },
  ],
});
