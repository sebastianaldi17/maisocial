import { Song } from "@/classes/song";
import { redirect } from "next/navigation";

export default async function SongDetailById({
  params,
}: {
  params: Promise<{ songId: string }>;
}) {
  const songId = (await params).songId;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/songs/song/${songId}`,
  );
  const body: Song = await response.json();

  if (!response.ok) {
    redirect(`/?badId=${songId}`);
  }

  return (
    <div className="px-4 flex-col max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold pb-2">Song information</h1>
      <table className="w-full border border-gray-400 hidden md:table">
        <tbody>
          <tr className="border border-gray-400">
            <td rowSpan={4} className="border border-gray-400 w-64">
              <img src={body.cover} alt="Cover" className="p-4 w-full h-full" />
            </td>
            <td className="p-3 border border-gray-400 bg-gray-200">Title</td>
            <td className="p-3 border border-gray-400">{body.title}</td>
          </tr>

          <tr className="border border-gray-400">
            <td className="p-3 border border-gray-400 bg-gray-200">Artist</td>
            <td className="p-3 border border-gray-400">{body.artist}</td>
          </tr>

          <tr className="border border-gray-400">
            <td className="p-3 border border-gray-400 bg-gray-200">Category</td>
            <td className="p-3 border border-gray-400">{body.category}</td>
          </tr>

          <tr className="border border-gray-400">
            <td className="p-3 border border-gray-400 bg-gray-200">Version</td>
            <td className="p-3 border border-gray-400">{body.version}</td>
          </tr>
        </tbody>
      </table>
      <table className="w-full border border-gray-400 md:hidden">
        <tbody>
          <tr>
            <td colSpan={2} className="p-0 border border-gray-400">
              <img
                src={body.cover}
                alt="Cover"
                className="mx-auto h-32 object-cover"
              />
            </td>
          </tr>

          <tr className="border border-gray-400">
            <td className="p-3 border border-gray-400 bg-gray-200">Title</td>
            <td className="p-3 border border-gray-400">{body.title}</td>
          </tr>

          <tr className="border border-gray-400">
            <td className="p-3 border border-gray-400 bg-gray-200">Artist</td>
            <td className="p-3 border border-gray-400">{body.artist}</td>
          </tr>

          <tr className="border border-gray-400">
            <td className="p-3 border border-gray-400 bg-gray-200">Category</td>
            <td className="p-3 border border-gray-400">{body.category}</td>
          </tr>

          <tr className="border border-gray-400">
            <td className="p-3 border border-gray-400 bg-gray-200">Version</td>
            <td className="p-3 border border-gray-400">{body.version}</td>
          </tr>
        </tbody>
      </table>
      <h1 className="text-2xl font-bold py-2">Difficulty information</h1>
      <table className="w-fit border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">Level</th>
            <th className="border border-gray-400 px-4 py-2">Constant</th>
          </tr>
        </thead>
        <tbody>
          {body.difficulties.map((difficulty) => {
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
