import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const backend = process.argv[2] ?? "C:\\Users\\alons\\Terra-Historia-Backend";
const file = join(backend, "deepdives-drafts", "winter-war.json");

const data = JSON.parse(await readFile(file, "utf8"));
const event = data.find((item) => item.id === "international-reaction");

if (!event) {
  throw new Error("Could not find winter-war/international-reaction");
}

event.regions = [];

await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log("Removed International Reaction highlighted region.");
