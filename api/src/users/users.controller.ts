import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Patch,
  Request,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { SupabaseGuard } from "src/guards/supabase.guard";
import { Request as CustomRequest } from "src/types/request";

@Controller("v1/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch("/nickname")
  @UseGuards(SupabaseGuard)
  async updateNickname(
    @Request() request: CustomRequest,
    @Body() body: { nickname: string },
  ) {
    const { user } = request;
    const { nickname } = body;

    if (!user) {
      throw new HttpException(
        "You must be logged in to update your nickname",
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!nickname) {
      throw new HttpException("Nickname is required", HttpStatus.BAD_REQUEST);
    }

    if (nickname.length > 20) {
      throw new HttpException(
        "Nickname length must be 20 characters or less",
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await this.usersService.updateNickname(user.id, nickname);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "An error occurred",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
