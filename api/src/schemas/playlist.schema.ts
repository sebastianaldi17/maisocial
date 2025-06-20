import mongoose, { Types } from "mongoose";

export const PlaylistSchema = new mongoose.Schema({
  _id: Types.ObjectId,
  userId: String,
  username: String,
  profileImage: String,
  playlistName: String,
  createdAt: Date,
  songs: [
    {
      songId: String,
      difficultyId: String,
    },
  ],
});
