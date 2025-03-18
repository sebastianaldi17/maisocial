import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { User } from "@supabase/supabase-js";
import mongoose, { Model } from "mongoose";
import { Comment, CommentQuery } from "src/interfaces/comment.interface";

@Injectable()
export class CommentsService {
  constructor(
    @Inject("COMMENT_MODEL")
    private commentsModel: Model<Comment>,
  ) {}

  async createComment(parentId: string, content: string, user: User) {
    await this.commentsModel.create({
      _id: new mongoose.Types.ObjectId(),
      parentId: parentId,
      userId: user.id,
      nickname: (user.user_metadata?.nickname as string) || user.id,
      profileImage: (user.user_metadata?.avatar_url as string) || "",
      content: content,
      createdAt: new Date(),
    });

    await this.updateCommentNickname(
      user.id,
      (user.user_metadata?.nickname as string) || user.id,
    );
  }

  async updateCommentNickname(userId: string, nickname: string) {
    await this.commentsModel.updateMany(
      { userId: userId },
      { nickname: nickname },
    );
  }

  async getComments(parentId: string, nextId?: string): Promise<Comment[]> {
    const query: CommentQuery = {
      parentId: parentId,
    };

    if (nextId) {
      query._id = { $lt: nextId };
    }

    const comments = await this.commentsModel
      .find(query)
      .sort({ _id: -1 })
      .limit(10);
    return comments;
  }

  async getCommentById(commentId: string) {
    return await this.commentsModel.findById(commentId);
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.getCommentById(commentId);
    if (!comment) {
      throw new HttpException("Comment not found", HttpStatus.NOT_FOUND);
    }

    if (comment.userId !== userId) {
      throw new HttpException(
        "You are not authorized to delete this comment",
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.commentsModel.findByIdAndDelete(commentId);
  }
}
