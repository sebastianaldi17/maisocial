"use client";

import { Song } from "@/classes/song";
import { useSession } from "@/contexts/sessionContext";
import { BackendApi } from "@/services/api";
import { useEffect, useState } from "react";

export default function CreatePlaylistPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const { session, loading } = useSession();

  const fetchSongs = async () => {
    try {
      const response = await BackendApi.fetchAllSongs();
      setSongs(response);
    } catch (error) {
      alert("Error fetching songs, please try again later.");
      console.error("Error fetching songs:", error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchSongs();
    }
    if (!loading && !session) {
      window.location.href = "/";
    }
  }, [session, loading]);

  return <div className="max-w-3xl px-2 mx-auto">test</div>;
}
