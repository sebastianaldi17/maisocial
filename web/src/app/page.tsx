"use client";

import { Difficulty } from "@/classes/difficulty";
import { Song } from "@/classes/song";
import Link from "next/link";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const DEBOUNCE_TIME = 500;

export default function Home() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("title");
  const [category, setCategory] = useState("");
  const [version, setVersion] = useState("");
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
    );
  };

  const fetchSongs = async (
    nextId: string,
    title: string,
    artist: string,
    category: string,
    version: string,
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/songs?nextId=${nextId}&title=${title}&artist=${artist}&category=${category}&version=${version}`,
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

  const difficultiesComponent = (difficulties: Difficulty[]) => {
    return difficulties.map((difficulty) => {
      let backgroundColor = "bg-white";
      const isRemaster = difficulty.difficulty.includes("RE:MASTER");

      if (difficulty.difficulty.includes("BASIC")) {
        backgroundColor = "bg-green-500";
      } else if (difficulty.difficulty.includes("ADVANCED")) {
        backgroundColor = "bg-amber-500";
      } else if (difficulty.difficulty.includes("EXPERT")) {
        backgroundColor = "bg-red-500";
      } else if (difficulty.difficulty.includes("MASTER") && !isRemaster) {
        backgroundColor = "bg-purple-500";
      }

      return (
        <div
          key={difficulty._id}
          className={`relative w-10 h-10 flex items-center justify-center rounded-lg ${isRemaster ? "border border-purple-500" : ""} ${backgroundColor}`}
        >
          <span
            className={`text-md ${isRemaster ? "text-purple-500" : "text-white"}`}
          >
            {difficulty.level}
          </span>
          {
            <img
              src={
                difficulty.difficulty.includes("(DX)")
                  ? "/type-dx.png"
                  : "/type-std.png"
              }
              alt="difficulty type icon"
              className="absolute top-0 left-6 w-7 h-2"
            />
          }
        </div>
      );
    });
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
  }, [category, version]);

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
      <div className="p-2">
        <div className="flex flex-col md:flex-row gap-4 mb-4 max-w-3xl mx-auto">
          <div className="flex w-full border rounded-lg overflow-hidden">
            <input
              className="flex-1 p-2 border-none outline-none"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="p-2 border-l"
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
        <div className="flex flex-col md:flex-row gap-4 mb-4 max-w-3xl mx-auto">
          <select
            className="p-2 border rounded w-full md:w-1/2"
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
            className="p-2 border rounded w-full md:w-1/2"
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
      </div>
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
              <Link
                href={`/song/${item._id}`}
                className="select-none flex flex-col p-4 my-4 border rounded-lg shadow flex hover:bg-stone-200"
                key={item._id + "root"}
              >
                <div key={item._id} className="flex">
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="mr-4 w-24 h-24 my-auto"
                  />
                  <div className="flex flex-col my-auto min-w-0">
                    <p className="font-bold truncate text-ellipsis">
                      {item.title}
                    </p>
                    <p className="text-gray-500 truncate text-ellipsis">
                      {item.artist}
                    </p>
                    <div className="mt-1 flex-wrap gap-4 hidden md:flex">
                      {difficultiesComponent(item.difficulties)}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-4 md:hidden">
                  {difficultiesComponent(item.difficulties)}
                </div>
              </Link>
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
}
