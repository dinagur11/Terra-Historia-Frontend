import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const backend = process.argv[2] ?? "C:\\Users\\alons\\Terra-Historia-Backend";
const file = join(backend, "deepdives-drafts", "wwii-events.json");

const demarcationLine = [
  [-1.28, 43.09],
  [-1.24, 43.16],
  [-0.98, 43.38],
  [-0.72, 43.62],
  [-0.5, 43.89],
  [-0.36, 44.18],
  [-0.25, 44.55],
  [-0.02, 44.92],
  [0.16, 45.65],
  [0.34, 46.05],
  [0.72, 46.34],
  [1.22, 46.62],
  [1.9, 46.82],
  [2.4, 47.08],
  [2.15, 47.38],
  [2.07, 47.56],
  [2.62, 47.63],
  [3.02, 46.98],
  [3.33, 46.57],
  [3.75, 46.42],
  [4.03, 46.31],
  [4.37, 46.43],
  [4.66, 46.78],
  [4.85, 47.03],
  [5.05, 47.1],
  [5.49, 47.09],
  [5.88, 46.91],
  [6.18, 46.75],
  [6.38, 46.73],
];

const data = JSON.parse(await readFile(file, "utf8"));
const france = data.find((event) => event.id === "france");

if (!france) {
  throw new Error("Could not find wwii-events/france");
}

france.regions = [];
france.divisionLines = [
  {
    id: "france-demarcation-line",
    label: "Demarcation line",
    color: "#ff4fa3",
    coordinates: demarcationLine,
  },
];

await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log("Removed Fall of France filled polygons and updated the demarcation border.");
