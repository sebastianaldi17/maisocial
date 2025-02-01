import { Controller, Get, Query } from "@nestjs/common";
import { SongsService } from "./songs.service";

@Controller("v1/songs")
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get("")
  async findSongs(
    @Query("title") title: string,
    @Query("artist") artist: string,
    @Query("nextId") nextId: string,
    @Query("category") category: string,
    @Query("version") version: string,
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

    if (!category) {
      category = "";
    }

    if (!version) {
      version = "";
    }

    const songs = await this.songsService.findSongs(
      title,
      artist,
      nextId,
      category,
      version,
    );
    return {
      songs: songs,
      lastId: songs.length > 0 ? songs[songs.length - 1]._id : "",
    };
  }

  @Get("versions")
  async getVersions() {
    const versions = await this.songsService.getVersions();
    return { versions: versions };
  }

  @Get("categories")
  async getCategories() {
    const categories = await this.songsService.getCategories();
    return { categories: categories };
  }
}
