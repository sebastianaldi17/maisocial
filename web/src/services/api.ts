import {
  CommentParentTypeEnum,
  CommentsResponse,
  UserCommentsResponse,
} from "@/classes/comment";
import { CreatePlaylistRequest, Playlist } from "@/classes/playlist";
import { Song } from "@/classes/song";

export class BackendApi {
  static async deleteComment(
    commentId: string,
    token: string,
  ): Promise<Response> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  }

  static async fetchComments(
    songId: string,
    nextId: string,
  ): Promise<CommentsResponse> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/comments/parent/${songId}?nextId=${nextId}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }
    return await response.json();
  }

  static async fetchUserComments(
    nextId: string,
    token: string,
  ): Promise<UserCommentsResponse> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/comments/user?nextId=${nextId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user comments");
    }
    return await response.json();
  }

  static async fetchSong(songId: string): Promise<Song> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/songs/song/${songId}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch song data");
    }
    return await response.json();
  }

  static async fetchAllSongs(): Promise<Song[]> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/songs/all-songs`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch songs");
    }
    return await response.json();
  }

  static async submitComment(
    parentId: string,
    parentType: CommentParentTypeEnum,
    content: string,
    token: string,
  ): Promise<Response> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/comments/parent/${parentId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          parentType,
        }),
      },
    );
    return response;
  }

  static async createPlaylist(
    request: CreatePlaylistRequest,
    token: string,
  ): Promise<Response> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/playlists`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to create playlist");
    }
    return response;
  }

  static async fetchPlaylists(
    titleFilter?: string,
    userId?: string,
    nextId?: string,
  ): Promise<Playlist[]> {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/playlists`);
    if (titleFilter) url.searchParams.append("title", titleFilter);
    if (userId) url.searchParams.append("userId", userId);
    if (nextId) url.searchParams.append("nextId", nextId);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error("Failed to fetch playlists");
    }
    return await response.json();
  }

  static async fetchPlaylistById(playlistId: string): Promise<Playlist> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/playlists/${playlistId}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch playlist by ID");
    }
    return await response.json();
  }

  static async deletePlaylist(
    playlistId: string,
    token: string,
  ): Promise<Response> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/playlists/${playlistId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  }
}
