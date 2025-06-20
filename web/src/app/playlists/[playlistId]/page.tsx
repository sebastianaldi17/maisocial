"use client";

import { CommentParentTypeEnum } from "@/classes/comment";
import { Playlist } from "@/classes/playlist";
import CommentSection from "@/components/common/comment-section";
import { useSession } from "@/contexts/sessionContext";
import { BackendApi } from "@/services/api";
import Image from "next/image";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PlaylistDetailById() {
  const params = useParams<{ playlistId: string }>();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);

  const { session } = useSession();

  const fetchPlaylist = async (playlistId: string) => {
    try {
      const playlist = await BackendApi.fetchPlaylistById(playlistId);
      setPlaylist(playlist);
    } catch (error) {
      console.error("Failed to fetch playlist data:", error);
      alert("Failed to fetch playlist data");
      redirect("/");
    }
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    if (!session) {
      alert("You must be logged in to delete a playlist");
      return;
    }
    if (!confirm("Are you sure you want to delete this playlist?")) {
      return;
    }
    try {
      await BackendApi.deletePlaylist(playlistId, session.access_token);
      alert("Playlist deleted successfully");
      window.location.href = "/playlists";
    } catch (error) {
      console.error("Failed to delete playlist:", error);
      alert("Failed to delete playlist");
    }
  };

  useEffect(() => {
    fetchPlaylist(params.playlistId);
  }, []);

  return (
    <div className="px-4 flex-col max-w-3xl mx-auto">
      {playlist ? (
        <div className="mb-8">
          <h2 className="text-xl font-bold">{playlist.playlistName}</h2>
          <div className="flex items-center mb-1">
            <span className="mr-2">Created by</span>
            <Image
              src={playlist.profileImage}
              alt={playlist.username}
              className="w-6 h-6 rounded-full mr-2"
              width={24}
              height={24}
            />
            <span className="text-gray-700">{playlist.username}</span>
          </div>
          <div className="text-gray-500 text-sm mb-4">
            {new Date(playlist.createdAt).toLocaleDateString()}
            {playlist.userId === session?.user.id && (
              <button
                className="text-red-500 hover:text-red-700 ml-2"
                onClick={() => handleDeletePlaylist(playlist.playlistId)}
              >
                Delete
              </button>
            )}
          </div>
          {playlist.songs.map((song, index) => {
            return (
              <div key={song.songId} className="mb-4">
                <h2 className="text-sm mb-1 font-medium">Track #{index + 1}</h2>
                <div
                  key={song.songId}
                  className="flex items-center mb-2 p-2 border rounded hover:bg-gray-50"
                >
                  <Link
                    href={`/song/${song.songId}`}
                    className="flex items-center"
                  >
                    <Image
                      src={song.cover}
                      alt={song.title}
                      className="rounded mr-3"
                      width={128}
                      height={128}
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm sm:text-base">
                        {song.title}
                      </span>
                      <span className="text-gray-600 text-xs sm:text-sm">
                        {song.artist}
                      </span>
                      <span className="text-gray-500 text-xs sm:text-sm">
                        Level: {song.level} ({song.internalLevel}) -{" "}
                        {song.difficulty}
                      </span>
                      <span className="text-gray-500 text-xs sm:text-sm">
                        Category: {song.category}
                      </span>
                      <span className="text-gray-500 text-xs sm:text-sm">
                        Version: {song.version}
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-600">Loading playlist details...</div>
      )}
      <CommentSection
        parentId={params.playlistId}
        parentType={CommentParentTypeEnum.PLAYLIST}
      />
    </div>
  );
}
