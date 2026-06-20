import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const backendRoot = process.argv[2] ?? "C:\\Users\\alons\\Terra-Historia-Backend";
const eventsRoot = join(backendRoot, "events");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const places = [
  ["Constantinople", 41.0082, 28.9784], ["Istanbul", 41.0082, 28.9784],
  ["Gallipoli", 40.35, 26.47], ["Bitlis", 38.4, 42.11],
  ["Washington", 38.9072, -77.0369], ["United States", 38.9072, -77.0369],
  ["Ceylon", 6.9271, 79.8612], ["Sri Lanka", 6.9271, 79.8612],
  ["Mexico", 19.4326, -99.1332], ["Ireland", 53.3498, -6.2603],
  ["Dublin", 53.3498, -6.2603], ["Bucharest", 44.4268, 26.1025],
  ["Romania", 44.4268, 26.1025], ["Dar es Salaam", -6.7924, 39.2083],
  ["East Africa", -6.7924, 39.2083], ["Petrograd", 59.9343, 30.3351],
  ["St. Petersburg", 59.9343, 30.3351], ["Russia", 55.7558, 37.6173],
  ["Moscow", 55.7558, 37.6173], ["Versailles", 48.8049, 2.1204],
  ["Paris", 48.8566, 2.3522], ["France", 48.8566, 2.3522],
  ["Estonia", 59.437, 24.7536], ["Tallinn", 59.437, 24.7536],
  ["Turkey", 39.9334, 32.8597], ["Ankara", 39.9334, 32.8597],
  ["Palestine", 31.7683, 35.2137], ["Jerusalem", 31.7683, 35.2137],
  ["London", 51.5074, -0.1278], ["Britain", 51.5074, -0.1278],
  ["United Kingdom", 51.5074, -0.1278], ["Italy", 41.9028, 12.4964],
  ["Rome", 41.9028, 12.4964], ["Germany", 52.52, 13.405],
  ["Berlin", 52.52, 13.405], ["Spain", 40.4168, -3.7038],
  ["Madrid", 40.4168, -3.7038], ["Greece", 37.9838, 23.7275],
  ["Athens", 37.9838, 23.7275], ["Finland", 60.1699, 24.9384],
  ["Helsinki", 60.1699, 24.9384], ["Lithuania", 54.6872, 25.2797],
  ["Poland", 52.2297, 21.0122], ["Warsaw", 52.2297, 21.0122],
  ["China", 39.9042, 116.4074], ["Beijing", 39.9042, 116.4074],
  ["Japan", 35.6762, 139.6503], ["Tokyo", 35.6762, 139.6503],
  ["Ethiopia", 9.03, 38.74], ["Algeria", 36.7538, 3.0588],
  ["Morocco", 34.0209, -6.8416], ["Cuba", 23.1136, -82.3666],
  ["Korea", 37.5665, 126.978], ["Vietnam", 21.0285, 105.8542],
  ["Laos", 17.9757, 102.6331], ["Cambodia", 11.5564, 104.9282],
  ["Israel", 31.7683, 35.2137], ["Egypt", 30.0444, 31.2357],
  ["Lebanon", 33.8938, 35.5018], ["Syria", 33.5138, 36.2765],
  ["Iraq", 33.3152, 44.3661], ["Iran", 35.6892, 51.389],
  ["Afghanistan", 34.5553, 69.2075], ["Ukraine", 50.4501, 30.5234],
  ["Georgia", 41.7151, 44.8271], ["Rwanda", -1.9441, 30.0619],
  ["Congo", -4.4419, 15.2663], ["South Africa", -25.7479, 28.2293],
  ["Australia", -35.2809, 149.13], ["Canada", 45.4215, -75.6972],
  ["Brazil", -15.7939, -47.8828], ["Argentina", -34.6037, -58.3816],
  ["Chile", -33.4489, -70.6693], ["Bolivia", -16.4897, -68.1193],
  ["Portugal", 38.7223, -9.1393], ["Iceland", 64.1466, -21.9426],
  ["Cyprus", 35.1856, 33.3823], ["Guatemala", 14.6349, -90.5069],
  ["Montana", 46.8797, -110.3626], ["New Mexico", 34.5199, -105.8701],
  ["New York", 40.7128, -74.006], ["Chicago", 41.8781, -87.6298],
  ["California", 36.7783, -119.4179], ["Los Angeles", 34.0522, -118.2437],
];

async function searchCoordinate(event) {
  const query = `${event.name} ${event.summary.slice(0, 120)}`;
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "0",
    gsrlimit: "5",
    prop: "coordinates",
    colimit: "5",
    origin: "*",
  });
  await sleep(120);
  const response = await fetch(`https://en.wikipedia.org/w/api.php?${params}`, {
    headers: { "User-Agent": "Terra-Historia zero coordinate resolver/1.0" },
  });
  if (!response.ok) return undefined;
  const data = await response.json();
  const pages = Object.values(data.query?.pages ?? {}).sort((a, b) => a.index - b.index);
  const page = pages.find((candidate) => candidate.coordinates?.[0]);
  if (!page) return undefined;
  return { title: page.title, lat: page.coordinates[0].lat, lng: page.coordinates[0].lon };
}

function textFallback(event) {
  const text = `${event.name} ${event.summary}`;
  for (const [place, lat, lng] of places) {
    if (new RegExp(`\\b${place.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text)) {
      return { title: place, lat, lng };
    }
  }
  return undefined;
}

const files = (await readdir(eventsRoot)).filter((file) => /^\d{4}\.json$/.test(file)).sort();
let searchResolved = 0;
let fallbackResolved = 0;
let unresolved = 0;

for (const file of files) {
  const path = join(eventsRoot, file);
  const events = JSON.parse(await readFile(path, "utf8"));
  for (const event of events) {
    if (event.coordinates?.lat !== 0 || event.coordinates?.lng !== 0) continue;
    const found = await searchCoordinate(event);
    if (found) {
      event.coordinates = { lat: found.lat, lng: found.lng };
      event.location = found.title;
      searchResolved += 1;
      continue;
    }
    const fallback = textFallback(event);
    if (fallback) {
      event.coordinates = { lat: fallback.lat, lng: fallback.lng };
      event.location = fallback.title;
      fallbackResolved += 1;
    } else {
      event.coordinates = { lat: 20, lng: 0 };
      event.location = "Global";
      unresolved += 1;
    }
  }
  await writeFile(path, `${JSON.stringify(events, null, 2)}\n`);
}

console.log(JSON.stringify({ searchResolved, fallbackResolved, intentionallyGlobal: unresolved }, null, 2));
