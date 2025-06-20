export interface PlaylistSong {
  songId: string;
  difficultyId: string;
}

export interface CreatePlaylistRequest {
  playlistName: string;
  songs: PlaylistSong[];
}

export interface PlaylistSongWithDetails {
  songId: string;
  difficultyId: string;
  title: string;
  artist: string;
  cover: string;
  category: string;
  version: string;
  difficulty: string;
  level: string;
  internalLevel: number;
}

export interface Playlist {
  playlistId: string;
  userId: string;
  username: string;
  profileImage: string;
  playlistName: string;
  createdAt: Date;
  songs: PlaylistSongWithDetails[];
}
