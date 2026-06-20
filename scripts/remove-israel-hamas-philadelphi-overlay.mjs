import fs from "fs";
import path from "path";

const backendRoot = process.argv[2] || "C:/Users/alons/Terra-Historia-Backend";
const file = path.join(
  backendRoot,
  "deepdives-drafts",
  "israel-hamas-war.generated.json"
);

const data = JSON.parse(fs.readFileSync(file, "utf8"));
for (const event of data) {
  if (event.id !== "rafah-and-philadelphi") continue;
  delete event.divisionLines;
  delete event.arrows;
}

fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
console.log("Removed Philadelphi Corridor overlay from israel-hamas-war.generated.json");
