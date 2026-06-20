import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const backend = process.argv[2] ?? "C:\\Users\\alons\\Terra-Historia-Backend";
const file = join(backend, "deepdives-drafts", "russian-civil-war.json");

const data = JSON.parse(await readFile(file, "utf8"));
const event = data.find((item) => item.id === "constituent-assembly");

if (!event) {
  throw new Error("Could not find russian-civil-war/constituent-assembly");
}

event.regions = [];

await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log("Removed Constituent Assembly highlighted region.");
