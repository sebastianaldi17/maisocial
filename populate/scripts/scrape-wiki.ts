import * as cheerio from "cheerio";

async function main() {
  const url = "https://gamerch.com/maimai/545589";
  const res = await fetch(url);
  const html = await res.text();
  const songListPage = cheerio.load(html);

  const songLinks: string[] = [];

  songListPage(
    "body > div.wiki-contents > div.liquid > div.layout.theme0.btn-default-orange.image-align-bottom.mu-zoom-icon > div.main > div.markup.mu > ul > li > a",
  ).each((_, elem) => {
    const songLink = songListPage(elem).attr("href");

    if (songLink) {
      songLinks.push(songLink);
    }
  });

  for (const songLink of songLinks) {
    const songRes = await fetch(songLink);
    const songHtml = await songRes.text();
    const songPage = cheerio.load(songHtml);

    console.log(
      songPage(
        "body > div.wiki-contents > div.liquid > div.layout.theme0.btn-default-orange.image-align-bottom.mu-zoom-icon > div.main > div.markup.mu > div:nth-child(2) > table > tbody > tr.mu__table--row2 > td > a",
      ).text(),
    );
  }
}

main();
