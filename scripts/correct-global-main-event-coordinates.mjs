import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const backendRoot = process.argv[2] ?? "C:\\Users\\alons\\Terra-Historia-Backend";
const eventsRoot = join(backendRoot, "events");
const draftsRoot = join(backendRoot, "deepdives-drafts");

const overrides = {
  "bolshevik-revolution-1915-1": ["Istanbul", 41.0082, 28.9784],
  "sinking-of-the-rms-lusitania-1915-4": ["Off the coast of Ireland", 51.4167, -8.55],
  "william-jennings-bryan-1915-6": ["Washington, D.C.", 38.9072, -77.0369],
  "irish-republican-brotherhood-1915-9": ["Dublin", 53.3498, -6.2603],
  "mcmahonhussein-correspondence-1916-2": ["Cairo", 30.0444, 31.2357],
  "roger-casement-1916-4": ["London", 51.5074, -0.1278],
  "battle-of-flerscourcelette-1916-7": ["Flers-Courcelette", 50.05, 2.8],
  "republican-party-1916-8": ["Montana", 46.8797, -110.3626],
};
const places = [
  ["Constantinople", 41.0082, 28.9784], ["Istanbul", 41.0082, 28.9784],
  ["Gallipoli", 40.35, 26.47], ["Bitlis", 38.4, 42.11], ["Dublin", 53.3498, -6.2603],
  ["Ireland", 53.3498, -6.2603], ["Bucharest", 44.4268, 26.1025],
  ["Dar es Salaam", -6.7924, 39.2083], ["Petrograd", 59.9343, 30.3351],
  ["St. Petersburg", 59.9343, 30.3351], ["Moscow", 55.7558, 37.6173],
  ["Versailles", 48.8049, 2.1204], ["Paris", 48.8566, 2.3522],
  ["Tallinn", 59.437, 24.7536], ["Ankara", 39.9334, 32.8597],
  ["Jerusalem", 31.7683, 35.2137], ["London", 51.5074, -0.1278],
  ["Rome", 41.9028, 12.4964], ["Berlin", 52.52, 13.405],
  ["Madrid", 40.4168, -3.7038], ["Athens", 37.9838, 23.7275],
  ["Helsinki", 60.1699, 24.9384], ["Warsaw", 52.2297, 21.0122],
  ["Beijing", 39.9042, 116.4074], ["Tokyo", 35.6762, 139.6503],
  ["Cairo", 30.0444, 31.2357], ["Beirut", 33.8938, 35.5018],
  ["Damascus", 33.5138, 36.2765], ["Baghdad", 33.3152, 44.3661],
  ["Tehran", 35.6892, 51.389], ["Kabul", 34.5553, 69.2075],
  ["Kyiv", 50.4501, 30.5234], ["Washington", 38.9072, -77.0369],
  ["New York", 40.7128, -74.006], ["Los Angeles", 34.0522, -118.2437],
  ["Mexico", 19.4326, -99.1332], ["Ceylon", 6.9271, 79.8612],
  ["Sri Lanka", 6.9271, 79.8612], ["United States", 38.9072, -77.0369],
  ["United Kingdom", 51.5074, -0.1278], ["Britain", 51.5074, -0.1278],
  ["France", 48.8566, 2.3522], ["Germany", 52.52, 13.405],
  ["Italy", 41.9028, 12.4964], ["Spain", 40.4168, -3.7038],
  ["Greece", 37.9838, 23.7275], ["Finland", 60.1699, 24.9384],
  ["Poland", 52.2297, 21.0122], ["Russia", 55.7558, 37.6173],
  ["China", 39.9042, 116.4074], ["Japan", 35.6762, 139.6503],
  ["Israel", 31.7683, 35.2137], ["Egypt", 30.0444, 31.2357],
  ["Lebanon", 33.8938, 35.5018], ["Syria", 33.5138, 36.2765],
  ["Iraq", 33.3152, 44.3661], ["Iran", 35.6892, 51.389],
  ["Ukraine", 50.4501, 30.5234], ["Africa", 0.3476, 32.5825],
];

function earliestPlace(event) {
  const text = `${event.name} ${event.summary}`;
  const matches = places
    .map(([name, lat, lng]) => ({ name, lat, lng, index: text.toLowerCase().indexOf(name.toLowerCase()) }))
    .filter((match) => match.index >= 0)
    .sort((a, b) => a.index - b.index || b.name.length - a.name.length);
  return matches[0];
}

let corrected = 0;
const files = (await readdir(eventsRoot)).filter((file) => /^\d{4}\.json$/.test(file));
for (const file of files) {
  const path = join(eventsRoot, file);
  const events = JSON.parse(await readFile(path, "utf8"));
  for (const event of events) {
    const override = overrides[event.id];
    const place = override
      ? { name: override[0], lat: override[1], lng: override[2] }
      : event.location === "Global" ? earliestPlace(event) : undefined;
    if (!place) continue;
    if (event.coordinates.lat !== place.lat || event.coordinates.lng !== place.lng || event.location !== place.name) {
      event.coordinates = { lat: place.lat, lng: place.lng };
      event.location = place.name;
      corrected += 1;
    }
  }
  await writeFile(path, `${JSON.stringify(events, null, 2)}\n`);
}

const russianPath = join(draftsRoot, "russian-civil-war.json");
const russian = JSON.parse(await readFile(russianPath, "utf8"));
const russianFixes = {
  "constituent-assembly": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Tauride_Palace_1917.jpg/1280px-Tauride_Palace_1917.jpg",
  "czechoslovak-legion": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Czechoslovak_Legion_in_Russia.jpg/1280px-Czechoslovak_Legion_in_Russia.jpg",
};
for (const event of russian) {
  if (!russianFixes[event.id]) continue;
  for (const slide of event.slides ?? []) slide.img = russianFixes[event.id];
}
await writeFile(russianPath, `${JSON.stringify(russian, null, 2)}\n`);

console.log(JSON.stringify({ correctedGlobalOrExplicitEvents: corrected, russianLowValueImagesRepaired: 2 }, null, 2));
