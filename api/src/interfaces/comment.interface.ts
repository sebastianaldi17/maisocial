import { Document } from "mongoose";

export interface Comment extends Document {
  readonly parentId: string;
  readonly userId: string;
  readonly nickname: string;
  readonly profileImage: string;
  readonly content: string;
  readonly createdAt: Date;
  readonly _id: string;
}

export interface CommentQuery {
  userId?: string;
  parentId?: string;
  _id?: { $lt: string };
}

export interface UserCommentWithSong {
  commentId: string;
  songId: string;
  title: string;
  artist: string;
  comment: string;
  songCover: string;
  commentTime: string;
}
