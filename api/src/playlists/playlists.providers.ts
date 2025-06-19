import { Connection } from "mongoose";
import { PlaylistSchema } from "src/schemas/playlist.schema";

export const playlistsProviders = [
  {
    provide: "PLAYLIST_MODEL",
    useFactory: (connection: Connection) =>
      connection.model("Playlist", PlaylistSchema),
    inject: ["DATABASE_CONNECTION"],
  },
];
