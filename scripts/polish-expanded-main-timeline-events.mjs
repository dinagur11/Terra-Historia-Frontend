import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DIR = "C:\\Users\\alons\\Terra-Historia-Backend\\events";
const years = Array.from({ length: 65 }, (_, index) => 1915 + index).filter((year) => year !== 1948);
const overrides = {
  "1953/Jonas Salk announces his polio vaccine":
    "Jonas Salk announced that he had successfully tested an experimental polio vaccine using inactivated virus. The announcement preceded the enormous 1954 field trial and the vaccine's licensing in 1955, after which widespread immunization sharply reduced polio cases in the United States and many other countries.",
  "1956/Tunisia":
    "Tunisia gained independence from France on March 20, 1956, ending the French protectorate established in 1881. Habib Bourguiba became prime minister and led the transition toward a republic, while independence added momentum to the wider postwar dismantling of European colonial rule across North Africa.",
  "1958/Soviet Union launches Sputnik 3":
    "The Soviet Union launched Sputnik 3, a large scientific satellite carrying instruments designed to study Earth's upper atmosphere and near-Earth space. Although a recorder failure limited some planned measurements, the mission demonstrated Soviet launch capability and extended the scientific ambitions of the early Space Race.",
  "1977/Djibouti":
    "Djibouti gained independence from France on June 27, 1977, ending its status as the French Territory of the Afars and the Issas. Hassan Gouled Aptidon became the country's first president, and the strategically located state soon joined the United Nations while maintaining close relations with France.",
  "1943/Allied invasion of Sicily":
    "The U.S. Seventh Army under General George S. Patton met the British Eighth Army under Field Marshal Bernard Montgomery in Messina, completing the Allied conquest of Sicily. The campaign removed Axis forces from the island, opened Mediterranean shipping routes, and helped trigger the fall of Benito Mussolini's government in Italy.",
  "1962/Vietnam War":
    "After visiting Vietnam at President John F. Kennedy's request, U.S. Senate Majority Leader Mike Mansfield became the first senior American official to publicly express pessimism about the war's progress. His assessment challenged optimistic official reporting and foreshadowed the growing American debate over deeper involvement in South Vietnam.",
  "1967/Waiting period":
    "The tense waiting period before the Six-Day War began as Egypt moved forces into Sinai, ordered the departure of UN peacekeepers, and closed the Straits of Tiran to Israeli shipping. Israel mobilized while diplomacy failed to resolve the crisis, and the regional confrontation escalated into war on June 5, 1967.",
  "1972/Watergate scandal":
    "President Richard Nixon and White House chief of staff H. R. Haldeman were recorded discussing the use of the CIA to obstruct the FBI investigation into the Watergate break-in. The recording later became known as the smoking-gun tape and helped demonstrate presidential involvement in the cover-up.",
};

function sentenceParts(value) {
  return value.split(/(?<=[.!?])\s+(?=["A-Z0-9])/).map((part) => part.trim()).filter(Boolean);
}
function dedupe(value) {
  const seen = new Set();
  return sentenceParts(value).filter((sentence) => {
    const key = sentence.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).join(" ");
}

for (const year of years) {
  const file = join(DIR, `${year}.json`);
  const events = JSON.parse(await readFile(file, "utf8"));
  for (const event of events) {
    event.summary = overrides[`${year}/${event.name}`] || dedupe(event.summary);
  }
  await writeFile(file, `${JSON.stringify(events, null, 2)}\n`, "utf8");
}

console.log("Polished expanded main-timeline summaries and removed repeated sentences.");
