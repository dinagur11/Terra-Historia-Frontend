import fs from "fs";
import path from "path";

const backendRoot = process.argv[2] || "C:/Users/alons/Terra-Historia-Backend";
const file = path.join(
  backendRoot,
  "deepdives-drafts",
  "israel-hamas-war.generated.json"
);

const data = JSON.parse(fs.readFileSync(file, "utf8"));
const event = data.find((item) => item.id === "conflict-summary");
const slide = event?.slides?.[0];

if (!slide) {
  throw new Error("Could not find Conflict Summary slide.");
}

slide.stats = [
  {
    val: "Fragile ceasefire; final settlement unresolved",
    lbl: "Outcome / present status",
  },
  {
    val: "Israeli dead include about 1,200 people murdered on October 7 plus hundreds of soldiers killed during the Gaza campaign",
    lbl: "Israeli human cost",
    full: true,
  },
  {
    val: "Gaza casualty figures are disputed by Israel because Hamas-run reporting does not reliably separate civilians from fighters",
    lbl: "Information war",
    full: true,
  },
  {
    val: "Final assessment",
    lbl: "Israel's core lesson was that Hamas rule in Gaza had become an unacceptable permanent threat: the war severely damaged Hamas, recovered many hostages, and exposed the difficulty of ending the conflict while Hamas retained leverage over hostages, casualty narratives, and Gaza's future.",
    full: true,
  },
];

fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
console.log("Updated Israel-Hamas War summary stats.");
