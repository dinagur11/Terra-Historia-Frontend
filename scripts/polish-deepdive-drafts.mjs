import { readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const BACKEND_ROOT = "C:\\Users\\alons\\Terra-Historia-Backend";
const DRAFT_DIR = join(BACKEND_ROOT, "deepdives-drafts");
const INDEX_PATH = join(BACKEND_ROOT, "deepdives-index.json");

const EXCLUDED_FILES = new Set([
  "candidate-wars-1914-2026.json",
  "wwi-events.json",
  "wwii-events.json",
]);

function draftId(file) {
  return basename(file).replace(/\.generated\.json$|\.json$/, "");
}

function polishText(value) {
  if (typeof value !== "string") return value;

  return value
    .replace(
      /Draft note for ([^.]+)\. Review and expand this slide before uploading\.\s*/gi,
      ""
    )
    .replace(
      /(?:Why It Matters|Why This Matters|Why It Mattered|Why This Mattered|Why This Moment Matters):\s*/gi,
      ""
    )
    .replace(
      /^(?:Why It Matters|Why This Matters|Why It Mattered|Why This Mattered|Why This Moment Matters)$/i,
      "The Wider Impact"
    )
    .replace(
      /(^|\n\n)[^.\n]+ mattered because it forced [^.]+\.\s*/gim,
      "$1"
    )
    .replace(
      /(^|\n\n)[^.\n]+ should be understood through the decisions it forced on [^.]+\.\s*/gim,
      "$1"
    )
    .replace(
      /In the wider arc of the war, this event changed calculations about security, legitimacy, escalation, or withdrawal\.\s*/gi,
      ""
    )
    .replace(/\bIt mattered because /gi, "")
    .replace(/^The importance of this event:$/i, "Historical significance")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();
}

function polishSlide(slide) {
  slide.title = polishText(slide.title);
  slide.body = polishText(slide.body);

  for (const stat of slide.stats || []) {
    stat.val = polishText(stat.val);
    stat.lbl = polishText(stat.lbl);
  }
}

function synchronizeEventImages(event, fallbackImage) {
  const slides = Array.isArray(event.slides) ? event.slides : [];
  if (slides.length < 2) return { changed: false, fallbackUsed: false };

  const source = slides.find((slide) => slide.img);
  const image = source?.img || fallbackImage;
  if (!image) return { changed: false, fallbackUsed: false };

  const caption = source?.cap?.trim() || undefined;
  let changed = false;

  for (const slide of slides) {
    if (slide.img !== image) {
      slide.img = image;
      changed = true;
    }

    if (caption) {
      if (slide.cap !== caption) {
        slide.cap = caption;
        changed = true;
      }
    } else if (slide.cap) {
      delete slide.cap;
      changed = true;
    }
  }

  return { changed, fallbackUsed: !source };
}

const index = JSON.parse((await readFile(INDEX_PATH, "utf8")).replace(/^\uFEFF/, ""));
const overviewImages = new Map(index.map((item) => [item.id, item.image]));
const files = (await readdir(DRAFT_DIR))
  .filter((file) => file.endsWith(".json") && !EXCLUDED_FILES.has(file))
  .sort();

const report = [];

for (const file of files) {
  const path = join(DRAFT_DIR, file);
  const original = (await readFile(path, "utf8")).replace(/^\uFEFF/, "");
  const events = JSON.parse(original);
  if (!Array.isArray(events)) continue;

  let imageEventsChanged = 0;
  let fallbackImagesUsed = 0;
  let textSlidesChanged = 0;

  for (const event of events) {
    const imageResult = synchronizeEventImages(
      event,
      overviewImages.get(draftId(file))
    );
    if (imageResult.changed) imageEventsChanged += 1;
    if (imageResult.fallbackUsed) fallbackImagesUsed += 1;

    for (const slide of event.slides || []) {
      const before = JSON.stringify(slide);
      polishSlide(slide);
      if (JSON.stringify(slide) !== before) textSlidesChanged += 1;
    }
  }

  const updated = `${JSON.stringify(events, null, 2)}\n`;
  if (updated !== original) await writeFile(path, updated, "utf8");

  report.push({
    file,
    imageEventsChanged,
    fallbackImagesUsed,
    textSlidesChanged,
  });
}

console.log(JSON.stringify(report, null, 2));
