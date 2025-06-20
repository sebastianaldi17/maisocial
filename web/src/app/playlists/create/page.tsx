"use client";

import { Song } from "@/classes/song";
import { Difficulty } from "@/classes/difficulty";
import { useSession } from "@/contexts/sessionContext";
import { BackendApi } from "@/services/api";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import { CreatePlaylistRequest, PlaylistSong } from "@/classes/playlist";

interface SelectedSong {
  song: Song;
  selectedDifficulty: Difficulty;
  id: string;
}

export default function CreatePlaylistPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<SelectedSong[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSongForDifficulty, setSelectedSongForDifficulty] =
    useState<Song | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const { session, loading } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSongSelect = (song: Song) => {
    setSelectedSongForDifficulty(song);
    setSelectedDifficulty("");
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleDifficultySelect = (difficulty: Difficulty) => {
    if (!selectedSongForDifficulty) return;

    if (selectedSongs.length >= 4) {
      alert("You can only select up to 4 songs.");
      return;
    }

    const newSelection: SelectedSong = {
      song: selectedSongForDifficulty,
      selectedDifficulty: difficulty,
      id: `${selectedSongForDifficulty._id}-${difficulty._id}-${Date.now()}`,
    };

    setSelectedSongs([...selectedSongs, newSelection]);
    setSelectedSongForDifficulty(null);
    setSelectedDifficulty("");
  };

  const handleRemoveSelection = (id: string) => {
    setSelectedSongs(selectedSongs.filter((selection) => selection.id !== id));
  };

  const handleCancelDifficultySelection = () => {
    setSelectedSongForDifficulty(null);
    setSelectedDifficulty("");
  };

  const handleCreatePlaylist = async () => {
    if (selectedSongs.length === 0) {
      alert("Please select at least one song to create a playlist.");
      return;
    }
    if (!session) {
      alert("You must be logged in to create a playlist.");
      return;
    }
    const playlistName = prompt(
      "Enter a name for your playlist (3-50 characters):",
    );
    if (!playlistName) {
      alert("Playlist name cannot be empty.");
      return;
    }
    if (playlistName.length < 3 || playlistName.length > 50) {
      alert("Playlist name must be between 3 and 50 characters.");
      return;
    }
    const playlistSongs: PlaylistSong[] = selectedSongs.map((selection) => ({
      songId: selection.song._id,
      difficultyId: selection.selectedDifficulty._id,
    }));
    const requestData: CreatePlaylistRequest = {
      playlistName,
      songs: playlistSongs,
    };
    try {
      await BackendApi.createPlaylist(requestData, session.access_token);
      alert("Playlist created successfully!");
      window.location.href = "/playlists";
    } catch (error) {
      alert("Error creating playlist, please try again later.");
      console.error("Error creating playlist:", error);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverItem(id);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, dropTargetId: string) => {
    e.preventDefault();

    if (!draggedItem || draggedItem === dropTargetId) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const draggedIndex = selectedSongs.findIndex(
      (song) => song.id === draggedItem,
    );
    const targetIndex = selectedSongs.findIndex(
      (song) => song.id === dropTargetId,
    );

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newSelectedSongs = [...selectedSongs];
    const [draggedSong] = newSelectedSongs.splice(draggedIndex, 1);
    newSelectedSongs.splice(targetIndex, 0, draggedSong);

    setSelectedSongs(newSelectedSongs);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  return (
    <div className="max-w-3xl px-2 mx-auto">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Create New Playlist</h1>

        {/* Song Search Combobox */}
        <div className="mb-6" ref={dropdownRef}>
          <label className="block text-sm font-medium mb-2">
            Search and select songs ({selectedSongs.length}/4)
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for songs by title or artist..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              disabled={selectedSongs.length >= 4}
            />

            {showDropdown && searchTerm && filteredSongs.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                {filteredSongs.map((song) => (
                  <div
                    key={song._id}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSongSelect(song)}
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={song.cover}
                        alt={song.title}
                        width={40}
                        height={40}
                        className="rounded object-cover"
                      />
                      <div>
                        <div className="font-medium">{song.title}</div>
                        <div className="text-sm text-gray-600">
                          {song.artist}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Difficulty Selection Modal */}
        {selectedSongForDifficulty && (
          <div className="mb-6 p-4 border border-blue-300 rounded-lg bg-blue-50">
            <h3 className="text-lg font-medium mb-3">
              Select difficulty for &quot;{selectedSongForDifficulty.title}
              &quot;
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <Image
                src={selectedSongForDifficulty.cover}
                alt={selectedSongForDifficulty.title}
                width={60}
                height={60}
                className="rounded object-cover"
              />
              <div>
                <div className="font-medium">
                  {selectedSongForDifficulty.title}
                </div>
                <div className="text-gray-600">
                  {selectedSongForDifficulty.artist}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 mb-4">
              {selectedSongForDifficulty.difficulties.map((difficulty) => (
                <label
                  key={difficulty._id}
                  className="flex items-center p-2 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="difficulty"
                    value={difficulty._id}
                    checked={selectedDifficulty === difficulty._id}
                    onChange={() => setSelectedDifficulty(difficulty._id)}
                    className="mr-3"
                  />
                  <span className="font-medium">{difficulty.difficulty}</span>
                  <span className="ml-2 text-gray-600">
                    Level {difficulty.level} ({difficulty.internalLevel})
                  </span>
                </label>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const difficulty =
                    selectedSongForDifficulty.difficulties.find(
                      (d) => d._id === selectedDifficulty,
                    );
                  if (difficulty) {
                    handleDifficultySelect(difficulty);
                  }
                }}
                disabled={!selectedDifficulty}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Playlist
              </button>
              <button
                onClick={handleCancelDifficultySelection}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Selected Songs List */}
        {selectedSongs.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Selected Songs</h3>
            <div className="space-y-3">
              {selectedSongs.map((selection) => (
                <div
                  key={selection.id}
                  className={`flex items-center gap-4 p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-move transition-all ${
                    draggedItem === selection.id ? "opacity-50" : ""
                  } ${
                    dragOverItem === selection.id
                      ? "border-blue-500 bg-blue-50"
                      : ""
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, selection.id)}
                  onDragOver={(e) => handleDragOver(e, selection.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, selection.id)}
                  onDragEnd={handleDragEnd}
                >
                  <Menu
                    className="text-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0"
                    size={20}
                  />
                  <Image
                    src={selection.song.cover}
                    alt={selection.song.title}
                    width={50}
                    height={50}
                    className="rounded object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{selection.song.title}</div>
                    <div className="text-gray-600">{selection.song.artist}</div>
                    <div className="text-sm text-blue-600">
                      {selection.selectedDifficulty.difficulty} - Level{" "}
                      {selection.selectedDifficulty.level} (
                      {selection.selectedDifficulty.internalLevel})
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveSelection(selection.id)}
                    className="text-gray-400 hover:text-red-500 text-xl font-bold p-1"
                    aria-label="Remove song"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            disabled={selectedSongs.length === 0}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              handleCreatePlaylist();
            }}
          >
            Save Playlist
          </button>
        </div>
      </div>
    </div>
  );
}
