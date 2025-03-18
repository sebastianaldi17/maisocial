"use client";

import { Song } from "@/classes/song";
import SongCard from "@/components/index/song-card";
import { minLevels, maxLevels } from "@/constants/constants";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const DEBOUNCE_TIME = 500;

export default function Home() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("title");
  const [category, setCategory] = useState("");
  const [version, setVersion] = useState("");
  const [minLevel, setMinLevel] = useState("0");
  const [maxLevel, setMaxLevel] = useState("15");
  const [lastId, setLastId] = useState("");

  const [fetching, setFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [firstRender, setFirstRender] = useState(true);

  const [items, setItems] = useState<Song[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [versions, setVersions] = useState<string[]>([]);

  const fetchMoreData = (restartSearch: boolean = false) => {
    if (restartSearch) {
      setHasMore(true);
      setLastId("");
      setItems([]);
    }
    if (fetching) return;
    setFetching(true);
    fetchSongs(
      restartSearch ? "" : lastId,
      filter === "title" ? search : "",
      filter === "artist" ? search : "",
      category,
      version,
      minLevel,
      maxLevel,
    );
  };

  const fetchSongs = async (
    nextId: string,
    title: string,
    artist: string,
    category: string,
    version: string,
    minLevel: string = "1.0",
    maxLevel: string = "15.0",
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/songs?nextId=${nextId}&title=${title}&artist=${artist}&category=${category}&version=${version}&minLevel=${minLevel}&maxLevel=${maxLevel}`,
      );
      if (response.ok) {
        const data = await response.json();
        setLastId(data.lastId);
        setItems((prev) => [...prev, ...data.songs]);
        setHasMore(data.lastId !== "");
      }
    } catch (error) {
      alert(error);
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const initializeFilters = async () => {
    const categoriesResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/songs/categories`,
    );
    if (categoriesResponse.ok) {
      const data = await categoriesResponse.json();
      setCategories(data.categories);
    }

    const versionsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/songs/versions`,
    );
    if (versionsResponse.ok) {
      const data = await versionsResponse.json();
      setVersions(data.versions);
    }
  };

  useEffect(() => {
    initializeFilters();
  }, []);

  // handle filter change
  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    fetchMoreData(true);
  }, [category, version, minLevel, maxLevel]);

  useEffect(() => {
    const debounceFn = setTimeout(() => {
      fetchMoreData(true);
    }, DEBOUNCE_TIME);

    return () => clearTimeout(debounceFn);
  }, [search]);

  useEffect(() => {
    setSearch("");
  }, [filter]);

  return (
    <div>
      {/* div containing filters */}
      <div className="p-2">
        <div className="flex flex-col md:flex-row gap-4 mb-4 max-w-3xl mx-auto">
          <div className="flex w-full border border-gray-600 rounded-lg overflow-hidden">
            <input
              className="flex-1 p-2 border-none outline-none placeholder-gray-500"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="p-2 border-l border-gray-600"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
              }}
            >
              <option value="title">Title</option>
              <option value="artist">Artist</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-4 mb-4 max-w-3xl mx-auto">
          <div className="flex flex-row flex-wrap gap-4">
            <select
              className="p-2 border border-gray-600 rounded-lg w-[calc(50%-0.5rem)] md:w-[calc(50%-0.5rem)]"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            >
              <option value="">All categories</option>
              {categories.map((category) => {
                return (
                  <option key={category} value={category}>
                    {category}
                  </option>
                );
              })}
            </select>
            <select
              className="p-2 border border-gray-600 rounded-lg w-[calc(50%-0.5rem)] md:w-[calc(50%-0.5rem)]"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            >
              <option value="">All versions</option>
              {versions.map((version) => {
                return (
                  <option key={version} value={version}>
                    {version}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex flex-row flex-wrap gap-4">
            <select
              className="p-2 border border-gray-600 rounded-lg w-[calc(50%-0.5rem)] md:w-[calc(50%-0.5rem)]"
              value={minLevel}
              onChange={(e) => setMinLevel(e.target.value)}
            >
              <option value="1.0">Min level</option>
              {minLevels.map((item) => {
                const [label, value] = item;
                if (value === "1.0") return null;
                return (
                  <option key={`${label}-min`} value={value}>
                    {label}
                  </option>
                );
              })}
            </select>
            <select
              className="p-2 border border-gray-600 rounded-lg w-[calc(50%-0.5rem)] md:w-[calc(50%-0.5rem)]"
              value={maxLevel}
              onChange={(e) => setMaxLevel(e.target.value)}
            >
              <option value="15.0">Max level</option>
              {maxLevels.map((item) => {
                const [label, value] = item;
                if (value === "15.0") return null;
                return (
                  <option key={`${label}-max`} value={value}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* div containing songs */}
      <div className="max-w-3xl px-2 mx-auto">
        <div>
          <InfiniteScroll
            dataLength={items.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<p className="text-center mt-4">Loading more...</p>}
            endMessage={
              <p className="text-center my-4">You have reached the end!</p>
            }
          >
            {items.map((item) => (
              <SongCard key={item._id} song={item} />
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
}
