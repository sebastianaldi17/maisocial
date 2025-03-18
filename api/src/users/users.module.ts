import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { CommentsModule } from "src/comments/comments.module";

@Module({
  imports: [CommentsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
