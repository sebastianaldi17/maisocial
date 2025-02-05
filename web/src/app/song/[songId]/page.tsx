"use client";

import { Song } from "@/classes/song";
import DifficultyTable from "@/components/songById/difficulty-table";
import SongTable from "@/components/songById/song-table";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SongDetailById() {
  const params = useParams<{ songId: string }>();

  const [song, setSong] = useState<Song | null>(null);
  const [accuracy, setAccuracy] = useState<string>("");

  useEffect(() => {
    fetchSong(params.songId);
  }, []);

  const fetchSong = async (songId: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/songs/song/${songId}`,
    );
    const body: Song = await response.json();

    if (!response.ok) {
      redirect(`/`);
    }

    setSong(body);
  };

  return song ? (
    <div className="px-4 flex-col max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold pb-2">Song information</h1>
      <SongTable song={song} />
      <div>
        <h1 className="text-2xl font-bold py-2">Difficulty information</h1>
        <DifficultyTable song={song} accuracy={Number(accuracy)} />
        <h2 className="text-xl font-bold py-2">Accuracy input (0-101)</h2>
        <input
          className="w-full md:w-40 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1"
          type="number"
          placeholder=" Accuracy (0 - 101)"
          value={accuracy}
          max={101}
          min={0}
          step={0.0001}
          onChange={(e) => {
            setAccuracy(e.target.value);
          }}
        />
      </div>
    </div>
  ) : (
    <div className="max-w-3xl mx-auto">
      <h1>Loading...</h1>
    </div>
  );
}
