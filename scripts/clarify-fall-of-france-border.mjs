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

const occupiedOuter = [
  [-4.85, 48.55],
  [-4.2, 48.8],
  [-3.15, 48.88],
  [-2.15, 49.15],
  [-1.58, 49.65],
  [-0.15, 49.5],
  [0.62, 50.18],
  [1.58, 50.78],
  [2.38, 51.04],
  [2.55, 51.08],
  [3.16, 50.74],
  [3.52, 50.36],
  [3.97, 50.28],
  [4.83, 50.14],
  [4.94, 49.7],
  [5.77, 49.52],
  [6.17, 49.36],
  [7.28, 49.1],
  [7.86, 49.02],
  [7.75, 48.58],
  [7.58, 48.08],
  [7.52, 47.58],
  [6.9, 47.18],
  [6.15, 46.3],
  ...demarcationLine.slice(0, -1).reverse(),
  [-1.43, 43.28],
  [-1.25, 44.6],
  [-1.15, 45.5],
  [-1.35, 46.25],
  [-2.0, 46.95],
  [-2.75, 47.55],
  [-4.15, 48.05],
  [-4.85, 48.55],
];

const vichyOuter = [
  ...demarcationLine,
  [7.2, 45.1],
  [7.4, 43.75],
  [6.15, 43.05],
  [4.8, 43.1],
  [3.0, 42.55],
  [1.5, 42.58],
  [0.2, 42.75],
  [-1.28, 43.09],
];

const data = JSON.parse(await readFile(file, "utf8"));
const france = data.find((event) => event.id === "france");

if (!france) {
  throw new Error("Could not find wwii-events/france");
}

france.regions = [
  {
    id: "occupied-france",
    label: "German occupied zone",
    color: "#c0392b",
    opacity: 0.2,
    coordinates: occupiedOuter,
  },
  {
    id: "vichy-france",
    label: "Vichy / Zone libre",
    color: "#f1c40f",
    opacity: 0.18,
    coordinates: vichyOuter,
  },
];

france.divisionLines = [
  {
    id: "france-demarcation-line",
    label: "Demarcation line",
    color: "#ff4fa3",
    coordinates: demarcationLine,
  },
];

await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log("Clarified Fall of France demarcation border.");
