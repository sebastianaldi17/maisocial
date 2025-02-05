import { Song } from "@/classes/song";
import Link from "next/link";
import DifficultyBadges from "./difficulty-badges";

interface SongCardProps {
  song: Song;
}

export default function SongCard({ song }: SongCardProps) {
  return (
    <Link
      href={`/song/${song._id}`}
      className="select-none flex flex-col p-4 my-4 border border-gray-300 rounded-lg shadow-md flex hover:bg-stone-200"
      key={song._id + "root"}
    >
      <div key={song._id} className="flex">
        <img
          src={song.cover}
          alt={song.title}
          className="mr-4 w-24 h-24 my-auto"
        />
        <div className="flex flex-col my-auto min-w-0">
          <p className="font-bold truncate text-ellipsis">{song.title}</p>
          <p className="text-gray-500 truncate text-ellipsis">{song.artist}</p>
          <div className="mt-2 flex-wrap gap-8 hidden md:flex">
            <DifficultyBadges difficulties={song.difficulties} />
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-8 md:hidden">
        <DifficultyBadges difficulties={song.difficulties} />
      </div>
    </Link>
  );
}
