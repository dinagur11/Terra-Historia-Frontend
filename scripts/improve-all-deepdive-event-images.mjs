import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const backendRoot = process.argv[2] ?? "C:\\Users\\alons\\Terra-Historia-Backend";
const shouldWrite = process.argv.includes("--write");
const draftsRoot = join(backendRoot, "deepdives-drafts");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const rejected = [
  "coat of arms", "demonstration", "emblem", "flag", "logo", "memorial",
  "protest", "ribbon", "roundel", "symbol", "wikidata",
];
const generic = new Set([
  "and", "background", "battle", "civil", "conflict", "from", "historical",
  "international", "legacy", "of", "operation", "origins", "outcome", "road",
  "summary", "the", "to", "war",
]);
const curated = {
  "russian-civil-war.json/february-revolution": "February_Revolution_in_Petrograd.jpg",
  "russian-civil-war.json/october-revolution": "Storming_the_Winter_Palace.jpg",
  "russian-civil-war.json/constituent-assembly": "Tauride_Palace_1917.jpg",
  "russian-civil-war.json/brest-litovsk": "Brest-Litovsk_Treaty_map.svg",
  "russian-civil-war.json/czechoslovak-legion": "Czechoslovak_Legion_in_Russia.jpg",
  "russian-civil-war.json/red-army-cheka": "Trotsky_on_armoured_train.jpg",
  "russian-civil-war.json/kolchak-siberia": "Alexander_Kolchak_1919.jpg",
  "russian-civil-war.json/denikin-south": "Anton_Denikin_1918.jpg",
  "russian-civil-war.json/foreign-intervention": "American_troops_Vladivostok_1918.jpg",
  "russian-civil-war.json/polish-soviet-war": "Polish-Soviet_War_1920_polish_defences_near_Milosna.jpg",
  "russian-civil-war.json/wrangel-crimea": "Pyotr_Wrangel_1920.jpg",
  "russian-civil-war.json/kronstadt-nep": "Kronstadt_sailors_1917.jpg",
  "wwii-events.json/poland": "Mapa_2_paktu_Ribbentrop-Mo%C5%82otow.gif",
};

function specialPath(file) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(decodeURIComponent(file)).replaceAll("%2F", "/")}`;
}

function normalizeCommonsUrl(url) {
  if (!url) return url;
  try {
    const parsed = new URL(url.replace(/^http:/, "https:"));
    if (parsed.hostname === "commons.wikimedia.org" && parsed.pathname.includes("/Special:FilePath/")) {
      const file = parsed.pathname.split("/Special:FilePath/")[1];
      return specialPath(file);
    }
    if (parsed.hostname.endsWith("upload.wikimedia.org")) {
      const parts = parsed.pathname.split("/").filter(Boolean);
      const thumb = parts.indexOf("thumb");
      const file = thumb >= 0 ? parts[thumb + 3] : parts.at(-1);
      return specialPath(file);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

function words(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !generic.has(word));
}

function candidateScore(title, eventWords, year) {
  const name = title.replace(/^File:/, "").toLowerCase();
  if (rejected.some((term) => name.includes(term))) return -100;
  if (!/\.(jpe?g|png|gif|webp|svg)$/i.test(name)) return -100;
  let score = 0;
  for (const word of eventWords) if (name.includes(word)) score += 3;
  if (year && name.includes(String(year))) score += 3;
  return score;
}

async function exactCommonsMatch(event, conflict) {
  const title = event.title
    .replace(/^Conflict Summary:\s*/, "")
    .replace(/^From .+ to /, "");
  const eventWords = words(title);
  if (!eventWords.length) return undefined;

  const searches = [
    `intitle:"${title}"`,
    `"${title}" ${conflict} ${event.year ?? ""}`,
  ];
  for (const search of searches) {
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      generator: "search",
      gsrnamespace: "6",
      gsrlimit: "12",
      gsrsearch: search,
      prop: "imageinfo",
      iiprop: "url",
      origin: "*",
    });

    for (let attempt = 0; attempt < 4; attempt += 1) {
      await sleep(350 + attempt * 800);
      const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
        headers: { "User-Agent": "Terra-Historia image relevance improvement/1.0" },
      });
      if (response.status === 429) continue;
      if (!response.ok) break;
      const data = await response.json();
      const candidates = Object.values(data.query?.pages ?? {})
        .map((page) => ({ title: page.title, score: candidateScore(page.title, eventWords, event.year) }))
        .filter((candidate) => candidate.score >= 3)
        .sort((a, b) => b.score - a.score);
      if (candidates[0]) return candidates[0].title.replace(/^File:/, "");
      break;
    }
  }
  return undefined;
}

const files = (await readdir(draftsRoot))
  .filter((file) => file.endsWith(".json") && file !== "candidate-wars-1914-2026.json")
  .sort();

let normalizedSlides = 0;
let synchronizedSlides = 0;
let replacedEvents = 0;
const replacements = [];

for (const file of files) {
  const path = join(draftsRoot, file);
  const events = JSON.parse(await readFile(path, "utf8"));
  if (!Array.isArray(events)) continue;
  const conflict = events.at(-1)?.title?.replace(/^Conflict Summary:\s*/, "") ?? file;
  const frequencies = new Map();

  for (const event of events) {
    const image = normalizeCommonsUrl(event.slides?.[0]?.img);
    frequencies.set(image, (frequencies.get(image) ?? 0) + 1);
  }

  for (const event of events) {
    const slides = event.slides ?? [];
    if (!slides.length) continue;
    const key = `${file}/${event.id}`;
    const original = normalizeCommonsUrl(slides[0].img ?? slides.find((slide) => slide.img)?.img);
    let selected = curated[key] ? specialPath(curated[key]) : original;
    const genericFallback = (frequencies.get(original) ?? 0) >= 4;

    const genericSection = /^(origins|conflict-summary|international|outcome)/.test(event.id);
    if (!curated[key] && genericFallback && !genericSection) {
      const match = await exactCommonsMatch(event, conflict);
      if (match) {
        selected = specialPath(match);
        if (selected !== original) {
          replacedEvents += 1;
          replacements.push({ file, event: event.id, title: event.title, image: selected });
        }
      }
    }

    const caption = slides[0].cap;
    for (const slide of slides) {
      const normalized = normalizeCommonsUrl(slide.img);
      if (normalized !== slide.img) normalizedSlides += 1;
      if (normalized !== selected) synchronizedSlides += 1;
      slide.img = selected;
      if (caption) slide.cap = caption;
    }
  }

  if (shouldWrite) await writeFile(path, `${JSON.stringify(events, null, 2)}\n`);
}

console.log(JSON.stringify({
  filesProcessed: files.length,
  normalizedSlides,
  synchronizedSlides,
  replacedEvents,
  replacements,
}, null, 2));
