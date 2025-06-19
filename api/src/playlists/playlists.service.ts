import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { User } from "@supabase/supabase-js";
import mongoose, { Model } from "mongoose";
import {
  Playlist,
  PlaylistQuery,
  PlaylistSong,
  PlaylistSongWithDetails,
  PlaylistWithDetails,
} from "src/interfaces/playlist.interface";
import { Song } from "src/interfaces/song.interface";
import { SongsService } from "src/songs/songs.service";

@Injectable()
export class PlaylistsService {
  constructor(
    @Inject("PLAYLIST_MODEL")
    private playlistsModel: Model<Playlist>,
    private songsService: SongsService,
  ) {}

  async createPlaylist(
    playlistName: string,
    songs: PlaylistSong[],
    user: User,
  ) {
    if (!playlistName || !songs || songs.length === 0) {
      throw new Error("Playlist name and songs are required");
    }

    await this.playlistsModel.create({
      _id: new mongoose.Types.ObjectId(),
      userId: user.id,
      username: (user.user_metadata?.nickname as string) || user.id,
      profileImage: (user.user_metadata?.avatar_url as string) || "",
      playlistName: playlistName,
      songs: songs,
      createdAt: new Date(),
    });
  }

  async getPlaylists(
    nameFilter?: string,
    userId?: string,
    nextId?: string,
  ): Promise<PlaylistWithDetails[]> {
    const query: PlaylistQuery = {};

    if (nameFilter) {
      query.playlistName = { $regex: nameFilter, $options: "i" };
    }

    if (userId) {
      query.userId = userId;
    }

    if (nextId) {
      query._id = { $lt: nextId };
    }

    const playlists = await this.playlistsModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const songIds = new Set<string>();
    playlists.forEach((playlist) => {
      playlist.songs.forEach((song) => {
        songIds.add(song.songId);
      });
    });
    const songs = await this.songsService.getSongsByIds(Array.from(songIds));
    const songMap = new Map<string, Song>();
    songs.forEach((song) => {
      songMap.set(song._id.toString(), song);
    });
    const response: PlaylistWithDetails[] = [];
    for (let i = 0; i < playlists.length; i++) {
      const playlistSongs: PlaylistSongWithDetails[] = [];
      for (let j = 0; j < playlists[i].songs.length; j++) {
        const song = playlists[i].songs[j];
        const songDetails = songMap.get(song.songId);
        if (songDetails) {
          const difficulty = songDetails.difficulties.find(
            (d) => d._id.toString() === song.difficultyId,
          );
          playlistSongs.push({
            songId: song.songId,
            difficultyId: song.difficultyId,
            title: songDetails.title,
            artist: songDetails.artist,
            cover: songDetails.cover,
            category: songDetails.category,
            version: songDetails.version,
            difficulty: difficulty?.difficulty || "",
            level: difficulty?.level || "",
            internalLevel: difficulty?.internalLevel || 0,
          });
        }
      }
      response.push({
        playlistId: playlists[i]._id,
        userId: playlists[i].userId,
        username: playlists[i].username,
        profileImage: playlists[i].profileImage,
        playlistName: playlists[i].playlistName,
        songs: playlistSongs,
        createdAt: playlists[i].createdAt,
      });
    }
    return response;
  }

  async getPlaylistById(playlistId: string): Promise<PlaylistWithDetails> {
    const playlist = await this.playlistsModel.findById(playlistId).lean();
    if (!playlist) {
      throw new HttpException("Playlist not found", HttpStatus.NOT_FOUND);
    }

    const songIds = new Set<string>();
    playlist.songs.forEach((song) => {
      songIds.add(song.songId);
    });

    const songs = await this.songsService.getSongsByIds(Array.from(songIds));
    const songMap = new Map<string, Song>();
    songs.forEach((song) => {
      songMap.set(song._id.toString(), song);
    });

    const playlistSongs: PlaylistSongWithDetails[] = [];
    for (let j = 0; j < playlist.songs.length; j++) {
      const song = playlist.songs[j];
      const songDetails = songMap.get(song.songId);
      if (songDetails) {
        const difficulty = songDetails.difficulties.find(
          (d) => d._id.toString() === song.difficultyId,
        );
        playlistSongs.push({
          songId: song.songId,
          difficultyId: song.difficultyId,
          title: songDetails.title,
          artist: songDetails.artist,
          cover: songDetails.cover,
          category: songDetails.category,
          version: songDetails.version,
          difficulty: difficulty?.difficulty || "",
          level: difficulty?.level || "",
          internalLevel: difficulty?.internalLevel || 0,
        });
      }
    }
    return {
      playlistId: playlist._id,
      userId: playlist.userId,
      username: playlist.username,
      profileImage: playlist.profileImage,
      playlistName: playlist.playlistName,
      songs: playlistSongs,
      createdAt: playlist.createdAt,
    };
  }

  async deletePlaylist(playlistId: string, user: User) {
    const playlist = await this.playlistsModel.findById(playlistId);
    if (!playlist) {
      throw new HttpException("Playlist not found", HttpStatus.NOT_FOUND);
    }

    if (playlist.userId !== user.id) {
      throw new HttpException(
        "You are not authorized to delete this playlist",
        HttpStatus.FORBIDDEN,
      );
    }

    await this.playlistsModel.findByIdAndDelete(playlistId);
  }
}
