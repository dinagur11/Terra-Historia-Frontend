import fs from "fs";
import path from "path";

const backendRoot = process.argv[2] || "C:/Users/alons/Terra-Historia-Backend";
const draftsDir = path.join(backendRoot, "deepdives-drafts");

const files = [
  "operation-litani.generated.json",
  "lebanese-civil-war.generated.json",
  "1982-lebanon-war.generated.json",
  "south-lebanon-conflict.generated.json",
  "second-intifada.generated.json",
];

const boilerplate =
  /From an Israeli security perspective,[\s\S]*?This security context does not erase Palestinian, Lebanese, Iranian, or other civilian suffering; it explains why Israeli leaders and much of the Israeli public regarded inaction as an unacceptable choice\./g;

const repeatedSentence =
  /This security context does not erase Palestinian, Lebanese, Iranian, or other civilian suffering; it explains why Israeli leaders and much of the Israeli public regarded inaction as an unacceptable choice\./g;

const images = {
  "operation-litani:PLO Forces Withdraw North":
    "https://www.idf.il/media/g2qf5sge/whatsapp-image-2017-10-30-at-133947.jpeg",
  "operation-litani:Resolution 425 Creates UNIFIL":
    "https://s.lorientlejour.com/storage/attachments/1465/HLPUNIFIL_817024.jpg/r/1200/HLPUNIFIL_817024.jpg",
  "operation-litani:Israeli Withdrawal":
    "https://www.idf.il/media/s55becnl/whatsapp-image-2017-10-30-at-133947-1.jpeg?width=500&height=340.625",
  "operation-litani:Conflict Summary: Operation Litani":
    "https://i.guim.co.uk/img/media/598c1eea1edd89423114b16037d2ba2e6739f0f8/18_15_2097_1258/master/2097.jpg?width=445&dpr=1&s=none&crop=none",
  "lebanese-civil-war:From Yom Kippur War to Lebanese Civil War":
    "https://www.thoughtco.com/thmb/eVIWeKvV59T2aylW_Hb1H2eFNF4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-607440036-5922ffb03df78cf5faf99555.jpg",
  "lebanese-civil-war:Bus Massacre and Civil War":
    "https://upload.wikimedia.org/wikipedia/commons/4/49/Ain_el_Remmeneh_Bus_Massacre_1975.jpg",
  "lebanese-civil-war:Syrian Intervention":
    "https://upload.wikimedia.org/wikipedia/commons/d/d9/Syrian_BMP-1_column_in_Lebanon_during_Lebanese_civil_war.jpg",
  "lebanese-civil-war:1982 Lebanon War":
    "https://upload.wikimedia.org/wikipedia/commons/9/92/1982_Lebanon_War_L.jpg",
  "lebanese-civil-war:Beirut Barracks Bombings":
    "https://2017-2021.state.gov/wp-content/uploads/2019/06/AP8310230589.jpg",
  "lebanese-civil-war:Hezbollah Emerges":
    "https://www.idf.il/media/a1ipb1jm/whatsapp-image-2017-10-15-at-45140-pm-3.jpeg?mode=crop&width=500",
  "lebanese-civil-war:Taif Settlement and War's End":
    "https://www.middleeastmonitor.com/wp-content/uploads/2020/05/GettyImages-95769389.jpg",
  "1982-lebanon-war:Battle of the Beaufort:1":
    "https://www.israelhayom.co.il/wp-content/uploads/2023/05/23/133889233382795410a_b_1-600x400.jpg",
  "1982-lebanon-war:Operation Mole Cricket 19":
    "https://upload.wikimedia.org/wikipedia/commons/d/d3/Operation_Mole_Cricket_19._II.jpg",
  "1982-lebanon-war:1984 Sohmor massacre":
    "https://media.newyorker.com/photos/673bb96ab748a714871f28eb/master/w_2560%2Cc_limit/Abouzeid-LebanonDispatch-Taleb.RC282BAFAP73jpg.jpg",
  "south-lebanon-conflict:Iron Fist policy":
    "https://images.ohmyhosting.se/PqCjAXZ4ROkxNtPFaBRgL08yOpY=/fit-in/1680x1050/smart/filters:quality(85)/https%3A%2F%2Fengelsbergideas.com%2Fwp-content%2Fuploads%2F2024%2F10%2F1982-Lebanon-War.jpg",
  "south-lebanon-conflict:Zrarieh raid":
    "https://c.files.bbci.co.uk/4928/live/23d29380-22f9-11f1-8620-17795c093e86.jpg",
  "south-lebanon-conflict:Ansariya ambush":
    "https://www.militaryimages.net/media/bangladesh-army-ambush.15520/full?d=1521490924",
  "south-lebanon-conflict:Battle of Khiam":
    "https://static.srpcdigital.com/styles/1037xauto/public/2024-10/836512_0.jpeg.webp",
  "south-lebanon-conflict:International and Human Dimensions":
    "https://img.lemde.fr/2026/02/08/0/0/6000/4000/1440/960/60/0/130c91a_ftp-1-sngvxqb3sjmt-5105185-01-06.jpg",
  "south-lebanon-conflict:Outcome and Legacy":
    "https://img.lemde.fr/2026/02/08/0/0/6000/4000/1440/960/60/0/130c91a_ftp-1-sngvxqb3sjmt-5105185-01-06.jpg",
  "second-intifada:From South Lebanon Conflict to Second Intifada":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/%D7%94%D7%A4%D7%99%D7%92%D7%95%D7%A2_%D7%91%D7%A6%D7%95%D7%9E%D7%AA_%D7%99%D7%92%D7%95%D7%A8_1.jpg/1920px-%D7%94%D7%A4%D7%99%D7%92%D7%95%D7%A2_%D7%91%D7%A6%D7%95%D7%9E%D7%AA_%D7%99%D7%92%D7%95%D7%A8_1.jpg",
  "second-intifada:Dolphinarium Bombing":
    "https://images.jpost.com/image/upload/f_auto,fl_lossy/q_auto/c_fill,g_faces:center,h_720,w_1280/477323",
  "second-intifada:Security Barrier and Intelligence Campaign":
    "https://ichef.bbci.co.uk/news/480/cpsprodpb/05cf/live/7a5870f0-f049-11ef-a319-fb4e7360c4ec.jpg.webp",
  "second-intifada:Sharm el-Sheikh Ceasefire":
    "https://israeled.org/wp-content/uploads/2023/02/FEB8-sharm-el-sheikh-1024x664.jpg",
  "second-intifada:Conflict Summary: Second Intifada":
    "https://www.aljazeera.com/wp-content/uploads/2010/10/2010103125618668784_8.jpeg?fit=770%2C510&quality=80",
};

const rewrites = {
  "lebanese-civil-war:Taif Settlement and War's End":
    "The Taif Agreement ended the main phase of Lebanon's civil war by rebalancing state power and bringing most militias under formal disarmament. Its central security flaw was the exception that allowed Hezbollah to keep its weapons while Syrian influence remained entrenched.\n\nFor Israel, that meant the war's end did not restore a stable northern frontier. The PLO's old position in Lebanon had been weakened, but an Iranian-backed organization with a long-term military project was left armed, politically protected, and able to turn southern Lebanon into the next pressure point.",
  "south-lebanon-conflict:Zrarieh raid":
    "The Zrarieh raid was part of Israel's 1985 effort to disrupt armed networks operating from villages and approaches south of the Litani. Israeli forces treated the area as a corridor used by militants, weapons, and local support cells after repeated attacks from southern Lebanon.\n\nThe raid caused civilian deaths and became one of the most disputed episodes of the period. Its purpose was not random punishment; it reflected the difficulty, and the moral risk, of fighting armed groups embedded inside populated Lebanese villages while Israeli border communities and soldiers remained under threat.",
  "second-intifada:Outbreak of the Uprising":
    "The uprising is often linked to Ariel Sharon's visit to the Temple Mount, but Israeli leaders and later accounts from within Palestinian politics argued that the violence was not spontaneous. After the collapse of Camp David, Yasser Arafat's circle had prepared for confrontation while publicly preserving the language of diplomacy.\n\nFor Israelis, the rapid shift from negotiations to shootings, riots, and organized attacks confirmed a devastating lesson: concessions and peace talks could be answered by violence rather than compromise. The first weeks turned a diplomatic crisis into a security emergency that soon reached buses, cafes, hotels, and family celebrations.",
};

const eventImages = {
  "south-lebanon-conflict:international-and-human-dimensions":
    "https://img.lemde.fr/2026/02/08/0/0/6000/4000/1440/960/60/0/130c91a_ftp-1-sngvxqb3sjmt-5105185-01-06.jpg",
  "south-lebanon-conflict:outcome-and-legacy":
    "https://img.lemde.fr/2026/02/08/0/0/6000/4000/1440/960/60/0/130c91a_ftp-1-sngvxqb3sjmt-5105185-01-06.jpg",
};

const contextByFile = {
  "operation-litani.generated.json":
    "The Israeli dilemma was immediate and concrete: northern towns could not be left exposed to PLO raids launched from across an unstable border. The campaign was designed to push armed infrastructure away from Israel, while exposing how little authority the Lebanese state or UN forces could impose in the south.",
  "lebanese-civil-war.generated.json":
    "For Israel, Lebanon's collapse mattered because armed organizations used the vacuum to build bases, fire across the border, and pull outside powers into the conflict. Israeli policy was shaped by the need to protect the Galilee while avoiding a permanent slide into Lebanon's internal war.",
  "1982-lebanon-war.generated.json":
    "Israeli planners saw the campaign through the accumulated failures of the previous years: diplomacy, UN deployments, and limited raids had not stopped PLO attacks from Lebanon. The operation aimed to break that infrastructure, though the war also revealed how costly deep involvement in Lebanon could become.",
  "south-lebanon-conflict.generated.json":
    "Israel's security zone was meant to keep Hezbollah and other armed groups away from the border and give northern communities warning time. The long conflict showed the strain of holding that line through local allies, intelligence work, raids, and constant pressure from an Iranian-backed guerrilla campaign.",
  "second-intifada.generated.json":
    "Israeli decision-makers faced a campaign aimed directly at civilians in daily life: buses, restaurants, hotels, roads, and city centers. The response combined intelligence, arrests, military operations, and physical barriers to break the networks that made mass-casualty attacks possible.",
};

const markerData = {
  "operation-litani.generated.json": {
    "origins-and-background": [
      marker("Coastal Road attack route", 32.38, 34.87, "major", "The massacre on Israel's coastal highway made the threat from Lebanon feel immediate to Israeli civilians and leaders."),
      marker("Southern Lebanon", 33.25, 35.38, "target", "PLO bases in the south gave militants proximity to the Galilee and Israeli border communities."),
    ],
    "coastal-road-massacre": [
      marker("Coastal Road", 32.39, 34.87, "major", "Fatah gunmen attacked civilians traveling on Israel's coast, killing 38 Israelis including children."),
    ],
    invasion: [
      marker("Israel-Lebanon border", 33.11, 35.55, "target", "Israeli forces crossed north to push armed groups away from communities in the Galilee."),
      marker("Litani River line", 33.33, 35.33, "minor", "The river became the rough northern limit of the operation's security objective."),
    ],
    "plo-withdraws-north": [
      marker("Litani River", 33.34, 35.3, "target", "Israeli pressure forced organized PLO units away from the border zone, though militants remained active elsewhere in Lebanon."),
    ],
    "resolution-425": [
      marker("UNIFIL area", 33.28, 35.37, "major", "UNIFIL was deployed to confirm withdrawal and help restore Lebanese authority, but its mandate left it limited against armed groups."),
    ],
    "israeli-withdrawal": [
      marker("Security handover zone", 33.2, 35.35, "target", "Israel withdrew from most positions while relying on local allied forces because the border threat had not disappeared."),
    ],
    "conflict-summary": [
      marker("Southern Lebanon theater", 33.25, 35.38, "major", "The operation pushed the PLO back temporarily, but the area remained the central arena of Israel's northern security problem."),
    ],
  },
  "lebanese-civil-war.generated.json": {
    "origins-and-background": [
      marker("Beirut", 33.8938, 35.5018, "major", "Lebanon's capital became the political and military center of a fractured state."),
      marker("Southern Lebanon", 33.25, 35.38, "target", "Armed groups in the south turned Lebanon's civil war into an Israeli border-security crisis."),
    ],
    "bus-massacre": [
      marker("Ain el-Remmaneh", 33.872, 35.536, "major", "The bus attack helped ignite the civil war's first major cycle of reprisals."),
    ],
    "syrian-intervention": [
      marker("Syrian entry routes", 34.0, 36.0, "target", "Syrian forces entered Lebanon to control the war's direction and preserve Damascus's influence."),
    ],
    "operation-litani": [
      marker("Southern Lebanon", 33.25, 35.38, "target", "The PLO's southern presence brought Lebanon's war directly to Israel's northern border."),
    ],
    "israel-invasion": [
      marker("Beirut", 33.8938, 35.5018, "major", "The 1982 campaign drove the PLO leadership from Beirut but deepened Israel's involvement in Lebanon."),
    ],
    "barracks-bombing": [
      marker("Beirut airport area", 33.82, 35.49, "major", "The barracks bombings showed the rise of suicide attacks against Western forces in Lebanon."),
    ],
    "hezbollah-emerges": [
      marker("Bekaa Valley", 33.85, 35.98, "target", "Iranian-backed networks used the Bekaa and southern Lebanon to build Hezbollah's military infrastructure."),
    ],
    "taif-and-end": [
      marker("Taif", 21.4373, 40.5127, "minor", "The political settlement ended much of the civil war but did not disarm Hezbollah."),
      marker("Southern Lebanon", 33.25, 35.38, "target", "The unresolved armed presence in the south became the next phase of Israel's Lebanon challenge."),
    ],
    "conflict-summary": [
      marker("Lebanon", 33.85, 35.86, "major", "The civil war ended formally, but foreign influence and Hezbollah's retained weapons left the border conflict unresolved."),
    ],
  },
  "1982-lebanon-war.generated.json": {
    "battle-of-the-beaufort": [
      marker("Beaufort Castle", 33.32, 35.53, "major", "The fortress overlooked northern Israel and symbolized the military value of southern Lebanon's high ground."),
    ],
    "battle-of-jezzine": [
      marker("Jezzine", 33.54, 35.58, "target", "Control of Jezzine helped open approaches toward the central mountain routes."),
    ],
    "operation-mole-cricket-19": [
      marker("Bekaa Valley", 33.85, 35.98, "major", "Israel's air force destroyed Syrian surface-to-air missile batteries and shifted the regional air balance."),
    ],
    "battle-of-sultan-yacoub": [
      marker("Sultan Yacoub", 33.64, 35.92, "target", "The battle became one of the campaign's most painful armored engagements for Israel."),
    ],
    "siege-of-beirut": [
      marker("West Beirut", 33.8938, 35.5018, "major", "The siege forced the PLO evacuation but carried high diplomatic and humanitarian costs."),
    ],
    "plo-withdrawal-from-lebanon": [
      marker("Beirut port", 33.9, 35.51, "major", "PLO evacuation from Beirut removed a major armed headquarters from Lebanon."),
    ],
    "tyre-headquarters-bombings": [
      marker("Tyre", 33.2708, 35.2033, "target", "Bombings in Tyre showed the danger Israeli forces faced even after major battlefield gains."),
    ],
    "1984-sohmor-massacre": [
      marker("Sohmor", 33.57, 35.69, "target", "The episode reflected the war's shift from conventional operations to raids, reprisals, and contested control."),
    ],
  },
  "south-lebanon-conflict.generated.json": {
    "origins-and-road-to-war": [
      marker("Security zone", 33.25, 35.38, "major", "The zone was intended to keep Hezbollah and other armed groups away from Israeli towns."),
      marker("Metula/Kiryat Shmona area", 33.21, 35.57, "target", "Northern Israeli communities were the civilian backdrop to Israel's security calculations."),
    ],
    "iron-fist-policy": [
      marker("Southern Lebanon villages", 33.35, 35.45, "target", "Israeli raids sought to disrupt armed cells operating among villages near the security zone."),
    ],
    "zrarieh-raid": [
      marker("Zrarieh", 33.43, 35.36, "major", "Israel treated the area as a militant corridor; the civilian deaths made the raid deeply controversial."),
    ],
    "operation-law-and-order": [
      marker("Maydoun", 33.58, 35.66, "major", "The operation targeted a Hezbollah base in terrain used to pressure the security zone."),
    ],
    "night-time-operation": [
      marker("Southern Lebanon road", 33.32, 35.38, "target", "The strike targeted Hezbollah's secretary-general as Israel tried to blunt the group's command network."),
    ],
    "september-1992-south-lebanon-clashes": [
      marker("Security zone line", 33.28, 35.48, "target", "Clashes along the zone showed the constant pressure on Israeli and SLA positions."),
    ],
    "ansariya-ambush": [
      marker("Ansariya", 33.41, 35.28, "major", "Hezbollah ambushed a Shayetet 13 force, exposing the danger of deep intelligence raids."),
    ],
    "battle-of-khiam": [
      marker("Khiam", 33.327, 35.612, "major", "The battle accelerated the collapse of SLA positions as Israel prepared to withdraw."),
    ],
    "international-and-human-dimensions": [
      marker("UNIFIL sector", 33.25, 35.38, "minor", "International observers operated in the same narrow geography where Hezbollah, the SLA, and Israel clashed."),
    ],
    "outcome-and-legacy": [
      marker("Israel-Lebanon border", 33.11, 35.55, "major", "Israel left Lebanon in 2000, but Hezbollah framed the withdrawal as a model for continued pressure."),
    ],
  },
  "second-intifada.generated.json": {
    "origins-and-background": [
      marker("Yagur Junction", 32.74, 35.08, "major", "Attacks on ordinary travel routes made the security crisis tangible for Israeli civilians."),
    ],
    outbreak: [
      marker("Temple Mount", 31.778, 35.235, "major", "The site became the symbolic flashpoint, but Israeli assessments saw organized violence already forming behind the scenes."),
    ],
    "dolphinarium-bombing": [
      marker("Dolphinarium, Tel Aviv", 32.068, 34.764, "major", "A suicide bomber targeted teenagers outside a seaside nightclub."),
    ],
    "passover-massacre": [
      marker("Park Hotel, Netanya", 32.328, 34.852, "major", "A suicide bomber struck a Passover seder, pushing Israel toward Operation Defensive Shield."),
    ],
    "operation-defensive-shield": [
      marker("Jenin", 32.459, 35.295, "target", "Israeli forces entered militant strongholds to disrupt bomb-making and dispatch networks."),
      marker("Ramallah", 31.903, 35.203, "minor", "Arafat's compound became a focal point of Israeli pressure on the Palestinian Authority."),
    ],
    "security-barrier": [
      marker("Security barrier", 32.22, 35.01, "major", "The barrier and intelligence campaign sharply reduced the ability of attackers to reach Israeli cities."),
    ],
    "sharm-el-sheikh": [
      marker("Sharm el-Sheikh", 27.9158, 34.3299, "major", "The summit marked a decline in organized violence but did not resolve the conflict's core security questions."),
    ],
    "conflict-summary": [
      marker("Israel's urban front", 31.9, 34.9, "major", "The conflict was experienced by Israelis as a campaign against civilian life across cities and roads."),
    ],
  },
};

const viewOverrides = {
  "operation-litani.generated.json": {
    "origins-and-background": [33.05, 35.25, 7],
    "coastal-road-massacre": [32.39, 34.87, 9],
    invasion: [33.21, 35.43, 8],
    "plo-withdraws-north": [33.34, 35.3, 9],
    "resolution-425": [33.28, 35.37, 9],
    "israeli-withdrawal": [33.2, 35.35, 9],
    "conflict-summary": [33.25, 35.38, 8],
  },
  "lebanese-civil-war.generated.json": {
    "origins-and-background": [33.63, 35.55, 7],
    "bus-massacre": [33.872, 35.536, 10],
    "syrian-intervention": [34.0, 36.0, 8],
    "operation-litani": [33.25, 35.38, 8],
    "israel-invasion": [33.8938, 35.5018, 9],
    "barracks-bombing": [33.82, 35.49, 10],
    "hezbollah-emerges": [33.85, 35.98, 8],
    "taif-and-end": [33.25, 35.38, 7],
    "conflict-summary": [33.85, 35.86, 7],
  },
  "1982-lebanon-war.generated.json": {
    "battle-of-the-beaufort": [33.32, 35.53, 10],
    "battle-of-jezzine": [33.54, 35.58, 9],
    "operation-mole-cricket-19": [33.85, 35.98, 8],
    "battle-of-sultan-yacoub": [33.64, 35.92, 9],
    "siege-of-beirut": [33.8938, 35.5018, 9],
    "plo-withdrawal-from-lebanon": [33.9, 35.51, 10],
    "tyre-headquarters-bombings": [33.2708, 35.2033, 10],
    "1984-sohmor-massacre": [33.57, 35.69, 9],
  },
  "south-lebanon-conflict.generated.json": {
    "origins-and-road-to-war": [33.2, 35.48, 7],
    "iron-fist-policy": [33.35, 35.45, 8],
    "zrarieh-raid": [33.43, 35.36, 9],
    "operation-law-and-order": [33.58, 35.66, 9],
    "night-time-operation": [33.32, 35.38, 8],
    "september-1992-south-lebanon-clashes": [33.28, 35.48, 8],
    "ansariya-ambush": [33.41, 35.28, 9],
    "battle-of-khiam": [33.327, 35.612, 9],
    "international-and-human-dimensions": [33.25, 35.38, 8],
    "outcome-and-legacy": [33.11, 35.55, 8],
  },
  "second-intifada.generated.json": {
    "origins-and-background": [32.74, 35.08, 9],
    outbreak: [31.778, 35.235, 10],
    "dolphinarium-bombing": [32.068, 34.764, 10],
    "passover-massacre": [32.328, 34.852, 10],
    "operation-defensive-shield": [32.18, 35.25, 8],
    "security-barrier": [32.22, 35.01, 9],
    "sharm-el-sheikh": [27.9158, 34.3299, 10],
    "conflict-summary": [31.9, 34.9, 8],
  },
};

function marker(label, lat, lng, type, description) {
  return { label, latlng: [lat, lng], type, description };
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(draftsDir, file), "utf8"));
}

function writeJson(file, data) {
  fs.writeFileSync(path.join(draftsDir, file), `${JSON.stringify(data, null, 2)}\n`);
}

function firstParagraph(body = "") {
  return body.split(/\n\n/)[0] || body;
}

function cleanStats(slide) {
  if (!Array.isArray(slide.stats)) return;
  slide.stats = slide.stats.map((stat) => {
    if (
      stat.full &&
      typeof stat.val === "string" &&
      typeof stat.lbl === "string" &&
      stat.val.length > 70 &&
      stat.lbl.length < 45
    ) {
      return { ...stat, val: stat.lbl, lbl: stat.val };
    }
    return stat;
  });
}

function updateSlide(file, event, slide, eventIndex, slideIndex) {
  const key = `${file.replace(".generated.json", "")}:${slide.title}`;
  const indexedKey = `${key}:${slideIndex}`;
  const eventKey = `${file.replace(".generated.json", "")}:${event.id}`;
  if (images[indexedKey]) slide.img = images[indexedKey];
  if (images[key]) slide.img = images[key];
  if (eventImages[eventKey]) slide.img = eventImages[eventKey];

  const rewrite = rewrites[key];
  if (rewrite) {
    slide.body = rewrite;
  } else if (typeof slide.body === "string") {
    const cleaned = slide.body.replace(boilerplate, "").replace(repeatedSentence, "").trim();
    slide.body = cleaned.includes("\n\n")
      ? cleaned
      : `${firstParagraph(cleaned)}\n\n${contextByFile[file]}`;
  }

  cleanStats(slide);
}

function updateEvent(file, event, eventIndex) {
  const markers = markerData[file]?.[event.id];
  if (markers) event.markers = markers;

  const view = viewOverrides[file]?.[event.id];
  if (view) {
    event.view = { center: [view[0], view[1]], zoom: view[2] };
  } else if (markers?.[0]) {
    event.view = { center: markers[0].latlng, zoom: event.view?.zoom && event.view.zoom > 4 ? event.view.zoom : 6 };
  }

  if (Array.isArray(event.slides)) {
    event.slides.forEach((slide, slideIndex) =>
      updateSlide(file, event, slide, eventIndex, slideIndex)
    );
  }
}

for (const file of files) {
  let data = readJson(file);

  if (file === "south-lebanon-conflict.generated.json") {
    data = data.filter((event) => event.id !== "mansouri-massacre");
  }

  data.forEach((event, eventIndex) => updateEvent(file, event, eventIndex));
  writeJson(file, data);
}

console.log(`Updated ${files.length} deep-dive drafts in ${draftsDir}`);
