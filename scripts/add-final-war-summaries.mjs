import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const BACKEND_ROOT = "C:\\Users\\alons\\Terra-Historia-Backend";
const DRAFT_DIR = join(BACKEND_ROOT, "deepdives-drafts");
const INDEX_PATH = join(BACKEND_ROOT, "deepdives-index.json");
const SUMMARY_PREFIX = "War Summary:";

const PREFERRED_FILES = {
  "wwi-events": "wwi-events.json",
  "wwii-events": "wwii-events.json",
  "russian-civil-war": "russian-civil-war.json",
  "spanish-civil-war": "spanish-civil-war.json",
  "winter-war": "winter-war.json",
  "continuation-war": "continuation-war.json",
};

const WAR_SUMMARIES = {
  "wwi-events": {
    sideA: ["Allied Powers", "~22 million military casualties"],
    sideB: ["Central Powers", "~15 million military casualties"],
    outcome: "Allied victory",
    body: "The armistice ended the fighting, but the peace dismantled empires, redrew borders, and left political and economic wounds that shaped the rest of the twentieth century.",
  },
  "wwii-events": {
    sideA: ["Allied Powers", "~16 million military deaths"],
    sideB: ["Axis Powers", "~8 million military deaths"],
    outcome: "Allied victory",
    body: "The Axis powers were defeated and occupied, the Holocaust was exposed, and the United States and Soviet Union emerged as rival superpowers in a transformed international order.",
  },
  "russian-civil-war": {
    sideA: ["Red forces", "~1 million military casualties"],
    sideB: ["White and opposing forces", "~1.5 million military casualties"],
    outcome: "Bolshevik victory",
    body: "The Bolsheviks secured the core of the former Russian Empire and founded the Soviet Union, but famine, disease, repression, and combat killed millions beyond the battlefield.",
  },
  "spanish-civil-war": {
    sideA: ["Republican forces", "~110,000 battlefield deaths"],
    sideB: ["Nationalist forces", "~90,000 battlefield deaths"],
    outcome: "Nationalist victory",
    body: "Franco's victory destroyed the Spanish Republic and established a dictatorship that lasted until 1975. The war also became a warning of the wider conflict soon to engulf Europe.",
  },
  "winter-war": {
    sideA: ["Finland", "~70,000 military casualties"],
    sideB: ["Soviet Union", "~320,000-380,000 military casualties"],
    outcome: "Soviet territorial victory",
    body: "Finland preserved its independence but ceded significant territory. The Soviet Union won its territorial demands at enormous cost, while Finland prepared for the possibility of renewed war.",
  },
  "continuation-war": {
    sideA: ["Finland and Germany", "~70,000 Finnish military casualties"],
    sideB: ["Soviet Union", "~250,000 military casualties"],
    outcome: "Soviet victory",
    body: "Finland accepted an armistice, restored the post-Winter War border with further concessions, and expelled German forces. It survived as an independent democracy under strong Soviet pressure.",
  },
  "korean-war": {
    sideA: ["South Korea and UN", "~780,000 military casualties"],
    sideB: ["North Korea and China", "~1.5 million military casualties"],
    outcome: "Armistice and stalemate",
    body: "The fighting ended near the original dividing line rather than with a peace treaty. Korea remained divided, heavily armed, and central to East Asian security.",
  },
  "1948-arab-israeli-war": {
    sideA: ["Israel", "~6,400 killed"],
    sideB: ["Arab armies and Palestinians", "~10,000-15,000 killed"],
    outcome: "Israeli victory",
    body: "Israel survived and expanded beyond the proposed UN partition borders. The war also created a major Palestinian refugee crisis and left the Arab-Israeli conflict unresolved.",
  },
  "suez-crisis": {
    sideA: ["Egypt", "~1,650-3,000 killed"],
    sideB: ["Israel, Britain, and France", "~230 killed"],
    outcome: "Egyptian strategic victory",
    body: "The invading forces achieved rapid military gains but withdrew under international pressure. Egypt retained the canal, while British and French imperial influence suffered a decisive blow.",
  },
  "sand-war": {
    sideA: ["Algeria", "Hundreds killed, wounded, or captured"],
    sideB: ["Morocco", "Hundreds killed, wounded, or captured"],
    outcome: "Ceasefire; no decisive winner",
    body: "Regional mediation stopped the fighting without fully resolving the border dispute. The conflict left a lasting rivalry between Algeria and Morocco.",
  },
  "falklands-war": {
    sideA: ["United Kingdom", "255 military deaths"],
    sideB: ["Argentina", "649 military deaths"],
    outcome: "British victory",
    body: "British forces retook the islands after a distant naval and amphibious campaign. The defeat accelerated the collapse of Argentina's military dictatorship.",
  },
  "vietnam-war": {
    sideA: ["South Vietnam, US, and allies", "~1.1 million military deaths"],
    sideB: ["North Vietnam and Viet Cong", "~1.1 million military deaths"],
    outcome: "North Vietnamese victory",
    body: "The fall of Saigon ended South Vietnam and unified the country under communist rule. The war profoundly changed American foreign policy and devastated Vietnam, Laos, and Cambodia.",
  },
  "chadian-libyan-war": {
    sideA: ["Chad and allies", "~1,000 killed"],
    sideB: ["Libya and allied forces", "~7,500 killed or captured"],
    outcome: "Chadian victory",
    body: "Highly mobile Chadian forces defeated Libya's better-equipped army and ended its occupation of most contested territory. The Aouzou Strip was later awarded to Chad.",
  },
  "laotian-civil-war": {
    sideA: ["Royal Lao and allied forces", "Tens of thousands killed"],
    sideB: ["Pathet Lao and North Vietnam", "Tens of thousands killed"],
    outcome: "Pathet Lao victory",
    body: "The communist Pathet Lao took power in 1975 as the wider Indochina wars ended. Laos emerged deeply scarred by displacement, unexploded ordnance, and years of covert warfare.",
  },
  "cambodian-civil-war": {
    sideA: ["Khmer Republic and allies", "~200,000 killed"],
    sideB: ["Khmer Rouge and allies", "~50,000 killed"],
    outcome: "Khmer Rouge victory",
    body: "Phnom Penh fell to the Khmer Rouge in 1975. Their victory did not bring peace; it opened one of the twentieth century's most catastrophic genocidal regimes.",
  },
  "six-day-war": {
    sideA: ["Israel", "776-983 killed"],
    sideB: ["Arab coalition", "~13,000-18,000 killed"],
    outcome: "Israeli victory",
    body: "Israel captured the Sinai Peninsula, Gaza Strip, West Bank, East Jerusalem, and Golan Heights. The dramatic territorial changes reshaped every later stage of the conflict.",
  },
  "third-indochina-war": {
    sideA: ["Vietnam and allied forces", "~100,000+ military deaths"],
    sideB: ["China, Khmer Rouge, and allies", "~50,000+ military deaths"],
    outcome: "No single decisive winner",
    body: "Vietnam removed the Khmer Rouge but faced a Chinese invasion and a long occupation of Cambodia. The interconnected conflicts faded only after years of diplomacy and withdrawal.",
  },
  "war-of-attrition": {
    sideA: ["Israel", "~1,400 killed"],
    sideB: ["Egypt and allies", "~10,000 killed"],
    outcome: "Ceasefire; no decisive winner",
    body: "Egypt failed to force an Israeli withdrawal from Sinai, while Israel could not turn military superiority into a lasting settlement. The unresolved confrontation led toward the 1973 war.",
  },
  "yom-kippur-war": {
    sideA: ["Israel", "2,656 killed"],
    sideB: ["Arab coalition", "~8,000-18,000 killed"],
    outcome: "Inconclusive military result",
    body: "Israel recovered from the surprise attack and gained battlefield leverage, but Egypt restored political credibility. The war ultimately opened the path to Egyptian-Israeli peace.",
  },
  "1982-lebanon-war": {
    sideA: ["Israel", "654 military deaths"],
    sideB: ["PLO, Syria, and allied forces", "~9,000 combatants killed"],
    outcome: "Israeli tactical victory; strategic stalemate",
    body: "The PLO leadership left Beirut, but Lebanon remained unstable and Israeli forces became trapped in a prolonged conflict that helped fuel the rise of Hezbollah.",
  },
  "iran-iraq-war": {
    sideA: ["Iran", "~500,000-750,000 casualties"],
    sideB: ["Iraq", "~375,000-500,000 casualties"],
    outcome: "Ceasefire; no decisive winner",
    body: "Eight years of invasion, attrition, chemical warfare, and attacks on cities ended without major territorial change. Both states were exhausted, indebted, and deeply scarred.",
  },
};

async function readJson(path) {
  const text = await readFile(path, "utf8");
  return JSON.parse(text.replace(/^\uFEFF/, ""));
}

function getDraftFile(id) {
  return PREFERRED_FILES[id] || `${id}.generated.json`;
}

function findClosingImage(events, fallback) {
  for (let eventIndex = events.length - 1; eventIndex >= 0; eventIndex -= 1) {
    const slides = events[eventIndex].slides || [];
    for (let slideIndex = slides.length - 1; slideIndex >= 0; slideIndex -= 1) {
      if (slides[slideIndex].img) return slides[slideIndex].img;
    }
  }
  return fallback;
}

function createSummarySlide(title, summary, image) {
  return {
    title: `${SUMMARY_PREFIX} ${title}`,
    img: image,
    cap: `The end and legacy of the ${title}`,
    body: summary.body,
    stats: [
      {
        val: summary.sideA[1],
        lbl: `${summary.sideA[0]} casualties, approximate`,
      },
      {
        val: summary.sideB[1],
        lbl: `${summary.sideB[0]} casualties, approximate`,
      },
      {
        val: summary.outcome,
        lbl: "Outcome / winner",
      },
      {
        val: "Final assessment",
        lbl: summary.body,
        full: true,
      },
    ],
  };
}

const index = await readJson(INDEX_PATH);
const updated = [];

for (const item of index) {
  const summary = WAR_SUMMARIES[item.id];
  if (!summary) throw new Error(`Missing war summary for ${item.id}`);

  const file = getDraftFile(item.id);
  const path = join(DRAFT_DIR, file);
  const events = await readJson(path);
  const lastEvent = events.at(-1);

  if (!lastEvent || !Array.isArray(lastEvent.slides)) {
    throw new Error(`${item.id} has no final event slides array`);
  }

  lastEvent.slides = lastEvent.slides.filter(
    (slide) => !slide.title?.startsWith(SUMMARY_PREFIX)
  );
  lastEvent.slides.push(
    createSummarySlide(item.title, summary, findClosingImage(events, item.image))
  );

  await writeFile(path, `${JSON.stringify(events, null, 2)}\n`, "utf8");
  updated.push({ id: item.id, file, outcome: summary.outcome });
}

console.log(JSON.stringify(updated, null, 2));
