import { Document } from "mongoose";

export interface Playlist extends Document {
  readonly userId: string;
  readonly username: string;
  readonly profileImage: string;
  readonly playlistName: string;
  readonly songs: PlaylistSong[];
  readonly createdAt: Date;
  readonly _id: string;
}

export interface PlaylistSong {
  readonly songId: string;
  readonly difficultyId: string;
}

export interface PlaylistWithDetails {
  readonly playlistId: string;
  readonly userId: string;
  readonly username: string;
  readonly profileImage: string;
  readonly playlistName: string;
  readonly createdAt: Date;
  readonly songs: PlaylistSongWithDetails[];
}

export interface PlaylistSongWithDetails {
  readonly songId: string;
  readonly difficultyId: string;
  readonly title: string;
  readonly artist: string;
  readonly cover: string;
  readonly category: string;
  readonly version: string;
  readonly difficulty: string;
  readonly level: string;
  readonly internalLevel: number;
}

export interface PlaylistQuery {
  _id?: { $lt: string };
  userId?: string;
  playlistName?: { $regex: string; $options: string };
}
