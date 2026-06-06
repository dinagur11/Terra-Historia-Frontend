import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const BACKEND_ROOT = "C:\\Users\\alons\\Terra-Historia-Backend";
const DRAFT_DIR = join(BACKEND_ROOT, "deepdives-drafts");
const INDEX_PATH = join(BACKEND_ROOT, "deepdives-index.json");
const RELATIONSHIPS_PATH = join(
  process.cwd(),
  "src",
  "constants",
  "deepDiveRelationships.json"
);
const ROOT_ID = "wwi-events";
const CONNECTION_SLIDE_PREFIX = "From ";
const relationshipData = JSON.parse(await readFile(RELATIONSHIPS_PATH, "utf8"));
const CONFLICT_GRAPH_NODES = relationshipData.nodes;
const CONFLICT_RELATIONSHIPS = relationshipData.relationships;
const CONFLICT_RELATIONSHIP_TYPES = relationshipData.types;

const PREFERRED_FILES = {
  "wwii-events": "wwii-events.json",
  "russian-civil-war": "russian-civil-war.json",
  "spanish-civil-war": "spanish-civil-war.json",
  "winter-war": "winter-war.json",
  "continuation-war": "continuation-war.json",
};

const CONNECTION_EXPLANATIONS = {
  "russian-civil-war":
    "World War I shattered the Russian Empire. Battlefield losses, shortages, and collapsing confidence in the tsar triggered revolution in 1917. Russia's withdrawal from the world war did not bring peace: it opened a struggle between the Bolsheviks, anti-Bolshevik forces, national movements, and foreign armies for control of the former empire.",
  "wwii-events":
    "World War II grew from the unstable peace that followed World War I. The Treaty of Versailles, economic crisis, wounded nationalism, and the failure of collective security gave revisionist powers room to overturn the postwar order. Germany's invasion of Poland transformed those unresolved tensions into another global war.",
  "spanish-civil-war":
    "The Russian Civil War helped turn communism and anti-communism into international political forces. In Spain, those rival visions collided with fascism, republicanism, regional nationalism, and social revolution. Foreign powers treated the Spanish conflict as both an ideological battleground and a test of weapons and tactics.",
  "winter-war":
    "The Soviet Union created by the Russian Civil War emerged as Finland's powerful eastern neighbor. Finland had gained independence during Russia's revolutionary collapse, but the border near Leningrad remained a Soviet security concern. Stalin's demands for territory and bases led directly to the Soviet invasion of Finland in 1939.",
  "continuation-war":
    "World War II created the conditions for Finland to renew its struggle with the Soviet Union. After losing territory in the Winter War, Finland aligned militarily with Germany as Operation Barbarossa began. Finnish leaders sought to recover the lost regions, turning the conflict into the Continuation War.",
  "korean-war":
    "World War II ended Japanese rule over Korea but left the peninsula divided between Soviet and American occupation zones. Two rival Korean states emerged on opposite sides of the 38th parallel. That temporary division hardened into a Cold War frontier and erupted into war when North Korea invaded the South.",
  "1948-arab-israeli-war":
    "World War II transformed the political future of Mandatory Palestine. The Holocaust intensified demands for a Jewish state, Britain withdrew from the mandate, and the United Nations proposed partition. The declaration of Israel and rejection of partition by neighboring Arab states led directly to war in 1948.",
  "sand-war":
    "World War II weakened Europe's colonial empires and accelerated independence across Africa. Algeria and Morocco inherited borders drawn under colonial rule, but disagreed over where sovereignty should lie in the Sahara. Those unresolved territorial claims erupted into the Sand War soon after Algerian independence.",
  "falklands-war":
    "World War II accelerated the decline of European empires but did not resolve every sovereignty dispute. Argentina continued to claim the British-held Falkland Islands, while Britain maintained the islanders' right to remain British. In 1982, Argentina attempted to settle that lingering imperial dispute by force.",
  "vietnam-war":
    "The Korean War established armed containment as a central American Cold War strategy. Leaders in Washington increasingly viewed communist advances in Asia as connected tests of credibility. That lesson shaped the decision to deepen support for South Vietnam and eventually commit large American forces.",
  "suez-crisis":
    "The 1948 Arab-Israeli War left Israel and its Arab neighbors without a durable peace. Border raids, refugee grievances, arms competition, and Egyptian control of strategic waterways sustained the confrontation. When Egypt nationalized the Suez Canal, Israel joined Britain and France in attacking Egypt.",
  "chadian-libyan-war":
    "The Sand War showed how colonial-era borders could fuel conflict between newly independent North African states. Libya later pursued its own territorial claim in northern Chad, especially over the Aouzou Strip. That dispute expanded into years of intervention, proxy warfare, and direct combat.",
  "laotian-civil-war":
    "The Vietnam War spread beyond Vietnam because both sides depended on neighboring territory. North Vietnam used routes through Laos to move troops and supplies, while the United States supported anti-communist forces and conducted a covert air campaign. Laos became an inseparable battlefield of the wider war.",
  "cambodian-civil-war":
    "The Vietnam War destabilized Cambodia as Vietnamese communist forces operated across its border and the United States expanded bombing and ground operations. Domestic political conflict intensified after Prince Sihanouk was removed. The result was a civil war that enabled the Khmer Rouge to seize power.",
  "six-day-war":
    "The Suez Crisis failed to resolve the Arab-Israeli confrontation. Although foreign troops withdrew and peacekeepers entered Sinai, regional rivalry, military buildup, Palestinian raids, and disputes over waterways continued. In 1967, escalating mobilization and fear of attack produced another major war.",
  "third-indochina-war":
    "The Laotian Civil War ended with communist victory, but peace did not settle the rivalries created by decades of conflict across Indochina. Vietnam, Cambodia, China, and their allies soon competed over borders, ideology, and regional influence. Those tensions produced a new series of wars after 1975.",
  "war-of-attrition":
    "The Six-Day War ended quickly but left Israel controlling the Sinai Peninsula, Gaza Strip, West Bank, East Jerusalem, and Golan Heights. Egypt refused to accept the new military balance and sought to make Israeli control of Sinai unbearably costly. Repeated artillery, commando, and air attacks became the War of Attrition.",
  "yom-kippur-war":
    "The War of Attrition ended without returning the territories captured in 1967 or producing a political settlement. Egypt and Syria concluded that another major offensive was necessary to break the deadlock. Their surprise attack on Yom Kippur in 1973 began the next war.",
  "1982-lebanon-war":
    "The Yom Kippur War changed interstate diplomacy in the Middle East, but conflict increasingly shifted toward armed groups and Lebanon. The Palestine Liberation Organization established a powerful presence there, while Lebanon's civil war drew in Israel and Syria. Cross-border attacks and escalation led to Israel's 1982 invasion.",
  "iran-iraq-war":
    "The Yom Kippur War and its aftermath reshaped the Middle Eastern balance of power. Egypt moved toward peace with Israel, oil became a strategic weapon, and regional competition intensified. After Iran's 1979 revolution, Iraq tried to exploit its neighbor's instability and assert leadership by invading Iran.",
};

function buildBfsParents() {
  const adjacency = new Map(
    Object.keys(CONFLICT_GRAPH_NODES).map((id) => [id, []])
  );

  for (const relationship of CONFLICT_RELATIONSHIPS) {
    adjacency.get(relationship.from).push({
      id: relationship.to,
      relationship,
    });
    adjacency.get(relationship.to).push({
      id: relationship.from,
      relationship,
    });
  }

  const parents = new Map();
  const visited = new Set([ROOT_ID]);
  const queue = [ROOT_ID];

  while (queue.length) {
    const current = queue.shift();
    for (const next of adjacency.get(current)) {
      if (visited.has(next.id)) continue;
      visited.add(next.id);
      parents.set(next.id, {
        parentId: current,
        relationship: next.relationship,
      });
      queue.push(next.id);
    }
  }

  return parents;
}

function getDraftFile(id) {
  return PREFERRED_FILES[id] || `${id}.generated.json`;
}

async function readJson(path) {
  const text = await readFile(path, "utf8");
  return JSON.parse(text.replace(/^\uFEFF/, ""));
}

function createConnectionSlide(id, parent, titles, images, explanation) {
  const title = titles[id];
  const parentTitle = titles[parent.parentId];
  const relationshipType =
    CONFLICT_RELATIONSHIP_TYPES[parent.relationship.type].label;

  return {
    title: `${CONNECTION_SLIDE_PREFIX}${parentTitle} to ${title}`,
    img: images[parent.parentId],
    cap: `Historical connection: ${parent.relationship.label}`,
    body: explanation,
    stats: [
      {
        val: parentTitle,
        lbl: "Previous conflict in this path",
      },
      {
        val: relationshipType,
        lbl: parent.relationship.label,
      },
      {
        val: title,
        lbl: "The next conflict to explore",
      },
      {
        val: "Why they connect",
        lbl: explanation,
        full: true,
      },
    ],
  };
}

const index = await readJson(INDEX_PATH);
const titles = Object.fromEntries(index.map((item) => [item.id, item.title]));
const images = Object.fromEntries(index.map((item) => [item.id, item.image]));
const parents = buildBfsParents();
const updated = [];

for (const [id, parent] of parents) {
  const path = join(DRAFT_DIR, getDraftFile(id));
  const events = await readJson(path);
  const firstEvent = events[0];

  if (!firstEvent || !Array.isArray(firstEvent.slides)) {
    throw new Error(`${id} has no first event slides array`);
  }
  const existingConnection = firstEvent.slides.find(
    (slide) =>
      slide.title?.startsWith(CONNECTION_SLIDE_PREFIX) &&
      slide.stats?.some((stat) => stat.lbl === "Previous conflict in this path")
  );
  const explanation = CONNECTION_EXPLANATIONS[id] || existingConnection?.body;

  if (!explanation) {
    throw new Error(`Missing connection explanation for ${id}`);
  }

  firstEvent.slides = firstEvent.slides.filter(
    (slide) => !slide.title?.startsWith(CONNECTION_SLIDE_PREFIX)
  );
  firstEvent.slides.unshift(
    createConnectionSlide(id, parent, titles, images, explanation)
  );

  await writeFile(path, `${JSON.stringify(events, null, 2)}\n`, "utf8");
  updated.push({
    id,
    file: getDraftFile(id),
    parent: parent.parentId,
  });
}

console.log(JSON.stringify(updated, null, 2));
