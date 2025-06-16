import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { User } from "@supabase/supabase-js";
import mongoose, { Model } from "mongoose";
import {
  Comment,
  CommentQuery,
  UserCommentWithSong,
} from "src/interfaces/comment.interface";
import { SongsService } from "src/songs/songs.service";

@Injectable()
export class CommentsService {
  constructor(
    @Inject("COMMENT_MODEL")
    private commentsModel: Model<Comment>,
    private songsService: SongsService,
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

  async getCommentsByUserId(
    userId: string,
    nextId?: string,
  ): Promise<UserCommentWithSong[]> {
    const query: CommentQuery = {
      userId: userId,
    };
    if (nextId) {
      query._id = { $lt: nextId };
    }
    const comments = await this.commentsModel
      .find(query)
      .sort({ _id: -1 })
      .limit(10);
    const songIds = new Set<string>();
    comments.map((comment) => {
      songIds.add(comment.parentId);
    });

    const songs = await this.songsService.getSongsByIds(Array.from(songIds));
    const response: UserCommentWithSong[] = [];
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      const song = songs.get(comment.parentId);
      if (song) {
        response.push({
          commentId: comment._id,
          songId: song._id,
          comment: comment.content,
          title: song.title,
          artist: song.artist,
          songCover: song.cover,
          commentTime: comment.createdAt.toISOString(),
        });
      }
    }
    return response;
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
