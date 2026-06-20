import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const backendRoot = process.argv[2] ?? "C:\\Users\\alons\\Terra-Historia-Backend";
const draftsRoot = join(backendRoot, "deepdives-drafts");
const eventsRoot = join(backendRoot, "events");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const russianTitles = {
  "february-revolution": "February Revolution",
  "october-revolution": "October Revolution",
  "constituent-assembly": "Russian Constituent Assembly",
  "brest-litovsk": "Treaty of Brest-Litovsk",
  "czechoslovak-legion": "Czechoslovak Legion",
  "red-army-cheka": "Russian Civil War",
  "kolchak-siberia": "Alexander Kolchak",
  "denikin-south": "Anton Denikin",
  "foreign-intervention": "Allied intervention in the Russian Civil War",
  "polish-soviet-war": "Polish-Soviet War",
  "wrangel-crimea": "Pyotr Wrangel",
  "kronstadt-nep": "Kronstadt rebellion",
};
const fedayeenTitles = {
  "origins-and-background": "1948 Arab-Israeli War",
  "border-infiltration": "Palestinian fedayeen insurgency",
  "unit-101": "Unit 101",
  "qibya": "Qibya massacre",
  "gaza-raid": "Gaza raid",
  "egypt-sponsored-raids": "Palestinian fedayeen insurgency",
  "sinai-campaign": "Suez Crisis",
  "conflict-summary": "Palestinian fedayeen insurgency",
};
const titleOverrides = {
  "bolshevik-revolution-1915-1": "Constantinople Agreement",
  "sinking-of-the-rms-lusitania-1915-4": "Sinking of the RMS Lusitania",
  "wwi-1915-10": "Battle of Loos",
  "mexican-revolution-1916-1": "Battle of Columbus (1916)",
  "republican-party-1916-8": "Jeannette Rankin",
  "society-of-motion-picture-and-television-engineers-1916-9": "Society of Motion Picture and Television Engineers",
};

async function wikiPages(titles, props, extra = {}) {
  const result = new Map();
  for (let index = 0; index < titles.length; index += 40) {
    const batch = titles.slice(index, index + 40);
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      redirects: "1",
      prop: props,
      titles: batch.join("|"),
      origin: "*",
      ...extra,
    });
    await sleep(200);
    const response = await fetch(`https://en.wikipedia.org/w/api.php?${params}`, {
      headers: { "User-Agent": "Terra-Historia coordinate and image repair/1.0" },
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
      result.set(title, pages.get(resolved));
    }
  }
  return result;
}

async function repairDiveImages(file, titleMap) {
  const path = join(draftsRoot, file);
  const data = JSON.parse(await readFile(path, "utf8"));
  const pages = await wikiPages(Object.values(titleMap), "pageimages", {
    piprop: "thumbnail",
    pithumbsize: "1600",
  });
  let changed = 0;
  for (const event of data) {
    const page = pages.get(titleMap[event.id]);
    const image = page?.thumbnail?.source?.replace(/^http:/, "https:");
    if (!image || !/\.(jpe?g|png|gif|webp|svg)(?:\/|$)/i.test(image.split("?")[0])) continue;
    for (const slide of event.slides ?? []) slide.img = image;
    changed += 1;
  }
  if (file === "russian-civil-war.json") {
    const february = data.find((event) => event.id === "february-revolution");
    if (february) february.regions = [];
  }
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`);
  return changed;
}

const russianChanged = await repairDiveImages("russian-civil-war.json", russianTitles);
const fedayeenChanged = await repairDiveImages("palestinian-fedayeen-insurgency.generated.json", fedayeenTitles);

const eventFiles = (await readdir(eventsRoot)).filter((file) => /^\d{4}\.json$/.test(file)).sort();
const datasets = [];
const titles = [];
for (const file of eventFiles) {
  const path = join(eventsRoot, file);
  const events = JSON.parse(await readFile(path, "utf8"));
  datasets.push({ file, path, events });
  for (const event of events) titles.push(titleOverrides[event.id] ?? event.name);
}

const pages = await wikiPages([...new Set(titles)], "coordinates");
let coordinatesUpdated = 0;
let zeroBefore = 0;
let zeroAfter = 0;
const unresolved = [];

for (const dataset of datasets) {
  for (const event of dataset.events) {
    if (event.coordinates?.lat === 0 && event.coordinates?.lng === 0) zeroBefore += 1;
    const title = titleOverrides[event.id] ?? event.name;
    const coordinate = pages.get(title)?.coordinates?.[0];
    if (coordinate && Number.isFinite(coordinate.lat) && Number.isFinite(coordinate.lon)) {
      const oldLat = event.coordinates?.lat;
      const oldLng = event.coordinates?.lng;
      if (oldLat !== coordinate.lat || oldLng !== coordinate.lon) {
        event.coordinates = { lat: coordinate.lat, lng: coordinate.lon };
        event.location = pages.get(title)?.title ?? event.location;
        coordinatesUpdated += 1;
      }
    } else if (event.coordinates?.lat === 0 && event.coordinates?.lng === 0) {
      unresolved.push({ file: dataset.file, id: event.id, name: event.name });
    }
    if (event.coordinates?.lat === 0 && event.coordinates?.lng === 0) zeroAfter += 1;
  }
  await writeFile(dataset.path, `${JSON.stringify(dataset.events, null, 2)}\n`);
}

console.log(JSON.stringify({
  russianEventsWithWorkingLeadImages: russianChanged,
  fedayeenEventsWithWorkingLeadImages: fedayeenChanged,
  yearlyFiles: eventFiles.length,
  coordinatesUpdated,
  zeroCoordinatesBefore: zeroBefore,
  zeroCoordinatesAfter: zeroAfter,
  unresolvedCount: unresolved.length,
  unresolved,
}, null, 2));
