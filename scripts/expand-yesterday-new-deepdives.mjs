import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const backendRoot = process.argv[2] ?? "C:\\Users\\alons\\Terra-Historia-Backend";
const draftsRoot = join(backendRoot, "deepdives-drafts");

const israelThreats = new Map([
  ["first-intifada.generated.json", "Palestinian armed groups and escalating unrest"],
  ["second-intifada.generated.json", "Palestinian terrorist organizations and suicide-bombing networks"],
  ["palestinian-fedayeen-insurgency.generated.json", "cross-border Palestinian fedayeen organizations"],
  ["gaza-war-2008-2009.generated.json", "Hamas and other Gaza-based armed groups"],
  ["2012-gaza-war.generated.json", "Hamas and Palestinian Islamic Jihad"],
  ["2014-gaza-war.generated.json", "Hamas and other Gaza-based armed groups"],
  ["2021-israel-palestine-crisis.generated.json", "Hamas and Palestinian Islamic Jihad"],
  ["gaza-conflicts-2018-2023.generated.json", "Hamas, Palestinian Islamic Jihad, and other Gaza-based armed groups"],
  ["israel-hamas-war.generated.json", "Hamas and the other armed groups that participated in or supported the October 7 attack"],
  ["operation-litani.generated.json", "the PLO's armed infrastructure in southern Lebanon"],
  ["lebanese-civil-war.generated.json", "armed organizations operating from a fractured Lebanon"],
  ["2006-lebanon-war.generated.json", "Hezbollah"],
  ["israel-hezbollah-war-2023-2024.generated.json", "Hezbollah"],
  ["2026-lebanon-war.generated.json", "Hezbollah and its Iranian-backed military network"],
  ["iran-israel-proxy-conflict.generated.json", "Iran and its regional proxy network"],
  ["twelve-day-war.generated.json", "Iran's nuclear, missile, and regional military capabilities"],
  ["2026-iran-war.generated.json", "Iran's nuclear, missile, and regional military capabilities"],
  ["israeli-operation-in-syria-2024-present.generated.json", "Iranian weapons networks and hostile military capabilities in Syria"],
]);

function compactStats(slide) {
  return (slide.stats ?? [])
    .filter((stat) => stat?.val && stat?.lbl && !stat.full)
    .slice(0, 2)
    .map((stat) => `${stat.val} (${stat.lbl.toLowerCase()})`)
    .join(" and ");
}

function strategicContext({ file, conflict, event, slide, nextEvent, index, total }) {
  const measure = compactStats(slide);
  const evidence = measure
    ? `The recorded indicators, including ${measure}, help convey the episode's scale and the pressures facing decision-makers.`
    : `Its importance lies not only in the immediate fighting, but also in how it changed military planning, political expectations, and the room available for diplomacy.`;

  if (event.id === "origins-and-background") {
    return `This background is essential to understanding ${conflict}: the conflict emerged from accumulated security failures, political choices, and unresolved disputes rather than from a single isolated incident. ${evidence}`;
  }

  if (event.id === "conflict-summary") {
    return `Taken as a whole, ${conflict} shows how battlefield achievements can alter the balance of power without necessarily producing a durable political settlement. The outcome must therefore be judged by the security conditions it created, the threats that survived, the human cost, and whether later leaders learned from the campaign.`;
  }

  const transition = nextEvent
    ? `It also shaped the conditions for the next phase, ${nextEvent.title}, by changing what commanders and political leaders believed was possible or necessary.`
    : `It shaped the conflict's final military and diplomatic calculations.`;

  const threat = israelThreats.get(file);
  if (threat) {
    return `From an Israeli security perspective, ${event.title} must be understood in the context of the continuing threat posed by ${threat}. Israel's central obligation was to protect its citizens, restore deterrence, and prevent armed groups from turning rockets, tunnels, border raids, terrorism, or regional military infrastructure into an accepted permanent danger. ${transition} ${evidence} This security context does not erase Palestinian, Lebanese, Iranian, or other civilian suffering; it explains why Israeli leaders and much of the Israeli public regarded inaction as an unacceptable choice.`;
  }

  const position = index === 1 ? "an early" : index >= total - 2 ? "a late" : "a central";
  return `As ${position} episode in ${conflict}, ${event.title} changed more than the local battlefield. It affected morale, command decisions, international perceptions, and the options available to every side. ${transition} ${evidence}`;
}

const status = execFileSync("git", ["status", "--porcelain"], {
  cwd: backendRoot,
  encoding: "utf8",
});
const files = status
  .split(/\r?\n/)
  .filter((line) => line.startsWith("?? deepdives-drafts/") && line.endsWith(".json"))
  .map((line) => basename(line.slice(3)))
  .sort();

let eventsExpanded = 0;
let slidesExpanded = 0;

for (const file of files) {
  const path = join(draftsRoot, file);
  const events = JSON.parse(await readFile(path, "utf8"));
  const conflict = events.at(-1)?.title?.replace(/^Conflict Summary:\s*/, "") ?? file;

  events.forEach((event, index) => {
    let changed = false;
    for (const slide of event.slides ?? []) {
      if (slide.body?.includes("From an Israeli security perspective,") ||
          slide.body?.includes("This background is essential to understanding") ||
          slide.body?.includes("Taken as a whole,") ||
          slide.body?.includes("changed more than the local battlefield.")) {
        continue;
      }

      const context = strategicContext({
        file,
        conflict,
        event,
        slide,
        nextEvent: events[index + 1],
        index,
        total: events.length,
      });
      slide.body = `${slide.body.trim()}\n\n${context}`;
      slidesExpanded += 1;
      changed = true;
    }
    if (changed) eventsExpanded += 1;
  });

  for (const event of events) {
    for (const slide of event.slides ?? []) {
      slide.body = slide.body?.replace(/\bAs a early episode\b/g, "As an early episode");
    }
  }

  await writeFile(path, `${JSON.stringify(events, null, 2)}\n`, "utf8");
}

const wwiiPath = join(draftsRoot, "wwii-events.json");
const wwii = JSON.parse(await readFile(wwiiPath, "utf8"));
const poland = wwii.find((event) => event.id === "poland");
if (!poland) throw new Error("Could not find the WWII Invasion of Poland event.");

poland.regions = [];
const partitionSlide = poland.slides.find((slide) => slide.title === "Poland Encircled");
if (!partitionSlide) throw new Error("Could not find the Poland Encircled slide.");
partitionSlide.img = "https://commons.wikimedia.org/wiki/Special:FilePath/Mapa_2_paktu_Ribbentrop-Mo%C5%82otow.gif";
partitionSlide.cap = "Map signed by Stalin and Ribbentrop showing the German-Soviet partition of Poland";
await writeFile(wwiiPath, `${JSON.stringify(wwii, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  newDeepDivesExpanded: files.length,
  eventsExpanded,
  slidesExpanded,
  polandRegionsRemoved: true,
  polandSlideImageUpdated: true,
}, null, 2));
