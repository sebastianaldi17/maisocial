export class Difficulty {
  _id: string;
  difficulty: string;
  level: string;
  internalLevel: number;

  constructor(
    _id: string,
    difficulty: string,
    level: string,
    internalLevel: number,
  ) {
    this._id = _id;
    this.difficulty = difficulty;
    this.level = level;
    this.internalLevel = internalLevel;
  }
}
