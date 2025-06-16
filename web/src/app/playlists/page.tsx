"use client";

import { useState } from "react";
import {
  minLevels,
  maxLevels,
  levels,
  DifficultyFilterMode,
} from "@/constants/constants";
import { LucideBookA, LucideHash } from "lucide-react";
import { useSession } from "@/contexts/sessionContext";
import Link from "next/link";

export default function PlaylistsPage() {
  const [search, setSearch] = useState("");
  const [minLevel, setMinLevel] = useState("0");
  const [maxLevel, setMaxLevel] = useState("15");

  const [useConstant, setUseConstant] = useState(false);

  const { session } = useSession();

  const getLevels = (mode: DifficultyFilterMode) => {
    if (useConstant) {
      return levels;
    }

    if (mode === DifficultyFilterMode.Min) {
      return minLevels;
    } else {
      return maxLevels;
    }
  };

  const toggleConstantSearch = () => {
    setUseConstant(!useConstant);
    setMinLevel("1.0");
    setMaxLevel("15.0");
  };

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
        <div className="flex flex-col gap-4 mb-4 max-w-3xl mx-auto">
          <div className="flex flex-row gap-4">
            <select
              className="p-2 border border-gray-600 rounded-lg flex-1"
              value={minLevel}
              onChange={(e) => setMinLevel(e.target.value)}
            >
              <option value="1.0">Min level</option>
              {getLevels(DifficultyFilterMode.Min).map((item) => {
                const [label, value] = item;
                if (value === "1.0") return null;
                return (
                  <option key={`${value}-min`} value={value}>
                    {label}
                  </option>
                );
              })}
            </select>
            <select
              className="p-2 border border-gray-600 rounded-lg flex-1"
              value={maxLevel}
              onChange={(e) => setMaxLevel(e.target.value)}
            >
              <option value="15.0">Max level</option>
              {getLevels(DifficultyFilterMode.Max).map((item) => {
                const [label, value] = item;
                if (value === "15.0") return null;
                return (
                  <option key={`${label}-max`} value={value}>
                    {label}
                  </option>
                );
              })}
            </select>
            <button
              className="hover:bg-gray-200 p-2 border border-gray-600 rounded-lg flex items-center justify-center"
              onClick={() => {
                toggleConstantSearch();
              }}
            >
              {useConstant ? <LucideHash /> : <LucideBookA />}
            </button>
          </div>
        </div>
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
