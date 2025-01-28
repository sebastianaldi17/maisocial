import { Controller, Get, Query } from "@nestjs/common";
import { SongsService } from "./songs.service";

@Controller("v1/songs")
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get("")
  async find(
    @Query("title") title: string,
    @Query("artist") artist: string,
    @Query("nextId") nextId: string,
  ) {
    if (!title) {
      title = "";
    }

    if (!artist) {
      artist = "";
    }

    if (!nextId) {
      nextId = "";
    }

    const songs = await this.songsService.find(title, artist, nextId);
    return songs;
  }
}
