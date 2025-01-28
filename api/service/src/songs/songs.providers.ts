import { Connection } from "mongoose";
import { SongSchema } from "src/schemas/song.schema";

export const songsProviders = [
  {
    provide: "SONG_MODEL",
    useFactory: (connection: Connection) =>
      connection.model("Song", SongSchema),
    inject: ["DATABASE_CONNECTION"],
  },
];
