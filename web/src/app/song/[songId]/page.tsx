"use client";

import { Song } from "@/classes/song";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";

const accFactor: [number, number][] = [
  [100.5, 22.4],
  [100, 21.6],
  [99.5, 21.1],
  [99, 20.8],
  [98, 20.3],
  [97, 20],
  [94, 16.8],
  [90, 15.2],
  [80, 13.6],
];

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
      <table className="w-full border border-gray-400 hidden md:table">
        <tbody>
          <tr className="border border-gray-400">
            <td rowSpan={4} className="border border-gray-400 w-64">
              <img src={song.cover} alt="Cover" className="p-4 w-full h-full" />
            </td>
            <td className="p-3 font-bold border border-gray-400 bg-gray-200">
              Title
            </td>
            <td className="p-3 border border-gray-400">{song.title}</td>
          </tr>

          <tr className="border border-gray-400">
            <td className="p-3 font-bold border border-gray-400 bg-gray-200">
              Artist
            </td>
            <td className="p-3 border border-gray-400">{song.artist}</td>
          </tr>

          <tr className="border border-gray-400">
            <td className="p-3 font-bold border border-gray-400 bg-gray-200">
              Category
            </td>
            <td className="p-3 border border-gray-400">{song.category}</td>
          </tr>

          <tr className="border border-gray-400">
            <td className="p-3 font-bold border border-gray-400 bg-gray-200">
              Version
            </td>
            <td className="p-3 border border-gray-400">{song.version}</td>
          </tr>
        </tbody>
      </table>
      <table className="w-full border border-gray-400 md:hidden">
        <tbody>
          <tr>
            <td colSpan={2} className="p-0 border border-gray-400">
              <img
                src={song.cover}
                alt="Cover"
                className="mx-auto h-32 object-cover"
              />
            </td>
          </tr>

          <tr className="border border-gray-400">
            <td className="p-3 border border-gray-400 bg-gray-200">Title</td>
            <td className="p-3 border border-gray-400">{song.title}</td>
          </tr>

          <tr className="border border-gray-400">
            <td className="p-3 border border-gray-400 bg-gray-200">Artist</td>
            <td className="p-3 border border-gray-400">{song.artist}</td>
          </tr>

          <tr className="border border-gray-400">
            <td className="p-3 border border-gray-400 bg-gray-200">Category</td>
            <td className="p-3 border border-gray-400">{song.category}</td>
          </tr>

          <tr className="border border-gray-400">
            <td className="p-3 border border-gray-400 bg-gray-200">Version</td>
            <td className="p-3 border border-gray-400">{song.version}</td>
          </tr>
        </tbody>
      </table>
      <div>
        <h1 className="text-2xl font-bold py-2">Difficulty information</h1>
        <table className="w-fit border border-gray-400">
          <thead>
            <tr>
              <th className="border border-gray-400 px-4 py-2 bg-gray-200">
                Level
              </th>
              <th className="border border-gray-400 px-4 py-2 bg-gray-200">
                Constant
              </th>
              <th className="border border-gray-400 px-4 py-2 bg-gray-200">
                Estimated rating
              </th>
            </tr>
          </thead>
          <tbody>
            {song.difficulties.map((difficulty) => {
              let backgroundColor = "bg-purple-200";
              const isRemaster = difficulty.difficulty.includes("RE:MASTER");

              if (difficulty.difficulty.includes("BASIC")) {
                backgroundColor = "bg-green-200";
              } else if (difficulty.difficulty.includes("ADVANCED")) {
                backgroundColor = "bg-amber-200";
              } else if (difficulty.difficulty.includes("EXPERT")) {
                backgroundColor = "bg-red-300";
              } else if (
                difficulty.difficulty.includes("MASTER") &&
                !isRemaster
              ) {
                backgroundColor = "bg-violet-400";
              }

              return (
                <tr key={difficulty._id}>
                  <td
                    className={`border border-gray-400 flex gap-2 ${backgroundColor}`}
                  >
                    <p className="flex-1 pl-2">{difficulty.level}</p>
                    <img
                      src={
                        difficulty.difficulty.includes("(DX)")
                          ? "/type-dx.png"
                          : "/type-std.png"
                      }
                      alt="difficulty type icon"
                      className="my-auto w-12 mr-2"
                    />
                  </td>
                  <td className={`border border-gray-400 pl-2`}>
                    {difficulty.internalLevel}
                  </td>
                  <td className={`border border-gray-400 pl-2`}>
                    {isNaN(Number(accuracy)) ||
                    Number(accuracy) < 0 ||
                    Number(accuracy) > 101
                      ? "Invalid"
                      : Math.floor(
                          (difficulty.internalLevel *
                            Number(accuracy) *
                            (accFactor.find(
                              ([value]) => value <= Number(accuracy),
                            )?.[1] ?? 13.6)) /
                            100,
                        )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
