import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const backend = process.argv[2] ?? "C:\\Users\\alons\\Terra-Historia-Backend";
const file = join(backend, "deepdives-drafts", "wwii-events.json");

const data = JSON.parse(await readFile(file, "utf8"));
const stalingrad = data.find((event) => event.id === "stalingrad");

if (!stalingrad) {
  throw new Error("Could not find wwii-events/stalingrad");
}

stalingrad.view = { center: [48.71, 44.51], zoom: 8 };
stalingrad.regions = [
  {
    id: "stalingrad-city-area",
    label: "Stalingrad city area",
    color: "#c0392b",
    opacity: 0.24,
    coordinates: [
      [44.35, 48.9],
      [44.47, 48.93],
      [44.62, 48.84],
      [44.66, 48.72],
      [44.59, 48.58],
      [44.46, 48.5],
      [44.32, 48.56],
      [44.27, 48.7],
      [44.35, 48.9],
    ],
  },
];

stalingrad.markers = [
  {
    latlng: [48.708, 44.514],
    label: "Stalingrad",
    type: "target",
    description:
      "Stalingrad marks the city on the Volga where German and Soviet forces fought house by house from August 1942 to February 1943.",
  },
  {
    latlng: [48.715, 44.531],
    label: "Volga crossing",
    type: "minor",
    description:
      "The Volga crossing marks the narrow Soviet supply lifeline that kept defenders in the city connected to the east bank.",
  },
  {
    latlng: [48.727, 44.529],
    label: "Factory district",
    type: "minor",
    description:
      "The factory district marks the northern industrial area where battles for sites such as the Red October and Barrikady factories became especially brutal.",
  },
];

await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log("Focused Stalingrad map on the city area and added marker descriptions.");
