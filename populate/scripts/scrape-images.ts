import dotenv from "dotenv";
import mongoose from "mongoose";
import { API_URL } from "../src/constants";
import { createClient } from "@supabase/supabase-js";
import sleep from "../src/utils";
import { songModel } from "../src/models";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"; // Use at your own risk

const DELAY = 500;

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB);

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );

    const result = await fetch(API_URL);
    if (result.ok) {
      console.log("Fetched song data");
      const data = await result.json();
      for (const song of data) {
        if (song.catcode === "宴会場") {
          // TODO: Handle utage songs in a separate collection later
          continue;
        }

        const existingSong = await songModel.findOne({
          title: song.title,
          category: song.catcode,
          artist: song.artist,
        });

        if (
          existingSong &&
          !existingSong.cover?.startsWith(
            "https://maimaidx.jp/maimai-mobile/img/Music/",
          )
        ) {
          console.log(`Image already exists for ${song.title}`);
          continue;
        }

        await sleep(DELAY);

        const originalImageUrl = `https://maimaidx.jp/maimai-mobile/img/Music/${song.image_url}`;
        const pngImageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/thumbnails/public/png/${song.image_url}`;

        const imageFetch = await fetch(originalImageUrl);
        if (imageFetch.ok) {
          const imageBlob = await imageFetch.blob();
          const { error } = await supabase.storage
            .from("thumbnails")
            .upload(`public/png/${song.image_url}`, imageBlob, {
              upsert: true,
            });

          if (error) {
            console.error(`Got error uploading image for ${song.title}`);
            console.error(error);
            continue;
          }

          await songModel.findOneAndUpdate(
            {
              title: song.title,
              category: song.catcode,
              artist: song.artist,
            },
            {
              cover: pngImageUrl,
            },
            { upsert: true },
          );

          console.log(`Uploaded image for ${song.title}`);
        } else {
          console.error(`Failed to fetch image for ${song.title}`);
        }
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
}

dotenv.config();
main();
