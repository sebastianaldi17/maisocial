import dotenv from "dotenv";
import mongoose from "mongoose";
import {
  API_URL,
  difficultyFieldNames,
  versionMapping,
} from "../src/constants";
import { songModel } from "../src/models";
import { Difficulty } from "../src/classes";

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB);

    const result = await fetch(API_URL);
    if (result.ok) {
      const data = await result.json();
      for (const song of data) {
        if (song.catcode === "宴会場") {
          // TODO: Handle utage songs in a separate collection later
          continue;
        }

        const versionKey = Number(song.version.substring(0, 3));
        const version = versionMapping.get(versionKey);

        const difficulties = [];

        const existingSong = await songModel.findOne({
          title: song.title,
          category: song.catcode,
          artist: song.artist,
        });

        if (existingSong && existingSong.difficulties?.length > 0) {
          console.log(`Song ${song.title} already exists in DB`);
          continue;
        }

        for (const [fieldName, difficulty] of difficultyFieldNames) {
          if (song[fieldName]) {
            let internalLevel = parseInt(
              song[fieldName].replace("+", "").replace("?", ""),
            );
            if (song[fieldName].includes("+")) {
              internalLevel += 0.6;
            }
            difficulties.push(
              new Difficulty(difficulty, song[fieldName], internalLevel),
            );
          }
        }

        await songModel.findOneAndUpdate(
          {
            title: song.title,
            category: song.catcode,
            artist: song.artist,
          },
          {
            artist: song.artist,
            title: song.title,
            version: version,
            category: song.catcode,
            cover: `https://maimaidx.jp/maimai-mobile/img/Music/${song.image_url}`,
            difficulties: difficulties,
          },
          { upsert: true },
        );

        console.log(`Upserting ${song.title} to DB`);
      }
      console.log("Initial DB population completed");
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

dotenv.config();
main();
