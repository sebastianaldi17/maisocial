import { Module } from "@nestjs/common";
import { PlaylistsController } from "./playlists.controller";
import { PlaylistsService } from "./playlists.service";
import { DatabaseModule } from "src/database/database.module";
import { playlistsProviders } from "./playlists.providers";
import { SongsModule } from "src/songs/songs.module";

@Module({
  imports: [DatabaseModule, SongsModule],
  controllers: [PlaylistsController],
  providers: [PlaylistsService, ...playlistsProviders],
  exports: [PlaylistsService],
})
export class PlaylistsModule {}
