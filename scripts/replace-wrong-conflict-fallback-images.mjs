import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const backendRoot = process.argv[2] ?? "C:\\Users\\alons\\Terra-Historia-Backend";
const shouldWrite = process.argv.includes("--write");
const draftsRoot = join(backendRoot, "deepdives-drafts");
const rejected = /(coat.of.arms|emblem|flag|logo|memorial|poster)/i;

const files = (await readdir(draftsRoot))
  .filter((file) => file.endsWith(".json") && file !== "candidate-wars-1914-2026.json")
  .sort();
const datasets = [];
const conflicts = new Set();

for (const file of files) {
  const path = join(draftsRoot, file);
  const events = JSON.parse(await readFile(path, "utf8"));
  if (!Array.isArray(events)) continue;
  const conflict = events.at(-1)?.title?.replace(/^Conflict Summary:\s*/, "") ?? events[0]?.title;
  const frequency = new Map();
  for (const event of events) {
    const image = event.slides?.[0]?.img;
    if (image) frequency.set(image, (frequency.get(image) ?? 0) + 1);
  }
  datasets.push({ file, path, events, conflict, frequency });
  conflicts.add(conflict);
}

const leadImages = new Map();
const titles = [...conflicts];
for (let index = 0; index < titles.length; index += 40) {
  const batch = titles.slice(index, index + 40);
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    redirects: "1",
    prop: "pageimages|pageprops",
    piprop: "thumbnail",
    pithumbsize: "1600",
    titles: batch.join("|"),
    origin: "*",
  });
  const response = await fetch(`https://en.wikipedia.org/w/api.php?${params}`, {
    headers: { "User-Agent": "Terra-Historia conflict fallback images/1.0" },
  });
  if (!response.ok) continue;
  const data = await response.json();
  const aliases = new Map([
    ...(data.query?.normalized ?? []).map((item) => [item.from, item.to]),
    ...(data.query?.redirects ?? []).map((item) => [item.from, item.to]),
  ]);
  const pages = new Map(Object.values(data.query?.pages ?? {}).map((page) => [page.title, page]));
  for (const title of batch) {
    let resolved = aliases.get(title) ?? title;
    resolved = aliases.get(resolved) ?? resolved;
    const page = pages.get(resolved);
    const image = page?.thumbnail?.source;
    if (!image || page.pageprops?.disambiguation !== undefined || rejected.test(decodeURIComponent(image))) continue;
    leadImages.set(title, image.replace(/^http:/, "https:"));
  }
}

let replacedEvents = 0;
const report = [];
for (const dataset of datasets) {
  const lead = leadImages.get(dataset.conflict);
  if (!lead) continue;
  let changed = false;
  for (const event of dataset.events) {
    const slides = event.slides ?? [];
    if (!slides.length) continue;
    const current = slides[0].img;
    if ((dataset.frequency.get(current) ?? 0) < 4 || current === lead) continue;
    for (const slide of slides) slide.img = lead;
    replacedEvents += 1;
    changed = true;
  }
  if (changed) report.push({ file: dataset.file, conflict: dataset.conflict, image: lead });
  if (shouldWrite && changed) {
    await writeFile(dataset.path, `${JSON.stringify(dataset.events, null, 2)}\n`);
  }
}

console.log(JSON.stringify({
  conflictLeadImagesFound: leadImages.size,
  filesUpdated: report.length,
  replacedEvents,
  report,
}, null, 2));
