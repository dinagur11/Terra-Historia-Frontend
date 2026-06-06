import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const BACKEND_ROOT = "C:\\Users\\alons\\Terra-Historia-Backend";
const DRAFT_DIR = join(BACKEND_ROOT, "deepdives-drafts");
const INDEX_PATH = join(BACKEND_ROOT, "deepdives-index.json");

const EXCLUDED_IDS = new Set([
  "wwi-events",
  "wwii-events",
  "russian-civil-war",
]);

const PREFERRED_FILES = {
  "spanish-civil-war": "spanish-civil-war.json",
  "winter-war": "winter-war.json",
  "continuation-war": "continuation-war.json",
};

const MAX_SINGLE_BODY = 650;
const MAX_MERGED_BODY = 1100;

function getDraftFile(id) {
  return PREFERRED_FILES[id] || `${id}.generated.json`;
}

function bodyLength(slide) {
  return slide.body?.trim().length || 0;
}

function isConnectionSlide(slide) {
  return slide.stats?.some(
    (stat) => stat.lbl === "Previous conflict in this path"
  );
}

function isSpecialSlide(slide) {
  return isConnectionSlide(slide) || slide.title?.startsWith("War Summary:");
}

function canMerge(slide) {
  const length = bodyLength(slide);
  return !isSpecialSlide(slide) && length > 0 && length <= MAX_SINGLE_BODY;
}

function mergeStats(slides) {
  const seen = new Set();
  const stats = [];

  for (const stat of slides.flatMap((slide) => slide.stats || [])) {
    const key = `${stat.val}|${stat.lbl}`;
    if (seen.has(key)) continue;
    seen.add(key);
    stats.push(stat);
  }

  return stats.slice(0, 6);
}

function mergeSlides(slides) {
  const [first, ...rest] = slides;
  const imageSlide = slides.find((slide) => slide.img);
  const merged = {
    ...first,
    body: [
      first.body.trim(),
      ...rest.map((slide) => `${slide.title}: ${slide.body.trim()}`),
    ].join("\n\n"),
  };

  if (imageSlide?.img) {
    merged.img = imageSlide.img;
    merged.cap = imageSlide.cap || first.cap;
  }

  const stats = mergeStats(slides);
  if (stats.length) merged.stats = stats;
  else delete merged.stats;

  return merged;
}

function consolidateSlides(slides) {
  const result = [];
  let run = [];

  function flush() {
    if (!run.length) return;
    result.push(run.length === 1 ? run[0] : mergeSlides(run));
    run = [];
  }

  for (const slide of slides) {
    if (!canMerge(slide)) {
      flush();
      result.push(slide);
      continue;
    }

    const candidate = [...run, slide];
    const candidateLength =
      candidate.reduce((sum, item) => sum + bodyLength(item), 0) +
      candidate.slice(1).reduce((sum, item) => sum + item.title.length + 4, 0);

    if (run.length && candidateLength > MAX_MERGED_BODY) flush();
    run.push(slide);
  }

  flush();
  return result;
}

const index = JSON.parse(await readFile(INDEX_PATH, "utf8"));
const report = [];

for (const item of index) {
  if (EXCLUDED_IDS.has(item.id)) continue;

  const file = getDraftFile(item.id);
  const path = join(DRAFT_DIR, file);
  const events = JSON.parse((await readFile(path, "utf8")).replace(/^\uFEFF/, ""));
  let before = 0;
  let after = 0;
  let changedEvents = 0;

  for (const event of events) {
    const originalSlides = Array.isArray(event.slides) ? event.slides : [];
    const nextSlides = consolidateSlides(originalSlides);
    before += originalSlides.length;
    after += nextSlides.length;
    if (nextSlides.length !== originalSlides.length) changedEvents += 1;
    event.slides = nextSlides;
  }

  await writeFile(path, `${JSON.stringify(events, null, 2)}\n`, "utf8");
  report.push({
    id: item.id,
    file,
    changedEvents,
    before,
    after,
    removed: before - after,
  });
}

console.log(JSON.stringify(report, null, 2));
