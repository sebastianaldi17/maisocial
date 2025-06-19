import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  Delete,
} from "@nestjs/common";
import { PlaylistsService } from "./playlists.service";
import { SupabaseGuard } from "src/guards/supabase.guard";
import { ThrottlerGuard } from "@nestjs/throttler";
import { Request as CustomRequest } from "src/types/request";

@Controller("v1/playlists")
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post("/")
  @UseGuards(SupabaseGuard)
  @UseGuards(ThrottlerGuard)
  async createPlaylist(
    @Body()
    body: {
      playlistName: string;
      songs: { songId: string; difficultyId: string }[];
    },
    @Request() request: CustomRequest,
  ) {
    const { playlistName, songs } = body;
    const { user } = request;

    if (!user) {
      throw new Error("You must be logged in to create a playlist");
    }

    if (!playlistName || !songs || songs.length === 0) {
      throw new Error("Playlist title and songs are required");
    }

    try {
      await this.playlistsService.createPlaylist(playlistName, songs, user);
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while creating the playlist");
    }
  }

  @Get("/")
  async getPlaylists(
    @Param("title") titleFilter?: string,
    @Param("userId") userId?: string,
    @Param("nextId") nextId?: string,
  ) {
    try {
      return await this.playlistsService.getPlaylists(
        titleFilter,
        userId,
        nextId,
      );
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while fetching playlists");
    }
  }

  @Get("/:playlistId")
  async getPlaylistById(@Param("playlistId") playlistId: string) {
    return await this.playlistsService.getPlaylistById(playlistId);
  }

  @Delete("/:playlistId")
  @UseGuards(SupabaseGuard)
  @UseGuards(ThrottlerGuard)
  async deletePlaylist(
    @Param("playlistId") playlistId: string,
    @Request() request: CustomRequest,
  ) {
    const { user } = request;

    if (!user) {
      throw new Error("You must be logged in to delete a playlist");
    }

    await this.playlistsService.deletePlaylist(playlistId, user);
  }
}
