export class Difficulty {
  difficulty: string;
  level: string;
  internalLevel: number;

  constructor(difficulty: string, level: string, internalLevel: number) {
    this.difficulty = difficulty;
    this.level = level;
    this.internalLevel = internalLevel;
  }
}
