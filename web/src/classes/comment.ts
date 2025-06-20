export enum CommentParentTypeEnum {
  PLAYLIST = "PLAYLIST",
  SONG = "SONG",
}

export type Comment = {
  _id: string;
  parentId: string;
  parentType: CommentParentTypeEnum;
  userId: string;
  nickname: string;
  profileImage: string;
  content: string;
  createdAt: string;
};

export type CommentsResponse = {
  comments: Comment[];
  lastId: string;
};

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

export type UserCommentsResponse = {
  comments: (UserCommentWithSong | UserCommentWithPlaylist)[];
  lastId: string;
};
