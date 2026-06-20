import fs from "fs";
import path from "path";

const backendRoot = process.argv[2] || "C:/Users/alons/Terra-Historia-Backend";
const file = path.join(
  backendRoot,
  "deepdives-drafts",
  "israel-hezbollah-war-2023-2024.generated.json"
);

const data = JSON.parse(fs.readFileSync(file, "utf8"));
const event = data.find((item) => item.id === "northern-evacuation");

if (!event) {
  throw new Error("Could not find northern-evacuation event.");
}

delete event.regions;
delete event.divisionLines;

fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
console.log("Removed Northern Israel Evacuated map highlight.");
