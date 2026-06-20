import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const BACKEND = "C:\\Users\\alons\\Terra-Historia-Backend";
const DRAFTS = join(BACKEND, "deepdives-drafts");
const INDEX = join(BACKEND, "deepdives-index.json");

const images = {
  intifada: "https://commons.wikimedia.org/wiki/Special:FilePath/Gaza_Strip_map2.svg",
  lebanon2006: "https://commons.wikimedia.org/wiki/Special:FilePath/2006_Lebanon_War._CLII.jpg",
  gaza: "https://commons.wikimedia.org/wiki/Special:FilePath/Gaza_Strip_map2.svg",
  gaza2014: "https://commons.wikimedia.org/wiki/Special:FilePath/Gaza_Strip_map2.svg",
  gaza2021: "https://commons.wikimedia.org/wiki/Special:FilePath/IDF_Iron_Dome_2021.jpg",
  oct7: "https://commons.wikimedia.org/wiki/Special:FilePath/IDF_Iron_Dome_2021.jpg",
  iran2025: "https://commons.wikimedia.org/wiki/Special:FilePath/Pictures_of_the_Israeli_attack_on_Tehran_1_Mehr_(2).jpg",
  iran2026: "https://commons.wikimedia.org/wiki/Special:FilePath/Pictures_of_the_Israeli_attack_on_Tehran_1_Mehr_(2).jpg",
  lebanon2026: "https://commons.wikimedia.org/wiki/Special:FilePath/2006_Lebanon_War._CLII.jpg",
};

const event = (id, date, title, body, stats = [], view = [31.5, 34.8], img = "") => ({
  id,
  year: Number(date.slice(0, 4)),
  date,
  title,
  sub: "",
  view: { center: view, zoom: view[0] === 31.5 ? 5 : 4 },
  markers: [],
  regions: [],
  slides: [{ title, img, cap: `Historical overview: ${title}`, body, stats }],
});

const stat = (val, lbl, full = false) => ({ val, lbl, ...(full ? { full: true } : {}) });

function dive({ id, title, previous, connection, period, stakes, img, events, summary, outcome, cost }) {
  const origin = event(
    "origins-and-background",
    period.start,
    `From ${previous} to ${title}`,
    `${connection}\n\n${stakes}`,
    [
      stat(previous, "Previous conflict in this path"),
      stat(period.label, "Conflict period"),
      stat(stakes, "Israeli security perspective", true),
    ],
    [31.5, 34.8],
    img,
  );
  origin.sub = `Connection and background to ${title}`;

  for (const item of events) {
    item.sub = `Part of ${title}`;
    item.slides[0].img ||= img;
  }

  const end = event(
    "conflict-summary",
    period.end,
    `Conflict Summary: ${title}`,
    summary,
    [
      stat(outcome, "Outcome / present status"),
      stat(cost, "Human cost"),
      stat(summary, "Final assessment", true),
    ],
    [31.5, 34.8],
    img,
  );
  end.sub = `Final summary of ${title}`;
  return [origin, ...events, end];
}

const dives = [
  {
    id: "second-intifada",
    title: "Second Intifada",
    description: "Follow Israel's struggle against the suicide bombings and armed attacks of the Second Intifada, from the collapse of negotiations to the 2005 ceasefire.",
    image: images.intifada,
    data: dive({
      id: "second-intifada",
      title: "Second Intifada",
      previous: "South Lebanon Conflict",
      connection: "Israel's May 2000 withdrawal from southern Lebanon was presented by Hezbollah as proof that sustained attacks could force Israeli retreats. Months later, failed peace negotiations, disputes over Jerusalem, and Palestinian anger erupted into a far more violent uprising.",
      period: { start: "2000-09-28", end: "2005-02-08", label: "2000-2005" },
      stakes: "For Israel, the central challenge became protecting buses, restaurants, hotels, and city streets from suicide bombings while trying to dismantle armed networks without abandoning the possibility of a political settlement.",
      img: images.intifada,
      events: [
        event("outbreak", "2000-09-28", "Outbreak of the Uprising", "Clashes following Ariel Sharon's visit to the Temple Mount/Haram al-Sharif rapidly spread. Demonstrations, shootings, and armed attacks replaced the already-fragile peace process with an escalating security crisis.", [stat("September 2000", "Violence begins"), stat("Peace process collapses", "Strategic turning point")], [31.78, 35.23]),
        event("dolphinarium-bombing", "2001-06-01", "Dolphinarium Bombing", "A Hamas suicide bomber killed 21 Israelis, mostly teenagers, outside a Tel Aviv nightclub. The attack became one of the clearest symbols of the campaign against Israeli civilians and intensified demands for stronger defensive action.", [stat("21 killed", "Mostly teenagers"), stat("Tel Aviv", "Attack location")], [32.07, 34.76]),
        event("passover-massacre", "2002-03-27", "Passover Massacre", "A Hamas suicide bombing at a Passover seder in Netanya killed 30 people. Coming during a wave of attacks, it triggered broad Israeli public support for a major operation against militant infrastructure in the West Bank.", [stat("30 killed", "Israeli civilians"), stat("Passover seder", "Targeted gathering")], [32.33, 34.86]),
        event("operation-defensive-shield", "2002-03-29", "Operation Defensive Shield", "Israel launched its largest West Bank operation since 1967, entering major Palestinian cities, arresting militants, seizing weapons, and disrupting bomb-making networks. Fighting in Jenin and the siege of Yasser Arafat's compound drew intense international scrutiny.", [stat("March-May 2002", "Major IDF operation"), stat("West Bank cities", "Primary theater")], [31.9, 35.2]),
        event("security-barrier", "2002-06-01", "Security Barrier and Intelligence Campaign", "Israel combined intelligence-led arrests, targeted killings, checkpoints, and construction of a security barrier. Supporters credited these measures with sharply reducing suicide bombings; critics challenged the barrier's route and its effects on Palestinians.", [stat("Sharp attack decline", "Israeli security result"), stat("Contested route", "Political and legal dispute")], [31.9, 35.1]),
        event("sharm-el-sheikh", "2005-02-08", "Sharm el-Sheikh Ceasefire", "Ariel Sharon and Mahmoud Abbas declared an end to hostilities at Sharm el-Sheikh. Organized violence declined, although no final peace agreement followed and the conflict's political causes remained unresolved.", [stat("8 Feb 2005", "Ceasefire summit"), stat("No final settlement", "Conflict remained unresolved")], [27.91, 34.33]),
      ],
      summary: "Israel suppressed the mass-casualty bombing campaign and restored greater day-to-day security, but paid a heavy human cost and emerged with reduced confidence in negotiations. Palestinian casualties and restrictions were extensive, and the unresolved conflict soon shifted toward Gaza.",
      outcome: "Violence greatly reduced; no political settlement",
      cost: "More than 1,000 Israelis and roughly 3,000 Palestinians killed",
    }),
  },
  {
    id: "2006-lebanon-war",
    title: "2006 Lebanon War",
    description: "Explore Israel's 2006 war against Hezbollah after a cross-border raid, from the rocket campaign to UN Security Council Resolution 1701.",
    image: images.lebanon2006,
    data: dive({
      title: "2006 Lebanon War",
      previous: "South Lebanon Conflict",
      connection: "Israel withdrew from southern Lebanon in 2000, but Hezbollah remained armed, expanded its Iranian-supplied rocket arsenal, and continued cross-border attacks. The unresolved border confrontation erupted into war after Hezbollah killed and abducted Israeli soldiers.",
      period: { start: "2006-07-12", end: "2006-08-14", label: "12 July-14 August 2006" },
      stakes: "Israel sought to recover its soldiers, stop rocket fire on northern communities, and restore deterrence against an Iranian-backed force operating across the border.",
      img: images.lebanon2006,
      events: [
        event("cross-border-raid", "2006-07-12", "Hezbollah Cross-Border Raid", "Hezbollah attacked an Israeli patrol, killed eight soldiers, and abducted Ehud Goldwasser and Eldad Regev. Israel responded with airstrikes and a blockade, beginning a 34-day war.", [stat("8 soldiers killed", "Opening attack"), stat("2 soldiers abducted", "Immediate Israeli objective")], [33.1, 35.55]),
        event("rocket-war", "2006-07-13", "Rocket War on Northern Israel", "Hezbollah fired thousands of rockets into northern Israel, forcing civilians into shelters and displacing communities. The sustained bombardment demonstrated the strategic threat posed by large militant rocket arsenals.", [stat("About 4,000 rockets", "Fired at Israel"), stat("Northern Israel", "Civilian front")], [32.8, 35.0]),
        event("air-and-naval-campaign", "2006-07-14", "Air and Naval Campaign", "Israel struck Hezbollah command sites, launchers, roads, and suspected weapons routes. A Hezbollah anti-ship missile hit INS Hanit, killing four sailors and exposing an unexpected capability.", [stat("INS Hanit hit", "Hezbollah anti-ship missile"), stat("4 sailors killed", "Naval loss")], [33.0, 35.2]),
        event("bint-jbeil", "2006-07-24", "Battle of Bint Jbeil", "Israeli forces fought entrenched Hezbollah units in and around Bint Jbeil. The difficult battle revealed Hezbollah's preparation, anti-tank capabilities, and ability to operate from fortified village networks.", [stat("Close urban combat", "Battle character"), stat("Fortified positions", "Hezbollah preparation")], [33.12, 35.43]),
        event("litani-offensive", "2006-08-11", "Final Push Toward the Litani", "As diplomacy neared a ceasefire, Israel expanded ground operations toward the Litani River. The late offensive gained territory but caused significant casualties and remained controversial inside Israel.", [stat("Litani River", "Operational objective"), stat("Late-war offensive", "Controversial decision")], [33.3, 35.4]),
        event("resolution-1701", "2006-08-14", "Ceasefire and Resolution 1701", "UN Security Council Resolution 1701 ended major fighting, expanded UNIFIL, and called for an area south of the Litani free of unauthorized armed personnel. Hezbollah nevertheless retained and later expanded its arsenal.", [stat("34 days", "War duration"), stat("UNSCR 1701", "Ceasefire framework")], [33.85, 35.86]),
      ],
      summary: "Israel damaged Hezbollah and secured a long period of relative border quiet, but failed to disarm the organization or immediately recover the abducted soldiers. The war exposed weaknesses in Israeli readiness and left Hezbollah's growing missile arsenal as a future threat.",
      outcome: "Ceasefire; inconclusive military result",
      cost: "About 165 Israelis and more than 1,000 Lebanese killed",
    }),
  },
  {
    id: "gaza-war-2008-2009",
    title: "Gaza War (2008-2009)",
    description: "Follow Operation Cast Lead, Israel's campaign to reduce Hamas rocket fire and weapons smuggling from Gaza.",
    image: images.gaza,
    data: dive({
      title: "Gaza War (2008-2009)",
      previous: "Second Intifada",
      connection: "After the Second Intifada, Israel disengaged from Gaza in 2005. Hamas seized control in 2007, rocket fire on southern Israel continued, and a six-month truce collapsed amid attacks, raids, and accusations by both sides.",
      period: { start: "2008-12-27", end: "2009-01-18", label: "27 December 2008-18 January 2009" },
      stakes: "Israel aimed to stop rocket attacks on southern towns, damage Hamas's military organization, and disrupt weapons smuggling while limiting Israeli military losses.",
      img: images.gaza,
      events: [
        event("opening-airstrikes", "2008-12-27", "Opening Airstrikes", "Operation Cast Lead opened with coordinated strikes on Hamas security and military sites. Israel sought tactical surprise and rapid disruption of rocket-launching and command networks.", [stat("27 Dec 2008", "Operation begins"), stat("Operation Cast Lead", "Israeli campaign name")], [31.5, 34.47]),
        event("rocket-fire", "2008-12-28", "Rockets Reach Deeper into Israel", "Hamas and other groups continued firing rockets, reaching Ashdod and Beersheba. The expanding range reinforced Israeli fears that inaction would leave more cities exposed.", [stat("Ashdod and Beersheba", "Cities reached"), stat("3 civilians killed", "Israeli rocket fatalities")], [31.8, 34.65]),
        event("ground-operation", "2009-01-03", "Ground Operation Begins", "Israeli brigades entered Gaza to encircle urban areas, seize launch zones, and destroy tunnels and weapons sites. The IDF avoided a full occupation but fought in densely populated terrain.", [stat("3 Jan 2009", "Ground phase begins"), stat("Combined arms", "Air, land, and naval campaign")], [31.45, 34.45]),
        event("humanitarian-controversies", "2009-01-06", "Urban Fighting and Humanitarian Crisis", "Heavy fighting caused extensive Palestinian civilian casualties and infrastructure damage. Israel argued Hamas operated from civilian areas; international investigations and rights groups raised serious allegations about Israeli conduct.", [stat("Dense urban battlefield", "Operational challenge"), stat("International scrutiny", "Long-term consequence")], [31.5, 34.45]),
        event("unilateral-ceasefire", "2009-01-18", "Unilateral Ceasefire", "Israel declared a unilateral ceasefire after damaging Hamas forces and tunnel networks. Hamas announced its own ceasefire hours later, and rocket fire temporarily declined.", [stat("22 days", "War duration"), stat("Rocket fire reduced", "Immediate Israeli result")], [31.5, 34.47]),
      ],
      summary: "Operation Cast Lead temporarily reduced rocket fire and damaged Hamas, but it did not remove Hamas from power or resolve Gaza's isolation and recurring conflict. The severe Palestinian death toll and destruction generated lasting international criticism.",
      outcome: "Israeli military victory; temporary reduction in rocket fire",
      cost: "13 Israelis and roughly 1,200-1,400 Palestinians killed",
    }),
  },
  {
    id: "2012-gaza-war",
    title: "2012 Gaza War",
    description: "Trace Operation Pillar of Defense, the eight-day confrontation that tested Iron Dome and ended through Egyptian mediation.",
    image: images.gaza,
    data: dive({
      title: "2012 Gaza War",
      previous: "Gaza War (2008-2009)",
      connection: "The 2009 ceasefire reduced but did not end attacks from Gaza. Repeated rocket fire, Israeli strikes, and border incidents created another escalation cycle by November 2012.",
      period: { start: "2012-11-14", end: "2012-11-21", label: "14-21 November 2012" },
      stakes: "Israel sought to restore quiet for southern communities, degrade longer-range rockets, and avoid a costly ground invasion.",
      img: images.gaza,
      events: [
        event("killing-ahmed-jabari", "2012-11-14", "Strike on Ahmed Jabari", "Israel opened Operation Pillar of Defense by killing Ahmed Jabari, commander of Hamas's military wing, and striking rocket sites. The action followed a sharp escalation in attacks on southern Israel.", [stat("14 Nov 2012", "Operation begins"), stat("Ahmed Jabari", "Hamas military commander killed")], [31.5, 34.47]),
        event("rockets-tel-aviv-jerusalem", "2012-11-15", "Rockets Target Tel Aviv and Jerusalem", "Longer-range rockets reached the Tel Aviv and Jerusalem areas, showing that Gaza-based groups could threaten Israel's largest population centers and political heartland.", [stat("Tel Aviv and Jerusalem", "Areas targeted"), stat("Longer-range rockets", "Strategic change")], [32.0, 34.8]),
        event("iron-dome", "2012-11-17", "Iron Dome Proves Its Value", "Iron Dome intercepted hundreds of rockets assessed as heading toward populated areas. Its performance reduced casualties and gave Israeli leaders greater time and flexibility before considering a ground operation.", [stat("Hundreds intercepted", "Missile-defense role"), stat("Ground invasion avoided", "Strategic effect")], [31.8, 34.7]),
        event("ceasefire", "2012-11-21", "Egyptian-Mediated Ceasefire", "Egypt and the United States helped broker a ceasefire after eight days. Israel halted its strikes and Gaza groups stopped rocket fire, though the underlying military buildup continued.", [stat("8 days", "Conflict duration"), stat("Egyptian mediation", "Ceasefire channel")], [30.0, 31.2]),
      ],
      summary: "Israel restored temporary quiet without a ground invasion and demonstrated Iron Dome's strategic importance. Hamas survived and continued rebuilding, making the ceasefire another pause rather than a durable settlement.",
      outcome: "Ceasefire and return to status quo",
      cost: "6 Israelis and roughly 160 Palestinians killed",
    }),
  },
  {
    id: "2014-gaza-war",
    title: "2014 Gaza War",
    description: "Explore Operation Protective Edge, from rocket fire and tunnel warfare to a ceasefire after fifty days.",
    image: images.gaza2014,
    data: dive({
      title: "2014 Gaza War",
      previous: "2012 Gaza War",
      connection: "The 2012 ceasefire left Hamas in power and did not stop military rebuilding. The kidnapping and murder of three Israeli teenagers, West Bank arrests, reciprocal attacks, and renewed rocket fire produced another rapid escalation.",
      period: { start: "2014-07-08", end: "2014-08-26", label: "8 July-26 August 2014" },
      stakes: "Israel aimed to stop sustained rocket attacks and destroy cross-border attack tunnels that threatened nearby Israeli communities.",
      img: images.gaza2014,
      events: [
        event("operation-protective-edge", "2014-07-08", "Operation Protective Edge Begins", "Israel began airstrikes after intensified rocket fire from Gaza. Hamas launched rockets across much of Israel, while Iron Dome limited casualties in populated areas.", [stat("8 Jul 2014", "Operation begins"), stat("Thousands of rockets", "Threat to Israeli communities")], [31.5, 34.47]),
        event("zikkim-infiltration", "2014-07-08", "Zikim Sea Infiltration", "Hamas naval commandos attempted to enter Israel near Zikim. Israeli forces stopped the raid, but it demonstrated Hamas's effort to bypass border defenses with specialized units.", [stat("Naval commandos", "Hamas tactic"), stat("Raid stopped", "Israeli result")], [31.61, 34.52]),
        event("ground-invasion-tunnels", "2014-07-17", "Ground Operation Against Tunnels", "Israel launched a ground operation after discovering cross-border tunnels used for attacks. Tunnel destruction became the central Israeli objective and brought intense combat in northern and eastern Gaza.", [stat("Cross-border tunnels", "Primary ground objective"), stat("17 Jul 2014", "Ground phase begins")], [31.5, 34.5]),
        event("shuja-iyya", "2014-07-20", "Battle of Shuja'iyya", "Israeli troops fought a major battle in a heavily fortified neighborhood used by Hamas forces. Thirteen Golani soldiers and many Palestinians were killed, illustrating the severe cost of urban combat.", [stat("13 Golani soldiers killed", "Israeli loss"), stat("Heavy Palestinian casualties", "Human cost")], [31.5, 34.48]),
        event("hadar-goldin", "2014-08-01", "Rafah Attack and Hadar Goldin", "During a humanitarian ceasefire, Hamas fighters attacked Israeli troops near Rafah, killing two and taking the body of Lieutenant Hadar Goldin. The event triggered intense Israeli fire and became a lasting national issue.", [stat("1 Aug 2014", "Ceasefire collapses"), stat("Hadar Goldin", "Body held by Hamas")], [31.3, 34.25]),
        event("ceasefire", "2014-08-26", "Open-Ended Ceasefire", "Egypt brokered an open-ended ceasefire after fifty days. Israel had destroyed many tunnels and degraded Hamas, but rocket threats and the political struggle over Gaza remained.", [stat("50 days", "War duration"), stat("Egyptian ceasefire", "End of major fighting")], [30.0, 31.2]),
      ],
      summary: "Israel destroyed many attack tunnels and reduced immediate rocket fire, but Hamas remained in control and both sides prepared for future conflict. The war caused major Israeli military losses and devastating Palestinian casualties and destruction.",
      outcome: "Ceasefire; Hamas remained in power",
      cost: "73 Israelis and more than 2,100 Palestinians killed",
    }),
  },
  {
    id: "2021-israel-palestine-crisis",
    title: "2021 Israel-Palestine Crisis",
    description: "Follow Operation Guardian of the Walls, from Jerusalem unrest and Hamas rocket fire to Israel's campaign against Gaza tunnel networks.",
    image: images.gaza2021,
    data: dive({
      title: "2021 Israel-Palestine Crisis",
      previous: "2014 Gaza War",
      connection: "The 2014 ceasefire produced years of uneasy deterrence, but Hamas rebuilt rockets and tunnels. Tensions in Jerusalem during Ramadan, clashes at the Temple Mount/Al-Aqsa, and political competition among Palestinian factions set off a new confrontation.",
      period: { start: "2021-05-10", end: "2021-05-21", label: "10-21 May 2021" },
      stakes: "Israel sought to stop rocket attacks, defend Jerusalem and Israeli cities, and damage Hamas's underground network while containing communal violence inside Israel.",
      img: images.gaza2021,
      events: [
        event("jerusalem-ultimatum", "2021-05-10", "Hamas Rockets Toward Jerusalem", "Hamas issued an ultimatum over events in Jerusalem and then fired rockets toward the city. Israel began Operation Guardian of the Walls in response.", [stat("10 May 2021", "War begins"), stat("Jerusalem targeted", "Escalatory threshold")], [31.78, 35.23]),
        event("mass-rocket-barrages", "2021-05-11", "Mass Rocket Barrages", "Hamas and Palestinian Islamic Jihad fired large salvos toward Israeli population centers. Iron Dome intercepted most rockets headed for populated areas, but attacks still killed civilians and disrupted daily life.", [stat("About 4,360 rockets", "Fired toward Israel"), stat("Iron Dome", "Core civilian defense")], [32.0, 34.8]),
        event("communal-violence", "2021-05-11", "Communal Violence Inside Israel", "Arab-Jewish riots, arson, assaults, and shootings spread through mixed cities including Lod and Acre. The internal unrest created a second security crisis alongside the Gaza fighting.", [stat("Lod and Acre", "Major unrest centers"), stat("Internal security crisis", "Distinctive feature")], [31.95, 34.9]),
        event("attack-on-the-metro", "2021-05-14", "Strikes on the Hamas 'Metro'", "Israel conducted large airstrikes against Hamas's underground tunnel network, which the IDF called the Metro. The operation aimed to disrupt command, movement, and protection systems beneath Gaza.", [stat("Underground network", "Primary Israeli target"), stat("No ground invasion", "Operational choice")], [31.5, 34.47]),
        event("ceasefire", "2021-05-21", "Ceasefire", "An Egyptian-mediated ceasefire ended eleven days of fighting. Israel said it had significantly damaged Hamas capabilities, while Hamas claimed political success for linking itself to Jerusalem.", [stat("11 days", "Conflict duration"), stat("Ceasefire", "Return to uneasy deterrence")], [31.5, 34.47]),
      ],
      summary: "Israel's missile defenses and air campaign limited the effect of mass rocket fire and damaged Hamas infrastructure, but Hamas retained control and claimed greater regional stature. The riots inside Israel exposed an additional challenge to national resilience.",
      outcome: "Ceasefire; both sides claimed victory",
      cost: "15 in Israel and roughly 250 Palestinians killed",
    }),
  },
  {
    id: "israel-hamas-war",
    title: "Israel-Hamas War",
    description: "Trace the war that began with Hamas's October 7 attack, Israel's campaign in Gaza, hostage operations, and the fragile ceasefire through June 2026.",
    image: images.oct7,
    data: dive({
      title: "Israel-Hamas War",
      previous: "2021 Israel-Palestine Crisis",
      connection: "After the 2021 ceasefire, Israel relied on deterrence, border technology, and limited economic relief while Hamas secretly prepared a large assault. That security concept collapsed on October 7, 2023.",
      period: { start: "2023-10-07", end: "2026-06-14", label: "7 October 2023-present" },
      stakes: "Israel's declared goals became returning the hostages, dismantling Hamas's military and governing capabilities, and ensuring Gaza could no longer launch an October 7-style attack.",
      img: images.oct7,
      events: [
        event("october-7-attacks", "2023-10-07", "October 7 Attacks", "Hamas-led forces breached the Gaza border, attacked communities and a music festival, killed about 1,200 people, and abducted 251 hostages. It was the deadliest day in Israel's history and the country's worst security failure.", [stat("About 1,200 killed", "Mostly civilians"), stat("251 hostages", "Taken into Gaza")], [31.4, 34.5]),
        event("air-campaign-and-mobilization", "2023-10-08", "Air Campaign and Mobilization", "Israel declared war, mobilized hundreds of thousands of reservists, evacuated border communities, and began an extensive air campaign. The scale of strikes and siege conditions rapidly created a severe humanitarian crisis in Gaza.", [stat("Mass reserve call-up", "Israeli mobilization"), stat("Humanitarian crisis", "Gaza consequence")], [31.5, 34.47]),
        event("ground-invasion", "2023-10-27", "Ground Invasion of Gaza", "Israeli ground forces entered northern Gaza, encircled Gaza City, and fought through a dense network of tunnels and fortified positions. The campaign dismantled many Hamas units but caused extensive destruction.", [stat("27 Oct 2023", "Ground operation expands"), stat("Tunnel warfare", "Central challenge")], [31.5, 34.47]),
        event("first-hostage-deal", "2023-11-24", "First Hostage Deal", "A temporary truce enabled the release of more than one hundred hostages in exchange for Palestinian prisoners and increased aid. The agreement showed diplomacy could recover captives, but fighting resumed after one week.", [stat("More than 100 hostages released", "Truce result"), stat("One-week pause", "Temporary agreement")], [31.5, 34.47]),
        event("rafah-and-philadelphi", "2024-05-06", "Rafah and the Philadelphi Corridor", "Israel entered Rafah and seized the Gaza side of the Egypt border corridor, arguing this was necessary to cut smuggling routes and dismantle Hamas's remaining organized battalions. The operation intensified international concern for displaced civilians.", [stat("Rafah", "Final major Gaza stronghold"), stat("Philadelphi Corridor", "Border-security objective")], [31.3, 34.25]),
        event("hostage-rescue", "2024-06-08", "Operation Arnon", "Israeli forces rescued four hostages alive from Nuseirat in a complex daylight raid. An Israeli officer and many Palestinians were killed, making it both a major national success and a source of renewed controversy over civilian harm.", [stat("4 hostages rescued", "Israeli operational success"), stat("Daylight raid", "High-risk operation")], [31.45, 34.4]),
        event("fragile-ceasefire", "2026-06-14", "Fragile Ceasefire and Unresolved Endgame", "A later ceasefire reduced major fighting and enabled further hostage arrangements, but strikes and clashes continued. As of June 14, 2026, Hamas's disarmament, Israeli withdrawal, reconstruction, and Gaza's future government remain unresolved.", [stat("Ongoing as of 14 Jun 2026", "Present status"), stat("Core issues unresolved", "Political endgame")], [31.5, 34.47]),
      ],
      summary: "Israel severely damaged Hamas and recovered many hostages, but the war remains politically and morally unresolved. October 7 transformed Israeli security thinking, while Gaza suffered immense casualties, displacement, and destruction. A fragile ceasefire has not yet produced a durable postwar order.",
      outcome: "Fragile ceasefire; final settlement unresolved",
      cost: "About 1,200 killed in the October 7 attack; Gaza authorities report more than 73,000 Palestinian deaths by June 14, 2026",
    }),
  },
  {
    id: "twelve-day-war",
    title: "Twelve-Day War",
    description: "Explore Israel's June 2025 campaign against Iran's nuclear and missile programs and Iran's direct missile retaliation.",
    image: images.iran2025,
    data: dive({
      title: "Twelve-Day War",
      previous: "Israel-Hamas War",
      connection: "The Gaza war expanded into a regional struggle with Iran's allied groups and direct Iran-Israel exchanges in 2024. Israel concluded that Iran's advancing nuclear program and missile arsenal required direct action rather than continued proxy containment.",
      period: { start: "2025-06-13", end: "2025-06-24", label: "13-24 June 2025" },
      stakes: "Israel aimed to delay Iran's nuclear and ballistic-missile programs, remove senior military leadership, and demonstrate that distance would not protect threats to Israeli survival.",
      img: images.iran2025,
      events: [
        event("operation-rising-lion", "2025-06-13", "Operation Rising Lion", "Israel launched surprise strikes across Iran against nuclear facilities, missile infrastructure, air defenses, commanders, and scientists. Years of intelligence preparation enabled a broad opening attack.", [stat("13 Jun 2025", "War begins"), stat("Surprise operation", "Israeli advantage")], [32.4, 53.7]),
        event("iranian-missile-retaliation", "2025-06-14", "Iranian Missile Retaliation", "Iran fired ballistic missiles and drones at Israel. Missile defenses intercepted many, but impacts killed civilians and damaged homes and strategic sites, demonstrating the danger of direct war.", [stat("Ballistic missiles and drones", "Iranian response"), stat("Israeli civilians killed", "Home-front cost")], [31.8, 34.8]),
        event("air-superiority", "2025-06-16", "Israeli Air Superiority Over Iran", "Israel reported gaining freedom of action over large parts of Iran after striking air defenses and launchers. Repeated sorties targeted missile production and military infrastructure deep inside the country.", [stat("Long-range sorties", "Israeli air campaign"), stat("Air defenses degraded", "Operational result")], [32.4, 53.7]),
        event("us-nuclear-strikes", "2025-06-22", "United States Strikes Nuclear Sites", "The United States entered the war by striking Fordow, Natanz, and Isfahan nuclear facilities. The intervention significantly increased damage to Iran's nuclear program and widened the conflict.", [stat("Fordow, Natanz, Isfahan", "Nuclear sites struck"), stat("US enters war", "Strategic escalation")], [32.0, 52.0]),
        event("ceasefire", "2025-06-24", "Ceasefire", "A ceasefire ended twelve days of fighting. Israel said the campaign removed an immediate existential threat; Iran's capabilities were damaged but not permanently eliminated.", [stat("12 days", "War duration"), stat("24 Jun 2025", "Ceasefire")], [32.4, 53.7]),
      ],
      summary: "Israel demonstrated extraordinary intelligence reach and air power and, with the United States, seriously damaged Iran's nuclear and missile infrastructure. The campaign bought time rather than a permanent solution, and Iran rebuilt enough capability for war to return in 2026.",
      outcome: "Ceasefire after major damage to Iranian capabilities",
      cost: "Civilian and military casualties in Iran and Israel; exact totals remain disputed",
    }),
  },
  {
    id: "2026-lebanon-war",
    title: "2026 Lebanon War",
    description: "Follow the renewed Israel-Hezbollah war that began in March 2026 and remains ongoing alongside the wider Iran conflict.",
    image: images.lebanon2026,
    data: dive({
      title: "2026 Lebanon War",
      previous: "2006 Lebanon War",
      connection: "Resolution 1701 did not disarm Hezbollah, which built a far larger missile arsenal after 2006. Fighting resumed after October 7, 2023, a 2024 ceasefire failed to prevent renewed buildup, and Hezbollah returned to major attacks during the 2026 Iran war.",
      period: { start: "2026-03-02", end: "2026-06-14", label: "2 March 2026-present" },
      stakes: "Israel seeks to end Hezbollah's ability to threaten northern communities, enforce a weapons-free border zone, and prevent Iran from using Lebanon as a permanent missile front.",
      img: images.lebanon2026,
      events: [
        event("hezbollah-renews-fire", "2026-03-02", "Hezbollah Renews Major Fire", "Hezbollah launched projectiles into northern Israel for the first time since the 2024 ceasefire. Israel responded with wide strikes in Beirut, southern Lebanon, and the Bekaa Valley.", [stat("2 Mar 2026", "War begins"), stat("Northern Israel", "Primary Israeli home front")], [33.3, 35.5]),
        event("ground-operations", "2026-03-16", "Israeli Ground Operations", "Israeli forces began ground operations in southern Lebanon, seeking to push Hezbollah away from the border and dismantle fortified positions, tunnels, and launch sites.", [stat("16 Mar 2026", "Ground phase begins"), stat("Southern Lebanon", "Main theater")], [33.2, 35.5]),
        event("litani-security-zone", "2026-03-24", "Security Zone Toward the Litani", "Israeli leaders declared an intention to control a security zone toward the Litani River until Hezbollah's threat was removed. The move reflected deep Israeli distrust of unenforced diplomatic guarantees.", [stat("Litani River", "Declared security depth"), stat("Hezbollah disarmament", "Israeli objective")], [33.3, 35.4]),
        event("operation-eternal-darkness", "2026-04-08", "Operation Eternal Darkness", "Israel launched a major wave against Hezbollah command centers, missile infrastructure, and elite units across Lebanon. Israel said Lebanon was not included in the Iran ceasefire.", [stat("More than 100 targets", "Israeli claim in opening wave"), stat("8 Apr 2026", "Major escalation")], [33.6, 35.5]),
        event("bint-jbeil-fighting", "2026-04-10", "Battle for Bint Jbeil", "Bint Jbeil again became a central battlefield as Israeli forces and Hezbollah fought for control. The battle connected the current war directly to the unresolved military geography of 2006.", [stat("Bint Jbeil", "Major battle zone"), stat("Ongoing combat", "As of June 2026")], [33.12, 35.43]),
      ],
      summary: "As of June 14, 2026, Israel continues operations intended to prevent Hezbollah from rebuilding on its border and to restore lasting security for northern residents. Hezbollah remains dangerous, while the war has caused enormous destruction, casualties, and displacement in Lebanon.",
      outcome: "Ongoing as of June 14, 2026",
      cost: "Thousands killed and more than one million displaced in Lebanon; Israeli military and civilian casualties",
    }),
  },
  {
    id: "2026-iran-war",
    title: "2026 Iran War",
    description: "Explore the ongoing 2026 war in which Israel and the United States struck Iran and Iran launched a regional missile campaign.",
    image: images.iran2026,
    data: dive({
      title: "2026 Iran War",
      previous: "Twelve-Day War",
      connection: "The June 2025 war damaged but did not eliminate Iran's nuclear, missile, and regional military capabilities. With diplomacy failing and Iran rebuilding, Israel and the United States launched a much larger campaign on February 28, 2026.",
      period: { start: "2026-02-28", end: "2026-06-14", label: "28 February 2026-present" },
      stakes: "From the Israeli security perspective, the war is intended to remove an existential nuclear and missile threat, weaken the Iranian regime's regional war network, and prevent another cycle of temporary deterrence.",
      img: images.iran2026,
      events: [
        event("opening-strikes", "2026-02-28", "Operations Roaring Lion and Epic Fury", "Israel and the United States launched surprise strikes across Iran against military, government, nuclear, missile, and naval targets. Israel described the operation as necessary to remove an existential threat.", [stat("28 Feb 2026", "War begins"), stat("Israel and United States", "Joint campaign")], [32.4, 53.7]),
        event("iranian-regional-retaliation", "2026-03-01", "Iranian Regional Retaliation", "Iran launched missiles and drones at Israel, US bases, and several regional states. Iranian strikes killed Israeli civilians and forced nationwide emergency measures despite layered missile defenses.", [stat("650 missile attacks by 8 Apr", "Reported against Israel"), stat("24 civilians killed", "Israel and West Bank through ceasefire")], [31.8, 34.8]),
        event("hormuz-closure", "2026-03-02", "Closure of the Strait of Hormuz", "Iran closed or heavily restricted the Strait of Hormuz, disrupting global trade and energy markets. The move widened the war from a military contest into a global economic crisis.", [stat("Strait of Hormuz", "Global shipping chokepoint"), stat("Energy disruption", "Worldwide consequence")], [26.6, 56.3]),
        event("iranian-leadership-and-military-struck", "2026-03-05", "Iranian Leadership and Military Struck", "Israeli and American attacks killed senior Iranian leaders and commanders and struck thousands of targets. Iran retained the ability to retaliate, but its military command and regional position were severely damaged.", [stat("Senior leadership killed", "Strategic effect"), stat("Thousands of targets", "Campaign scale")], [35.7, 51.4]),
        event("april-ceasefire", "2026-04-08", "Fragile April Ceasefire", "A Pakistan-mediated ceasefire paused much of the direct fighting, but disputes over Hormuz, sanctions, nuclear material, and Lebanon prevented a durable settlement.", [stat("8 Apr 2026", "Ceasefire begins"), stat("Fragile truce", "Core issues unresolved")], [32.4, 53.7]),
        event("june-escalation", "2026-06-07", "June Missile Exchange", "Iran fired missiles toward Israel after Israeli strikes on Hezbollah targets in Lebanon, and Israel retaliated against military targets in Iran. Israel later agreed to hold fire under US pressure as negotiations continued.", [stat("7-8 Jun 2026", "Renewed direct exchange"), stat("Negotiations ongoing", "As of 14 Jun 2026")], [32.4, 53.7]),
      ],
      summary: "As of June 14, 2026, Israel and Iran are under a fragile and repeatedly violated ceasefire while negotiations continue. Israel and the United States inflicted extraordinary damage on Iran's leadership and military capabilities, but Iran retained missiles, regional allies, and leverage over Hormuz. The war's final outcome is not yet known.",
      outcome: "Ongoing conflict under fragile ceasefire as of June 14, 2026",
      cost: "Thousands killed region-wide; 24 civilians killed by Iranian missiles in Israel and the West Bank through April 8",
    }),
  },
];

await mkdir(DRAFTS, { recursive: true });
for (const item of dives) {
  await writeFile(join(DRAFTS, `${item.id}.generated.json`), `${JSON.stringify(item.data, null, 2)}\n`, "utf8");
}

const index = JSON.parse(await readFile(INDEX, "utf8"));
for (const item of dives) {
  const entry = { id: item.id, title: item.title, description: item.description, image: item.image };
  const position = index.findIndex((existing) => existing.id === item.id);
  if (position >= 0) index[position] = entry;
  else index.push(entry);
}
await writeFile(INDEX, `${JSON.stringify(index, null, 2)}\n`, "utf8");

console.log(`Created ${dives.length} modern Israel deep dives and updated the index.`);
