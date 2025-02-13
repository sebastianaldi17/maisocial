import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from "@nestjs/common";
import { SongsService } from "./songs.service";
import mongoose from "mongoose";

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
    @Query("minLevel") minLevel: number,
    @Query("maxLevel") maxLevel: number,
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

    if (!minLevel) {
      minLevel = 0;
    }

    if (!maxLevel) {
      maxLevel = 15;
    }

    const songs = await this.songsService.findSongs(
      title,
      artist,
      nextId,
      category,
      version,
      minLevel,
      maxLevel,
    );

    return {
      songs: songs,
      lastId: songs.length > 0 ? songs[songs.length - 1]._id : "",
    };
  }

  @Get("/song/:id")
  async getSongById(@Param("id") id: string) {
    if (mongoose.isValidObjectId(id) === false) {
      throw new HttpException(
        { error: "Invalid song ID" },
        HttpStatus.BAD_REQUEST,
      );
    }
    const song = await this.songsService.getSongById(id);
    if (!song) {
      throw new HttpException(
        { error: "Song not found" },
        HttpStatus.NOT_FOUND,
      );
    }
    return song;
  }

  @Get("/random")
  async getRandomSongs(
    @Query("minLevel") minLevel: number,
    @Query("maxLevel") maxLevel: number,
    @Query("songCount") songCount: number,
  ) {
    if (!minLevel) {
      minLevel = 0;
    }

    if (!maxLevel) {
      maxLevel = 15;
    }

    if (!songCount) {
      songCount = 1;
    }

    minLevel = Number(minLevel);
    maxLevel = Number(maxLevel);
    songCount = Number(songCount);

    return await this.songsService.getRandomSongs(
      minLevel,
      maxLevel,
      songCount,
    );
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
