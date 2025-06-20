import { Document } from "mongoose";

export enum CommentParentTypeEnum {
  PLAYLIST = "PLAYLIST",
  SONG = "SONG",
}

export interface Comment extends Document {
  readonly parentId: string;
  readonly parentType: CommentParentTypeEnum;
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

export interface CommonCommentFields {
  commentId: string;
  parentId: string;
  parentType: CommentParentTypeEnum;
  commentTime: string;
  comment: string;
}

export interface UserCommentWithSong extends CommonCommentFields {
  title: string;
  artist: string;
  songCover: string;
}

export interface UserCommentWithPlaylist extends CommonCommentFields {
  playlistTitle: string;
  profileImage: string;
}
