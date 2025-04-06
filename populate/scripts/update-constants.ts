import { JWT } from "google-auth-library";
import dotenv from "dotenv";
import creds from "../service-account.json";
import { loadSpreadsheet } from "../src/spreadsheeet-client";
import {
  diffMapping,
  PRiSM_PLUS_SPREADSHEET_ID,
  titleHotfix,
} from "../src/constants";
import { GoogleSpreadsheet } from "google-spreadsheet";
import mongoose from "mongoose";
import { songModel } from "../src/models";

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB);

    const auth = new JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const spreadsheet = loadSpreadsheet(PRiSM_PLUS_SPREADSHEET_ID, auth);

    await spreadsheet.loadInfo();

    console.log("Loaded spreadsheet");

    await updatePrismPlusConstants(spreadsheet);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
}

async function updatePrismPlusConstants(spreadsheet: GoogleSpreadsheet) {
  await updateConstantFromSheet(
    spreadsheet,
    "PRiSM PLUS新曲",
    [0, 1, 2, 4],
    [0, 6],
  );
  await updateConstantFromSheet(
    spreadsheet,
    "14以上",
    [0, 2, 3, 5],
    [0, 7, 14, 21, 28],
  );
  await updateConstantFromSheet(
    spreadsheet,
    "13+",
    [0, 1, 2, 4],
    [0, 6, 12, 18],
  );
}

// async function updatePrismConstants(spreadsheet: GoogleSpreadsheet) {
//   await updateConstantFromSheet(
//     spreadsheet,
//     "PRiSM新曲",
//     [0, 1, 2, 4],
//     [0, 6, 12, 18, 24],
//   );
//   await updateConstantFromSheet(
//     spreadsheet,
//     "14以上",
//     [0, 2, 3, 5],
//     [0, 7, 14, 21, 28],
//   );
//   await updateConstantFromSheet(
//     spreadsheet,
//     "13+",
//     [0, 2, 3, 5],
//     [0, 7, 14, 21, 28],
//   );
//   await updateConstantFromSheet(
//     spreadsheet,
//     "13",
//     [0, 2, 3, 5],
//     [0, 8, 15, 22, 29, 36],
//   );
// }

async function updateConstantFromSheet(
  spreadsheeet: GoogleSpreadsheet,
  sheetName: string,
  // indexes is [title, dx/std, difficultyName, constant]
  indexes: [number, number, number, number],
  offsets: number[],
) {
  const sheet = spreadsheeet.sheetsByTitle[sheetName];
  await sheet.loadCells();
  for (let i = 0; i < offsets.length; i++) {
    const offset = offsets[i];
    for (let j = 3; j < sheet.rowCount; j++) {
      let title = sheet.getCell(j, indexes[0] + offset).value;
      const chartType = sheet.getCell(j, indexes[1] + offset).value;
      const chartDifficulty = sheet.getCell(j, indexes[2] + offset).value;
      let chartConstant = sheet.getCell(j, indexes[3] + offset).value;

      if (chartConstant === "-") {
        // Assume old value is to the left of the new value
        chartConstant = sheet.getCell(j, indexes[3] + offset - 1).value;
      }

      if (titleHotfix.has(title as string)) {
        title = titleHotfix.get(title as string);
      }

      if (
        isNaN(Number(chartConstant)) ||
        !chartConstant ||
        !chartDifficulty ||
        !chartType ||
        !title
      ) {
        // console.log(`Skipping "${title}" (row ${j} column ${offset})`);
        continue;
      }

      const existingSong = await songModel.findOne({ title: title });
      if (!existingSong) {
        console.log(`Song "${title}" is not found in DB, please check`);
        continue;
      }

      const difficulties = existingSong.difficulties;
      let found = false;
      for (let i = 0; i < difficulties.length; i++) {
        if (
          difficulties[i].difficulty ===
          `${diffMapping.get(chartDifficulty as string)}${chartType === "DX" ? " (DX)" : ""}`
        ) {
          found = true;
          difficulties[i].internalLevel = Number(chartConstant);
        }
      }
      if (!found) {
        console.log(
          `Difficulty ${diffMapping.get(chartDifficulty as string)}${chartType === "DX" ? " (DX)" : ""} not found for song "${title}", please check`,
        );
        continue;
      }
      await songModel.findOneAndUpdate(
        { title: title },
        { difficulties: difficulties },
      );

      // console.log(
      //   `Updated ${title} - ${diffMapping.get(chartDifficulty as string)}${chartType === "DX" ? " (DX)" : ""} to ${chartConstant}`,
      // );
    }
  }
}

dotenv.config();
main();
