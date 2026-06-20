import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const backendRoot = process.argv[2] ?? "C:\\Users\\alons\\Terra-Historia-Backend";
const shouldWrite = process.argv.includes("--write");
const draftsRoot = join(backendRoot, "deepdives-drafts");

function key(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/^conflict summary:\s*/, "")
    .replace(/^from .+ to /, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function imageName(url) {
  try {
    return decodeURIComponent(new URL(url).pathname.split("/").at(-1)).toLowerCase();
  } catch {
    return "";
  }
}

function titleScore(event, image) {
  const name = imageName(image);
  return key(event.title)
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .reduce((score, word) => score + (name.includes(word) ? 1 : 0), 0);
}

const files = (await readdir(draftsRoot))
  .filter((file) => file.endsWith(".json") && file !== "candidate-wars-1914-2026.json")
  .sort();
const datasets = [];
const candidates = new Map();

for (const file of files) {
  const path = join(draftsRoot, file);
  const events = JSON.parse(await readFile(path, "utf8"));
  if (!Array.isArray(events)) continue;
  const frequency = new Map();
  for (const event of events) {
    const image = event.slides?.[0]?.img;
    if (image) frequency.set(image, (frequency.get(image) ?? 0) + 1);
  }
  datasets.push({ file, path, events, frequency });

  for (const event of events) {
    const image = event.slides?.[0]?.img;
    if (!image) continue;
    const candidate = {
      image,
      file,
      reuse: frequency.get(image) ?? 0,
      score: titleScore(event, image),
    };
    const eventKey = key(event.title);
    const current = candidates.get(eventKey);
    if (!current ||
        candidate.score > current.score ||
        (candidate.score === current.score && candidate.reuse < current.reuse)) {
      candidates.set(eventKey, candidate);
    }
  }
}

let replacedEvents = 0;
const replacements = [];

for (const dataset of datasets) {
  let changed = false;
  for (const event of dataset.events) {
    if (/^(origins|conflict-summary|international|outcome)/.test(event.id)) continue;
    const slides = event.slides ?? [];
    if (!slides.length) continue;
    const current = slides[0].img;
    const currentReuse = dataset.frequency.get(current) ?? 0;
    if (currentReuse < 4) continue;

    const candidate = candidates.get(key(event.title));
    if (!candidate || candidate.image === current || candidate.reuse >= currentReuse) continue;
    if (candidate.score === 0 && candidate.reuse > 1) continue;

    for (const slide of slides) slide.img = candidate.image;
    replacements.push({
      file: dataset.file,
      event: event.id,
      title: event.title,
      sourceFile: candidate.file,
      image: candidate.image,
    });
    replacedEvents += 1;
    changed = true;
  }
  if (shouldWrite && changed) {
    await writeFile(dataset.path, `${JSON.stringify(dataset.events, null, 2)}\n`);
  }
}

console.log(JSON.stringify({ filesProcessed: datasets.length, replacedEvents, replacements }, null, 2));
