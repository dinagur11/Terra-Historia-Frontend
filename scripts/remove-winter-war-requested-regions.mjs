import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const backend = process.argv[2] ?? "C:\\Users\\alons\\Terra-Historia-Backend";
const file = join(backend, "deepdives-drafts", "winter-war.json");

const regionsByEvent = {
  "international-reaction": [
    {
      id: "aid-route-scandinavia",
      label: "Scandinavian aid route",
      color: "#f1c40f",
      opacity: 0.14,
      coordinates: [
        [10, 58],
        [18, 60],
        [25, 64],
        [25, 66],
        [17, 63],
        [9, 59],
        [10, 58],
      ],
    },
  ],
  legacy: [
    {
      id: "finland-postwar-core",
      label: "Finland after the treaty",
      color: "#2980b9",
      opacity: 0.12,
      coordinates: [
        [20.6, 69.8],
        [29.5, 69.5],
        [31, 63.5],
        [29, 61.5],
        [26, 60],
        [22, 60],
        [20, 64],
        [20.6, 69.8],
      ],
    },
  ],
};

const data = JSON.parse(await readFile(file, "utf8"));

for (const event of data) {
  if (regionsByEvent[event.id]) {
    event.regions = regionsByEvent[event.id];
  }
}

await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log("Restored requested Winter War highlighted regions.");
