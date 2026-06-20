import { readFileSync, writeFileSync } from "node:fs";

const DRAFT_DIR = "C:\\Users\\alons\\Terra-Historia-Backend\\deepdives-drafts";
const INDEX_PATH = "C:\\Users\\alons\\Terra-Historia-Backend\\deepdives-index.json";

const sovietAfghanImages = {
  "origins-and-background": "https://upload.wikimedia.org/wikipedia/commons/6/6c/Mortar_attack_on_Shigal_Tarna_garrison%2C_Kunar_Province%2C_87.jpg",
  "soviet-invasion": "https://cdn.britannica.com/79/134279-050-1B91C96F/vehicle-Soviet-civilians-group-invasion-Afghanistan-December-1979.jpg",
  "mujahideen-resistance": "https://upload.wikimedia.org/wikipedia/commons/c/ca/Afghan_mujahideen.jpg",
  "panjshir-offensives": "https://warfarehistorynetwork.com/wp-content/uploads/2020/05/M-Sum20-Books-LEAD.jpg",
  "stinger-missiles": "https://i.insider.com/5bb3aaafdde867502f6b7449?width=700&format=jpeg&auto=webp",
  "operation-magistral": "https://i.redd.it/600q275m2lz51.jpg",
  "geneva-accords": "https://nsarchive.gwu.edu/sites/default/files/styles/wide/public/thumbnails/image/1990-summit-between-pres-bush-and-soviet-president-gorbachev-1.jpg?itok=y08na-Nd",
  "soviet-withdrawal": "https://static.themoscowtimes.com/image/1920/fe/aa853a852a4342d7add70cb58f2c6ab0.jpg",
  "conflict-summary": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Afgan_prisoners_in_Vardak_1987.jpg/1920px-Afgan_prisoners_in_Vardak_1987.jpg",
};

const sovietAfghanMarkers = {
  "origins-and-background": [
    marker("Kabul", [34.5553, 69.2075], "target", "The Saur Revolution, communist factional struggle, and Soviet-backed government centered on Kabul."),
    marker("Herat", [34.3529, 62.204], "major", "The March 1979 Herat uprising demonstrated the scale of resistance before the Soviet invasion."),
    marker("Moscow", [55.7558, 37.6173], "minor", "Soviet leaders debated intervention as the Afghan government fractured and repression widened revolt."),
  ],
  "soviet-invasion": [
    marker("Tajbeg Palace", [34.454, 69.114], "target", "Soviet special forces assaulted the palace, killed Hafizullah Amin, and installed Babrak Karmal."),
    marker("Bagram Air Base", [34.9461, 69.265], "major", "Bagram became a principal airhead and operational hub for Soviet forces."),
    marker("Salang Pass", [35.312, 69.038], "major", "The Salang route connected Soviet supply lines from the north to Kabul."),
  ],
  "mujahideen-resistance": [
    marker("Peshawar", [34.0151, 71.5249], "major", "Pakistan-based parties and the ISI channeled foreign weapons and money to Afghan resistance factions."),
    marker("Kunar Valley", [34.85, 71.1], "target", "Mountain sanctuaries and cross-border access sustained intense resistance in eastern Afghanistan."),
    marker("Kandahar", [31.6289, 65.7372], "major", "Southern resistance contested roads, garrisons, and rural control around Afghanistan's second city."),
  ],
  "panjshir-offensives": [
    marker("Panjshir Valley", [35.3, 69.7], "target", "Ahmad Shah Massoud used the valley's terrain and local networks to survive repeated Soviet offensives."),
    marker("Bagram Air Base", [34.9461, 69.265], "major", "Soviet operations into Panjshir were launched and supplied from bases north of Kabul."),
  ],
  "stinger-missiles": [
    marker("Jalalabad airfield", [34.3998, 70.4986], "target", "Early Stinger teams demonstrated the missile against Soviet and Afghan aircraft near Jalalabad in 1986."),
    marker("Peshawar", [34.0151, 71.5249], "major", "The CIA supplied missiles through Pakistan's ISI under Operation Cyclone."),
    marker("Kunar Province", [34.85, 71.1], "major", "Mountain firing positions allowed resistance teams to threaten helicopters and low-flying aircraft."),
  ],
  "operation-magistral": [
    marker("Gardez", [33.6008, 69.225], "major", "The relief column assembled around Gardez before moving toward Khost."),
    marker("Satukandav Pass", [33.43, 69.55], "target", "Heavy fighting for the mountain pass opened the blocked road corridor."),
    marker("Khost", [33.3395, 69.9204], "major", "The operation temporarily relieved the besieged garrison and delivered supplies."),
  ],
  "geneva-accords": [
    marker("Geneva", [46.2044, 6.1432], "target", "Afghanistan and Pakistan signed the accords under UN mediation and US-Soviet guarantees."),
    marker("Islamabad", [33.6844, 73.0479], "major", "Pakistan signed the bilateral agreements while continuing to host and influence resistance factions."),
    marker("Kabul", [34.5553, 69.2075], "major", "The Afghan government accepted a withdrawal framework that did not settle its war with the mujahideen."),
  ],
  "soviet-withdrawal": [
    marker("Friendship Bridge", [37.228, 67.43], "target", "General Boris Gromov crossed the bridge as the final Soviet commander to leave Afghanistan."),
    marker("Hairatan", [37.225, 67.43], "major", "The border town was the last Afghan staging point on the northern withdrawal route."),
    marker("Kabul", [34.5553, 69.2075], "major", "Najibullah's government remained in power after Soviet combat troops departed."),
  ],
  "conflict-summary": [
    marker("Kabul", [34.5553, 69.2075], "target", "The Soviet-backed state held the capital and major institutions but never secured the countryside."),
    marker("Panjshir Valley", [35.3, 69.7], "major", "Panjshir represents the failure of repeated clearing operations to produce lasting political control."),
    marker("Khost", [33.3395, 69.9204], "major", "Khost illustrates late Soviet tactical success without a strategic end to the insurgency."),
    marker("Friendship Bridge", [37.228, 67.43], "major", "The final withdrawal ended occupation but left Afghanistan's civil war unresolved."),
  ],
};

const selectionImages = {
  "first-chechen-war": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Evstafiev-helicopter-shot-down.jpg",
  "tajikistani-civil-war": "https://upload.wikimedia.org/wikipedia/commons/a/a0/Spetsnaz_troopers_during_the_1992_Tajik_war.jpg",
  "cambodian-civil-war": "https://images.theconversation.com/files/661370/original/file-20250411-56-86yjb6.jpg?ixlib=rb-4.1.0&rect=0%2C7%2C5000%2C3330&q=50&auto=format&w=768&h=512&fit=crop&dpr=2",
  "laotian-civil-war": "https://orion-uploads.openroadmedia.com/lg_a071b89a1e4e-anti-aircraft-troops-of-the-laotian-peoples-liberation-army-142341995246.jpg",
  "vietnam-war": "https://images.immediate.co.uk/production/volatile/sites/7/2019/04/GettyImages-2717016-93218c6.jpg?quality=90&resize=980,654",
  "korean-war": "https://static0.mltimages.com/wordpress/wp-content/uploads/2020-08/Korean%20War%20NKPA%201200.jpg?&fit=crop&w=1200&h=675",
  "operation-litani": "https://upload.wikimedia.org/wikipedia/commons/3/36/Operation_Litani_V.jpg",
  "lebanese-civil-war": "https://ichef.bbci.co.uk/images/ic/1200x675/p01txc91.jpg",
  "syrian-civil-war": "https://ichef.bbci.co.uk/ace/standard/2048/cpsprodpb/EF63/production/_105738216_mediaitem88772680.jpg",
  "2026-iran-war": "https://i.abcnewsfe.com/a/546114b8-48d3-4165-abe9-a7bcfd9f3990/Khamenei-1-rt-gmh-250617_1750177937088_hpMain.jpg",
  "2006-lebanon-war": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/2006_Lebanon_War._LXXXI.jpg/250px-2006_Lebanon_War._LXXXI.jpg",
  "first-intifada": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Intifada_in_Gaza_Strip%2C_1987_V_Dan_Hadani_Archive.jpg/1280px-Intifada_in_Gaza_Strip%2C_1987_V_Dan_Hadani_Archive.jpg",
  "second-intifada": "https://www.aljazeera.com/wp-content/uploads/2010/10/2010103125618668784_8.jpeg?fit=770%2C510&quality=80",
  "gaza-war-2008-2009": "https://www.middleeastmonitor.com/wp-content/uploads/2018/12/2008_12-gaza-warAB00-13.jpg",
  "2014-gaza-war": "https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/175FA/production/_94883759_6d8a39ed-39c5-406e-8657-95c7443cbc36.jpg",
  "2021-israel-palestine-crisis": "https://upload.wikimedia.org/wikipedia/commons/d/df/Disorders_in_Lod%2C_May_2021._VII.jpg",
  "2026-lebanon-war": "https://img.lemde.fr/2026/02/08/0/0/6000/4000/664/0/75/0/130c91a_ftp-1-sngvxqb3sjmt-5105185-01-06.jpg",
  "israeli-operation-in-syria-2024-present": "https://assets.cfr.org/images/t_gct_w1200/v1755542657/globalconflicttracker/Conflict-in-Syria-Syria20Fall20of20Assad202/Conflict-in-Syria-Syria20Fall20of20Assad202.jpg?_i=AA",
  "russo-georgian-war": "https://civil.ge/wp-content/uploads/2023/08/Georgia-Russia-war-AP-Musa-Sadulayev.jpg",
  "bosnian-war": "https://media.iwm.org.uk/ciim5/38/8/large_000000.jpg",
  "yugoslav-wars": "https://d1e4pidl3fu268.cloudfront.net/18d0f9f7-4df5-4ec3-8b08-beaec21fc58e/111.crop_659x494_42,0.preview.webp",
  "greek-civil-war": "https://www.nationalww2museum.org/sites/default/files/2020-05/GW1%20-%20Edward%20Lengel.jpg",
  "kosovo-war": "https://www.reuters.com/resizer/v2/https%3A%2F%2Farchive-images.prod.global.a201836.reutersmedia.net%2F2009%2F02%2F17%2F2009-02-17T201017Z_02_RP1DRIETZVAB_RTRRPP_0_KOSOVO.JPG?auth=c2082b872a8c6e304c6b25320b9cb988ae7366a9d82a5d5511afd9a1ce66fb1e&width=1920&quality=80",
};

function marker(label, latlng, type, description) {
  return { label, latlng, type, description };
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8").replace(/^\uFEFF/, ""));
}

function writeJson(path, data) {
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function setImage(event, image) {
  for (const slide of event.slides || []) {
    slide.img = image;
    slide.cap = `Visual reference for ${event.title}.`;
  }
}

function setViewFromMarkers(event, markers, preferredZoom) {
  event.markers = markers;
  const lats = markers.map((item) => item.latlng[0]);
  const lngs = markers.map((item) => item.latlng[1]);
  event.view = {
    center: [
      Number(((Math.min(...lats) + Math.max(...lats)) / 2).toFixed(5)),
      Number(((Math.min(...lngs) + Math.max(...lngs)) / 2).toFixed(5)),
    ],
    zoom: preferredZoom,
  };
}

const sovietPath = `${DRAFT_DIR}\\soviet-afghan-war.generated.json`;
const sovietEvents = readJson(sovietPath);

for (const event of sovietEvents) {
  if (sovietAfghanImages[event.id]) setImage(event, sovietAfghanImages[event.id]);
  if (sovietAfghanMarkers[event.id]) {
    const zoom = event.id === "geneva-accords" ? 3 : event.id === "conflict-summary" ? 6 : 7;
    setViewFromMarkers(event, sovietAfghanMarkers[event.id], zoom);
  }
}

const stinger = sovietEvents.find((event) => event.id === "stinger-missiles");
if (!stinger?.slides?.[0]) throw new Error("Missing Stinger event");
stinger.slides[0].body = "The United States supplied FIM-92 Stinger missiles through the CIA's Operation Cyclone after years of providing less advanced weapons to the Afghan resistance. Washington wanted to raise the cost of Soviet occupation, support the Reagan Doctrine of backing anti-communist insurgencies, and reduce the freedom with which Soviet helicopters and low-flying aircraft attacked guerrilla positions. Pakistan's ISI controlled distribution and training, preserving indirect US involvement. Stingers forced Soviet pilots to fly higher and change tactics, but they were one part of a wider system of sanctuary, funding, local intelligence, and sustained resistance rather than a single weapon that won the war.";

const summary = sovietEvents.find((event) => event.id === "conflict-summary");
if (!summary?.slides?.[0]) throw new Error("Missing Soviet-Afghan summary");
const vietnamExplanation = "The war is often called the 'Soviet Union's Vietnam' because a superpower entered expecting a limited intervention, became trapped in a long guerrilla war sustained by foreign aid and cross-border sanctuaries, suffered mounting casualties and political disillusionment, and withdrew without securing a durable allied victory. The comparison is useful but not exact: Afghanistan's geography, Soviet strategy, casualty scale, and domestic politics differed from the American war in Vietnam.";
const summaryBase = summary.slides[0].body.split("\n\nThe war is often called")[0];
summary.slides[0].body = `${summaryBase}\n\n${vietnamExplanation}`;
const summaryStats = (summary.slides[0].stats || []).filter(
  (stat) => stat.val !== "Why 'the Soviet Vietnam?'"
);
for (const stat of summaryStats) {
  if (stat.lbl === "Final assessment" && (stat.val || "").length > 90) {
    stat.lbl = stat.val;
    stat.val = "Final assessment";
    stat.full = true;
  }
}
const human = summaryStats.find((stat) => /human|casual|death|cost/i.test(`${stat.val} ${stat.lbl}`));
const sovietLossNote = "Official Soviet figures record 14,453 Soviet military deaths. Hundreds of thousands to more than one million Afghans were killed, and roughly five to six million became refugees; Afghan totals vary widely by source.";
if (human) {
  human.val = "Human cost";
  human.lbl = sovietLossNote;
  human.full = true;
} else {
  summaryStats.push({ val: "Human cost", lbl: sovietLossNote, full: true });
}
summary.slides[0].stats = [
  ...summaryStats,
  { val: "Why 'the Soviet Vietnam'?", lbl: vietnamExplanation, full: true },
];
writeJson(sovietPath, sovietEvents);

const irishPath = `${DRAFT_DIR}\\irish-war-of-independence.generated.json`;
const irishEvents = readJson(irishPath);
const irishOrigins = irishEvents.find((event) => event.id === "origins-and-background");
if (!irishOrigins) throw new Error("Missing Irish origins event");
setImage(irishOrigins, "https://upload.wikimedia.org/wikipedia/commons/5/58/Hogan%27s_Flying_Column.gif");
writeJson(irishPath, irishEvents);

const index = readJson(INDEX_PATH);
const indexById = new Map(index.map((item) => [item.id, item]));
for (const [id, image] of Object.entries(selectionImages)) {
  const item = indexById.get(id);
  if (!item) throw new Error(`Missing deep-dive index item: ${id}`);
  item.image = image;
}
writeJson(INDEX_PATH, index);

console.log(`Updated Soviet-Afghan War, Irish origins, and ${Object.keys(selectionImages).length} selection images.`);
