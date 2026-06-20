import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = "C:\\Users\\alons\\Terra-Historia-Backend";
const DIR = join(ROOT, "deepdives-drafts");
const INDEX = join(ROOT, "deepdives-index.json");

async function load(name) {
  return JSON.parse(await readFile(join(DIR, name), "utf8"));
}

async function save(name, value) {
  await writeFile(join(DIR, name), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function event(events, id) {
  const found = events.find((item) => item.id === id);
  if (!found) throw new Error(`Missing event ${id}`);
  return found;
}

function setDate(item, date) {
  item.date = date;
  item.year = Number(date.slice(0, 4));
}

const datedOverviewFixes = {
  "lithuanian-soviet-war.generated.json": ["lithuanian-soviet-war", "1918-12-12"],
  "polish-lithuanian-war.generated.json": ["polish-lithuanian-war", "1919-05-01"],
  "sand-war.generated.json": ["sand-war", "1963-09-25"],
  "soviet-finnish-wars.generated.json": ["soviet-finnish-wars", "1939-11-30"],
};

for (const [file, [id, date]] of Object.entries(datedOverviewFixes)) {
  const events = await load(file);
  setDate(event(events, id), date);
  await save(file, events);
}

{
  const events = await load("croat-bosniak-war.generated.json");
  const vrbanja = events.find((item) => item.id === "q16781947");
  if (vrbanja) vrbanja.id = "vrbanja-massacre";
  await save("croat-bosniak-war.generated.json", events);
}

{
  const events = await load("first-chechen-war.generated.json");
  const grozny = events.filter((item) => item.id === "battle-of-grozny");
  if (grozny.length === 3) {
    grozny[0].id = "november-1994-battle-of-grozny";
    grozny[0].title = "November 1994 Battle of Grozny";
    setDate(grozny[0], "1994-11-26");
    grozny[1].id = "first-battle-of-grozny";
    grozny[1].title = "First Battle of Grozny";
    setDate(grozny[1], "1994-12-31");
    grozny[2].id = "august-1996-battle-of-grozny";
    grozny[2].title = "August 1996 Battle of Grozny";
    setDate(grozny[2], "1996-08-06");
    await save("first-chechen-war.generated.json", events);
  }
}

{
  const events = await load("iran-israel-proxy-conflict.generated.json");
  const lebanon = events.find((item) =>
    ["lebanese-civil-war", "formation-of-hezbollah"].includes(item.id),
  );
  if (lebanon) {
    lebanon.id = "formation-of-hezbollah";
    lebanon.title = "Formation of Hezbollah";
    lebanon.sub = "Part of Iran-Israel Proxy Conflict";
    setDate(lebanon, "1985-02-16");
    lebanon.slides[0].title = "Formation of Hezbollah";
    lebanon.slides[0].body =
      "Hezbollah emerged during the Lebanese Civil War with extensive Iranian support and published its open letter in February 1985. The organization opposed Israel's presence in Lebanon and became Iran's most powerful regional partner, creating the principal armed front of the Iran-Israel proxy conflict.";
    lebanon.slides[0].stats = [
      { val: "16 Feb 1985", lbl: "Hezbollah publishes its open letter" },
      { val: "Iranian support", lbl: "Training, financing, and weapons" },
    ];
  }
  const syria = event(events, "iran-israel-conflict-during-the-syrian-civil-war");
  setDate(syria, "2013-01-30");
  syria.year = 2013;
  const current = events.indexOf(syria);
  events.splice(current, 1);
  const insertBefore = events.findIndex((item) => item.id === "may-2018-israel-syria-clashes");
  events.splice(insertBefore, 0, syria);
  await save("iran-israel-proxy-conflict.generated.json", events);
}

{
  const image =
    "https://upload.wikimedia.org/wikipedia/commons/f/f9/RE-OCCUPATION_OF_FRENCH_INDO-CHINA.jpg";
  const view = { center: [10.82, 106.63], zoom: 5 };
  const make = (id, date, title, body, stats) => ({
    id,
    year: Number(date.slice(0, 4)),
    date,
    title,
    sub: "Part of War in Southern Vietnam (1945-1946)",
    view,
    markers: [],
    regions: [],
    slides: [
      {
        title,
        img: image,
        cap: `Historical overview: ${title}`,
        body,
        stats,
      },
    ],
  });
  const full = (val, lbl) => ({ val, lbl, full: true });
  const events = [
    make(
      "origins-and-background",
      "1945-08-15",
      "From World War II to War in Southern Vietnam",
      "Japan's surrender ended its occupation of Indochina and created a struggle over who would govern Vietnam. Under Allied arrangements, British-Indian forces entered the south to accept the Japanese surrender, while France sought to restore colonial rule and Vietnamese independence movements tried to consolidate power.",
      [
        { val: "World War II", lbl: "Previous conflict in this path" },
        { val: "23 Sep 1945-30 Mar 1946", lbl: "Conflict period" },
        full(
          "The immediate question was whether France would reoccupy southern Vietnam or Vietnamese independence forces could prevent colonial rule from returning.",
          "What was at stake",
        ),
      ],
    ),
    make(
      "british-indian-arrival",
      "1945-09-13",
      "British-Indian Forces Arrive in Saigon",
      "Major-General Douglas Gracey's British-Indian force arrived to accept the Japanese surrender, maintain order, and assist Allied prisoners. It entered a politically fractured city where Vietnamese groups had already proclaimed independence and French authority had collapsed.",
      [
        { val: "13 Sep 1945", lbl: "Allied troops arrive" },
        { val: "20th Indian Division", lbl: "Principal British formation" },
      ],
    ),
    make(
      "french-coup-in-saigon",
      "1945-09-23",
      "French Reoccupation of Saigon",
      "French troops, including recently released prisoners of war, displaced Vietnamese authorities from key positions in Saigon. The action on 23 September triggered the Southern Resistance War and fighting around the city.",
      [
        { val: "23 Sep 1945", lbl: "War begins" },
        { val: "Saigon", lbl: "Opening battlefield" },
      ],
    ),
    make(
      "siege-and-gateforce",
      "1945-10-29",
      "Siege Fighting and Gateforce",
      "Vietnamese forces attacked roads and infrastructure around Saigon while British-Indian, French, and rearmed Japanese troops conducted patrols and clearing operations. Gateforce pushed resistance units farther from the city but could not end the wider independence struggle.",
      [
        { val: "British, French, and Japanese troops", lbl: "Forces fighting the Viet Minh" },
        { val: "29 Oct 1945", lbl: "Gateforce operation begins" },
      ],
    ),
    make(
      "british-withdrawal",
      "1946-03-30",
      "British Withdrawal",
      "The last main British-Indian battalions departed on 30 March 1946 after handing responsibility to France. French forces had reoccupied southern Vietnam, while the Viet Minh withdrew toward the countryside and continued resistance.",
      [
        { val: "30 Mar 1946", lbl: "Campaign ends" },
        { val: "Franco-British victory", lbl: "Immediate military result" },
      ],
    ),
    make(
      "conflict-summary",
      "1946-03-30",
      "Conflict Summary: War in Southern Vietnam",
      "British-Indian, French, and Japanese forces defeated the immediate resistance around Saigon and enabled France to reoccupy the south. The victory did not restore lasting colonial stability: violence continued, Vietnamese political factions fractured, and the First Indochina War began later in 1946.",
      [
        { val: "Franco-British victory", lbl: "Outcome / winner" },
        { val: "British estimate: about 2,700 Vietnamese resistance fighters killed", lbl: "Human cost" },
        full(
          "The campaign restored French control in southern Vietnam but helped set the stage for the much larger First Indochina War.",
          "Final assessment",
        ),
      ],
    ),
  ];
  await save("war-in-southern-vietnam.generated.json", events);
}

{
  const events = await load("wwii-events.json");
  for (const item of events) {
    for (const slide of item.slides || []) {
      slide.stats = (slide.stats || []).filter(
        (stat) => stat.val !== "1M+" || !/Projected Allied casualties avoided/i.test(stat.lbl),
      );
    }
  }
  await save("wwii-events.json", events);
}

{
  const index = JSON.parse(await readFile(INDEX, "utf8"));
  const southern = index.find((item) => item.id === "war-in-southern-vietnam");
  if (southern) {
    southern.title = "War in Southern Vietnam (1945-1946)";
    southern.description =
      "Explore the British-Indian and French campaign that restored colonial control in southern Vietnam after Japan's surrender and helped lead into the First Indochina War.";
    southern.image =
      "https://upload.wikimedia.org/wikipedia/commons/f/f9/RE-OCCUPATION_OF_FRENCH_INDO-CHINA.jpg";
  }
  await writeFile(INDEX, `${JSON.stringify(index, null, 2)}\n`, "utf8");
}

{
  const index = JSON.parse(await readFile(INDEX, "utf8"));
  const images = new Map(index.map((item) => [item.id, item.image]));
  const files = (await readdir(DIR)).filter(
    (file) => file.endsWith(".json") && !file.startsWith("candidate-"),
  );
  for (const file of files) {
    const events = await load(file);
    if (!Array.isArray(events)) continue;
    const id = file.replace(/\.generated\.json$|\.json$/, "");
    const fallback = images.get(id);
    let changed = false;
    for (const item of events) {
      const eventImage = (item.slides || []).find((slide) => slide.img)?.img || fallback;
      if (!eventImage) continue;
      for (const slide of item.slides || []) {
        if (!slide.img) {
          slide.img = eventImage;
          changed = true;
        }
      }
    }
    if (changed) await save(file, events);
  }
}

{
  const files = (await readdir(DIR)).filter(
    (file) => file.endsWith(".json") && !file.startsWith("candidate-"),
  );
  const unsupported = [
    "marked an important episode",
    "was more than an isolated engagement",
    "helped define the conflict's direction",
    "reflected the changing balance of power",
    "Its place in the wider campaign also influenced later military choices and political calculations",
    "The opening phase established the political goals, alliances, and military problems that shaped every later campaign",
  ];
  const generatedDraftReplacements = {
    "anglo-iraqi-war.generated.json/conflict-at-rutbah":
      "British and Transjordanian forces captured Rutbah Fort in May 1941, securing an important desert route between Transjordan and Iraq during the campaign against Rashid Ali's government.",
    "lithuanian-wars-of-independence.generated.json/lithuanian-soviet-war":
      "Lithuanian and German volunteer forces stopped the Soviet advance before Kaunas and gradually pushed Soviet forces out, preserving the new Lithuanian state.",
    "lithuanian-wars-of-independence.generated.json/polish-lithuanian-war":
      "The conflict left Vilnius under Polish control and produced a diplomatic rupture that lasted until Poland's 1938 ultimatum to Lithuania.",
    "lithuanian-wars-of-independence.generated.json/lithuanian-bermontian-war":
      "Lithuanian forces defeated the West Russian Volunteer Army at Radviliskis in November 1919, accelerating the Bermontians' withdrawal from Lithuania.",
  };
  for (const file of files) {
    const events = await load(file);
    if (!Array.isArray(events)) continue;
    let changed = false;
    for (const item of events) {
      if (item.sub === "Generated overview draft") {
        item.sub = `Overview of ${item.title}`;
        changed = true;
      }
      for (const slide of item.slides || []) {
        if (/^Generated draft\./i.test(slide.body || "")) {
          slide.body =
            generatedDraftReplacements[`${file}/${item.id}`] ||
            `This event formed part of ${item.sub?.replace(/^Part of /, "") || item.title}.`;
          slide.stats = (slide.stats || []).filter(
            (stat) => stat.lbl !== "Wikidata" && stat.val !== "Wikidata",
          );
          changed = true;
        }
        let cleaned = slide.body || "";
        cleaned = cleaned
          .replace(
            /[^.\n]+ was more than an isolated engagement\. It (?:helped define the conflict's direction and exposed the strengths and weaknesses of the opposing sides|reflected the changing balance of power and pushed the conflict closer to its eventual outcome)\.\s*/gi,
            "",
          )
          .replace(
            /Its place in the wider campaign also influenced later military choices and political calculations\.\s*/gi,
            "",
          )
          .replace(
            /The opening phase established the political goals, alliances, and military problems that shaped every later campaign\.\s*/gi,
            "",
          )
          .trim();
        if (cleaned && cleaned !== slide.body) {
          slide.body = cleaned;
          changed = true;
        }
        const paragraphs = (slide.body || "").split(/\n\n+/).map((part) => part.trim());
        const filtered = paragraphs.filter(
          (part) => !unsupported.some((phrase) => part.includes(phrase)),
        );
        if (filtered.length && filtered.join("\n\n") !== slide.body) {
          slide.body = filtered.join("\n\n");
          changed = true;
        }
      }
    }
    if (changed) await save(file, events);
  }
}

console.log("Applied verified factual corrections to high-risk deep-dive data.");
