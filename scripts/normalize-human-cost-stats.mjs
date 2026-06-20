import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const backend = process.argv[2] ?? "C:\\Users\\alons\\Terra-Historia-Backend";
const drafts = join(backend, "deepdives-drafts");

const files = [
  "first-chechen-war.generated.json",
  "war-of-dagestan.generated.json",
  "second-chechen-war.generated.json",
];

function normalizeStats(event) {
  for (const slide of event?.slides ?? []) {
    for (const stat of slide.stats ?? []) {
      const val = String(stat.val ?? "");
      const lbl = String(stat.lbl ?? "");
      if (/human cost|casualt/i.test(lbl) && !/human cost|casualt/i.test(val)) {
        stat.val = /human cost/i.test(lbl) ? "Estimated human cost" : "Casualties / human cost";
        stat.lbl = val;
      }
    }
  }
}

for (const file of files) {
  const path = join(drafts, file);
  const data = JSON.parse(await readFile(path, "utf8"));
  for (const event of data) normalizeStats(event);
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`);
}

console.log("Normalized human-cost stats.");
