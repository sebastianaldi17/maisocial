import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { CommentsModule } from "src/comments/comments.module";
import { PlaylistsModule } from "src/playlists/playlists.module";

@Module({
  imports: [CommentsModule, PlaylistsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
