import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const backend = process.argv[2] ?? "C:\\Users\\alons\\Terra-Historia-Backend";
const drafts = join(backend, "deepdives-drafts");

const descriptions = {
  "first-battle-of-grozny:Battle of Grozny": "Grozny marks the Chechen capital and the center of the first major urban battle.",
  "samashki-massacre:Samashki massacre": "Samashki marks the village where Russian forces carried out a notorious massacre of civilians.",
  "budyonnovsk-hospital-hostage-crisis:Budyonnovsk hospital hostage crisis": "Budyonnovsk marks the hospital hostage crisis that forced Moscow into negotiations.",
  "kizlyar-pervomayskoye-hostage-crisis:Kizlyar-Pervomayskoye hostage crisis": "Kizlyar and Pervomayskoye mark the hostage crisis and pursuit that widened the war's civilian impact.",
  "august-1996-battle-of-grozny:Battle of Grozny": "Grozny marks the August 1996 battle that broke Russian control and led toward the Khasavyurt Accord.",
  "battle-of-grozny:Battle of Grozny": "Grozny marks the devastated Chechen capital and the main objective of Russia's 1999-2000 offensive.",
  "novye-aldi-massacre:Novye Aldi massacre": "Novye Aldi marks the Grozny district where civilians were killed after Russian forces entered the area.",
  "battle-for-height-776:Battle for Height 776": "Height 776 marks the mountain battle where Russian paratroopers fought Chechen fighters breaking out of Grozny.",
  "battle-of-komsomolskoye:Battle of Komsomolskoye": "Komsomolskoye marks the village battle that destroyed one of the last large Chechen field formations.",
  "insurgency-in-ingushetia:Insurgency in Ingushetia": "Ingushetia is marked because the conflict spilled beyond Chechnya into neighboring republics.",
};

async function load(name) {
  return JSON.parse(await readFile(join(drafts, name), "utf8"));
}

async function save(name, data) {
  await writeFile(join(drafts, name), `${JSON.stringify(data, null, 2)}\n`);
}

function addDescriptions(data) {
  for (const event of data) {
    for (const marker of event.markers ?? []) {
      if (!marker.description) {
        marker.description = descriptions[`${event.id}:${marker.label}`] ?? `${marker.label} is marked because it is central to this event.`;
      }
    }
  }
}

for (const file of ["first-chechen-war.generated.json", "second-chechen-war.generated.json"]) {
  const data = await load(file);
  addDescriptions(data);
  await save(file, data);
}

console.log("Finalized Chechen marker descriptions.");
