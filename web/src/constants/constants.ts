const minLevels: [string, string][] = [];
const maxLevels: [string, string][] = [];
const levels: [string, string][] = [];

for (let i = 1; i <= 15; i++) {
  if (i >= 12 && i < 15) {
    for (let j = 0.1; j < 1; j += 0.1) {
      const level = (i + j).toFixed(1);
      levels.push([level, level]);
    }
  } else {
    levels.push([i.toString(), i.toString()]);
  }
  minLevels.push([i.toString(), i.toString() + ".0"]);
  maxLevels.push([i.toString(), i.toString() + (i < 7 ? ".9" : ".5")]);
  if (i >= 7 && i < 15) {
    minLevels.push([i.toString() + "+", i.toString() + ".6"]);
    maxLevels.push([i.toString() + "+", i.toString() + ".9"]);
  }
}

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

export enum DifficultyFilterMode {
  Min,
  Max,
}

export { levels, minLevels, maxLevels, accFactor };
