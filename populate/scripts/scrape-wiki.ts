import * as cheerio from "cheerio";
// import mongoose from "mongoose";

async function main() {
  // await mongoose.connect(process.env.MONGODB);

  const url = "https://gamerch.com/maimai/545589";
  const res = await fetch(url);
  const html = await res.text();
  const songListPage = cheerio.load(html);

  const songLinks: [string, string][] = [];

  songListPage(
    "body > div.wiki-contents > div.liquid > div.layout.theme0.btn-default-orange.image-align-bottom.mu-zoom-icon > div.main > div.markup.mu > ul > li > a",
  ).each((_, elem) => {
    const songLink = songListPage(elem).attr("href");
    const songTitle = songListPage(elem).text();

    if (songLink) {
      songLinks.push([songTitle, songLink]);
    }
  });

  for (const [songTitle, songLink] of songLinks) {
    const songRes = await fetch(songLink);
    const songHtml = await songRes.text();
    const songPage = cheerio.load(songHtml);

    const bpmTd = songPage("tr")
      .filter((_, tr) => {
        return songPage(tr).find("th").text().includes("BPM");
      })
      .find("td")
      .text();

    console.log(`Song: ${songTitle}, BPM: ${bpmTd}`);
  }
}

main();
