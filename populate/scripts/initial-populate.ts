import dotenv from "dotenv";
import mongoose from "mongoose";

const API_URL = "https://maimai.sega.jp/data/maimai_songs.json";
const versionMapping = new Map([
  [0, null],
  [100, "maimai"],
  [110, "maimai PLUS"],
  [120, "GreeN"],
  [130, "GreeN PLUS"],
  [140, "ORANGE"],
  [150, "ORANGE PLUS"],
  [160, "PiNK"],
  [170, "PiNK PLUS"],
  [180, "MURASAKi"],
  [185, "MURASAKi PLUS"],
  [190, "MiLK"],
  [195, "MiLK PLUS"],
  [199, "FiNALE"],
  [200, "maimaiでらっくす"],
  [205, "maimaiでらっくす PLUS"],
  [210, "Splash"],
  [215, "Splash PLUS"],
  [220, "UNiVERSE"],
  [225, "UNiVERSE PLUS"],
  [230, "FESTiVAL"],
  [235, "FESTiVAL PLUS"],
  [240, "BUDDiES"],
  [245, "BUDDiES PLUS"],
  [250, "PRiSM"],
]);
const difficultyFieldNames: [string, string][] = [
  ["lev_bas", "BASIC"],
  ["lev_adv", "ADVANCED"],
  ["lev_exp", "EXPERT"],
  ["lev_mas", "MASTER"],
  ["lev_remas", "RE:MASTER"],
  ["dx_lev_bas", "BASIC (DX)"],
  ["dx_lev_adv", "ADVANCED (DX)"],
  ["dx_lev_exp", "EXPERT (DX)"],
  ["dx_lev_mas", "MASTER (DX)"],
  ["dx_lev_remas", "RE:MASTER (DX)"],
  ["lev_utage", "UTAGE"],
];

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB);

    const songSchema = new mongoose.Schema({
      artist: String,
      title: String,
      version: String,
      category: String,
      cover: String,
      bpm: String,
      difficulties: [
        {
          difficulty: String,
          level: String,
          internalLevel: Number,
        },
      ],
    });
    const songModel = mongoose.model("Song", songSchema);

    const result = await fetch(API_URL);
    if (result.ok) {
      const data = await result.json();
      for (const song of data) {
        const versionKey = Number(song.version.substring(0, 3));
        const version = versionMapping.get(versionKey);

        const difficulties = [];

        for (const [fieldName, difficulty] of difficultyFieldNames) {
          if (song[fieldName]) {
            difficulties.push({
              difficulty: difficulty,
              level: song[fieldName],
            });
          }
        }

        const res = await songModel.findOne({
          title: song.title,
          category: song.catcode,
          artist: song.artist,
        });

        if (res) {
          // TODO rather than skipping, it might have difficulty changes, so update it
          console.log(`Skipping ${song.title}, since it is already in DB`);
          continue;
        }
        console.log(`Adding ${song.title} to DB`);

        const songDocument = new songModel({
          artist: song.artist,
          title: song.title,
          version: version,
          category: song.catcode,
          cover: `https://maimaidx.jp/maimai-mobile/img/Music/${song.image_url}`,
          difficulties: difficulties,
        });

        await songDocument.save();
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
