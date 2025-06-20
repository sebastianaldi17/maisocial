import { Module } from "@nestjs/common";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { DatabaseModule } from "src/database/database.module";
import { commentsProviders } from "./comments.providers";
import { SongsModule } from "src/songs/songs.module";
import { PlaylistsModule } from "src/playlists/playlists.module";

@Module({
  imports: [DatabaseModule, SongsModule, PlaylistsModule],
  controllers: [CommentsController],
  providers: [CommentsService, ...commentsProviders],
  exports: [CommentsService],
})
export class CommentsModule {}
