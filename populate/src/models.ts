import mongoose from "mongoose";
import { songSchema } from "./schemas";

export const songModel = mongoose.model("Song", songSchema);
