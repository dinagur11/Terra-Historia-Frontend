import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DRAFT_DIR = "C:\\Users\\alons\\Terra-Historia-Backend\\deepdives-drafts";

const markerSets = {
  "russo-ukrainian-war": {
    "origins-and-background": [
      m("Kyiv", [50.4501, 30.5234], "target", "The Revolution of Dignity in Kyiv removed Viktor Yanukovych and triggered the immediate crisis with Russia."),
      m("Sevastopol", [44.6167, 33.5254], "major", "Russia's Black Sea Fleet base made Crimea central to Moscow's first military move."),
      m("Donetsk", [48.0159, 37.8029], "major", "Donetsk became a center of Russian-backed separatism and the long Donbas war."),
    ],
    "annexation-of-crimea": [
      m("Simferopol", [44.9521, 34.1024], "target", "Russian troops seized Crimea's parliament and key government sites in Simferopol."),
      m("Sevastopol", [44.6167, 33.5254], "major", "The Russian fleet base anchored the operation and Crimea's strategic importance."),
      m("Kerch Strait", [45.35, 36.6], "minor", "The Kerch connection later tied occupied Crimea more closely to Russia."),
    ],
    "war-in-donbas": [
      m("Sloviansk", [48.8532, 37.6053], "target", "The seizure of Sloviansk in April 2014 marked the opening of organized armed conflict in Donbas."),
      m("Donetsk", [48.0159, 37.8029], "major", "Donetsk became the political and logistical center of the self-proclaimed Donetsk People's Republic."),
      m("Luhansk", [48.574, 39.3078], "major", "Luhansk became the center of the parallel separatist entity in northern Donbas."),
    ],
    "minsk-agreements": [
      m("Minsk", [53.9006, 27.559], "target", "Ukraine, Russia, France, Germany, and OSCE representatives negotiated Minsk II here."),
      m("Debaltseve", [48.3407, 38.4049], "major", "Fighting around Debaltseve continued as Minsk II was signed, exposing the ceasefire's weakness."),
    ],
    "full-scale-invasion": [
      m("Kyiv", [50.4501, 30.5234], "target", "Russia's northern thrust aimed to seize the capital and collapse the Ukrainian government."),
      m("Hostomel Airport", [50.6035, 30.1919], "major", "The airborne battle at Hostomel was central to Russia's failed plan for a rapid capture of Kyiv."),
      m("Kharkiv", [49.9935, 36.2304], "major", "Ukraine held its second-largest city against the northeastern invasion axis."),
      m("Kherson", [46.6354, 32.6169], "major", "Kherson became the first regional capital occupied by Russia in the full-scale invasion."),
    ],
    "siege-of-mariupol": [
      m("Mariupol", [47.0971, 37.5434], "target", "The encircled port city was devastated during one of the war's longest and most destructive sieges."),
      m("Azovstal steelworks", [47.107, 37.616], "major", "The steelworks became the defenders' final fortified position until their surrender in May 2022."),
    ],
    "ukrainian-counteroffensives": [
      m("Balakliia", [49.4627, 36.8598], "major", "The breakthrough around Balakliia opened the rapid Kharkiv counteroffensive."),
      m("Izium", [49.2128, 37.2569], "target", "Recapturing Izium disrupted Russia's northern Donbas logistics and demonstrated operational surprise."),
      m("Kherson", [46.6354, 32.6169], "target", "Russian forces withdrew across the Dnipro and Ukraine liberated Kherson city in November 2022."),
    ],
    "attritional-war": [
      m("Bakhmut", [48.5953, 37.9998], "target", "The prolonged battle for Bakhmut became a symbol of artillery-heavy attritional warfare."),
      m("Avdiivka", [48.139, 37.742], "major", "Avdiivka's fall followed months of costly attacks and pressure on Ukrainian ammunition and manpower."),
      m("Zaporizhzhia front", [47.45, 35.8], "major", "Dense defenses, mines, drones, and artillery limited movement during Ukraine's 2023 counteroffensive."),
    ],
    "conflict-summary": [
      m("Kyiv", [50.4501, 30.5234], "target", "Ukraine preserved its government and sovereignty after defeating Russia's initial drive on the capital."),
      m("Crimea", [45.2, 34.3], "major", "Crimea remains occupied and central to the war's territorial and naval dimensions."),
      m("Donbas", [48.1, 37.9], "major", "The Donbas front connects the war that began in 2014 to the continuing full-scale conflict."),
      m("Mariupol", [47.0971, 37.5434], "major", "Mariupol represents occupation, urban destruction, civilian loss, and Russia's land corridor to Crimea."),
    ],
  },
  "turkish-war-of-independence": {
    "origins-and-road-to-war": [
      m("Istanbul", [41.0082, 28.9784], "major", "Allied occupation of the Ottoman capital symbolized the empire's defeat and loss of sovereignty."),
      m("Samsun", [41.2867, 36.33], "target", "Mustafa Kemal's arrival at Samsun on 19 May 1919 became the symbolic beginning of the nationalist struggle."),
      m("Ankara", [39.9334, 32.8597], "major", "Ankara became the nationalist movement's political and military center."),
    ],
    "franco-turkish-war": [
      m("Gaziantep", [37.0662, 37.3833], "target", "The siege and resistance at Antep became a defining episode of the southern front."),
      m("Kahramanmaraş", [37.5753, 36.9228], "major", "Local resistance at Maraş challenged French and Armenian auxiliary control."),
      m("Şanlıurfa", [37.1674, 38.7955], "major", "Urfa was another major center of the nationalist campaign against French occupation."),
    ],
    "greco-turkish-war": [
      m("İzmir", [38.4237, 27.1428], "major", "The Greek landing at İzmir in May 1919 opened the principal western campaign."),
      m("Sakarya River front", [39.6, 31.6], "target", "The Battle of the Sakarya halted the Greek advance toward Ankara."),
      m("Dumlupınar", [38.854, 30.0], "target", "The Great Offensive and victory at Dumlupınar broke the Greek army in Anatolia."),
    ],
    "ala-ehir-congress": [m("Alaşehir", [38.3508, 28.5172], "target", "Delegates organized regional resistance and coordinated western Anatolian nationalist forces here.")],
    "battle-of-karbo-az": [m("Karboğazı Pass", [37.3833, 34.6667], "target", "Turkish nationalists ambushed and forced the surrender of a French battalion in this Taurus Mountain pass.")],
    "turkish-armenian-war": [
      m("Kars", [40.6013, 43.0975], "target", "Turkish forces captured Kars during the decisive eastern campaign."),
      m("Alexandropol / Gyumri", [40.7894, 43.8475], "major", "The advance to Alexandropol forced Armenia toward the Treaty of Alexandropol."),
    ],
    "red-army-invasion-of-armenia": [
      m("Yerevan", [40.1872, 44.5152], "target", "The Soviet takeover ended the First Republic of Armenia as Turkish forces pressed from the west."),
      m("Dilijan", [40.7408, 44.8636], "major", "Armenian Bolsheviks proclaimed Soviet power at Dilijan during the Red Army advance."),
    ],
    "bombardment-of-samsun": [m("Samsun", [41.2867, 36.33], "target", "Greek warships shelled Samsun, a Black Sea supply center for the nationalist movement.")],
    "chanak-crisis": [
      m("Çanakkale / Chanak", [40.1467, 26.4086], "target", "Turkish forces approached the Allied neutral zone at Chanak, creating a war scare with Britain."),
      m("Dardanelles", [40.2, 26.4], "major", "Control of the straits linked the military victory in Anatolia to the final diplomatic settlement."),
    ],
    "international-and-human-dimensions": [
      m("Ankara", [39.9334, 32.8597], "target", "The Grand National Assembly coordinated the nationalist war and negotiated as an alternative government."),
      m("Moscow", [55.7558, 37.6173], "minor", "Soviet aid and diplomacy supported the nationalist movement against common Western adversaries."),
      m("Lausanne", [46.5197, 6.6323], "minor", "The final treaty negotiations replaced the unimplemented Treaty of Sèvres."),
    ],
    "outcome-and-legacy": [
      m("Ankara", [39.9334, 32.8597], "target", "The nationalist center became the capital of the Republic of Turkey."),
      m("Lausanne", [46.5197, 6.6323], "major", "The Treaty of Lausanne internationally recognized the new Turkish state and its borders."),
      m("İzmir", [38.4237, 27.1428], "major", "The recapture of İzmir marked the end of the main western campaign and preceded mass displacement."),
    ],
  },
  "indonesian-national-revolution": {
    "origins-and-road-to-war": [
      m("Jakarta", [-6.2088, 106.8456], "target", "Sukarno and Mohammad Hatta proclaimed Indonesian independence in Jakarta on 17 August 1945."),
      m("Yogyakarta", [-7.7956, 110.3695], "major", "Yogyakarta later became the republican capital and a center of resistance."),
    ],
    "battle-of-surabaya": [
      m("Surabaya", [-7.2575, 112.7521], "target", "The largest battle of the revolution made Surabaya a national symbol of resistance."),
      m("Jembatan Merah", [-7.236, 112.738], "major", "Fighting around the Red Bridge area became associated with the battle's opening confrontations."),
    ],
    "battle-of-ambarawa": [
      m("Ambarawa", [-7.263, 110.405], "target", "Indonesian forces pushed British and Dutch units out of Ambarawa after weeks of fighting."),
      m("Semarang", [-6.9667, 110.4167], "major", "The wider central Java campaign connected Ambarawa to Semarang and Magelang."),
    ],
    "battle-of-medan": [m("Medan", [3.5952, 98.6722], "target", "Medan and its surroundings became the principal revolutionary battlefield in North Sumatra.")],
    "3-july-affair": [
      m("Yogyakarta", [-7.7956, 110.3695], "target", "The republican capital was the center of the political crisis and attempted change of government."),
      m("Surakarta", [-7.5755, 110.8243], "major", "Military and political tensions around Surakarta fed the kidnapping crisis and factional struggle."),
    ],
    "police-actions-indonesia": [
      m("West Java", [-6.9, 107.6], "major", "Dutch Operation Product targeted republican territory, roads, and economic centers in Java."),
      m("East Java", [-7.5, 112.3], "target", "Dutch columns seized key plantation and industrial areas while bypassing some republican forces."),
      m("East Sumatra", [3.4, 99.0], "major", "The offensive also targeted economically valuable plantation regions on Sumatra."),
    ],
    "operation-kraai": [
      m("Maguwo airfield", [-7.7882, 110.4317], "major", "Dutch paratroopers seized the airfield at the opening of Operation Kraai."),
      m("Yogyakarta", [-7.7956, 110.3695], "target", "Dutch forces captured the republican capital and arrested senior leaders, but failed to end resistance."),
    ],
    "rengat-massacre": [m("Rengat", [-0.375, 102.5469], "target", "Dutch paratroopers captured Rengat and killed soldiers, officials, and civilians during and after the assault.")],
    "1-march-general-offensive": [
      m("Yogyakarta", [-7.7956, 110.3695], "target", "Republican forces held Yogyakarta for several hours to demonstrate that the resistance remained effective."),
      m("Fort Vredeburg area", [-7.8002, 110.3663], "major", "The city center became a visible stage for the temporary republican return."),
    ],
    "international-and-human-dimensions": [
      m("Jakarta", [-6.2088, 106.8456], "major", "Diplomacy and military pressure converged in the colonial capital."),
      m("The Hague", [52.0705, 4.3007], "minor", "Dutch political decisions and the Round Table Conference shaped the final transfer of sovereignty."),
      m("United Nations, New York", [40.7494, -73.968], "minor", "UN mediation and Security Council pressure constrained the Dutch campaign."),
    ],
    "outcome-and-legacy": [
      m("Jakarta", [-6.2088, 106.8456], "target", "Jakarta became the capital of the sovereign Indonesian state."),
      m("Yogyakarta", [-7.7956, 110.3695], "major", "The wartime republican capital symbolizes political survival after Dutch occupation."),
      m("The Hague", [52.0705, 4.3007], "minor", "The Netherlands agreed to transfer sovereignty at the Round Table Conference."),
    ],
  },
  "bosnian-war": {
    "origins-and-background": [
      m("Sarajevo", [43.8563, 18.4131], "target", "Bosnia's capital became the political center of independence and the war's longest siege."),
      m("Banja Luka", [44.7722, 17.191], "major", "Banja Luka became the political center of the Bosnian Serb entity."),
      m("Mostar", [43.3438, 17.8078], "major", "Mostar reflected both the anti-Serb alliance and its later Croat-Bosniak rupture."),
    ],
    "siege-of-sarajevo": [
      m("Central Sarajevo", [43.8563, 18.4131], "target", "Residents endured shelling and sniper fire throughout the nearly four-year siege."),
      m("Trebević positions", [43.83, 18.44], "major", "Bosnian Serb artillery and sniper positions on surrounding heights dominated the city."),
      m("Sarajevo Tunnel", [43.8197, 18.3376], "major", "The tunnel beneath the airport became a vital supply and evacuation route."),
    ],
    "ethnic-cleansing": [
      m("Prijedor", [44.9808, 16.713], "target", "The Prijedor campaign included mass expulsions, killings, and detention camps."),
      m("Omarska camp", [44.891, 16.9], "major", "Omarska became one of the most notorious Bosnian Serb detention camps."),
      m("Foča", [43.5065, 18.7785], "major", "Foča became associated with expulsion, detention, killings, and systematic sexual violence."),
    ],
    "croat-bosniak-war": [
      m("Mostar", [43.3438, 17.8078], "target", "The divided city became the largest battlefield of the conflict between former allies."),
      m("Ahmići", [44.136, 17.86], "major", "The massacre at Ahmići became a defining atrocity of the Croat-Bosniak War."),
    ],
    "srebrenica": [
      m("Srebrenica", [44.1075, 19.2967], "target", "Bosnian Serb forces captured the UN-declared safe area in July 1995."),
      m("Potočari", [44.151, 19.298], "major", "Thousands sought refuge near the Dutch UN base before men and boys were separated from their families."),
    ],
    "operation-deliberate-force": [
      m("Pale", [43.8167, 18.5667], "target", "NATO struck Bosnian Serb command and military targets around the wartime political center."),
      m("Sarajevo", [43.8563, 18.4131], "major", "The second Markale massacre and continuing siege helped trigger sustained NATO action."),
    ],
    "dayton-accords": [
      m("Dayton, Ohio", [39.7589, -84.1916], "target", "The parties negotiated the General Framework Agreement at Wright-Patterson Air Force Base."),
      m("Paris", [48.8566, 2.3522], "major", "The agreement was formally signed in Paris on 14 December 1995."),
      m("Sarajevo", [43.8563, 18.4131], "major", "The settlement preserved Bosnia and Herzegovina as one internationally recognized state."),
    ],
    "conflict-summary": [
      m("Sarajevo", [43.8563, 18.4131], "target", "Sarajevo represents the survival of the Bosnian state and the civilian experience of siege."),
      m("Srebrenica", [44.1075, 19.2967], "major", "Srebrenica represents the genocide and the failure of international protection."),
      m("Dayton", [39.7589, -84.1916], "minor", "Dayton ended the war while institutionalizing a complex power-sharing system."),
    ],
  },
  "yugoslav-wars": {
    "origins-and-background": [
      m("Belgrade", [44.8125, 20.4612], "target", "The federal capital and Milošević's centralizing politics stood at the center of Yugoslavia's crisis."),
      m("Ljubljana", [46.0569, 14.5058], "major", "Slovenia's independence opened the first armed phase of dissolution."),
      m("Zagreb", [45.815, 15.9819], "major", "Croatia's independence and Serb rebellion turned dissolution into a much larger war."),
    ],
    "ten-day-war": [
      m("Ljubljana", [46.0569, 14.5058], "target", "Slovenia's government coordinated resistance to the Yugoslav People's Army."),
      m("Brnik Airport", [46.2237, 14.4576], "major", "The airport and border crossings became key objectives during the brief war."),
      m("Holmec", [46.5, 14.85], "major", "The border post saw one of the conflict's best-known engagements."),
    ],
    "croatian-war": [
      m("Vukovar", [45.3433, 18.9997], "target", "The siege and destruction of Vukovar became a symbol of the Croatian war."),
      m("Knin", [44.0408, 16.1969], "major", "Knin became the political center of the Serb-held Krajina."),
      m("Dubrovnik", [42.6507, 18.0944], "major", "The siege of Dubrovnik drew international attention to attacks on civilians and heritage."),
    ],
    "bosnian-war": [
      m("Sarajevo", [43.8563, 18.4131], "target", "The siege of Sarajevo became the Bosnian War's most sustained urban ordeal."),
      m("Prijedor", [44.9808, 16.713], "major", "Detention camps and expulsions around Prijedor exemplified ethnic cleansing."),
      m("Srebrenica", [44.1075, 19.2967], "major", "The 1995 genocide became the war's gravest single atrocity."),
    ],
    "nato-bosnia": [
      m("Pale", [43.8167, 18.5667], "target", "NATO struck Bosnian Serb military targets around the wartime leadership center."),
      m("Sarajevo", [43.8563, 18.4131], "major", "Attacks on Sarajevo and UN safe areas drove the shift toward sustained intervention."),
    ],
    "kosovo-war": [
      m("Pristina", [42.6629, 21.1655], "target", "Kosovo's capital became the political center of the conflict and postwar UN administration."),
      m("Račak", [42.466, 21.007], "major", "The Račak massacre transformed international diplomacy before NATO intervention."),
      m("Belgrade", [44.8125, 20.4612], "major", "NATO strikes targeted Yugoslav military and state infrastructure, including in the capital."),
    ],
    "milosevic-falls": [
      m("Federal Assembly, Belgrade", [44.8106, 20.4572], "target", "Mass protesters stormed the federal parliament after Milošević refused to concede electoral defeat."),
      m("Republic Square", [44.8168, 20.4605], "major", "Central Belgrade filled with demonstrators during the October 2000 uprising."),
    ],
    "ohrid-agreement": [
      m("Ohrid", [41.1231, 20.8016], "target", "Negotiations produced a framework for minority rights and an end to the Macedonian conflict."),
      m("Tetovo", [42.0069, 20.9715], "major", "Tetovo and nearby mountains were central to fighting between Macedonian forces and Albanian insurgents."),
      m("Skopje", [41.9981, 21.4254], "major", "The agreement reshaped state institutions and language rights from the capital."),
    ],
    "conflict-summary": [
      m("Ljubljana", [46.0569, 14.5058], "major", "Slovenia's short war opened the armed breakup of Yugoslavia."),
      m("Vukovar", [45.3433, 18.9997], "major", "Vukovar represents the destruction and displacement of the Croatian war."),
      m("Sarajevo", [43.8563, 18.4131], "target", "Sarajevo represents siege warfare and the international struggle to preserve Bosnia."),
      m("Pristina", [42.6629, 21.1655], "major", "Kosovo represents the final major war, NATO intervention, and unresolved status questions."),
    ],
  },
};

const summaryDetails = {
  "russo-ukrainian-war": {
    eventId: "conflict-summary",
    body: "As of June 15, 2026, the war remains unresolved. Ukraine preserved its state and defeated Russia's initial plan for rapid conquest, while Russia occupies substantial Ukrainian territory. Military deaths across both sides are estimated in the hundreds of thousands, but no independently verified combined total exists; verified civilian deaths exceeded 13,000 by mid-2025 and the true civilian toll is higher. Millions were displaced inside and outside Ukraine, and the war produced destruction on a continental scale.\n\nTaken as a whole, the Russo-Ukrainian War demonstrates the limits of rapid conquest, the importance of external military support, and the extraordinary cost of prolonged industrial warfare. Any final assessment must distinguish verified civilian losses from disputed military estimates and recognize that the outcome remains unsettled.",
    status: "Ongoing as of June 15, 2026",
    human: "Hundreds of thousands of military deaths estimated across both sides; more than 13,000 civilian deaths verified by mid-2025, with the true toll higher",
  },
  "turkish-war-of-independence": {
    eventId: "outcome-and-legacy",
    body: "Nationalist victories overturned the proposed partition, ended the Greek campaign in Anatolia, and forced a new diplomatic settlement. The Treaty of Lausanne recognized the Republic of Turkey, while the abolition of the sultanate and the choice of Ankara as capital completed the political break with the Ottoman order. The connected wars killed tens of thousands of soldiers; civilian deaths from massacres, deportations, reprisals, famine, and forced migration drove the broader toll into the hundreds of thousands. The compulsory population exchange uprooted roughly 1.5 million Orthodox Christians from Turkey and about half a million Muslims from Greece.",
    status: "Turkish nationalist victory and international recognition at Lausanne",
    human: "Tens of thousands of soldiers and hundreds of thousands of civilians killed across the connected wars; roughly two million people affected by compulsory exchange",
  },
  "indonesian-national-revolution": {
    eventId: "outcome-and-legacy",
    body: "The Netherlands transferred sovereignty in December 1949 after two major offensives failed to eliminate the republic and international pressure made continued colonial war increasingly costly. The revolution created an independent Indonesian state but left unresolved questions over federalism, military power, local revolutions, and West New Guinea. Estimates vary widely: roughly 45,000-100,000 Indonesian combatants and 25,000-100,000 civilians were killed, alongside more than 5,000 Dutch military deaths and additional British, Indian, Japanese, and Chinese Indonesian victims.",
    status: "Indonesian victory and Dutch transfer of sovereignty",
    human: "Approximately 45,000-100,000 Indonesian combatants and 25,000-100,000 civilians killed; more than 5,000 Dutch military deaths",
  },
  "bosnian-war": {
    eventId: "conflict-summary",
    body: "The Dayton Accords ended the fighting and preserved Bosnia and Herzegovina as one state divided between two principal entities, backed by an international military and civilian implementation system. Research has documented roughly 100,000 deaths, including about 40,000 civilians, while more than two million people were displaced. The war included the Srebrenica genocide, the siege of Sarajevo, systematic detention and sexual violence, and ethnic-cleansing campaigns whose demographic effects remain visible. Dayton stopped the war but institutionalized a complex ethnic power-sharing structure that still limits political reform.",
    status: "Negotiated settlement under the Dayton Accords",
    human: "Approximately 100,000 killed, including about 40,000 civilians; more than two million displaced",
  },
  "yugoslav-wars": {
    eventId: "conflict-summary",
    body: "Yugoslavia dissolved into successor states after interconnected wars in Slovenia, Croatia, Bosnia and Herzegovina, Kosovo, southern Serbia, and North Macedonia. The conflicts killed about 130,000 people overall and displaced millions. The Bosnian War accounted for roughly 100,000 deaths, the Croatian war around 20,000, and the Kosovo conflict more than 13,000 killed or missing, with smaller totals in the other theaters. Ethnic cleansing, siege warfare, genocide, detention camps, and mass displacement transformed the region. International courts established extensive records of crimes, while NATO intervention and Western-backed settlements helped end the largest wars without fully resolving every constitutional and status dispute.",
    status: "Yugoslavia dissolved and successor states established",
    human: "About 130,000 killed across the wars and millions displaced",
  },
};

const rafahMarkers = [
  m("Rafah Crossing", [31.2475, 34.2661], "target", "The Gaza-Egypt passenger crossing sits at the southeastern edge of Rafah and became a focal point of the May 2024 operation."),
  m("Western Philadelphi Corridor", [31.321, 34.219], "major", "The corridor begins near the Mediterranean coast and follows the Gaza-Egypt boundary south of Rafah."),
  m("Kerem Shalom junction", [31.2275, 34.284], "major", "The eastern end of the border corridor meets the Kerem Shalom area near the Gaza-Israel-Egypt tri-border zone."),
];

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
  event.view = {
    center: [
      Number(((Math.min(...lats) + Math.max(...lats)) / 2).toFixed(5)),
      Number(((Math.min(...lngs) + Math.max(...lngs)) / 2).toFixed(5)),
    ],
    zoom: markers.some((marker) => Math.abs(marker.latlng[1]) > 60) ? 3 : markers.length > 2 ? 5 : 7,
  };
}

function updateSummary(event, detail) {
  const slides = event.slides || [];
  for (const slide of slides) {
    slide.body = detail.body;
    const stats = slide.stats || [];
    if (!stats.length) continue;
    stats[0] = { val: detail.status, lbl: "Outcome / present status" };
    if (stats.length > 1) stats[1] = { val: "Human cost", lbl: detail.human, full: true };
    if (stats.length > 2) stats[2] = { val: "Final assessment", lbl: detail.body, full: true };
    slide.stats = stats;
  }
}

function normalizeLongStatValues(events) {
  for (const event of events) {
    for (const slide of event.slides || []) {
      slide.stats = (slide.stats || []).map((stat) => {
        if ((stat.val || "").length <= 90) return stat;
        return {
          ...stat,
          val: stat.lbl || "Context",
          lbl: stat.val,
          full: true,
        };
      });
    }
  }
}

const israelPath = join(DRAFT_DIR, "israel-hamas-war.generated.json");
const israelEvents = await readJson(israelPath);
const rafah = israelEvents.find((event) => event.id === "rafah-and-philadelphi");
if (!rafah) throw new Error("Missing Rafah and Philadelphi event");
applyMarkers(rafah, rafahMarkers);
rafah.view.zoom = 11;
await writeJson(israelPath, israelEvents);
console.log("Corrected Rafah and Philadelphi Corridor markers");

for (const [id, eventsMarkers] of Object.entries(markerSets)) {
  const path = join(DRAFT_DIR, `${id}.generated.json`);
  const events = await readJson(path);
  for (const event of events) {
    const markers = eventsMarkers[event.id];
    if (markers) applyMarkers(event, markers);
  }
  const detail = summaryDetails[id];
  if (detail) {
    const summary = events.find((event) => event.id === detail.eventId);
    if (!summary) throw new Error(`Missing summary ${detail.eventId} in ${id}`);
    updateSummary(summary, detail);
  }
  normalizeLongStatValues(events);
  await writeJson(path, events);
  console.log(`Updated markers and summary for ${id}`);
}
