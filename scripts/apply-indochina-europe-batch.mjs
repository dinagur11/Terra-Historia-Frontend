import { existsSync } from "node:fs";
import { readFile, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";

const BACKEND_ROOT = "C:\\Users\\alons\\Terra-Historia-Backend";
const DRAFT_DIR = join(BACKEND_ROOT, "deepdives-drafts");
const INDEX_PATH = join(BACKEND_ROOT, "deepdives-index.json");
const BACKEND_RELATIONSHIPS_PATH = join(BACKEND_ROOT, "deepdive-relationships.json");
const FRONTEND_RELATIONSHIPS_PATH = join(process.cwd(), "src", "constants", "deepDiveRelationships.json");
const REMOVED_IDS = ["rwandan-civil-war", "shaba-ii", "war-in-southern-vietnam"];

const markerSets = {
  "indochina-wars": {
    "origins-and-road-to-war": [
      m("Hanoi", [21.0278, 105.8342], "target", "The Viet Minh proclaimed the Democratic Republic of Vietnam in Hanoi after Japan's surrender."),
      m("Saigon", [10.8231, 106.6297], "major", "British arrival and French reoccupation made Saigon the opening battlefield of the postwar conflict."),
      m("Phnom Penh", [11.5564, 104.9282], "major", "Cambodia's political future became part of the connected struggle over French Indochina."),
    ],
    "british-indian-arrival": [
      m("Saigon", [10.8231, 106.6297], "target", "Major-General Douglas Gracey's 20th Indian Division entered a city where Vietnamese authorities had already declared independence."),
      m("Tân Sơn Nhất airfield", [10.8188, 106.6519], "major", "The airfield was a principal Allied entry and logistics point."),
    ],
    "french-coup-in-saigon": [
      m("Central Saigon", [10.7769, 106.7009], "target", "French troops displaced Vietnamese authorities from key buildings on 23 September 1945."),
      m("Saigon-Cholon", [10.755, 106.66], "major", "Resistance and communal violence spread through the wider urban area."),
    ],
    "siege-and-gateforce": [
      m("Saigon", [10.8231, 106.6297], "major", "Vietnamese forces tried to isolate the Allied-held city through attacks on roads and infrastructure."),
      m("Biên Hòa", [10.9447, 106.8243], "target", "Gateforce pushed northeast from Saigon toward Biên Hòa and surrounding resistance positions."),
      m("Thủ Dầu Một", [10.9804, 106.6519], "major", "Road-clearing operations expanded the British-French perimeter north of Saigon."),
    ],
    "british-withdrawal": [
      m("Saigon", [10.8231, 106.6297], "target", "The final main British-Indian units departed after transferring responsibility to France."),
      m("Southern countryside", [10.6, 106.4], "major", "Vietnamese resistance moved away from the city and continued against restored French colonial power."),
    ],
    "first-indochina-war": [
      m("Hanoi", [21.0278, 105.8342], "major", "Fighting in Hanoi in December 1946 opened the full war between France and the Viet Minh."),
      m("Việt Bắc", [22.15, 105.85], "major", "The northern base area allowed the Viet Minh to survive French offensives and build a regular army."),
      m("Điện Biên Phủ", [21.386, 103.016], "target", "The 1954 French defeat forced negotiations and ended the colonial war."),
      m("Geneva", [46.2044, 6.1432], "minor", "The Geneva Conference ended French Indochina and temporarily divided Vietnam."),
    ],
    "cambodian-civil-war": [
      m("Phnom Penh", [11.5564, 104.9282], "target", "The Khmer Republic defended an increasingly isolated capital until its fall in 1975."),
      m("Kampong Cham", [11.9934, 105.4635], "major", "Fighting along the Mekong corridor threatened the capital's supply routes."),
      m("Eastern Cambodia", [12.0, 106.5], "major", "North Vietnamese bases, US bombing, and Khmer Rouge expansion overlapped in the east."),
    ],
    "third-indochina-war": [
      m("Phnom Penh", [11.5564, 104.9282], "target", "Vietnam captured Phnom Penh in 1979 and removed the Khmer Rouge government."),
      m("Vietnam-Cambodia border", [11.6, 106.1], "major", "Khmer Rouge raids and Vietnamese retaliation escalated into full invasion."),
      m("Lạng Sơn", [21.8537, 106.761], "major", "China attacked northern Vietnam in 1979, making the regional war openly interstate."),
      m("Thai-Cambodian border", [13.6, 102.6], "major", "Khmer Rouge and coalition forces operated from border sanctuaries during the prolonged occupation war."),
    ],
    "international-and-human-dimensions": [
      m("Điện Biên Phủ", [21.386, 103.016], "major", "French colonial defeat opened the era of direct Cold War competition in Indochina."),
      m("Plain of Jars", [19.45, 103.15], "major", "Laos became one of the world's most heavily bombed landscapes."),
      m("Phnom Penh", [11.5564, 104.9282], "target", "Civil war, Khmer Rouge rule, genocide, Vietnamese invasion, and occupation devastated Cambodia."),
      m("Ho Chi Minh City", [10.8231, 106.6297], "major", "The fall of Saigon ended one war but did not end conflict across Indochina."),
    ],
    "outcome-and-legacy": [
      m("Hanoi", [21.0278, 105.8342], "target", "Vietnam emerged unified under communist rule after defeating France and South Vietnam."),
      m("Ho Chi Minh City", [10.8231, 106.6297], "major", "Former Saigon symbolizes the end of South Vietnam and national reunification."),
      m("Phnom Penh", [11.5564, 104.9282], "major", "Cambodia's wars left genocide, occupation, and a long international settlement process."),
      m("Vientiane", [17.9757, 102.6331], "major", "Communist victory in Laos was followed by displacement and the enduring danger of unexploded ordnance."),
    ],
  },
  "polish-soviet-war": {
    "origins-and-background": [
      m("Warsaw", [52.2297, 21.0122], "target", "The restored Polish state sought defensible borders and a federation of states east of Poland."),
      m("Minsk", [53.9006, 27.559], "major", "Belarusian lands became a central contested corridor between Poland and Soviet Russia."),
      m("Kyiv", [50.4501, 30.5234], "major", "Poland's alliance with the Ukrainian People's Republic made Ukraine a major theater of the war."),
    ],
    "first-clashes": [
      m("Mosty", [53.412, 24.538], "target", "Polish and Soviet forces met as German occupation troops withdrew from the borderlands."),
      m("Bereza Kartuska", [52.531, 24.978], "major", "The commonly cited first clash occurred near Bereza Kartuska in February 1919."),
    ],
    "kiev-offensive": [
      m("Zhytomyr", [50.2547, 28.6587], "major", "Polish-Ukrainian forces advanced rapidly through western Ukraine."),
      m("Kyiv", [50.4501, 30.5234], "target", "The allies entered Kyiv but failed to destroy the retreating Soviet armies."),
    ],
    "soviet-counteroffensive": [
      m("Kyiv", [50.4501, 30.5234], "major", "Soviet forces retook Kyiv and drove the Polish-Ukrainian army westward."),
      m("Minsk", [53.9006, 27.559], "major", "The Western Front advanced through Belarus toward Poland."),
      m("Brest", [52.0976, 23.7341], "target", "The Soviet capture of Brest opened the direct approaches toward Warsaw."),
    ],
    "battle-of-warsaw": [
      m("Warsaw", [52.2297, 21.0122], "target", "The capital was the strategic objective of the Soviet Western Front."),
      m("Radzymin", [52.4159, 21.1842], "major", "Heavy fighting northeast of Warsaw tested the Polish defensive line."),
      m("Wieprz River", [51.55, 22.25], "major", "Piłsudski's counterstroke from the Wieprz struck the exposed Soviet flank."),
    ],
    "battle-of-niemen": [
      m("Grodno", [53.6694, 23.8131], "target", "The Niemen campaign centered on crossings and maneuver around Grodno."),
      m("Lida", [53.8874, 25.3027], "major", "Polish forces threatened Soviet communications and forced a further retreat."),
    ],
    "treaty-of-riga": [m("Riga", [56.9496, 24.1052], "target", "Poland, Soviet Russia, and Soviet Ukraine signed the peace treaty establishing the new frontier.")],
    "conflict-summary": [
      m("Warsaw", [52.2297, 21.0122], "target", "The defense of Warsaw preserved the restored Polish state and reversed Soviet momentum."),
      m("Kyiv", [50.4501, 30.5234], "major", "The failed federation project left Poland's Ukrainian ally outside the final settlement."),
      m("Riga", [56.9496, 24.1052], "major", "The treaty divided Ukrainian and Belarusian lands and shaped Eastern Europe until World War II."),
    ],
  },
  "algerian-war": {
    "origins-and-background": [
      m("Sétif", [36.1911, 5.4137], "major", "The 1945 demonstrations and massacres convinced many nationalists that reform under French rule had failed."),
      m("Algiers", [36.7538, 3.0588], "target", "The colonial capital concentrated political authority, settler power, and later urban insurgency."),
      m("Aurès Mountains", [35.5, 6.2], "major", "The mountainous Aurès became an early FLN stronghold."),
    ],
    "toussaint-rouge": [
      m("Aurès Mountains", [35.5, 6.2], "target", "The largest concentration of coordinated FLN attacks occurred in the Aurès region."),
      m("Batna", [35.5559, 6.1741], "major", "Attacks around Batna announced the opening of nationwide armed revolt."),
      m("Kabylie", [36.55, 4.5], "major", "Kabylie became another major zone of insurgent organization and French counterinsurgency."),
    ],
    "philippeville": [
      m("Philippeville / Skikda", [36.8762, 6.9092], "target", "FLN attacks in and around Philippeville killed settlers and Muslim civilians."),
      m("El Halia", [36.89, 7.05], "major", "The massacre at the mining settlement was followed by massive French reprisals across the region."),
    ],
    "battle-of-algiers": [
      m("Casbah", [36.786, 3.06], "target", "The FLN's urban network operated from the dense Casbah while French forces imposed systematic searches and arrests."),
      m("European quarter", [36.765, 3.055], "major", "Bombings targeted cafés and public places in the European city."),
      m("Villa Susini", [36.742, 3.05], "major", "French forces used detention and torture sites to dismantle the FLN network."),
    ],
    "1958-crisis": [
      m("Government-General, Algiers", [36.773, 3.059], "target", "Settlers and officers seized the political initiative and demanded de Gaulle's return."),
      m("Paris", [48.8566, 2.3522], "major", "The Algerian crisis collapsed the Fourth Republic and created the Fifth Republic."),
    ],
    "self-determination": [
      m("Paris", [48.8566, 2.3522], "target", "De Gaulle publicly accepted Algerian self-determination from the French presidency."),
      m("Algiers", [36.7538, 3.0588], "major", "The policy shift intensified resistance among hardline settlers and parts of the army."),
    ],
    "evian-accords": [
      m("Évian-les-Bains", [46.401, 6.59], "target", "French and Algerian representatives negotiated the ceasefire and transition to independence."),
      m("Algiers", [36.7538, 3.0588], "major", "The ceasefire was followed by OAS violence, population flight, and independence."),
    ],
    "conflict-summary": [
      m("Algiers", [36.7538, 3.0588], "target", "Algiers represents colonial rule, urban insurgency, torture, settler politics, and the final transfer of power."),
      m("Aurès Mountains", [35.5, 6.2], "major", "The war began and persisted through rural guerrilla zones such as the Aurès."),
      m("Évian-les-Bains", [46.401, 6.59], "minor", "The accords ended formal hostilities and opened the path to Algerian independence."),
    ],
  },
  "irish-war-of-independence": {
    "origins-and-background": [
      m("General Post Office", [53.3494, -6.2603], "major", "The Easter Rising and executions shifted public support toward republican independence."),
      m("Dublin", [53.3498, -6.2603], "target", "Sinn Féin's electoral victory and the First Dáil gave the independence movement a rival government."),
      m("Westminster", [51.4995, -0.1248], "minor", "Britain faced a collapsing political mandate for continued rule over most of Ireland."),
    ],
    "soloheadbeg": [
      m("Soloheadbeg", [52.477, -8.166], "target", "IRA volunteers killed two RIC officers in the ambush commonly treated as the war's opening action."),
      m("Mansion House, Dublin", [53.3409, -6.2586], "major", "The First Dáil met and declared Irish independence on the same day."),
    ],
    "guerrilla-campaign": [
      m("County Cork", [51.9, -8.6], "target", "Tom Barry's West Cork Brigade became one of the most effective IRA flying-column commands."),
      m("County Tipperary", [52.55, -7.9], "major", "Tipperary was an early center of barracks attacks and rural guerrilla activity."),
      m("Dublin", [53.3498, -6.2603], "major", "Michael Collins's intelligence network targeted British agents and protected the underground government."),
    ],
    "black-and-tans": [
      m("Cork", [51.8985, -8.4756], "target", "Auxiliaries burned much of central Cork after an IRA ambush in December 1920."),
      m("Balbriggan", [53.608, -6.183], "major", "Black and Tan reprisals burned homes and businesses after the killing of police officers."),
      m("Trim", [53.555, -6.7917], "major", "Reprisals against towns demonstrated the coercive logic and political cost of British counterinsurgency."),
    ],
    "bloody-sunday": [
      m("Croke Park", [53.3607, -6.2511], "target", "Crown forces fired into a football crowd, killing fourteen civilians."),
      m("Dublin city center", [53.342, -6.26], "major", "Earlier that morning, IRA teams killed members of the British intelligence network at several addresses."),
      m("Dublin Castle", [53.343, -6.2675], "major", "The castle remained the center of British administration and security operations."),
    ],
    "custom-house": [m("Custom House, Dublin", [53.348, -6.253], "target", "The IRA burned the administrative landmark but lost many experienced volunteers to arrest.")],
    "truce-and-treaty": [
      m("Dublin", [53.3498, -6.2603], "major", "The truce ended active operations while the republican movement debated acceptable terms."),
      m("10 Downing Street", [51.5034, -0.1276], "target", "British and Irish delegations negotiated and signed the Anglo-Irish Treaty in London."),
      m("Belfast", [54.5973, -5.9301], "major", "Northern Ireland remained in the United Kingdom, making partition central to the settlement."),
    ],
    "conflict-summary": [
      m("Dublin", [53.3498, -6.2603], "target", "Dublin was the center of the underground republic, intelligence war, and treaty debate."),
      m("County Cork", [51.9, -8.6], "major", "The southern guerrilla war made large rural areas difficult for British forces to administer."),
      m("Belfast", [54.5973, -5.9301], "major", "Partition left Northern Ireland within the United Kingdom and preserved a fundamental political dispute."),
    ],
  },
  "greek-civil-war": {
    "origins-and-background": [
      m("Athens", [37.9838, 23.7275], "target", "The December 1944 fighting revealed the unresolved struggle between the communist-led resistance and the British-backed government."),
      m("Northern Greece", [40.3, 21.5], "major", "Mountain terrain and borders with communist states sustained the later insurgency."),
    ],
    "litochoro-attack": [m("Litochoro", [40.1006, 22.497], "target", "The guerrilla attack on the police station is commonly treated as the opening of the final civil-war phase.")],
    "democratic-army": [
      m("Grammos Mountains", [40.35, 20.75], "target", "The Democratic Army built bases in the rugged mountains near Albania."),
      m("Vitsi Mountains", [40.65, 21.25], "major", "Vitsi became the other principal northern stronghold of the communist army."),
    ],
    "truman-doctrine": [
      m("Washington, DC", [38.9072, -77.0369], "target", "President Truman asked Congress to support Greece and Turkey as an early containment commitment."),
      m("Athens", [37.9838, 23.7275], "major", "US money, advisers, weapons, and training replaced declining British support for the government."),
    ],
    "konitsa": [
      m("Konitsa", [40.0486, 20.7564], "target", "The Democratic Army tried to seize the town and establish a provisional capital near Albania."),
      m("Albanian border", [40.15, 20.65], "major", "Cross-border access mattered for guerrilla refuge and supply."),
    ],
    "grammos-vitsi": [
      m("Grammos", [40.35, 20.75], "target", "Government forces used artillery, aircraft, and maneuver to break the main mountain defenses."),
      m("Vitsi", [40.65, 21.25], "target", "The fall of Vitsi helped force the surviving Democratic Army into Albania."),
    ],
    "war-ends": [
      m("Greek-Albanian border", [40.4, 20.7], "target", "The defeated Democratic Army withdrew across the border before announcing a ceasefire."),
      m("Athens", [37.9838, 23.7275], "major", "The government victory secured Greece's place in the Western bloc."),
    ],
    "conflict-summary": [
      m("Athens", [37.9838, 23.7275], "target", "Government survival in Athens anchored Greece within the emerging Western alliance."),
      m("Grammos", [40.35, 20.75], "major", "The northern mountain war represents the final conventional phase of the conflict."),
      m("Makronisos", [37.7, 24.12], "major", "The prison and re-education camps symbolize repression and the war's long political trauma."),
    ],
  },
};

const summaries = {
  "indochina-wars": {
    eventId: "outcome-and-legacy",
    body: "Colonial rule ended and communist governments prevailed in Vietnam and Laos, but Indochina passed through several connected wars before a regional settlement emerged. France's defeat at Điện Biên Phủ ended the colonial war; the Vietnam War internationalized the struggle; Cambodia suffered civil war, Khmer Rouge genocide, Vietnamese invasion, and occupation; and Laos endured bombing, revolution, and displacement. Across the connected wars and genocide, well over four million people were killed, with exact aggregate estimates varying because conflicts overlap. Tens of millions were displaced or exposed to bombing, famine, detention, and unexploded ordnance.",
    status: "Colonial rule ended; communist victories followed by prolonged regional war",
    human: "Well over four million killed across connected wars and genocide; tens of millions displaced or otherwise affected",
  },
  "polish-soviet-war": {
    eventId: "conflict-summary",
    body: "Poland preserved its independence and defeated the Soviet drive toward Warsaw, then secured a broad eastern frontier in the Treaty of Riga. The settlement divided Belarusian and Ukrainian lands and abandoned Poland's Ukrainian ally, creating borders and minority disputes later destroyed by World War II. Roughly 100,000 soldiers were killed across both sides, while many more were wounded, captured, or displaced; thousands of prisoners died in captivity amid disease, hunger, and harsh camp conditions.",
    status: "Polish victory and Treaty of Riga",
    human: "About 100,000 military deaths; many more wounded, captured, or displaced",
  },
  "algerian-war": {
    eventId: "conflict-summary",
    body: "Algeria achieved independence after a war defined by guerrilla fighting, terrorism, torture, reprisals, detention, and internal violence. The conflict ended French colonial rule, brought down the Fourth Republic, and caused the flight of most European settlers and many Harkis. Casualty estimates remain politically contested: many historians place Algerian deaths around 300,000-500,000, while official Algerian memory claims a substantially higher total; about 25,000 French military personnel were killed, alongside thousands of European civilians and pro-French Algerians.",
    status: "Algerian independence and FLN victory",
    human: "Estimated 300,000-500,000 Algerian deaths and about 25,000 French military deaths; totals remain disputed",
  },
  "irish-war-of-independence": {
    eventId: "conflict-summary",
    body: "The guerrilla war made continued British rule over most of Ireland politically and militarily unsustainable. The Anglo-Irish Treaty created the Irish Free State but accepted partition, dominion status, and an oath to the Crown, disagreements that led directly to the Irish Civil War. Roughly 2,300 people were killed, including IRA volunteers, British soldiers, police, and civilians, while reprisals, imprisonment, economic disruption, and sectarian violence affected many more.",
    status: "Anglo-Irish Treaty and creation of the Irish Free State",
    human: "Roughly 2,300 combatants and civilians killed",
  },
  "greek-civil-war": {
    eventId: "conflict-summary",
    body: "The US-backed Greek government defeated the communist insurgency and secured Greece within the Western bloc. British intervention, the Truman Doctrine, Yugoslavia's split with Stalin, and the closing of northern sanctuaries all shaped the outcome. Estimates vary, but approximately 100,000-160,000 people were killed across occupation-era political violence and the civil war, while hundreds of thousands were displaced, imprisoned, exiled, or forced from their homes. The conflict left political divisions that shaped Greece for decades.",
    status: "Greek government victory and alignment with the Western bloc",
    human: "Approximately 100,000-160,000 killed; hundreds of thousands displaced, imprisoned, or exiled",
  },
};

function m(label, latlng, type, description) {
  return { label, latlng, type, description };
}

async function readJson(path) {
  return JSON.parse((await readFile(path, "utf8")).replace(/^\uFEFF/, ""));
}

async function writeJson(path, data) {
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function applyMarkers(event, markers) {
  event.markers = markers;
  const lats = markers.map((marker) => marker.latlng[0]);
  const lngs = markers.map((marker) => marker.latlng[1]);
  const crossesWorld = Math.max(...lngs) - Math.min(...lngs) > 30;
  event.view = {
    center: [
      Number(((Math.min(...lats) + Math.max(...lats)) / 2).toFixed(5)),
      Number(((Math.min(...lngs) + Math.max(...lngs)) / 2).toFixed(5)),
    ],
    zoom: crossesWorld ? 3 : markers.length >= 3 ? 6 : 8,
  };
}

function updateSummary(event, detail) {
  for (const slide of event.slides || []) {
    slide.body = detail.body;
    if (!(slide.stats || []).length) continue;
    slide.stats = [
      { val: detail.status, lbl: "Outcome / present status" },
      { val: "Human cost", lbl: detail.human, full: true },
      { val: "Final assessment", lbl: detail.body, full: true },
    ];
  }
}

function normalizeLongStats(events) {
  for (const event of events) {
    for (const slide of event.slides || []) {
      slide.stats = (slide.stats || []).map((stat) =>
        (stat.val || "").length > 90
          ? { ...stat, val: stat.lbl || "Context", lbl: stat.val, full: true }
          : stat
      );
    }
  }
}

const indochinaPath = join(DRAFT_DIR, "indochina-wars.generated.json");
const southernPath = join(DRAFT_DIR, "war-in-southern-vietnam.generated.json");
const indochina = await readJson(indochinaPath);
const southern = await readJson(southernPath);
const mergedIds = ["british-indian-arrival", "french-coup-in-saigon", "siege-and-gateforce", "british-withdrawal"];
const mergedEvents = southern
  .filter((event) => mergedIds.includes(event.id))
  .map((event) => ({ ...event, sub: "Opening phase of the Indochina Wars" }));
const withoutPlaceholder = indochina.filter((event) => event.id !== "war-in-southern-vietnam");
withoutPlaceholder.splice(1, 0, ...mergedEvents);
await writeJson(indochinaPath, withoutPlaceholder);
console.log(`Merged southern Vietnam into Indochina Wars (${withoutPlaceholder.length} events)`);

for (const [id, eventMarkers] of Object.entries(markerSets)) {
  const path = join(DRAFT_DIR, `${id}.generated.json`);
  const events = await readJson(path);
  for (const event of events) {
    if (eventMarkers[event.id]) applyMarkers(event, eventMarkers[event.id]);
  }
  const detail = summaries[id];
  const summary = events.find((event) => event.id === detail.eventId);
  if (!summary) throw new Error(`Missing summary ${detail.eventId} in ${id}`);
  updateSummary(summary, detail);
  normalizeLongStats(events);
  await writeJson(path, events);
  console.log(`Updated markers and summary for ${id}`);
}

const index = await readJson(INDEX_PATH);
const nextIndex = index.filter((item) => !REMOVED_IDS.includes(item.id));
await writeJson(INDEX_PATH, nextIndex);

const relationshipData = await readJson(FRONTEND_RELATIONSHIPS_PATH);
for (const id of REMOVED_IDS) delete relationshipData.nodes[id];
relationshipData.relationships = relationshipData.relationships.filter(
  (relationship) => !REMOVED_IDS.includes(relationship.from) && !REMOVED_IDS.includes(relationship.to)
);
await writeJson(FRONTEND_RELATIONSHIPS_PATH, relationshipData);
await writeJson(BACKEND_RELATIONSHIPS_PATH, relationshipData);

for (const id of REMOVED_IDS) {
  const path = join(DRAFT_DIR, `${id}.generated.json`);
  if (existsSync(path)) await unlink(path);
}

console.log(`Removed standalone deep dives: ${REMOVED_IDS.join(", ")}`);
