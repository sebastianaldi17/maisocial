"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/contexts/sessionContext";
import Link from "next/link";
import { BackendApi } from "@/services/api";
import { Playlist } from "@/classes/playlist";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [myPlaylists, setMyPlaylists] = useState(false);
  const [search, setSearch] = useState("");

  const { session } = useSession();

  const fetchPlaylists = async (
    replace: boolean,
    search?: string,
    userId?: string,
    nextId?: string,
  ) => {
    const playlists = await BackendApi.fetchPlaylists(search, userId, nextId);
    if (replace) {
      setPlaylists(playlists);
    } else {
      setPlaylists((prev) => [...prev, ...playlists]);
    }
  };

  useEffect(() => {
    fetchPlaylists(true);
  }, []);

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
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="default-checkbox"
              className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
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
      </div>
    </div>
  );
}
