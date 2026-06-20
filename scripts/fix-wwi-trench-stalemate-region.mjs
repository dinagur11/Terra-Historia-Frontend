import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const backend = process.argv[2] ?? "C:\\Users\\alons\\Terra-Historia-Backend";
const file = join(backend, "deepdives-drafts", "wwi-events.json");

const westernFrontTrenchBelt = [
  [2.58, 51.18],
  [2.68, 51.03],
  [2.7, 50.86],
  [2.62, 50.63],
  [2.55, 50.42],
  [2.46, 50.18],
  [2.47, 49.93],
  [2.75, 49.56],
  [3.1, 49.3],
  [3.76, 49.08],
  [4.5, 48.98],
  [5.14, 49.0],
  [5.42, 48.77],
  [5.88, 48.68],
  [6.36, 48.34],
  [6.7, 47.95],
  [7.08, 47.55],
  [7.32, 47.6],
  [6.98, 48.05],
  [6.62, 48.48],
  [6.1, 48.86],
  [5.62, 49.03],
  [5.46, 49.28],
  [4.82, 49.33],
  [4.08, 49.42],
  [3.48, 49.56],
  [3.08, 49.83],
  [2.92, 50.09],
  [2.98, 50.34],
  [3.12, 50.54],
  [3.1, 50.74],
  [3.02, 50.94],
  [2.86, 51.12],
  [2.58, 51.18],
];

const data = JSON.parse(await readFile(file, "utf8"));
const event = data.find((item) => item.id === "trench-stalemate");

if (!event) {
  throw new Error("Could not find wwi-events/trench-stalemate");
}

event.view = { center: [49.75, 4.3], zoom: 5 };
event.regions = [
  {
    id: "western-front-trench-belt",
    label: "Western Front trench belt",
    color: "#8e44ad",
    opacity: 0.2,
    coordinates: westernFrontTrenchBelt,
  },
];

await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log("Updated WWI trench-stalemate highlighted area.");
