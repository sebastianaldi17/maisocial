import dotenv from "dotenv";
import mongoose from "mongoose";
import {
  API_URL,
  difficultyFieldNames,
  versionMapping,
} from "../src/constants";
import { songModel } from "../src/models";
import { Difficulty } from "../src/classes";
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import { convertMacrons } from "../src/utils";

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB);

    const kuroshiro = new Kuroshiro();
    await kuroshiro.init(new KuromojiAnalyzer());

    const result = await fetch(API_URL);
    if (result.ok) {
      const data = await result.json();
      for (const song of data) {
        if (song.catcode === "宴会場") {
          // TODO: Handle utage songs in a separate collection later
          continue;
        }

        // Convert title to romaji
        const romajiTitle = await kuroshiro.convert(song.title, {
          to: "romaji",
        });
        const alternateTitle = convertMacrons(romajiTitle);

        const versionKey = Number(song.version.substring(0, 3));
        const version = versionMapping.get(versionKey);

        const difficulties = [];

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

        const existingSong = await songModel.findOne({
          title: song.title,
          category: song.catcode,
          artist: song.artist,
        });

        if (existingSong && existingSong.difficulties?.length > 0) {
          // Compare difficulties and update if needed
          let hasChanges = false;
          existingSong.set({
            difficulties: existingSong.difficulties.map((existingDiff) => {
              const newDiff = difficulties.find(
                (d) => d.difficulty === existingDiff.difficulty,
              );
              if (newDiff && existingDiff.level !== newDiff.level) {
                hasChanges = true;
                return { ...existingDiff, level: newDiff.level };
              }
              return existingDiff;
            }),
          });

          // Check if any new difficulties were added
          for (const newDiff of difficulties) {
            if (
              !existingSong.difficulties.some(
                (d) => d.difficulty === newDiff.difficulty,
              )
            ) {
              existingSong.difficulties.push(newDiff);
              hasChanges = true;
            }
          }

          if (
            !existingSong.alternateTitle ||
            existingSong.alternateTitle !== alternateTitle
          ) {
            existingSong.alternateTitle = alternateTitle;
            hasChanges = true;
          }

          if (hasChanges) {
            console.log(`Updating ${song.title} in DB`);
            await existingSong.save();
          }
          continue;
        }

        await songModel.findOneAndUpdate(
          {
            title: song.title,
            category: song.catcode,
            artist: song.artist,
          },
          {
            artist: song.artist,
            alternateTitle: alternateTitle,
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
