import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const BACKEND_ROOT = "C:\\Users\\alons\\Terra-Historia-Backend";
const DRAFT_DIR = join(BACKEND_ROOT, "deepdives-drafts");
const INDEX_PATH = join(BACKEND_ROOT, "deepdives-index.json");
const FRONTEND_RELATIONSHIPS_PATH = join(
  process.cwd(),
  "src",
  "constants",
  "deepDiveRelationships.json"
);
const BACKEND_RELATIONSHIPS_PATH = join(
  BACKEND_ROOT,
  "deepdive-relationships.json"
);
const CONNECTION_PREFIX = "From ";
const currentRelationshipData = JSON.parse(
  await readFile(FRONTEND_RELATIONSHIPS_PATH, "utf8")
);
const CONFLICT_GRAPH_NODES = currentRelationshipData.nodes;
const CONFLICT_GRAPH_SIZE = currentRelationshipData.size;
const CONFLICT_RELATIONSHIPS = currentRelationshipData.relationships;
const CONFLICT_RELATIONSHIP_TYPES = currentRelationshipData.types;

const newWars = {
  "finnish-civil-war": ["Finnish Civil War", "1918", 680, 800, "russian-civil-war", "aftermath", "Revolution spreads into newly independent Finland"],
  "estonian-war-of-independence": ["Estonian War of Independence", "1918-1920", 680, 1280, "russian-civil-war", "aftermath", "Imperial collapse and Baltic independence"],
  "lithuanian-soviet-war": ["Lithuanian-Soviet War", "1918-1919", 680, 1450, "russian-civil-war", "aftermath", "Bolshevik advance into Lithuania"],
  "polish-lithuanian-war": ["Polish-Lithuanian War", "1919-1920", 1010, 1450, "lithuanian-soviet-war", "regional", "Competing borders after imperial collapse"],
  "turkish-war-of-independence": ["Turkish War of Independence", "1919-1923", 680, 1620, "wwi-events", "aftermath", "Defeat and partition of the Ottoman Empire"],
  "eastern-front": ["Eastern Front", "1941-1945", 1010, 20, "wwii-events", "regional", "Nazi invasion of the Soviet Union"],
  "soviet-finnish-wars": ["Soviet-Finnish Wars", "1939-1944", 1010, 1280, "winter-war", "regional", "Renewed struggle over Finland and the Soviet frontier"],
  "lapland-war": ["Lapland War", "1944-1945", 1325, 1280, "continuation-war", "aftermath", "Armistice requires Finland to expel Germany"],
  "indonesian-national-revolution": ["Indonesian National Revolution", "1945-1949", 1010, 1620, "wwii-events", "decolonization", "Japanese surrender and the end of Dutch colonial rule"],
  "indochina-wars": ["Indochina Wars", "1946-1991", 1325, 1620, "wwii-events", "decolonization", "Collapse of French colonial authority"],
  "war-in-southern-vietnam": ["War in Southern Vietnam", "1955-1975", 1640, 1620, "indochina-wars", "coldWar", "Partition and insurgency in Vietnam"],
  "rwandan-civil-war": ["Rwandan Civil War", "1990-1994", 1325, 1960, "wwii-events", "decolonization", "Post-colonial division and unresolved refugee crisis"],
  "shaba-ii": ["Shaba II", "1978", 1640, 1960, "rwandan-civil-war", "regional", "Cold War instability in central Africa"],
  "toyota-war": ["Toyota War", "1986-1987", 2270, 1080, "chadian-libyan-war", "regional", "Final campaign against Libya in northern Chad"],
  "croatian-war-of-independence": ["Croatian War of Independence", "1991-1995", 1640, 1280, "wwii-events", "aftermath", "Collapse of Yugoslavia's postwar order"],
  "croat-bosniak-war": ["Croat-Bosniak War", "1992-1994", 1955, 1280, "croatian-war-of-independence", "regional", "Yugoslav dissolution spreads into Bosnia"],
  "kosovo-war": ["Kosovo War", "1998-1999", 2270, 1280, "croat-bosniak-war", "regional", "Unresolved Yugoslav breakup"],
  "transnistria-war": ["Transnistria War", "1990-1992", 1325, 1450, "russian-civil-war", "aftermath", "Soviet collapse reopens territorial divisions"],
  "war-in-abkhazia": ["War in Abkhazia", "1992-1993", 1640, 1450, "transnistria-war", "regional", "Separatism after Soviet collapse"],
  "tajikistani-civil-war": ["Tajikistani Civil War", "1992-1997", 1955, 1450, "transnistria-war", "regional", "Post-Soviet state collapse and factional conflict"],
  "first-chechen-war": ["First Chechen War", "1994-1996", 1325, 20, "russian-civil-war", "aftermath", "Separatism after Soviet collapse"],
  "war-of-dagestan": ["War of Dagestan", "1999", 1640, 20, "first-chechen-war", "regional", "Chechen conflict spreads into Dagestan"],
  "second-chechen-war": ["Second Chechen War", "1999-2009", 1955, 20, "war-of-dagestan", "regional", "Dagestan incursion triggers renewed Russian invasion"],
  "south-lebanon-conflict": ["South Lebanon Conflict", "1985-2000", 2860, 960, "1982-lebanon-war", "regional", "Occupation and resistance after the Lebanon War"],
  "gulf-war": ["Gulf War", "1990-1991", 2580, 725, "iran-iraq-war", "aftermath", "Iraqi debt and militarization after the Iran-Iraq War"],
  "war-on-terrorism": ["War on Terror", "2001-present", 3210, 725, "gulf-war", "aftermath", "US regional presence and transnational militancy"],
  "war-in-afghanistan-2001-2021": ["War in Afghanistan", "2001-2021", 3540, 725, "war-on-terrorism", "regional", "First major campaign of the War on Terror"],
  "iran-israel-proxy-conflict": ["Iran-Israel Proxy Conflict", "1985-present", 2860, 725, "iran-iraq-war", "regional", "Iranian regional networks and shifting power"],
};

const explanations = {
  "finnish-civil-war": "The Russian Revolution destroyed imperial authority in Finland just as the country declared independence. Political polarization, food shortages, and armed Red and White guards then turned the struggle over Finland's new state into civil war.",
  "estonian-war-of-independence": "The Russian Civil War created both the opportunity and the danger for Estonian independence. Estonia declared sovereignty as empires collapsed, but then had to defeat a Bolshevik attempt to restore control.",
  "lithuanian-soviet-war": "Lithuania emerged from the collapse of the Russian Empire, but Soviet forces advanced west during the Russian Civil War. The young republic had to fight immediately to preserve its independence.",
  "polish-lithuanian-war": "Lithuania survived the Soviet offensive, but independence did not settle its borders. Polish and Lithuanian national projects both claimed Vilnius, turning former partners against Bolshevik expansion into rivals.",
  "turkish-war-of-independence": "World War I ended with the Ottoman Empire defeated and Allied powers planning its partition. Turkish nationalists rejected that settlement and fought to establish a sovereign state in Anatolia.",
  "eastern-front": "World War II became a war of annihilation when Nazi Germany invaded the Soviet Union. The resulting Eastern Front consumed the largest armies and produced the greatest losses of the global conflict.",
  "soviet-finnish-wars": "The Winter War was the first part of a longer struggle over Finland's frontier with the Soviet Union. Finland's territorial losses and the wider German-Soviet war led directly to renewed fighting.",
  "lapland-war": "The Continuation War ended with Finland accepting Soviet armistice terms. Those terms required Finland to remove its former German partner from the country, producing a new war in Lapland.",
  "indonesian-national-revolution": "World War II shattered Dutch colonial control and ended with Japan's sudden surrender. Indonesian nationalists used that opening to declare independence and resist the attempted restoration of empire.",
  "indochina-wars": "World War II weakened France and destroyed the old colonial order in Indochina. Vietnamese independence movements then fought France, opening decades of connected regional and Cold War conflicts.",
  "war-in-southern-vietnam": "The Indochina Wars left Vietnam divided after the defeat of France. Rival governments, communist insurgency, and outside intervention transformed the southern struggle into the central battlefield of the Vietnam War.",
  "rwandan-civil-war": "The end of European colonial rule left Rwanda with hardened political divisions and large refugee communities. Decades of exclusion and failed return eventually produced invasion, civil war, and genocide.",
  "shaba-ii": "Post-colonial central Africa remained vulnerable to rebellion, foreign intervention, and Cold War competition. Exiled Katangan fighters invaded Zaire's Shaba Province, drawing in French and Belgian forces.",
  "toyota-war": "The Chadian-Libyan War reached its decisive phase when Chadian forces united against Libya's northern occupation. Highly mobile units broke fortified Libyan positions and forced a retreat.",
  "croatian-war-of-independence": "World War II's aftermath created socialist Yugoslavia, but that federal order collapsed after the Cold War. Croatia's declaration of independence and Serb resistance turned political dissolution into war.",
  "croat-bosniak-war": "The breakup of Yugoslavia spread from Croatia into Bosnia and Herzegovina. Croat and Bosniak forces initially cooperated, then fought one another over territory and competing political projects.",
  "kosovo-war": "The earlier Yugoslav wars did not resolve Kosovo's status or Serbia's treatment of its Albanian majority. Repression, insurgency, and failed negotiations led to another war and NATO intervention.",
  "transnistria-war": "The Soviet collapse reopened questions of borders, language, and identity across former republics. In Moldova, separatists east of the Dniester resisted the new central government and gained Russian military support.",
  "war-in-abkhazia": "Like Transnistria, Abkhazia became a separatist battlefield after Soviet authority disappeared. Competing Georgian and Abkhaz national projects, aided by outside fighters and Russian involvement, produced war and mass displacement.",
  "tajikistani-civil-war": "The Soviet collapse removed the institutions that had contained regional and ideological competition in Tajikistan. Rival factions then fought for control of the newly independent state.",
  "first-chechen-war": "The Russian Empire's violent history in the Caucasus and the Soviet collapse encouraged Chechen separatism. Moscow's attempt to restore federal authority led to a destructive invasion.",
  "war-of-dagestan": "The unresolved First Chechen War left armed Islamist factions operating from Chechnya. Their invasion of neighboring Dagestan attempted to spread rebellion across the North Caucasus.",
  "second-chechen-war": "The Dagestan incursion gave Moscow the immediate reason to invade Chechnya again. Russia returned with greater force and a strategy aimed at permanent federal control.",
  "south-lebanon-conflict": "Israel's 1982 invasion removed the PLO leadership from Beirut but did not end violence in Lebanon. A continuing Israeli security zone and the rise of Hezbollah produced a prolonged conflict in the south.",
  "gulf-war": "The Iran-Iraq War left Iraq militarized, indebted, and economically strained. Saddam Hussein tried to solve those problems and strengthen Iraq's regional position by invading Kuwait.",
  "war-on-terrorism": "The Gulf War expanded the long-term American military presence in the Middle East, which became one grievance used by transnational jihadist groups. After the September 11 attacks, the United States launched a global military campaign.",
  "war-in-afghanistan-2001-2021": "The first major campaign of the War on Terror targeted al-Qaeda and the Taliban government that sheltered it. A rapid intervention became a twenty-year counterinsurgency and state-building war.",
  "iran-israel-proxy-conflict": "The South Lebanon conflict strengthened Hezbollah and tied it closely to Iran's regional strategy. That relationship became one of the central fronts in the wider proxy confrontation between Iran and Israel.",
};

function readJson(path) {
  return readFile(path, "utf8").then((text) => JSON.parse(text.replace(/^\uFEFF/, "")));
}

function firstImage(events) {
  return events.flatMap((event) => event.slides || []).find((slide) => slide.img)?.img || "";
}

function descriptionFor(title, explanation) {
  return `Explore ${title} through its origins, major turning points, international dimension, human cost, and lasting consequences. ${explanation.split(".")[0]}.`;
}

const index = await readJson(INDEX_PATH);
const indexById = new Map(index.map((item) => [item.id, item]));
const nodes = { ...CONFLICT_GRAPH_NODES };
const relationships = [...CONFLICT_RELATIONSHIPS];

for (const [id, [title, years, x, y, parent, type, label]] of Object.entries(newWars)) {
  const path = join(DRAFT_DIR, `${id}.generated.json`);
  const events = await readJson(path);
  const image = firstImage(events);

  nodes[id] = { x, y, years };
  if (!relationships.some((item) => item.from === parent && item.to === id)) {
    relationships.push({ from: parent, to: id, type, label });
  }

  const existing = indexById.get(id);
  const item = {
    id,
    title,
    description: existing?.description || descriptionFor(title, explanations[id]),
    image: existing?.image || image,
  };
  if (existing) Object.assign(existing, item);
  else {
    index.push(item);
    indexById.set(id, item);
  }

  const firstEvent = events[0];
  firstEvent.slides = firstEvent.slides.filter(
    (slide) => !slide.title?.startsWith(CONNECTION_PREFIX)
  );
  firstEvent.slides.unshift({
    title: `${CONNECTION_PREFIX}${indexById.get(parent)?.title || parent} to ${title}`,
    img: indexById.get(parent)?.image || image,
    cap: `Historical connection: ${label}`,
    body: explanations[id],
    stats: [
      { val: indexById.get(parent)?.title || parent, lbl: "Previous conflict in this path" },
      { val: CONFLICT_RELATIONSHIP_TYPES[type].label, lbl: label },
      { val: title, lbl: "The next conflict to explore" },
      { val: "Why they connect", lbl: explanations[id], full: true },
    ],
  });

  await writeFile(path, `${JSON.stringify(events, null, 2)}\n`, "utf8");
}

const relationshipData = {
  size: { ...CONFLICT_GRAPH_SIZE, width: 3900, height: 2200 },
  types: CONFLICT_RELATIONSHIP_TYPES,
  nodes,
  relationships,
};

await writeFile(INDEX_PATH, `${JSON.stringify(index, null, 2)}\n`, "utf8");
await writeFile(FRONTEND_RELATIONSHIPS_PATH, `${JSON.stringify(relationshipData, null, 2)}\n`, "utf8");
await writeFile(BACKEND_RELATIONSHIPS_PATH, `${JSON.stringify(relationshipData, null, 2)}\n`, "utf8");

console.log(`Integrated ${Object.keys(newWars).length} wars.`);
console.log(`Graph now has ${Object.keys(nodes).length} nodes and ${relationships.length} relationships.`);
