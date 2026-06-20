import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DRAFT_DIR = "C:\\Users\\alons\\Terra-Historia-Backend\\deepdives-drafts";

async function readJson(path) {
  return JSON.parse((await readFile(path, "utf8")).replace(/^\uFEFF/, ""));
}

async function writeJson(path, data) {
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function setImage(events, eventId, image) {
  const event = events.find((item) => item.id === eventId);
  if (!event?.slides?.[0]) throw new Error(`Missing event or first slide: ${eventId}`);
  event.slides[0].img = image;
  event.slides[0].cap = `Visual reference for ${event.title}.`;
}

const abkhazia = await readJson(join(DRAFT_DIR, "war-in-abkhazia.generated.json"));
setImage(
  abkhazia,
  "battle-of-ochamchire",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/%D0%90%D0%B1%D1%85%D0%B0%D0%B7%D0%B8%D1%8F_%D0%90.%D0%9B%D1%83%D1%88%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2_1992.jpg/1920px-%D0%90%D0%B1%D1%85%D0%B0%D0%B7%D0%B8%D1%8F_%D0%90.%D0%9B%D1%83%D1%88%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2_1992.jpg"
);
await writeJson(join(DRAFT_DIR, "war-in-abkhazia.generated.json"), abkhazia);

const tajikistan = await readJson(join(DRAFT_DIR, "tajikistani-civil-war.generated.json"));
setImage(
  tajikistan,
  "outcome-and-legacy",
  "https://gdb.rferl.org/01bdb959-9b54-4dd4-a729-0d89fa6489f0_cx0_cy14_cw0_w408_r1_s.jpg"
);
await writeJson(join(DRAFT_DIR, "tajikistani-civil-war.generated.json"), tajikistan);

const georgia = await readJson(join(DRAFT_DIR, "russo-georgian-war.generated.json"));
const finalEvent = georgia.find((item) => item.id === "outcome-and-legacy");
if (!finalEvent?.slides?.[0]) throw new Error("Missing Russo-Georgian outcome-and-legacy event");
const finalSlide = finalEvent.slides[0];
const casualtyNote =
  "The war killed about 850 people in total, including Georgian, Russian, South Ossetian, and civilian victims, and displaced tens of thousands more. Those losses made a five-day war into a lasting national trauma and a durable security rupture.";
finalSlide.body =
  "The Russo-Georgian War ended quickly but changed regional security. Russia entrenched itself in Abkhazia and South Ossetia, Georgia lost control of additional territory, about 850 people were killed, and tens of thousands were displaced. The war became a warning about how frozen conflicts could become instruments of interstate coercion.";
const fullNote = (finalSlide.stats || []).find((stat) => stat.full);
if (fullNote) {
  fullNote.val = "Human cost";
  fullNote.lbl = casualtyNote;
} else {
  finalSlide.stats = [
    ...(finalSlide.stats || []),
    { val: "Human cost", lbl: casualtyNote, full: true },
  ];
}
await writeJson(join(DRAFT_DIR, "russo-georgian-war.generated.json"), georgia);

console.log("Applied final post-Soviet touchups.");
