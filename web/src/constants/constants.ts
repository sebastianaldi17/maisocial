const levels: [string, string][] = [];
for (let i = 1; i <= 15; i++) {
  levels.push([i.toString(), i.toString() + ".0"]);
  if (i >= 7 && i < 15) {
    levels.push([i.toString() + "+", i.toString() + ".6"]);
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

export { levels, accFactor };
