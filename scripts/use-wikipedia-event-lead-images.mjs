import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const backendRoot = process.argv[2] ?? "C:\\Users\\alons\\Terra-Historia-Backend";
const shouldWrite = process.argv.includes("--write");
const draftsRoot = join(backendRoot, "deepdives-drafts");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function normalizeCommonsUrl(url) {
  if (!url) return url;
  const parsed = new URL(url.replace(/^http:/, "https:"));
  if (!parsed.hostname.endsWith("upload.wikimedia.org")) return parsed.toString();
  const parts = parsed.pathname.split("/").filter(Boolean);
  const thumb = parts.indexOf("thumb");
  const file = thumb >= 0 ? parts[thumb + 3] : parts.at(-1);
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(decodeURIComponent(file))}`;
}

function usableLeadImage(url) {
  const name = decodeURIComponent(url).toLowerCase();
  return /\.(jpe?g|png|gif|webp|svg)$/i.test(name) &&
    !/(coat.of.arms|emblem|flag|logo|memorial)/i.test(name);
}

const files = (await readdir(draftsRoot))
  .filter((file) => file.endsWith(".json") && file !== "candidate-wars-1914-2026.json")
  .sort();
const datasets = [];
const targets = [];

for (const file of files) {
  const path = join(draftsRoot, file);
  const events = JSON.parse(await readFile(path, "utf8"));
  if (!Array.isArray(events)) continue;
  const frequency = new Map();
  for (const event of events) {
    const image = event.slides?.[0]?.img;
    if (image) frequency.set(image, (frequency.get(image) ?? 0) + 1);
  }
  datasets.push({ file, path, events });
  for (const event of events) {
    if (/^(origins|conflict-summary|international|outcome)/.test(event.id)) continue;
    const image = event.slides?.[0]?.img;
    if ((frequency.get(image) ?? 0) >= 4) targets.push({ file, event });
  }
}

const leadImages = new Map();
for (let index = 0; index < targets.length; index += 40) {
  const batch = targets.slice(index, index + 40);
  const titles = [...new Set(batch.map(({ event }) => event.title))];
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    redirects: "1",
    prop: "pageimages|pageprops",
    piprop: "original",
    titles: titles.join("|"),
    origin: "*",
  });
  await sleep(300);
  const response = await fetch(`https://en.wikipedia.org/w/api.php?${params}`, {
    headers: { "User-Agent": "Terra-Historia exact event lead image/1.0" },
  });
  if (!response.ok) continue;
  const data = await response.json();
  const normalized = new Map([
    ...(data.query?.normalized ?? []).map((item) => [item.from, item.to]),
    ...(data.query?.redirects ?? []).map((item) => [item.from, item.to]),
  ]);
  const pages = new Map(Object.values(data.query?.pages ?? {}).map((page) => [page.title, page]));
  for (const title of titles) {
    let resolved = normalized.get(title) ?? title;
    resolved = normalized.get(resolved) ?? resolved;
    const page = pages.get(resolved);
    if (!page?.original?.source || page.pageprops?.disambiguation !== undefined) continue;
    const image = normalizeCommonsUrl(page.original.source);
    if (usableLeadImage(image)) leadImages.set(title, image);
  }
}

let replacedEvents = 0;
const replacements = [];
for (const dataset of datasets) {
  let changed = false;
  for (const event of dataset.events) {
    const image = leadImages.get(event.title);
    if (!image || !event.slides?.length || event.slides[0].img === image) continue;
    for (const slide of event.slides) slide.img = image;
    replacements.push({ file: dataset.file, event: event.id, title: event.title, image });
    replacedEvents += 1;
    changed = true;
  }
  if (shouldWrite && changed) {
    await writeFile(dataset.path, `${JSON.stringify(dataset.events, null, 2)}\n`);
  }
}

console.log(JSON.stringify({
  targetedEvents: targets.length,
  exactLeadImagesFound: leadImages.size,
  replacedEvents,
  replacements,
}, null, 2));
