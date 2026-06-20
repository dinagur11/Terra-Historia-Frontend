import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = "C:\\Users\\alons\\Terra-Historia-Backend";
const DIR = join(ROOT, "deepdives-drafts");
const INDEX = join(ROOT, "deepdives-index.json");
const TODAY = "2026-06-15";
const isIso = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value || "");

async function load(file) {
  return JSON.parse(await readFile(join(DIR, file), "utf8"));
}
async function save(file, value) {
  await writeFile(join(DIR, file), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
function setDate(event, date) {
  event.date = date;
  event.year = Number(date.slice(0, 4));
}

const exactDateFixes = {
  "gulf-war.generated.json/iraqi-invasion-of-kuwait": "1990-08-02",
  "first-chechen-war.generated.json/khasavyurt-accord": "1996-08-31",
  "first-chechen-war.generated.json/kizlyar-pervomayskoye-hostage-crisis": "1996-01-09",
  "first-chechen-war.generated.json/shatoy-ambush": "1996-04-16",
};

const index = JSON.parse(await readFile(INDEX, "utf8"));
const published = new Set(index.map((item) => item.id));
const files = (await readdir(DIR)).filter((file) => {
  const id = file.replace(/\.generated\.json$|\.json$/, "");
  return published.has(id);
});

for (const file of files) {
  const events = await load(file);
  if (!Array.isArray(events)) continue;
  let changed = false;

  for (const event of events) {
    const firstYear = String(event.date || "").match(/\b(19|20)\d{2}\b/)?.[0];
    if (firstYear && event.year !== Number(firstYear)) {
      event.year = Number(firstYear);
      changed = true;
    }
    const corrected = exactDateFixes[`${file}/${event.id}`];
    if (corrected && event.date !== corrected) {
      setDate(event, corrected);
      changed = true;
    }
    for (const slide of event.slides || []) {
      const original = JSON.stringify(slide);
      slide.body = (slide.body || "")
        .replaceAll("June 14, 2026", "June 15, 2026")
        .replaceAll("14 June 2026", "15 June 2026")
        .replaceAll("as of 14 Jun 2026", "as of 15 Jun 2026");
      for (const stat of slide.stats || []) {
        if (typeof stat.val === "string") {
          stat.val = stat.val
            .replaceAll("June 14, 2026", "June 15, 2026")
            .replaceAll("14 June 2026", "15 June 2026")
            .replaceAll("14 Jun 2026", "15 Jun 2026");
        }
      }
      if (JSON.stringify(slide) !== original) changed = true;
    }
    if (isIso(event.date) && event.date === "2026-06-14" && /ongoing|continue|summary/i.test(`${event.id} ${event.title}`)) {
      setDate(event, TODAY);
      changed = true;
    }
  }

  if (events.every((event) => isIso(event.date))) {
    const backgrounds = events.filter((event) => /^(origins-and-background|origins-and-road-to-war)$/.test(event.id));
    const endings = events.filter((event) => /^(international-and-human-dimensions|outcome-and-legacy|conflict-summary)$/.test(event.id));
    const middle = events.filter((event) => !backgrounds.includes(event) && !endings.includes(event))
      .sort((a, b) => a.date.localeCompare(b.date));
    const ordered = [...backgrounds, ...middle, ...endings];
    const finalOperationalDate = middle.at(-1)?.date || backgrounds.at(-1)?.date;
    let endingDate = finalOperationalDate;
    for (const ending of endings) {
      if (endingDate && ending.date < endingDate) {
        setDate(ending, endingDate);
        changed = true;
      } else {
        endingDate = ending.date;
      }
    }
    if (ordered.some((event, i) => event !== events[i])) {
      events.splice(0, events.length, ...ordered);
      changed = true;
    }
  }

  if (file === "turkish-war-of-independence.generated.json") {
    const origin = events.find((event) => event.id === "origins-and-road-to-war");
    if (origin) setDate(origin, "1918-10-30");
    changed = true;
  }
  if (file === "indochina-wars.generated.json") {
    const origin = events.find((event) => event.id === "origins-and-road-to-war");
    if (origin) setDate(origin, "1945-08-15");
    changed = true;
  }
  if (file === "war-on-terrorism.generated.json") {
    const origin = events.find((event) => event.id === "origins-and-road-to-war");
    if (origin) setDate(origin, "1964-05-27");
    changed = true;
  }

  if (file === "2026-iran-war.generated.json") {
    const june = events.find((event) => event.id === "june-escalation");
    if (june) {
      june.id = "june-peace-negotiations";
      june.title = "June Peace Negotiations Under Pressure";
      setDate(june, "2026-06-14");
      const slide = june.slides[0];
      slide.title = june.title;
      slide.cap = `Historical overview: ${june.title}`;
      slide.body =
        "US-Iran negotiations mediated with support from Qatar and Pakistan moved toward a proposed framework addressing the ceasefire, sanctions, nuclear restrictions, and the Strait of Hormuz. Renewed Israel-Hezbollah fighting and an Israeli strike in Beirut threatened to derail the talks, leaving the agreement uncertain.";
      slide.stats = [
        { val: "14 Jun 2026", lbl: "Talks face renewed regional escalation" },
        { val: "Proposed agreement", lbl: "Not yet a durable peace settlement" },
      ];
    }
    const summary = events.find((event) => event.id === "conflict-summary");
    if (summary) {
      const slide = summary.slides[0];
      slide.body =
        "As of June 15, 2026, direct US-Israel-Iran fighting remains constrained by a fragile ceasefire while negotiations continue. Israel and the United States inflicted extraordinary damage on Iran's leadership and military capabilities, but Iran retained missiles, regional allies, and leverage over Hormuz. A proposed peace framework remains contested, and the war's final outcome is not yet known.";
      slide.stats = [
        { val: "Fragile ceasefire and negotiations as of June 15, 2026", lbl: "Outcome / present status" },
        { val: "More than 6,000 killed region-wide; estimates remain disputed and changing", lbl: "Human cost" },
        { val: slide.body, lbl: "Final assessment", full: true },
      ];
    }
    changed = true;
  }

  if (file === "2026-lebanon-war.generated.json") {
    const battle = events.find((event) => event.id === "bint-jbeil-fighting");
    if (battle) {
      battle.slides[0].stats = [
        { val: "Bint Jbeil", lbl: "Major battle zone" },
        { val: "Major 2026 ground battle", lbl: "Operational significance" },
      ];
    }
    const summary = events.find((event) => event.id === "conflict-summary");
    if (summary) {
      const slide = summary.slides[0];
      slide.body =
        "As of June 15, 2026, Israel continues operations intended to prevent Hezbollah from rebuilding on its border and to restore lasting security for northern residents. Hezbollah remains dangerous, while renewed exchanges have complicated negotiations for a broader regional settlement. The war has caused enormous destruction, casualties, and displacement in Lebanon.";
      slide.stats = [
        { val: "Ongoing as of June 15, 2026", lbl: "Outcome / present status" },
        { val: "More than 2,700 killed and about 1.2 million displaced in Lebanon; Israeli military and civilian casualties", lbl: "Human cost" },
        { val: slide.body, lbl: "Final assessment", full: true },
      ];
    }
    changed = true;
  }

  if (changed) await save(file, events);
}

console.log(`Corrected chronology and current-date references across ${files.length} published deep dives.`);
