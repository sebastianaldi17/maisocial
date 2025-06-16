import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { SongsService } from "./songs.service";
import { songsProviders } from "./songs.providers";
import { SongsController } from "./songs.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [SongsController],
  providers: [SongsService, ...songsProviders],
  exports: [SongsService],
})
export class SongsModule {}
