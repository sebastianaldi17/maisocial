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
