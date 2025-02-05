import { Difficulty } from "@/classes/difficulty";

interface DifficultyBadgesProps {
  difficulties: Difficulty[];
}

export default function DifficultyBadges({
  difficulties,
}: DifficultyBadgesProps) {
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
        className={`relative w-12 h-12 flex items-center justify-center rounded-lg ${isRemaster ? "border border-purple-500" : ""} ${backgroundColor}`}
      >
        <span
          className={`text-lg ${isRemaster ? "text-purple-500" : "text-white"}`}
        >
          {difficulty.level}
        </span>
        <div className="absolute w-10 h-4 bottom-9 left-6 bg-gray-800 rounded-2xl shadow-lg">
          <p className="text-xs text-white text-center align-middle">
            {difficulty.internalLevel}
          </p>
        </div>
        {
          <img
            src={
              difficulty.difficulty.includes("(DX)")
                ? "/type-dx.png"
                : "/type-std.png"
            }
            alt="difficulty type icon"
            className="absolute top-9 left-6 w-12 h-4"
          />
        }
      </div>
    );
  });
}
