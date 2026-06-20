import { readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const backendRoot = process.argv[2] ?? "C:\\Users\\alons\\Terra-Historia-Backend";
const shouldWrite = process.argv.includes("--write");
const draftsRoot = join(backendRoot, "deepdives-drafts");

const rejectedNameTerms = [
  "coat_of_arms", "demonstration", "emblem", "flag_of_", "logo", "memorial",
  "protest", "ribbon", "roundel", "symbol", "wikidata",
];
const genericTerms = new Set([
  "and", "background", "battle", "civil", "conflict", "from", "historical",
  "in", "of", "operation", "part", "summary", "the", "to", "war",
]);
const curated = {
  "russian-civil-war.json/february-revolution":
    "https://commons.wikimedia.org/wiki/Special:FilePath/February_Revolution_in_Petrograd.jpg",
  "russian-civil-war.json/october-revolution":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Storming_the_Winter_Palace.jpg",
  "russian-civil-war.json/constituent-assembly":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Tauride_Palace_1917.jpg",
  "russian-civil-war.json/brest-litovsk":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Brest-Litovsk_Treaty_map.svg",
  "russian-civil-war.json/czechoslovak-legion":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Czechoslovak_Legion_in_Russia.jpg",
  "russian-civil-war.json/red-army-cheka":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Trotsky_on_armoured_train.jpg",
  "russian-civil-war.json/kolchak-siberia":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Alexander_Kolchak_1919.jpg",
  "russian-civil-war.json/denikin-south":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Anton_Denikin_1918.jpg",
  "russian-civil-war.json/foreign-intervention":
    "https://commons.wikimedia.org/wiki/Special:FilePath/American_troops_Vladivostok_1918.jpg",
  "russian-civil-war.json/polish-soviet-war":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Polish-Soviet_War_1920_polish_defences_near_Milosna.jpg",
  "russian-civil-war.json/wrangel-crimea":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Pyotr_Wrangel_1920.jpg",
  "russian-civil-war.json/kronstadt-nep":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Kronstadt_sailors_1917.jpg",
  "wwii-events.json/poland":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Mapa_2_paktu_Ribbentrop-Mo%C5%82otow.gif",
};

function words(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !genericTerms.has(word));
}

function filename(url) {
  try {
    return decodeURIComponent(new URL(url).pathname.split("/").at(-1)).toLowerCase();
  } catch {
    return "";
  }
}

function relevanceScore(url, event, conflict) {
  const name = filename(url);
  const eventWords = words(`${event.title} ${event.slides?.[0]?.title}`);
  const conflictWords = words(conflict);
  let score = 0;
  for (const word of eventWords) if (name.includes(word)) score += 3;
  for (const word of conflictWords) if (name.includes(word)) score += 1;
  if (rejectedNameTerms.some((term) => name.includes(term))) score -= 20;
  return score;
}

async function checkUrl(url) {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "User-Agent": "Terra-Historia image audit/1.0" },
      signal: AbortSignal.timeout(15000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

const files = (await readdir(draftsRoot))
  .filter((file) => file.endsWith(".json") && file !== "candidate-wars-1914-2026.json")
  .sort();
const datasets = [];
const uniqueUrls = new Set();

for (const file of files) {
  const path = join(draftsRoot, file);
  const events = JSON.parse(await readFile(path, "utf8"));
  if (!Array.isArray(events)) continue;
  for (const event of events) {
    for (const slide of event.slides ?? []) {
      if (slide.img) uniqueUrls.add(slide.img);
    }
  }
  datasets.push({ file, path, events });
}

const health = new Map();
const urls = [...uniqueUrls];
for (let index = 0; index < urls.length; index += 8) {
  const batch = urls.slice(index, index + 8);
  const results = await Promise.all(batch.map(async (url) => [url, await checkUrl(url)]));
  for (const result of results) health.set(...result);
}

const report = [];
let synchronizedEvents = 0;
let curatedEvents = 0;

for (const dataset of datasets) {
  const conflict = dataset.events.at(-1)?.title?.replace(/^Conflict Summary:\s*/, "") ?? basename(dataset.file);
  let changed = false;

  for (const event of dataset.events) {
    const slides = event.slides ?? [];
    if (!slides.length) continue;
    const key = `${dataset.file}/${event.id}`;
    const first = slides[0];
    const original = first.img;
    const selected = curated[key] ?? first.img ?? slides.find((slide) => slide.img)?.img;
    const selectedHealthy = selected ? (health.get(selected) ?? true) : false;
    const originalHealthy = original ? (health.get(original) ?? true) : false;
    const score = relevanceScore(selected, event, conflict);

    if (curated[key] && selected !== original) curatedEvents += 1;
    if (selected) {
      const caption = first.cap;
      let eventSynchronized = false;
      for (const slide of slides) {
        if (slide.img !== selected) {
          slide.img = selected;
          changed = true;
          eventSynchronized = true;
        }
        if (caption && slide.cap !== caption) {
          slide.cap = caption;
          changed = true;
        }
      }
      if (eventSynchronized) synchronizedEvents += 1;
    }

    if (!selectedHealthy || score < 0 || !originalHealthy) {
      report.push({
        file: dataset.file,
        event: event.id,
        title: event.title,
        image: selected,
        healthy: selectedHealthy,
        relevanceScore: score,
      });
    }
  }

  if (shouldWrite && changed) {
    await writeFile(dataset.path, `${JSON.stringify(dataset.events, null, 2)}\n`);
  }
}

console.log(JSON.stringify({
  files: datasets.length,
  uniqueUrlsChecked: urls.length,
  brokenUrls: [...health.values()].filter((ok) => !ok).length,
  synchronizedEvents,
  curatedEvents,
  flaggedEvents: report.length,
  report,
}, null, 2));
