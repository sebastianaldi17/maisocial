import mongoose, { Types } from "mongoose";

export const CommentSchema = new mongoose.Schema({
  _id: Types.ObjectId,
  parentId: String,
  userId: String,
  nickname: String,
  profileImage: String,
  content: String,
  createdAt: Date,
});
