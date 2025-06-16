export type Comment = {
  _id: string;
  parentId: string;
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

export type UserComment = {
  commentId: string;
  songId: string;
  title: string;
  artist: string;
  comment: string;
  songCover: string;
  commentTime: string;
};

export type UserCommentsResponse = {
  comments: UserComment[];
  lastId: string;
};
