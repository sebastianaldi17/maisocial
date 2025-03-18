import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { SupabaseGuard } from "src/guards/supabase.guard";
import { Request as CustomRequest } from "src/types/request";
import { CommentsService } from "./comments.service";
import { Comment } from "src/interfaces/comment.interface";
import { ThrottlerGuard } from "@nestjs/throttler";

@Controller("v1/comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post("/parent/:parentId")
  @UseGuards(SupabaseGuard)
  @UseGuards(ThrottlerGuard)
  async createComment(
    @Param("parentId") parentId: string,
    @Body() body: { content: string },
    @Request() request: CustomRequest,
  ) {
    const { content } = body;
    const { user } = request;

    if (!user) {
      throw new HttpException(
        "You must be logged in to leave a comment",
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!content) {
      throw new HttpException("Content is required", HttpStatus.BAD_REQUEST);
    }

    if (content.length > 255) {
      throw new HttpException(
        "Comment length must be 255 characters or less",
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await this.commentsService.createComment(parentId, body.content, user);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "An error occurred",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("/parent/:parentId")
  async getComments(
    @Param("parentId") parentId: string,
    @Query("nextId") nextId: string,
  ) {
    const comments: Comment[] = await this.commentsService.getComments(
      parentId,
      nextId,
    );
    return {
      comments: comments,
      lastId: comments.length > 0 ? comments[comments.length - 1]._id : "",
    };
  }

  @Delete("/:commentId")
  @UseGuards(SupabaseGuard)
  @UseGuards(ThrottlerGuard)
  async deleteComment(
    @Request() request: CustomRequest,
    @Param("commentId") commentId: string,
  ) {
    const { user } = request;

    if (!user || !user.id) {
      throw new HttpException(
        "You must be logged in to leave a comment",
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.commentsService.deleteComment(commentId, request.user!.id);
  }
}
