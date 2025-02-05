import { Song } from "@/classes/song";

interface SongTableProps {
  song: Song;
}
export default function SongTable({ song }: SongTableProps) {
  return (
    <>
      {/* desktop/tablet view */}
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

      {/* mobile view */}
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
    </>
  );
}
