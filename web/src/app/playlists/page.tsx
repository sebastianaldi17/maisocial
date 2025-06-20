"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/contexts/sessionContext";
import Link from "next/link";
import { BackendApi } from "@/services/api";
import { Playlist } from "@/classes/playlist";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";

const DEBOUNCE_TIME = 500;

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [myPlaylists, setMyPlaylists] = useState(false);
  const [search, setSearch] = useState("");
  const [fetching, setFetching] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [lastId, setLastId] = useState<string>("");

  const { session } = useSession();

  const fetchPlaylists = async (
    replace: boolean,
    search?: string,
    userId?: string,
    nextId?: string,
  ) => {
    setFetching(true);
    try {
      const playlists = await BackendApi.fetchPlaylists(search, userId, nextId);
      if (replace) {
        setPlaylists(playlists);
      } else {
        setPlaylists((prev) => [...prev, ...playlists]);
      }
      setLastId(
        playlists.length > 0 ? playlists[playlists.length - 1].playlistId : "",
      );
      setHasMore(playlists.length > 0);
      setFetching(false);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      alert("Failed to fetch playlists. Please try again later.");
    } finally {
      setFetching(false);
    }
  };

  const fetchMorePlaylists = async () => {
    fetchPlaylists(
      false,
      search,
      myPlaylists ? session?.user.id : undefined,
      lastId,
    );
  };

  const handleDeletePlaylist = async (
    playlistId: string,
    playlistTitle: string,
  ) => {
    if (!session) return;
    if (
      !confirm(
        `Are you sure you want to delete the playlist "${playlistTitle}"?`,
      )
    )
      return;

    try {
      await BackendApi.deletePlaylist(playlistId, session.access_token);
      setPlaylists((prev) =>
        prev.filter((playlist) => playlist.playlistId !== playlistId),
      );
    } catch (error) {
      console.error("Error deleting playlist:", error);
      alert("Failed to delete playlist. Please try again later.");
    }
  };

  useEffect(() => {
    fetchPlaylists(true);
  }, []);

  useEffect(() => {
    const debounceFn = setTimeout(() => {
      fetchPlaylists(true, search, myPlaylists ? session?.user.id : undefined);
    }, DEBOUNCE_TIME);

    return () => clearTimeout(debounceFn);
  }, [search, myPlaylists]);

  return (
    <div className="max-w-3xl px-2 mx-auto">
      <div className="p-2">
        <div className="flex flex-col md:flex-row gap-4 mb-4 max-w-3xl mx-auto">
          <div className="flex w-full border border-gray-600 rounded-lg overflow-hidden">
            <input
              className="flex-1 p-2 border-none outline-none placeholder-gray-500"
              placeholder="Search playlist name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {session && (
          <div className="flex items-center">
            <input
              id="default-checkbox"
              type="checkbox"
              checked={myPlaylists}
              onChange={(e) => setMyPlaylists(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
            />
            <label
              htmlFor="default-checkbox"
              className="ms-2 text-sm font-medium"
            >
              Only my playlists?
            </label>
          </div>
        )}
        {session && (
          <div className="mt-4">
            <Link
              href="/playlists/create"
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors text-center"
            >
              Create new playlist
            </Link>
          </div>
        )}
        {playlists.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            {fetching ? "Loading..." : "No playlists found."}
          </div>
        ) : (
          <InfiniteScroll
            dataLength={playlists.length}
            next={fetchMorePlaylists}
            hasMore={hasMore}
            loader={<p className="text-center mt-4">Loading more...</p>}
          >
            {playlists.map((playlist) => (
              <div
                className="flex flex-col p-4 my-4 border border-gray-300 rounded-lg shadow-md"
                key={playlist.playlistId}
              >
                <Link
                  href={`/playlists/${playlist.playlistId}`}
                  className="font-bold text-lg mb-2"
                >
                  {playlist.playlistName}
                </Link>
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
                <span className="text-sm text-gray-500 mb-3">
                  {new Date(playlist.createdAt).toLocaleString()}
                  {playlist.userId === session?.user.id && (
                    <button
                      className="text-red-500 hover:text-red-700 ml-2"
                      onClick={() => {
                        handleDeletePlaylist(
                          playlist.playlistId,
                          playlist.playlistName,
                        );
                      }}
                    >
                      Delete
                    </button>
                  )}
                </span>
                <div className="flex gap-2">
                  {playlist.songs.map((song, index) => (
                    <Image
                      key={index}
                      src={song.cover || "/default-cover.jpg"}
                      alt={`Song ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-lg"
                      width={64}
                      height={64}
                    />
                  ))}
                </div>
              </div>
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}
