import {
  Body,
  Controller,
  HttpException,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { SupabaseGuard } from "src/guards/supabase.guard";
import { Request as CustomRequest } from "src/types/request";

@Controller("v1/comments")
export class CommentsController {
  @Post("/parent/:parentId")
  @UseGuards(SupabaseGuard)
  createComment(
    @Param("parentId") parentId: string,
    @Body() body: { content: string },
    @Request() request: CustomRequest,
  ) {
    const { content } = body;
    const { user } = request;

    if (!user) {
      throw new HttpException("You must be logged in to leave a comment", 401);
    }

    if (!content) {
      throw new HttpException("Content is required", 400);
    }

    console.log(user);
    console.log(body);
  }
}
