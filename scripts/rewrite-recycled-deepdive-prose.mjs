import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DRAFT_DIR = "C:\\Users\\alons\\Terra-Historia-Backend\\deepdives-drafts";
const TEMPLATE_TERMS = [
  "changed more than the local battlefield",
  "It affected morale, command decisions",
  "It also shaped the conditions for the next phase",
  "This background is essential to understanding",
  "The recorded indicators",
];

const addenda = {
  "bosnian-war": {
    "origins-and-background": "Bosnia's referendum and international recognition did not produce an agreed state because the principal nationalist movements held incompatible territorial projects. Bosnian Serb forces, supported by the Yugoslav military inheritance and Serbia, moved quickly to seize corridors and surround cities; Bosniak and Croat forces initially defended the republic together before their alliance fractured.",
    "siege-of-sarajevo": "The siege made civilian endurance the central image of the war. The airport airlift and tunnel kept the city alive, while repeated massacres exposed the limits of UN protection and gradually increased pressure for stronger international action.",
    "ethnic-cleansing": "Expulsion was used as a method of territorial control rather than as a side effect of combat. Camps around Prijedor, sexual-violence campaigns, killings, and forced transfers permanently changed settlement patterns and later supplied a vast body of evidence for international prosecutions.",
    "croat-bosniak-war": "The rupture opened a second front inside government-held Bosnia, divided Mostar, and devastated mixed communities in central Bosnia. The Washington Agreement reunited Croat and Bosniak forces in a federation, enabling the military cooperation that shifted the balance in 1995.",
    "srebrenica": "The genocide demonstrated the catastrophic failure of the UN safe-area system. Its scale accelerated demands for NATO action and became central to later convictions, missing-person identification, and the legal record defining genocide in Bosnia.",
    "operation-deliberate-force": "NATO airstrikes degraded Bosnian Serb communications, ammunition sites, and heavy weapons while Bosnian and Croatian ground offensives applied simultaneous pressure. The altered military balance made continued refusal to negotiate more costly and helped bring the parties to Dayton.",
    "dayton-accords": "Dayton stopped organized warfare and enabled refugee return, reconstruction, and international peacekeeping. It also embedded wartime entities and ethnic vetoes in Bosnia's constitution, trading immediate peace for a political system that remains difficult to reform.",
  },
  "iraq-war": {
    "origins-and-background": "The invasion case joined unresolved Gulf War confrontation to post-September 11 threat assessments, but its central WMD claim proved false. Planning succeeded at defeating Iraq's armed forces and removing the regime; preparation for occupation, institutional continuity, and political legitimacy was far weaker.",
    "invasion": "The campaign demonstrated overwhelming coalition conventional superiority and collapsed Iraq's organized defense within weeks. Speed concealed the harder problem: military victory removed the state leadership before a credible replacement security order existed.",
    "fall-of-baghdad": "The fall of the capital ended Baathist rule but opened a vacuum marked by looting and administrative collapse. Broad de-Baathification and dissolution of the Iraqi army excluded large numbers of armed, experienced men and helped convert defeat into insurgency.",
    "insurgency": "The insurgency combined former regime networks, local nationalists, foreign jihadists, and later sectarian organizations with different goals. Attacks on international agencies and Iraqi recruits narrowed reconstruction space, while Abu Musab al-Zarqawi deliberately targeted Shia civilians to provoke communal war.",
    "fallujah": "Coalition forces retook the city block by block and disrupted an important insurgent sanctuary. The battle also caused extensive destruction and displacement, and armed networks adapted by dispersing rather than disappearing.",
    "samarra-sectarian-war": "The shrine bombing accelerated death-squad killings, neighborhood expulsions, and retaliatory bombings. Baghdad became increasingly segregated, state institutions were penetrated by armed factions, and the conflict took on the character of a sectarian civil war.",
    "surge": "Additional US brigades mattered alongside the Sunni Awakening, ceasefires by Shia militias, and an exhausted population's rejection of indiscriminate violence. Security improved sharply, but disputed power sharing, corruption, detainee policy, and the exclusion of many Sunnis remained unresolved.",
    "us-withdrawal": "The withdrawal restored full formal responsibility to the Iraqi government but did not close the war's political fractures. Authoritarian consolidation in Baghdad, renewed Sunni alienation, and the Syrian war created conditions in which the Islamic State could return as a territorial army.",
  },
  "russo-ukrainian-war": {
    "origins-and-background": "Ukraine's Revolution of Dignity reopened the country's struggle over democratic government and alignment with Europe. The Kremlin treated the loss of influence in Kyiv as a strategic threat and answered through territorial seizure and proxy war, overturning the assumption that European borders would not be changed by force.",
    "annexation-of-crimea": "The operation gave Russia control of the peninsula and strengthened its Black Sea position without a prolonged initial battle. It also triggered sanctions, militarized Crimea, displaced opponents of annexation, and established the coercive model soon used in Donbas.",
    "war-in-donbas": "The seizure of Sloviansk and government buildings turned political unrest into sustained armed conflict. Russian matériel, personnel, and cross-border intervention prevented Kyiv from restoring control, while the front hardened around two unrecognized separatist entities.",
    "minsk-agreements": "Minsk II reduced the intensity of fighting but left sovereignty, security, elections, and border control in an intentionally disputed sequence. Because neither side accepted the other's order of implementation, the agreement managed the front without resolving the war.",
    "full-scale-invasion": "Russia's failure to seize Kyiv prevented regime change and transformed the invasion into a protracted war. Ukraine mobilized society, Western states imposed sweeping sanctions and expanded arms deliveries, and NATO reinforced its eastern flank while millions of Ukrainians fled their homes.",
    "siege-of-mariupol": "Capturing Mariupol completed a Russian-controlled land corridor toward Crimea and removed a major Ukrainian port from Kyiv's control. The method of victory left the city devastated, caused immense civilian loss, and made Azovstal a symbol of resistance and captivity.",
    "ukrainian-counteroffensives": "The Kharkiv breakthrough exploited thin Russian lines and recovered a large area before defenses could reorganize. Liberation of Kherson forced Russia behind the Dnipro, encouraged further Western support, and contributed to Moscow's mobilization and construction of deeper defensive belts.",
    "attritional-war": "The front became a contest of manpower, ammunition, industrial production, drones, electronic warfare, and layered fortifications. Local gains at enormous cost replaced rapid maneuver, making outside supply and each side's ability to regenerate forces as important as any single battle.",
  },
  "soviet-afghan-war": {
    "origins-and-background": "The Saur Revolution imposed radical reforms through a divided communist party whose repression widened rebellion. Soviet leaders feared the collapse of a neighboring allied government, but intervention tied Moscow to a regime with little rural legitimacy and converted an Afghan political crisis into an international proxy war.",
    "soviet-invasion": "The assault removed Hafizullah Amin and secured Kabul, airfields, and major garrisons with great speed. Moscow expected political stabilization under Babrak Karmal; instead, the foreign occupation broadened resistance and required an expanding military commitment.",
    "mujahideen-resistance": "Resistance remained fragmented by region, ideology, ethnicity, and patronage, yet Pakistan's sanctuary and foreign funding allowed it to survive losses. Soviet forces dominated cities and major roads but repeatedly surrendered rural ground after clearing operations ended.",
    "panjshir-offensives": "Ahmad Shah Massoud dispersed his forces, preserved local intelligence networks, and returned after Soviet columns withdrew. Repeated offensives inflicted damage but failed to create durable administration, showing the gap between entering a valley and controlling it politically.",
    "stinger-missiles": "Stingers increased the risk to low-flying aircraft and forced changes in Soviet aviation tactics. Their symbolic importance was large, but they complemented rather than replaced the broader pressures of sanctuary, arms flows, Afghan government weakness, Soviet casualties, and political change in Moscow.",
    "operation-magistral": "The operation reopened the Gardez-Khost road and demonstrated that Soviet and Afghan government forces could still coordinate a large conventional success. Once the supply mission ended, however, the strategic isolation of Khost and the nationwide insurgency remained.",
    "geneva-accords": "The accords provided international guarantees and a timetable for Soviet departure. They did not include a power-sharing settlement among Afghans, disarm the mujahideen, or end external aid, so withdrawal diplomacy coexisted with preparation for the next civil-war phase.",
    "soviet-withdrawal": "The final crossing ended direct Soviet occupation but not the government created under it. Najibullah survived for three more years with Soviet aid, while mujahideen factions failed to form a unified alternative and later fought over Kabul after his fall.",
  },
  "syrian-civil-war": {
    "origins-and-background": "The Daraa crackdown transformed demands for reform into a nationwide challenge to authoritarian rule. Militarization then fragmented the uprising among local rebels, Islamists, Kurdish forces, and jihadists, while foreign intervention gave the conflict several overlapping regional and international fronts.",
    "daraa-protests": "The arrest and torture of schoolchildren made local corruption and police abuse a national symbol. Funeral protests, lethal shootings, and failed concessions spread mobilization beyond Daraa and encouraged defections from a security apparatus ordered to suppress civilians.",
    "battle-of-aleppo": "Control of Syria's largest city divided between rebel east and government west, producing siege, bombardment, and immense displacement. The government's 2016 victory, enabled by Russian airpower and Iran-aligned ground forces, ended the opposition's best chance to hold a major urban capital.",
    "ghouta-chemical-attack": "The sarin attack brought the war to the edge of direct US intervention after President Obama's chemical-weapons warning. The resulting US-Russian agreement removed much of Syria's declared arsenal but left Assad in power and failed to prevent later chemical attacks.",
    "rise-of-isis": "ISIS erased parts of the Iraq-Syria border, captured oil fields and cities, and imposed mass violence under its caliphate. Fighting it redirected Western policy toward counterterrorism, strengthened Kurdish-led forces, and complicated the original contest between Assad and the rebellion.",
    "russian-intervention": "Russian aircraft and advisers prevented further government collapse and targeted a broad range of opposition forces as well as ISIS. The intervention restored Assad's strategic initiative and shifted diplomacy away from a negotiated transition toward arrangements shaped by Moscow, Tehran, and Ankara.",
    "fall-of-baghuz": "The capture of Baghuz ended ISIS control of a territorial state but not its clandestine network. Thousands of detainees and families entered prisons and camps in northeastern Syria, creating an unresolved security and humanitarian burden for Kurdish-led authorities.",
    "fall-of-assad": "The rapid offensive exposed how dependent the regime had become on exhausted foreign-backed military structures. Assad's flight ended dynastic rule, but the victory left a fragmented country containing armed factions, foreign troops, displaced populations, and unresolved Kurdish and regional questions.",
  },
  "yugoslav-wars": {
    "origins-and-background": "Debt, inflation, constitutional paralysis, and competing republican leaderships weakened the federation after Tito. Milošević's centralizing use of Serbian institutions and the Yugoslav army intensified fears elsewhere, while nationalist leaders increasingly treated mixed populations and republican borders as security threats.",
    "ten-day-war": "Slovenia's cohesive institutions, limited Serb minority, and control of border posts made the conflict difficult for the federal army to escalate politically. The Brioni Agreement enabled a JNA withdrawal and demonstrated that Yugoslavia could no longer compel every republic to remain.",
    "croatian-war": "Croatia's war was longer because substantial Serb communities, JNA support, and contested territory made separation inseparable from borders. Vukovar, Dubrovnik, Krajina, and mass displacement internationalized the crisis and introduced patterns later repeated in Bosnia.",
    "bosnian-war": "Bosnia's mixed geography made clean territorial separation impossible without siege, detention, expulsion, and massacre. The war produced the largest death toll of Yugoslavia's breakup, the Srebrenica genocide, and a sustained international effort to keep Bosnia as one state.",
    "nato-bosnia": "Operation Deliberate Force combined with Bosnian and Croatian ground advances to reduce Bosnian Serb leverage. The resulting pressure did not settle every grievance, but it created the military conditions under which all parties accepted negotiations at Dayton.",
    "kosovo-war": "NATO intervention forced Yugoslav forces to withdraw from Kosovo and placed the territory under international administration. It also established a disputed precedent for intervention without explicit new Security Council authorization and was followed by further displacement and reprisals against Serbs and Roma.",
    "milosevic-falls": "The October uprising defended an electoral result rather than winning a battlefield. Milošević's removal enabled extradition and closer ties with Europe, but it did not erase nationalist institutions, economic damage, or unresolved questions over Kosovo and Montenegro.",
    "ohrid-agreement": "The agreement ended the Macedonian insurgency through decentralization, language rights, and greater Albanian participation in state institutions. Its power-sharing model prevented the final major conflict of Yugoslav dissolution from expanding into another prolonged war.",
  },
};

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8").replace(/^\uFEFF/, ""));
}

function writeJson(path, data) {
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function hasTemplate(body = "") {
  return TEMPLATE_TERMS.some((term) => body.includes(term));
}

function factualOpening(body) {
  const cuts = ["\n\nAs an early episode", "\n\nAs a central episode", "\n\nAs a late episode", "\n\nThis background is essential"];
  let end = body.length;
  for (const cut of cuts) {
    const index = body.indexOf(cut);
    if (index >= 0) end = Math.min(end, index);
  }
  return body.slice(0, end).trim();
}

for (const [id, replacements] of Object.entries(addenda)) {
  const path = join(DRAFT_DIR, `${id}.generated.json`);
  const events = readJson(path);
  let changed = 0;

  for (const event of events) {
    const slide = event.slides?.[0];
    if (!slide || !hasTemplate(slide.body)) continue;
    const replacement = replacements[event.id];
    if (!replacement) throw new Error(`Missing custom replacement for ${id}/${event.id}`);
    slide.body = `${factualOpening(slide.body)}\n\n${replacement}`;
    changed += 1;
  }

  const remaining = events.flatMap((event) =>
    (event.slides || []).filter((slide) => hasTemplate(slide.body)).map(() => event.id)
  );
  if (remaining.length) throw new Error(`Template prose remains in ${id}: ${remaining.join(", ")}`);

  writeJson(path, events);
  console.log(`Rewrote ${changed} templated events in ${id}`);
}
