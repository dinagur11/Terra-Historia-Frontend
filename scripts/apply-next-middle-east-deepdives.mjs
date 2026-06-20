import fs from "fs";
import path from "path";

const backendRoot =
  process.argv[2] || "C:/Users/alons/Terra-Historia-Backend";
const draftsDir = path.join(backendRoot, "deepdives-drafts");

const readDive = (id) =>
  JSON.parse(fs.readFileSync(path.join(draftsDir, `${id}.generated.json`), "utf8"));

const writeDive = (id, data) => {
  fs.writeFileSync(
    path.join(draftsDir, `${id}.generated.json`),
    `${JSON.stringify(data, null, 2)}\n`
  );
};

const marker = (label, lat, lng, type, description) => ({
  label,
  latlng: [lat, lng],
  type,
  description,
});

const region = (coordinates, color = "#c94f4f", opacity = 0.28) => ({
  coordinates,
  color,
  opacity,
});

function getEvent(dive, id) {
  return dive.find((event) => event.id === id);
}

function setImages(event, img, cap) {
  for (const slide of event?.slides || []) {
    slide.img = img;
    if (cap) slide.cap = cap;
  }
}

function setMap(event, view, markers, regions = [], arrows = []) {
  event.view = view;
  event.markers = markers;
  event.regions = regions;
  event.arrows = arrows;
}

function swapIntroStats(dive) {
  const swapLabels = new Set([
    "Previous conflict in this path",
    "The next conflict to explore",
    "Why they connect",
    "Direct aftermath",
    "Regional conflict chain",
    "Changing Middle Eastern power balance",
    "Dispute over occupied territory",
    "Failed settlement and renewed attack",
    "Iraqi debt and militarization after the Iran-Iraq War",
    "Iranian regional networks and shifting power",
  ]);

  for (const event of dive) {
    for (const slide of event.slides || []) {
      for (const stat of slide.stats || []) {
        if (swapLabels.has(stat.lbl)) {
          [stat.val, stat.lbl] = [stat.lbl, stat.val];
        }
        if (stat.lbl === "What was at stake" && stat.val.length > 80) {
          [stat.val, stat.lbl] = [stat.lbl, stat.val];
          stat.full = true;
        }
      }
    }
  }
}

function cleanExplicitPerspective(text = "") {
  return text
    .replace(/from Israel's perspective,?\s*/gi, "")
    .replace(/From Israel's perspective,?\s*/g, "")
    .replace(/from the Israeli perspective,?\s*/gi, "")
    .replace(/From the Israeli perspective,?\s*/g, "")
    .replace(/from the Israeli point of view,?\s*/gi, "")
    .replace(/From the Israeli point of view,?\s*/g, "");
}

function cleanDiveText(dive) {
  for (const event of dive) {
    event.sub = cleanExplicitPerspective(event.sub);
    for (const slide of event.slides || []) {
      slide.body = cleanExplicitPerspective(slide.body);
      slide.cap = cleanExplicitPerspective(slide.cap);
      for (const stat of slide.stats || []) {
        stat.val = cleanExplicitPerspective(stat.val);
        stat.lbl = cleanExplicitPerspective(stat.lbl);
      }
    }
  }
}

function patchWarOfAttrition() {
  const id = "war-of-attrition";
  const dive = readDive(id);
  swapIntroStats(dive);
  cleanDiveText(dive);

  const rumani = getEvent(dive, "battle-of-rumani-coast");
  setImages(
    rumani,
    "https://upload.wikimedia.org/wikipedia/commons/8/81/Mastvic.jpg",
    "Israeli naval forces during the War of Attrition period"
  );
  setMap(rumani, { center: [31.1, 32.8], zoom: 8 }, [
    marker("Rumani coast", 31.1, 32.8, "target", "The July 1967 naval clash took place off the northern Sinai coast, soon after the Six-Day War."),
    marker("Port Said approaches", 31.26, 32.3, "major", "Egyptian naval forces operated from the canal's northern approaches."),
  ]);

  setMap(getEvent(dive, "battle-of-karameh"), { center: [31.95, 35.58], zoom: 9 }, [
    marker("Karameh", 31.95, 35.58, "target", "Israeli forces raided this Jordan Valley area to strike PLO bases after cross-border attacks."),
    marker("Jordan River crossings", 31.9, 35.55, "major", "The raid showed how Palestinian attacks could widen the post-1967 confrontation beyond the Suez front."),
  ]);

  setMap(getEvent(dive, "operation-rooster-53"), { center: [28.36, 33.08], zoom: 8 }, [
    marker("Ras Gharib radar site", 28.36, 33.08, "target", "Israeli commandos captured a Soviet-made Egyptian radar and flew it out by helicopter."),
    marker("Gulf of Suez", 28.6, 33.2, "major", "The raid demonstrated Israel's reach behind the Egyptian line."),
  ]);

  setMap(getEvent(dive, "operation-boxer"), { center: [30.5, 32.4], zoom: 7 }, [
    marker("Suez Canal front", 30.6, 32.32, "target", "Israeli air attacks targeted Egyptian positions along the canal during a new phase of escalation."),
    marker("Egyptian west bank", 30.4, 32.25, "major", "Egyptian artillery and air-defense positions shaped the War of Attrition battlefield."),
  ]);

  setMap(getEvent(dive, "operation-bulmus-6"), { center: [29.94, 32.57], zoom: 9 }, [
    marker("Green Island", 29.94, 32.57, "target", "Israeli naval commandos attacked this fortified Egyptian outpost in the Gulf of Suez."),
    marker("Gulf of Suez", 29.6, 32.7, "major", "The operation widened pressure beyond static canal positions."),
  ]);

  setMap(getEvent(dive, "operation-raviv"), { center: [28.9, 32.75], zoom: 8 }, [
    marker("Gulf of Suez landing area", 28.9, 32.75, "target", "Israeli forces used captured armor in a deep raid along Egypt's Red Sea coast."),
    marker("Egyptian rear area", 28.7, 32.85, "major", "The raid embarrassed Egyptian defenses and increased pressure on the Suez front."),
  ]);

  setMap(getEvent(dive, "operation-rhodes"), { center: [27.5, 34.02], zoom: 9 }, [
    marker("Shadwan Island", 27.5, 34.02, "target", "Israeli forces raided this Red Sea island to pressure Egypt away from the main canal line."),
    marker("Straits of Tiran route", 28.0, 34.45, "major", "Control of Red Sea approaches remained strategically important after 1967."),
  ]);

  const rimon = getEvent(dive, "operation-rimon-20");
  setImages(
    rimon,
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnUI5DayEDNekelRZO2iot8MSg0cQ91oSLc2uwJ8rtHg&s=10",
    "Israeli aircraft during the War of Attrition air campaign"
  );
  setMap(rimon, { center: [30.4, 32.6], zoom: 7 }, [
    marker("Rimon 20 ambush area", 30.4, 32.6, "target", "Israeli pilots lured Soviet-piloted Egyptian MiGs into an air ambush on 30 July 1970."),
    marker("Suez Canal air front", 30.6, 32.32, "major", "The operation showed the superpower risk inside the War of Attrition."),
  ]);

  writeDive(id, dive);
}

function patchYomKippur() {
  const id = "yom-kippur-war";
  const dive = readDive(id);
  swapIntroStats(dive);
  cleanDiveText(dive);

  const badr = getEvent(dive, "operation-badr");
  setImages(
    badr,
    "https://upload.wikimedia.org/wikipedia/commons/a/aa/Egyptianbridge.jpg",
    "Egyptian bridging equipment across the Suez Canal during Operation Badr"
  );
  const badrMain = badr.slides?.find((s) => s.title === "Operation Badr");
  if (badrMain) {
    badrMain.body =
      "Operation Badr was Egypt's surprise crossing of the Suez Canal on 6 October 1973, launched together with Syria's assault on the Golan Heights. Egyptian engineers opened breaches in the sand ramparts, laid bridges across the canal, and pushed infantry with anti-tank missiles into Sinai before Israel fully understood the scale of the attack.\n\nThe timing was devastating for Israel: it came on Yom Kippur, when much of the country was at rest and reserve mobilization was not yet complete. The attack caught Israeli outposts and commanders off guard, shattered the easy confidence left by 1967, and forced Israel to fight its way back from a dangerous opening position.";
  }
  setMap(badr, { center: [30.6, 32.35], zoom: 7 }, [
    marker("Suez Canal crossings", 30.6, 32.35, "target", "Egyptian forces crossed the canal and breached the Bar-Lev Line in the opening hours."),
    marker("Bar-Lev Line", 30.75, 32.45, "major", "Israeli fortifications along the canal were overwhelmed by the surprise attack."),
    marker("Sinai front", 30.7, 33.3, "major", "Israel had to mobilize reserves and stabilize the southern front under pressure."),
  ]);

  setMap(getEvent(dive, "battle-of-the-chinese-farm"), { center: [30.95, 32.38], zoom: 9 }, [
    marker("Chinese Farm", 30.95, 32.38, "target", "This brutal battle opened the way for Israel's crossing west of the Suez Canal."),
    marker("Deversoir crossing", 30.94, 32.34, "major", "Israeli forces used this area to cross into Egypt and reverse the momentum."),
  ]);
  setMap(getEvent(dive, "ofira-air-battle"), { center: [27.92, 34.33], zoom: 9 }, [
    marker("Ofira / Sharm el-Sheikh", 27.92, 34.33, "target", "Two Israeli Phantoms intercepted a much larger Egyptian air attack in the opening hours."),
    marker("Red Sea approach", 28.0, 34.45, "major", "The battle protected Israel's southern air and sea approaches."),
  ]);
  setMap(getEvent(dive, "battle-of-latakia"), { center: [35.52, 35.78], zoom: 8 }, [
    marker("Latakia coast", 35.52, 35.78, "target", "Israeli missile boats defeated Syrian vessels in a landmark naval missile battle."),
  ]);
  setMap(getEvent(dive, "operation-model-5"), { center: [33.1, 35.85], zoom: 8 }, [
    marker("Syrian SAM belt", 33.1, 35.85, "target", "The failed strike exposed the danger of dense Syrian air defenses on the Golan front."),
    marker("Golan Heights", 33.05, 35.75, "major", "Israeli aircraft were trying to relieve pressure on the northern front."),
  ]);
  setMap(getEvent(dive, "battle-of-baltim"), { center: [31.6, 31.1], zoom: 8 }, [
    marker("Baltim coast", 31.6, 31.1, "target", "Israeli and Egyptian missile boats fought off the Nile Delta coast."),
    marker("Mediterranean naval front", 31.9, 31.9, "major", "Naval missile warfare became a major part of the 1973 conflict."),
  ]);
  setMap(getEvent(dive, "valley-of-tears"), { center: [33.13, 35.78], zoom: 9 }, [
    marker("Valley of Tears", 33.13, 35.78, "target", "A small Israeli armored force held against a much larger Syrian attack on the Golan Heights."),
    marker("Northern Israeli communities", 33.0, 35.6, "major", "The defensive stand helped prevent a Syrian breakthrough toward northern Israel."),
  ]);
  setMap(getEvent(dive, "operation-abirey-halev"), { center: [30.94, 32.34], zoom: 8 }, [
    marker("Israeli canal crossing", 30.94, 32.34, "target", "Israeli forces crossed to the west bank of the canal and changed the southern campaign."),
    marker("Egyptian Third Army", 30.35, 32.45, "major", "Israel's west-bank move threatened and partly encircled Egypt's Third Army."),
  ]);

  writeDive(id, dive);
}

function patchIranIraq() {
  const id = "iran-iraq-war";
  const dive = readDive(id);
  swapIntroStats(dive);

  setImages(
    getEvent(dive, "battle-of-khorramshahr"),
    "https://upload.wikimedia.org/wikipedia/commons/1/18/Battle_of_khorramshahr_2.jpg",
    "Street fighting during the Battle of Khorramshahr"
  );
  setMap(getEvent(dive, "battle-of-khorramshahr"), { center: [30.44, 48.17], zoom: 9 }, [
    marker("Khorramshahr", 30.44, 48.17, "target", "The city became the war's first major urban battlefield and slowed Iraq's opening offensive."),
    marker("Shatt al-Arab", 30.5, 48.1, "major", "Control of this waterway was a central cause and prize of the war."),
  ]);
  setMap(getEvent(dive, "siege-of-abadan"), { center: [30.35, 48.3], zoom: 9 }, [
    marker("Abadan", 30.35, 48.3, "target", "Iraqi forces besieged the oil city but failed to capture it."),
    marker("Abadan refinery", 30.36, 48.28, "major", "The refinery made the city strategically vital."),
  ]);
  setMap(getEvent(dive, "attack-on-h3"), { center: [32.93, 39.68], zoom: 8 }, [
    marker("H3 airbase complex", 32.93, 39.68, "target", "Iranian aircraft struck Iraq's remote western airbase complex in a long-range raid."),
    marker("Western Iraq route", 33.1, 40.3, "major", "The distance and route made the raid one of the war's most daring air operations."),
  ], [
    region([
      [39.35, 33.12],
      [39.98, 33.12],
      [39.98, 32.72],
      [39.35, 32.72],
      [39.35, 33.12],
    ]),
  ]);
  setMap(getEvent(dive, "liberation-of-khorramshahr"), { center: [30.44, 48.17], zoom: 9 }, [
    marker("Khorramshahr recaptured", 30.44, 48.17, "target", "Iran retook the city in May 1982, creating a major national turning point."),
    marker("Iraqi retreat line", 30.6, 47.9, "major", "The defeat forced Iraq back and raised the question of whether Iran would cross the border."),
  ]);
  setImages(
    getEvent(dive, "operation-ramadan"),
    "https://upload.wikimedia.org/wikipedia/commons/8/8a/Trench_warfare_during_Operation_Ramadan%2C_1982.jpg",
    "Trench warfare during Operation Ramadan, 1982"
  );
  setMap(getEvent(dive, "operation-ramadan"), { center: [30.55, 47.78], zoom: 8 }, [
    marker("Basra front", 30.55, 47.78, "target", "Iran's first major offensive into Iraq aimed toward Basra and met prepared defenses."),
    marker("Iran-Iraq border", 30.5, 48.0, "major", "The crossing marked the war's shift from liberation to attrition."),
  ]);
  setMap(getEvent(dive, "tankers-war"), { center: [26.6, 56.25], zoom: 6 }, [
    marker("Strait of Hormuz", 26.6, 56.25, "target", "Attacks on shipping threatened the global oil chokepoint."),
    marker("Persian Gulf shipping lanes", 27.2, 52.5, "major", "Tankers became targets as the war spread from land fronts to energy routes."),
  ]);
  setMap(getEvent(dive, "operation-earnest-will"), { center: [27.5, 51.5], zoom: 6 }, [
    marker("Reflagged tanker route", 27.5, 51.5, "target", "The U.S. Navy escorted Kuwaiti tankers through the Gulf under Operation Earnest Will."),
    marker("Kuwait", 29.38, 47.98, "major", "Kuwait's request for protection drew the United States deeper into the Gulf conflict."),
  ]);
  setMap(getEvent(dive, "operation-praying-mantis"), { center: [25.9, 53.1], zoom: 6 }, [
    marker("Central Persian Gulf", 25.9, 53.1, "target", "U.S. forces struck Iranian naval targets after the USS Samuel B. Roberts hit a mine."),
    marker("Iranian oil platforms", 26.1, 52.8, "major", "Oil platforms and naval assets became targets in the U.S.-Iran escalation."),
  ]);

  writeDive(id, dive);
}

function patchGulfWar() {
  const id = "gulf-war";
  const dive = readDive(id);
  swapIntroStats(dive);

  setImages(
    getEvent(dive, "origins-and-road-to-war"),
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwjYJTFkR5Bk4Y2ROy3dljd-BkgNcsC_7WYkztKYeZxg&s",
    "Iraqi armor and Gulf crisis imagery before the 1991 war"
  );
  setMap(getEvent(dive, "origins-and-road-to-war"), { center: [30.2, 46.8], zoom: 6 }, [
    marker("Baghdad", 33.3152, 44.3661, "major", "Saddam Hussein's post-Iran-Iraq War debt and ambitions drove the crisis."),
    marker("Kuwait", 29.38, 47.98, "target", "Kuwait became the target of Iraq's invasion after disputes over debt, oil, and territory."),
  ]);

  const invasion = getEvent(dive, "iraqi-invasion-of-kuwait");
  setImages(
    invasion,
    "https://res.cloudinary.com/aenetworks/image/upload/c_fill,ar_2,w_3840,h_1920,g_auto/dpr_auto/f_auto/q_auto:eco/v1/this-day-in-history-08-02-1990-iraq-invades-kuwait?_a=BAVMn6DY0",
    "Iraqi forces during the invasion and occupation of Kuwait"
  );
  for (const slide of invasion.slides || []) {
    for (const stat of slide.stats || []) {
      if (stat.val === "2009" && stat.lbl === "Year") stat.val = "1990";
    }
  }
  setMap(invasion, { center: [29.38, 47.98], zoom: 7 }, [
    marker("Kuwait City", 29.3759, 47.9774, "target", "Iraqi forces entered Kuwait City on 2 August 1990 and occupied the country."),
    marker("Basra-Kuwait axis", 30.1, 47.75, "major", "Iraqi units advanced south from the Basra area into Kuwait."),
    marker("Saudi border", 28.8, 47.7, "major", "The occupation threatened Saudi Arabia and pushed the U.S.-led coalition to deploy."),
  ]);
  setMap(getEvent(dive, "1991-iraqi-missile-attacks-against-israel"), { center: [32.0, 35.0], zoom: 6 }, [
    marker("Tel Aviv area", 32.0853, 34.7818, "target", "Iraqi Scud missiles hit Israel in an attempt to split the coalition."),
    marker("Haifa", 32.794, 34.99, "major", "Northern Israel was also targeted during the missile campaign."),
    marker("Western Iraq launch areas", 33.0, 42.0, "major", "Coalition aircraft hunted Iraqi mobile launchers in western Iraq."),
  ]);
  setMap(getEvent(dive, "operation-desert-storm"), { center: [30.4, 46.5], zoom: 6 }, [
    marker("Kuwait theater", 29.38, 47.98, "target", "Coalition air and ground operations aimed to liberate Kuwait."),
    marker("Iraqi air-defense network", 33.3, 44.4, "major", "The opening air campaign struck command, air-defense, and military infrastructure across Iraq."),
  ]);
  const khafji = getEvent(dive, "battle-of-khafji");
  setImages(
    khafji,
    "https://blog.togetherweserved.com/app/uploads/2026/01/4-3.jpg",
    "Coalition forces during the Battle of Khafji"
  );
  setMap(khafji, { center: [28.425, 48.5], zoom: 9 }, [
    marker("Khafji", 28.425, 48.5, "target", "Iraqi forces briefly captured this Saudi border town before Saudi, Qatari, and coalition forces retook it."),
    marker("Kuwait-Saudi border", 28.75, 48.2, "major", "The battle tested coalition defenses before the ground offensive."),
  ]);
  setMap(getEvent(dive, "amiriyah-shelter-bombing"), { center: [33.2972, 44.2808], zoom: 10 }, [
    marker("Amiriyah shelter", 33.2972, 44.2808, "target", "A U.S. airstrike killed hundreds of civilians in this Baghdad shelter."),
    marker("Baghdad", 33.3152, 44.3661, "major", "The capital was a major target of the coalition air campaign."),
  ]);
  setMap(getEvent(dive, "battle-of-73-easting"), { center: [29.5447, 46.6258], zoom: 8 }, [
    marker("73 Easting", 29.5447, 46.6258, "target", "Coalition armor defeated Iraqi Republican Guard units in a major tank battle."),
    marker("Southern Iraq desert", 29.8, 46.2, "major", "The battle was part of the coalition left hook into Iraq."),
  ]);
  setMap(getEvent(dive, "highway-of-death"), { center: [29.3842, 47.6518], zoom: 8 }, [
    marker("Highway 80", 29.3842, 47.6518, "target", "Coalition aircraft attacked retreating Iraqi columns between Kuwait City and Basra."),
    marker("Kuwait City", 29.3759, 47.9774, "major", "The retreat followed the collapse of Iraqi control in Kuwait."),
  ]);
  setMap(getEvent(dive, "battle-of-norfolk"), { center: [29.2, 46.8], zoom: 8 }, [
    marker("Battle of Norfolk area", 29.2, 46.8, "target", "U.S. and British armored forces fought Iraqi Republican Guard units in southern Iraq."),
    marker("VII Corps advance", 29.4, 46.4, "major", "The battle formed part of the coalition armored sweep around Iraqi forces."),
  ]);
  setMap(getEvent(dive, "international-and-human-dimensions"), { center: [29.8, 47.0], zoom: 6 }, [
    marker("Kuwait oil fires", 29.3, 47.9, "target", "Burning oil wells became one of the war's most visible environmental and human consequences."),
    marker("Baghdad", 33.3152, 44.3661, "major", "Airstrikes and sanctions left lasting effects on Iraqi civilians."),
  ]);
  setMap(getEvent(dive, "outcome-and-legacy"), { center: [29.8, 47.0], zoom: 6 }, [
    marker("Liberated Kuwait", 29.38, 47.98, "target", "Coalition victory restored Kuwait's sovereignty."),
    marker("Iraq remains under Saddam", 33.3152, 44.3661, "major", "The war ended without removing Saddam Hussein, leaving future confrontation unresolved."),
  ]);

  writeDive(id, dive);
}

function patchIranIsraelProxy() {
  const id = "iran-israel-proxy-conflict";
  const dive = readDive(id);
  swapIntroStats(dive);
  cleanDiveText(dive);

  const imageByEvent = {
    "origins-and-road-to-war": "https://news.vt.edu/content/news_vt_edu/en/articles/2024/10/Israel-Iran-proxy-wars-expert/_jcr_content/image.transform/l-medium/image.jpg",
    "formation-of-hezbollah": "https://images.squarespace-cdn.com/content/v1/54c70db5e4b0c75c07d5cbc5/95c445c4-a480-43fc-9ec5-ad8425f301d3/Hezbollah_guys.jpg",
    "hezbollah-israel-conflict": "https://thearabweekly.com/sites/default/files/styles/article_image_800x450_/public/2026-03/2026-03-07_07-00-36_228452.jpg?itok=BPBvY48p",
    "iran-israel-conflict-during-the-syrian-civil-war": "https://arabcenterdc.org/wp-content/uploads/2022/03/Israeli-airstrike-in-Syria.jpg",
    "may-2018-israel-syria-clashes": "https://csis-website-prod.s3.amazonaws.com/s3fs-public/publication/180615_hezbollah.jpg",
    "syria-missile-strikes-september-2018": "https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/KXJZ7ACUFAI6RHERPWVVS3UCKI.jpg&w=1800&h=1800",
    "operation-true-promise-i": "https://cdn.presstv.ir/Photo/2025/4/14/40e99b2c-c8aa-4c18-9fd9-714961362dbe.jpg",
    "2024-iran-israel-conflict": "https://www.aljazeera.com/wp-content/uploads/2024/10/2024-10-01T172111Z_1734428691_RC2TBAATN69I_RTRMADP_3_ISRAEL-PALESTINIANS-LEBANON-1727803728.jpg?resize=730%2C410&quality=80",
    "international-and-human-dimensions": "https://static-cdn.toi-media.com/www/uploads/2025/06/AFP__20250616__62GX68M__v1__HighRes__IsraelIranConflictMissiles.jpg",
    "outcome-and-legacy": "https://www.iiss.org/globalassets/media-library---content--migration/images-delta/comment/analysis/2025/july/886x486-2.png",
  };
  for (const [eventId, img] of Object.entries(imageByEvent)) {
    setImages(getEvent(dive, eventId), img);
  }

  const hez = getEvent(dive, "hezbollah-israel-conflict");
  hez.year = 1985;
  hez.date = "1985-02-16";
  hez.slides[0].body =
    "Hezbollah's conflict with Israel began in the context of Lebanon's civil war, Israel's security zone in southern Lebanon, and Iran's effort to build a capable armed partner on Israel's northern border. Over time, Hezbollah became both a Lebanese political-military actor and Iran's most important forward front against Israel.\n\nFor Israel, the challenge was not only border fire from Lebanon but the creation of a heavily armed organization supplied, trained, and strategically backed by Iran. The conflict continued after Israel's 2000 withdrawal from southern Lebanon and became central to every later escalation in Lebanon.";
  hez.slides[0].stats = [
    { val: "1985-present", lbl: "Long-running conflict" },
    { val: "Southern Lebanon", lbl: "Main armed front" },
    { val: "Iran-backed Hezbollah", lbl: "Principal proxy force" },
    {
      val: "Why it matters",
      lbl: "Hezbollah turned Lebanon into Iran's most important military pressure point against Israel.",
      full: true,
    },
  ];

  const syria = getEvent(dive, "iran-israel-conflict-during-the-syrian-civil-war");
  for (const slide of syria.slides || []) {
    for (const stat of slide.stats || []) {
      if (stat.val === "2100" && stat.lbl === "Year") stat.val = "2013";
    }
  }
  syria.slides[0].body =
    "The Syrian civil war gave Iran and Hezbollah space to entrench forces, weapons routes, and missile infrastructure near Israel's northern frontier. Israel responded with a sustained campaign of airstrikes intended to disrupt advanced weapons transfers, Iranian bases, and attempts to open a new front from Syria.\n\nThis phase made the proxy conflict more direct. Israel was no longer dealing only with Hezbollah in Lebanon, but with an Iranian military network stretching through Syria toward the Golan Heights.";

  const human = getEvent(dive, "international-and-human-dimensions");
  human.slides[0].body =
    "The conflict links several arenas: Lebanon, Syria, Iraq, Yemen, Iran, Israel, and the Persian Gulf. The United States, Russia, Gulf states, and armed groups all shape the risk of escalation, while civilians live under missile alerts, airstrikes, displacement, disrupted economies, and repeated fear that a limited exchange could become a regional war.\n\nA cautious estimate puts the directly linked human cost at least above 7,000 killed, with tens of thousands wounded and well over a million displaced during the major post-2023 escalations. The exact number depends on what is counted: Hezbollah-Israel fighting in Lebanon, Iranian and proxy missile attacks on Israel, Israeli strikes on Iranian-linked targets in Syria and Iran, militia attacks in Iraq and Syria, and later direct Iran-Israel exchanges. The estimate does not fold in the full Gaza war toll, which would make the wider regional human cost far higher.";
  human.slides[0].stats = [
    {
      val: "7,000+ killed",
      lbl: "Conservative estimate across directly linked proxy/direct fronts; tens of thousands more wounded and over a million displaced, depending on what is counted.",
      full: true,
    },
  ];

  setMap(getEvent(dive, "origins-and-road-to-war"), { center: [33.0, 39.0], zoom: 4 }, [
    marker("Israel", 31.8, 35.0, "target", "Israel became the main target of Iran's regional proxy strategy after the 1979 revolution."),
    marker("Iran", 35.7, 51.4, "major", "Iran built influence through armed partners, missile programs, and regional networks."),
    marker("Lebanon-Syria corridor", 34.0, 36.0, "major", "The route through Syria and Lebanon became central to weapons transfers and pressure on Israel."),
  ]);
  setMap(getEvent(dive, "formation-of-hezbollah"), { center: [33.9, 35.9], zoom: 7 }, [
    marker("Bekaa Valley", 34.0, 36.2, "target", "Iranian support and training helped Hezbollah emerge in Lebanon's Bekaa and south."),
    marker("Southern Lebanon", 33.2, 35.35, "major", "The area became Hezbollah's main front against Israel."),
  ]);
  setMap(hez, { center: [33.2, 35.45], zoom: 8 }, [
    marker("Southern Lebanon front", 33.2, 35.45, "target", "Hezbollah built a large rocket and border-war infrastructure facing northern Israel."),
    marker("Northern Israel", 33.0, 35.55, "major", "Israeli towns near the border became frequent targets during escalations."),
  ]);
  setMap(syria, { center: [33.5, 36.3], zoom: 7 }, [
    marker("Damascus area", 33.5138, 36.2765, "target", "Iranian-linked facilities and weapons routes near Damascus became recurring targets."),
    marker("Golan Heights", 33.05, 35.75, "major", "Israel worked to prevent Iranian-backed forces from turning Syria into another border front."),
  ]);
  setMap(getEvent(dive, "may-2018-israel-syria-clashes"), { center: [33.1, 35.8], zoom: 8 }, [
    marker("Golan Heights", 33.1, 35.8, "target", "Iranian forces in Syria launched rockets toward Israeli positions, followed by major Israeli strikes."),
    marker("Syrian military sites", 33.45, 36.1, "major", "Israel struck Iranian and Syrian-linked targets after the rocket fire."),
  ]);
  setMap(getEvent(dive, "syria-missile-strikes-september-2018"), { center: [35.53, 35.78], zoom: 8 }, [
    marker("Latakia area", 35.53, 35.78, "target", "Israeli strikes near Latakia triggered Syrian air-defense fire that accidentally downed a Russian Il-20."),
    marker("Western Syria", 35.0, 36.0, "major", "The incident showed how crowded and dangerous the Syrian airspace had become."),
  ]);
  setMap(getEvent(dive, "attacks-on-us-bases-during-the-gaza-war"), { center: [34.6, 41.0], zoom: 5 }, [
    marker("Al-Asad region", 33.8, 42.4, "target", "Iran-backed militias repeatedly attacked U.S. positions in Iraq during the Gaza war spillover."),
    marker("Al-Tanf", 33.49, 38.66, "major", "U.S. forces in Syria were also targeted by militia drones and rockets."),
    marker("Jordan border area", 32.6, 38.8, "major", "Attacks expanded toward U.S. positions near the Syria-Jordan-Iraq border."),
  ]);
  setMap(getEvent(dive, "operation-true-promise-i"), { center: [33.0, 43.0], zoom: 4 }, [
    marker("Iranian launch network", 32.0, 53.0, "target", "Iran launched drones, cruise missiles, and ballistic missiles toward Israel in April 2024."),
    marker("Israel air-defense network", 31.8, 35.0, "major", "Israel, with partners, intercepted most of the incoming attack."),
    marker("Golan Heights", 33.05, 35.75, "major", "The attack also targeted the Israeli-controlled Golan Heights."),
  ]);
  setMap(getEvent(dive, "2024-iran-israel-conflict"), { center: [33.0, 43.0], zoom: 4 }, [
    marker("Israel", 31.8, 35.0, "target", "Direct Iran-Israel exchanges in 2024 moved the conflict beyond proxy warfare."),
    marker("Iran", 35.7, 51.4, "target", "Iranian territory and command decisions became part of the confrontation."),
    marker("Damascus", 33.5138, 36.2765, "major", "The April 2024 consulate strike in Damascus helped trigger Iran's direct attack."),
  ]);
  setMap(human, { center: [33.0, 39.0], zoom: 4 }, [
    marker("Northern Israel", 33.0, 35.55, "major", "Rocket and drone threats repeatedly forced evacuations and civilian disruption."),
    marker("Lebanon", 33.85, 35.86, "target", "Lebanese civilians have faced airstrikes, militia control, and repeated displacement."),
    marker("Syria", 34.8, 38.0, "major", "Syria became a major arena for Iranian entrenchment, Israeli strikes, and civilian harm."),
    marker("Iran", 35.7, 51.4, "major", "Direct exchanges raised the danger that civilians inside Iran and Israel could face wider war."),
  ]);
  setMap(getEvent(dive, "outcome-and-legacy"), { center: [33.0, 39.0], zoom: 4 }, [
    marker("Israel-Lebanon-Syria front", 33.3, 35.8, "target", "The northern arena remains the conflict's most active pressure point."),
    marker("Iran", 35.7, 51.4, "major", "Iran's proxy network and direct missile capabilities keep the confrontation unresolved."),
  ]);

  writeDive(id, dive);
}

function patchBackendRelationships() {
  const p = path.join(backendRoot, "deepdive-relationships.json");
  if (!fs.existsSync(p)) return;
  const data = JSON.parse(fs.readFileSync(p, "utf8"));
  if (data.nodes?.["iran-israel-proxy-conflict"]) {
    data.nodes["iran-israel-proxy-conflict"].y = 565;
  }
  fs.writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`);
}

patchWarOfAttrition();
patchYomKippur();
patchIranIraq();
patchGulfWar();
patchIranIsraelProxy();
patchBackendRelationships();

console.log("Updated War of Attrition, Yom Kippur War, Iran-Iraq War, Gulf War, and Iran-Israel Proxy Conflict deep dives.");
