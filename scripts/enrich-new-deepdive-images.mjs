import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";

const backendRoot = process.argv[2];
const shouldWrite = process.argv.includes("--write");
const curatedOnly = process.argv.includes("--curated-only");
const quickMode = process.argv.includes("--quick");
const excludeCurated = process.argv.includes("--exclude-curated");
const requestedFiles = process.argv
  .find((argument) => argument.startsWith("--files="))
  ?.slice("--files=".length)
  .split(",");

if (!backendRoot) {
  throw new Error("Usage: node scripts/enrich-new-deepdive-images.mjs <backend-root> [--write]");
}

const stopWords = new Set([
  "and", "background", "battle", "conflict", "from", "historical", "in",
  "of", "operation", "part", "summary", "the", "to", "war",
]);
const rejectedTerms = [
  "coat of arms", "demonstration", "emblem", "flag", "logo", "locator",
  "medal", "memorial", "protest", "ribbon", "roundel", "symbol", "user",
  "wikidata",
];
const searchCache = new Map();
const curatedImages = {
  "israel-hamas-war.generated.json": {
    "october-7-attacks": "https://upload.wikimedia.org/wikipedia/commons/1/19/Gaza_envelope_after_coordinated_surprise_offensive_on_Israel%2C_October_2023_%28KBG_GPO05%29.jpg",
    "ground-invasion": "https://upload.wikimedia.org/wikipedia/commons/0/00/Forced_Displacement_of_Gaza_Strip_Residents_During_the_Gaza-Israel_War_23-25.jpg",
    "hostage-rescue": "https://upload.wikimedia.org/wikipedia/commons/7/74/Welcome_home_Andrey_Kozlov.jpg",
    "conflict-summary": "https://upload.wikimedia.org/wikipedia/commons/7/73/Disaster_Victim_Identification_after_2023_Hamas_attack_on_Israel_%28ZAKA1051%29..jpg",
  },
  "2026-iran-war.generated.json": {
    "opening-strikes": "https://upload.wikimedia.org/wikipedia/commons/9/94/Operation-Roaring-Lion-0004.jpg",
    "iranian-regional-retaliation": "https://upload.wikimedia.org/wikipedia/commons/0/04/2026_Iran_war_collage.jpg",
    "hormuz-closure": "https://upload.wikimedia.org/wikipedia/commons/1/16/BP_petrol_station_in_Semaphore%2C_South_Australia_during_the_2026_Iran_war_fuel_crisis_%28DSCF4256%29.jpg",
    "iranian-leadership-and-military-struck": "https://upload.wikimedia.org/wikipedia/commons/4/4f/2026_Iran_war_collage_2.jpg",
  },
  "2026-lebanon-war.generated.json": {
    "hezbollah-renews-fire": "https://upload.wikimedia.org/wikipedia/commons/a/a5/Hezbollah_Rocket_Attack_on_Tiberias%2C_Israel_IMG_5960_%28194912554%29.jpg",
    "ground-operations": "https://upload.wikimedia.org/wikipedia/commons/8/86/Invasion_of_Lebanon_2026.png",
    "operation-eternal-darkness": "https://upload.wikimedia.org/wikipedia/commons/b/b7/Destroyed_Qasmiyeh_Bridge%2C_Lebanon%2C_Mar_2026_%281%29.png",
    "bint-jbeil-fighting": "https://upload.wikimedia.org/wikipedia/commons/9/9b/Destroyed_Qasmiyeh_Bridge%2C_Lebanon%2C_Mar_2026_%283%29.png",
    "conflict-summary": "https://upload.wikimedia.org/wikipedia/commons/f/fc/Destroyed_Qasmiyeh_Bridge%2C_Lebanon%2C_Mar_2026_%282%29.png",
  },
  "2021-israel-palestine-crisis.generated.json": {
    "ceasefire": "https://commons.wikimedia.org/wiki/Special:FilePath/IDF_Iron_Dome_2021.jpg",
  },
  "iraq-war.generated.json": {
    "fall-of-baghdad": "https://upload.wikimedia.org/wikipedia/commons/b/bb/Flickr_-_Government_Press_Office_%28GPO%29_-_Patriot_missiles_being_launched_to_intercept_an_Iraqi_Scud_missile.jpg",
  },
  "twelve-day-war.generated.json": {
    "operation-rising-lion": "https://upload.wikimedia.org/wikipedia/commons/a/a7/132302_iran_war_-_accommodation_complex_PikiWiki_Israel.jpg",
    "iranian-missile-retaliation": "https://upload.wikimedia.org/wikipedia/commons/7/75/132305_iran_war_-_accommodation_complex_PikiWiki_Israel.jpg",
    "air-superiority": "https://upload.wikimedia.org/wikipedia/commons/0/0a/132311_iran_war_-_accommodation_complex_PikiWiki_Israel.jpg",
    "us-nuclear-strikes": "https://upload.wikimedia.org/wikipedia/commons/0/0e/132312_iran_war_-_accommodation_complex_PikiWiki_Israel.jpg",
    "conflict-summary": "https://upload.wikimedia.org/wikipedia/commons/f/f0/132313_iran_war_-_accommodation_complex_PikiWiki_Israel.jpg",
  },
};

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function tokens(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function scoreCandidate(candidate, queryTokens) {
  const name = decodeURIComponent(candidate.title.replace(/^File:/, "")).toLowerCase();
  if (rejectedTerms.some((term) => name.includes(term))) return -100;
  if (!/\.(jpe?g|png|webp)$/i.test(name)) return -100;

  let score = name.endsWith(".jpg") || name.endsWith(".jpeg") ? 3 : 0;
  for (const token of queryTokens) {
    if (name.includes(token)) score += 3;
  }
  if (/\b(map|diagram|chart)\b/i.test(name)) score -= 2;
  return score;
}

async function searchCommons(query, used) {
  if (searchCache.has(query)) {
    return searchCache.get(query).find((url) => !used.has(url));
  }

  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrnamespace: "6",
    gsrlimit: "20",
    gsrsearch: query,
    prop: "imageinfo",
    iiprop: "url|mime",
    origin: "*",
  });
  let response;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    await sleep(250 * (attempt + 1));
    response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
      headers: { "User-Agent": "Terra-Historia image enrichment/1.0" },
    });
    if (response.ok) break;
    if (response.status !== 429) throw new Error(`Commons search failed: ${response.status}`);
    await sleep(1500 * (attempt + 1));
  }
  if (!response?.ok) return undefined;

  const data = await response.json();
  const queryTokens = tokens(query);
  const candidates = Object.values(data.query?.pages ?? {})
    .filter((page) => page.imageinfo?.[0]?.url && !used.has(page.imageinfo[0].url))
    .map((page) => ({ ...page, score: scoreCandidate(page, queryTokens) }))
    .filter((page) => page.score >= 6)
    .sort((a, b) => b.score - a.score);

  const urls = candidates.map((candidate) => candidate.imageinfo[0].url);
  searchCache.set(query, urls);
  return urls.find((url) => !used.has(url));
}

const status = execFileSync("git", ["status", "--porcelain"], {
  cwd: backendRoot,
  encoding: "utf8",
});
const files = status
  .split(/\r?\n/)
  .filter((line) => line.startsWith("?? deepdives-drafts/") && line.endsWith(".json"))
  .map((line) => line.slice(3))
  .filter((file) => !requestedFiles || requestedFiles.includes(path.basename(file)))
  .filter((file) => !excludeCurated || !curatedImages[path.basename(file)]);

let replacements = 0;
for (const relativeFile of files) {
  const file = path.join(backendRoot, relativeFile);
  const data = JSON.parse(await fs.readFile(file, "utf8"));
  const conflictTitle = data.at(-1)?.title?.replace(/^Conflict Summary:\s*/, "") ?? "";
  const used = new Set();
  let fileReplacements = 0;

  for (const event of data) {
    for (const slide of event.slides ?? []) {
      const original = slide.img;
      const eventTitle = slide.title ?? event.title;
      const curated = curatedImages[path.basename(file)]?.[event.id];
      if (curated) {
        slide.img = curated;
        used.add(curated);
        fileReplacements += 1;
        replacements += 1;
        console.log(`${path.basename(file)} | ${eventTitle} | ${curated}`);
        continue;
      }
      if (curatedOnly) {
        used.add(original);
        continue;
      }
      const queries = [
        `"${eventTitle}" ${conflictTitle}`,
        `${eventTitle} ${conflictTitle}`,
        `${conflictTitle} ${event.year ?? ""}`,
      ];
      if (quickMode) queries.splice(1);

      let replacement;
      for (const query of queries) {
        replacement = await searchCommons(query, used);
        if (replacement) break;
      }
      if (!replacement || replacement === original) {
        used.add(original);
        continue;
      }

      slide.img = replacement;
      used.add(replacement);
      fileReplacements += 1;
      replacements += 1;
      console.log(`${path.basename(file)} | ${eventTitle} | ${replacement}`);
    }
  }

  if (shouldWrite && fileReplacements > 0) {
    await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
  }
}

console.error(`${shouldWrite ? "Updated" : "Would update"} ${replacements} slides across ${files.length} new deep dives.`);
