import { CommentsResponse, UserCommentsResponse } from "@/classes/comment";
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

  static async submitComment(
    songId: string,
    content: string,
    token: string,
  ): Promise<Response> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/comments/parent/${songId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
        }),
      },
    );
    return response;
  }
}
