import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const backendRoot = process.argv[2] ?? "C:\\Users\\alons\\Terra-Historia-Backend";
const fixes = {
  "first-intifada.generated.json": {
    "palestinian-declaration": "https://commons.wikimedia.org/wiki/Special:FilePath/Gaza_Strip_map2.svg",
    "madrid-conference": "https://commons.wikimedia.org/wiki/Special:FilePath/Gaza_Strip_map2.svg",
  },
  "first-libyan-civil-war.generated.json": {
    "fall-of-tripoli": "https://commons.wikimedia.org/wiki/Special:FilePath/First%20Libyan%20Civil%20War%20%282011%29.png",
  },
  "gaza-conflicts-2018-2023.generated.json": {
    "breaking-dawn": "https://commons.wikimedia.org/wiki/Special:FilePath/Gaza_conflict_map2.png",
  },
  "wwi-events.json": {
    "verdun": "https://upload.wikimedia.org/wikipedia/commons/5/5d/Battle_of_Verdun_map.png",
    "us-enters": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/President_Woodrow_Wilson_asking_Congress_to_declare_war_on_Germany%2C_2_April_1917.jpg/1280px-President_Woodrow_Wilson_asking_Congress_to_declare_war_on_Germany%2C_2_April_1917.jpg",
    "hundred-days": "https://upload.wikimedia.org/wikipedia/commons/4/42/Western_front_1918_german.jpg",
  },
  "indonesian-national-revolution.generated.json": {
    "rengat-massacre": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/KITLV_A1161_-_De_Inderagiri_%28Batang_Koeantan%29_te_Rengat%2C_KITLV_402263.tiff/lossy-page1-1280px-KITLV_A1161_-_De_Inderagiri_%28Batang_Koeantan%29_te_Rengat%2C_KITLV_402263.tiff.jpg",
  },
  "turkish-war-of-independence.generated.json": {
    "bombardment-of-samsun": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Turkish_Nationalists_arrive_by_ship_at_Samsun.webm/1280px--Turkish_Nationalists_arrive_by_ship_at_Samsun.webm.jpg",
  },
  "palestinian-fedayeen-insurgency.generated.json": {
    "egypt-sponsored-raids": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Qalqilia_Raid.jpg/1920px-Qalqilia_Raid.jpg",
    "conflict-summary": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Qalqilia_Raid.jpg/1920px-Qalqilia_Raid.jpg",
  },
};

let fixed = 0;
for (const [file, events] of Object.entries(fixes)) {
  const path = join(backendRoot, "deepdives-drafts", file);
  const data = JSON.parse(await readFile(path, "utf8"));
  for (const event of data) {
    const image = events[event.id];
    if (!image) continue;
    for (const slide of event.slides ?? []) slide.img = image;
    fixed += 1;
  }
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`);
}
console.log(`Repaired ${fixed} low-value or non-renderable event images.`);
