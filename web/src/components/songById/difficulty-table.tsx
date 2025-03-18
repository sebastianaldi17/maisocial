import { Song } from "@/classes/song";
import { accFactor } from "@/constants/constants";

interface DifficultyTableProps {
  song: Song;
  accuracy: number;
}

export default function DifficultyTable({
  song,
  accuracy,
}: DifficultyTableProps) {
  return (
    <>
      <table className="border border-gray-400 w-full table-fixed">
        <thead>
          <tr>
            <th className="border border-gray-400 bg-gray-200 w-[35%]">
              Level
            </th>
            <th className="border border-gray-400 bg-gray-200 w-[32%]">
              Constant
            </th>
            <th className="border border-gray-400 bg-gray-200 w-[33%]">
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
                  <p className="pl-2">{difficulty.level}</p>
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
    </>
  );
}
