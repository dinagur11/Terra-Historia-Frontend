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

const region = (coordinates, color = "#d6a536", opacity = 0.18) => ({
  coordinates,
  color,
  opacity,
});

const sinaiRegion = region(
  [
    [32.4, 31.25],
    [34.9, 31.25],
    [34.55, 29.45],
    [33.8, 28.25],
    [32.55, 29.95],
    [32.4, 31.25],
  ],
  "#d6a536",
  0.2
);

const westBankRegion = region(
  [
    [35.0, 32.48],
    [35.55, 32.2],
    [35.58, 31.35],
    [35.22, 31.12],
    [34.96, 31.78],
    [35.0, 32.48],
  ],
  "#4f8ec9",
  0.18
);

const gazaRegion = region(
  [
    [34.18, 31.58],
    [34.55, 31.52],
    [34.49, 31.2],
    [34.24, 31.22],
    [34.18, 31.58],
  ],
  "#c94f4f",
  0.18
);

const galileeRegion = region(
  [
    [35.0, 33.28],
    [35.75, 33.28],
    [35.85, 32.78],
    [35.15, 32.65],
    [35.0, 33.28],
  ],
  "#5aa46b",
  0.18
);

const negevRegion = region(
  [
    [34.3, 31.5],
    [35.25, 31.25],
    [34.95, 29.55],
    [34.72, 29.5],
    [34.4, 30.55],
    [34.3, 31.5],
  ],
  "#d6a536",
  0.16
);

function swapConnectionStats(slide) {
  if (!slide?.stats) return;
  for (const stat of slide.stats) {
    if (
      [
        "Previous conflict in this path",
        "The next conflict to explore",
        "Why they connect",
        "Regional rivalry",
        "End of the British Mandate",
        "Unresolved Arab-Israeli conflict",
        "Revolution spreads into newly independent Finland",
      ].includes(stat.lbl)
    ) {
      [stat.val, stat.lbl] = [stat.lbl, stat.val];
    }
    if (stat.lbl === "What was at stake" && stat.val.length > 80) {
      [stat.val, stat.lbl] = [stat.lbl, stat.val];
      stat.full = true;
    }
  }
}

function normalizeStats(dive) {
  for (const event of dive) {
    for (const slide of event.slides || []) swapConnectionStats(slide);
  }
}

function removePerspectivePhrases(text) {
  if (!text) return text;
  return text
    .replace(/From the Israeli point of view,?\s*/gi, "")
    .replace(/From an Israeli point of view,?\s*/gi, "")
    .replace(/From the Israeli perspective,?\s*/gi, "")
    .replace(/From an Israeli perspective,?\s*/gi, "")
    .replace(/From the Israeli viewpoint,?\s*/gi, "")
    .replace(/from an Israeli point of view as\s*/gi, "as ")
    .replace(/from the Israeli point of view as\s*/gi, "as ")
    .replace(/From the Israeli side,?\s*/gi, "")
    .replace(/From an Israeli security perspective,?\s*/gi, "")
    .replace(/This draft is framed from the Israeli security point of view:\s*/gi, "");
}

function cleanPerspectiveLanguage(dive) {
  for (const event of dive) {
    event.sub = removePerspectivePhrases(event.sub);
    for (const slide of event.slides || []) {
      slide.title = removePerspectivePhrases(slide.title);
      slide.body = removePerspectivePhrases(slide.body);
      slide.cap = removePerspectivePhrases(slide.cap);
      for (const stat of slide.stats || []) {
        stat.val = removePerspectivePhrases(stat.val);
        stat.lbl = removePerspectivePhrases(stat.lbl);
      }
    }
  }
}

function clearMapHighlights(dive) {
  for (const event of dive) {
    event.regions = [];
    event.arrows = [];
  }
}

function setEventMap(event, view, markers, regions = [], arrows = []) {
  event.view = view;
  event.markers = markers;
  event.regions = regions;
  event.arrows = arrows;
}

function patch1948() {
  const id = "1948-arab-israeli-war";
  const dive = readDive(id);
  normalizeStats(dive);
  cleanPerspectiveLanguage(dive);

  const civil = dive.find((e) => e.id === "1947-1948-civil-war-in-mandatory-palestine");
  civil.slides.forEach((s) => {
    s.img = "https://i2.cdn.turner.com/cnn/interactive/2014/08/world/israel-neighbors/media/images/01.jpg";
    s.cap = "UN partition plan and the strategic geography of the 1947-1948 civil-war phase";
  });
  civil.slides[1].body =
    "After the United Nations voted to partition Mandatory Palestine into Jewish and Arab states, Arab leaders rejected the plan and fighting began almost immediately. Jewish neighborhoods, roads, and convoys came under attack while the Yishuv prepared to defend the future state before the British withdrawal. The Haganah moved from local defense toward coordinated operations, while the Palmach protected isolated settlements and vital routes.\n\nThe civil-war phase forced the Yishuv to build a functioning army under fire. It showed that the state approved by diplomacy would still have to be secured by soldiers, supply convoys, local defense, and control of the roads linking Jewish population centers.";
  setEventMap(
    civil,
    { center: [31.9, 35.0], zoom: 7 },
    [
      marker("Tel Aviv", 32.0853, 34.7818, "target", "The coastal Jewish center became the main rear area for the Yishuv and later the new state."),
      marker("Jerusalem road", 31.78, 35.05, "major", "Convoys to Jewish Jerusalem became a decisive test of whether isolated communities could be supplied."),
      marker("Haifa", 32.794, 34.9896, "minor", "A major mixed port city and strategic British Mandate hub during the civil-war phase."),
    ],
    [westBankRegion, gazaRegion]
  );

  setEventMap(
    dive.find((e) => e.id === "battle-for-jerusalem"),
    { center: [31.78, 35.18], zoom: 9 },
    [
      marker("Jewish Jerusalem", 31.778, 35.213, "target", "Jewish neighborhoods depended on convoys and later the Burma Road to survive the siege."),
      marker("Latrun", 31.837, 34.978, "major", "The Arab Legion held the fortress area controlling the main road from the coast to Jerusalem."),
      marker("Burma Road", 31.775, 35.02, "minor", "An improvised bypass route that helped move supplies around Latrun."),
    ]
  );

  setEventMap(
    dive.find((e) => e.id === "independence-and-arab-invasion"),
    { center: [31.7, 35.0], zoom: 6 },
    [
      marker("Tel Aviv declaration", 32.063, 34.77, "target", "Ben-Gurion declared the State of Israel here on 14 May 1948 as the Mandate ended."),
      marker("Egyptian front", 31.55, 34.55, "major", "Egyptian forces advanced north from Gaza toward the coastal plain."),
      marker("Jordanian front", 31.78, 35.23, "major", "The Arab Legion fought around Jerusalem and the central hill country."),
      marker("Syrian front", 32.82, 35.62, "major", "Syrian forces attacked near the Sea of Galilee and the Jordan Valley."),
    ],
    [gazaRegion, westBankRegion, galileeRegion]
  );

  setEventMap(
    dive.find((e) => e.id === "battles-of-latrun"),
    { center: [31.82, 35.03], zoom: 9 },
    [
      marker("Latrun", 31.837, 34.978, "target", "The Arab Legion fortress blocked the main road to Jewish Jerusalem and resisted repeated Israeli assaults."),
      marker("Jerusalem", 31.778, 35.213, "major", "The city depended on supplies from the coastal plain while the road was under fire."),
      marker("Burma Road", 31.775, 35.02, "minor", "Israeli engineers opened this bypass after direct attacks on Latrun failed."),
    ]
  );

  setEventMap(
    dive.find((e) => e.id === "operation-pleshet"),
    { center: [31.78, 34.65], zoom: 8 },
    [
      marker("Ad Halom", 31.785, 34.653, "target", "Israeli forces halted the Egyptian advance near this bridge, south of Tel Aviv."),
      marker("Ashdod/Isdud", 31.8, 34.64, "major", "The Egyptian column reached this area before being stopped."),
      marker("Tel Aviv", 32.0853, 34.7818, "minor", "The main urban center threatened by a continued Egyptian push north."),
    ],
    [gazaRegion]
  );

  setEventMap(
    dive.find((e) => e.id === "operation-danny"),
    { center: [31.94, 34.95], zoom: 8 },
    [
      marker("Lydda/Lod", 31.951, 34.895, "target", "Captured during Israel's largest offensive of the war to that point."),
      marker("Ramle", 31.929, 34.865, "target", "Captured alongside Lydda, widening Israeli control near the coastal plain."),
      marker("Tel Aviv-Jerusalem corridor", 31.82, 35.02, "major", "The operation aimed to strengthen the vulnerable link between the coast and Jerusalem."),
    ],
    [westBankRegion]
  );

  setEventMap(
    dive.find((e) => e.id === "operation-yoav"),
    { center: [31.2, 34.85], zoom: 7 },
    [
      marker("Beersheba", 31.2529, 34.7915, "target", "Captured by Israeli forces, opening the way to a stronger hold in the Negev."),
      marker("Negev settlements", 31.0, 34.6, "major", "Isolated communities in the Negev were a central reason for the offensive."),
      marker("Egyptian line", 31.55, 34.65, "major", "Egyptian positions were broken across the southern front."),
    ],
    [negevRegion, gazaRegion]
  );

  setEventMap(
    dive.find((e) => e.id === "operation-hiram"),
    { center: [33.0, 35.45], zoom: 8 },
    [
      marker("Upper Galilee", 33.05, 35.35, "target", "The offensive secured the Upper Galilee in roughly sixty hours."),
      marker("Lebanese border", 33.1, 35.5, "major", "The operation pushed the Arab Liberation Army away from northern communities."),
      marker("Safed", 32.965, 35.498, "minor", "A key Galilee city near the northern theater."),
    ],
    [galileeRegion]
  );

  setEventMap(
    dive.find((e) => e.id === "operation-horev"),
    { center: [30.8, 34.45], zoom: 7 },
    [
      marker("Negev front", 30.9, 34.65, "target", "Israeli forces drove Egyptian units south and west during the final major offensive."),
      marker("Rafah", 31.287, 34.25, "major", "A key gateway between Gaza and Sinai."),
      marker("Sinai border", 30.75, 34.28, "major", "Israeli forces briefly crossed into Sinai before diplomatic pressure forced withdrawal."),
    ],
    [negevRegion, sinaiRegion]
  );

  setEventMap(
    dive.find((e) => e.id === "operation-uvda"),
    { center: [30.0, 34.75], zoom: 7 },
    [
      marker("Umm Rashrash / Eilat", 29.5577, 34.9519, "target", "The Ink Flag was raised here, giving Israel access to the Red Sea."),
      marker("Southern Negev", 30.25, 34.8, "major", "Israeli columns moved through the Negev to establish control before the armistice map hardened."),
    ],
    [negevRegion]
  );

  const armistice = dive.find((e) => e.id === "1949-armistice-agreements");
  armistice.slides.forEach((s) => {
    s.img = "https://israelpolicyforum.org/wp-content/uploads/1949/02/Map-7-Armistice-Agreements-February-July-1949.jpg";
    s.cap = "1949 armistice lines after agreements with Egypt, Lebanon, Jordan, and Syria";
  });
  setEventMap(
    armistice,
    { center: [31.8, 35.0], zoom: 6 },
    [
      marker("Rhodes talks", 36.434, 28.217, "minor", "UN-mediated armistice negotiations were held on Rhodes."),
      marker("Green Line", 31.9, 35.1, "target", "The armistice lines became Israel's practical boundaries until 1967, without becoming final peace borders."),
      marker("Jerusalem divided", 31.778, 35.224, "major", "The agreements left Jerusalem divided between Israeli and Jordanian control."),
    ],
    [westBankRegion, gazaRegion, galileeRegion, negevRegion]
  );

  clearMapHighlights(dive);
  writeDive(id, dive);
}

function patchSuez() {
  const id = "suez-crisis";
  const dive = readDive(id);
  normalizeStats(dive);
  cleanPerspectiveLanguage(dive);

  setEventMap(
    dive.find((e) => e.id === "operation-yona"),
    { center: [31.4, 34.7], zoom: 6 },
    [
      marker("Israeli rear area", 31.8, 34.8, "target", "Operation Yona helped prepare the arms and logistics behind the Sinai campaign."),
      marker("Sinai gateway", 31.25, 34.25, "major", "Israeli planning focused on the routes leading from Israel into Sinai."),
    ],
    [sinaiRegion]
  );

  setEventMap(
    dive.find((e) => e.id === "operation-tarnegol"),
    { center: [34.8, 32.1], zoom: 6 },
    [
      marker("Interception area", 34.8, 32.1, "target", "Israeli aircraft intercepted an Egyptian command flight just before the Sinai ground operation."),
      marker("Cyprus air route", 35.0, 33.8, "minor", "The episode reflected the regional air picture around the crisis."),
    ]
  );

  setEventMap(
    dive.find((e) => e.id === "naval-campaign-of-the-suez-crisis"),
    { center: [30.5, 32.4], zoom: 6 },
    [
      marker("Suez Canal", 30.6, 32.32, "target", "The canal was the strategic waterway at the center of the British-French-Egyptian confrontation."),
      marker("Straits of Tiran", 28.0, 34.45, "major", "Israel regarded Egyptian blockade policy at the Straits as a core security and maritime grievance."),
      marker("Haifa", 32.794, 34.99, "minor", "Israeli naval and trade interests were tied to open sea access."),
    ],
    [sinaiRegion]
  );

  const musketeer = dive.find((e) => e.id === "operation-musketeer");
  musketeer.slides.forEach((s) => {
    s.img = "https://media.iwm.org.uk/ciim5/55/415/super_000000.jpg";
    s.cap = "British and French forces during Operation Musketeer at Port Said";
  });
  setEventMap(
    musketeer,
    { center: [31.26, 32.31], zoom: 8 },
    [
      marker("Port Said", 31.2653, 32.3019, "target", "British and French landings at Port Said tried to seize the northern end of the canal."),
      marker("Suez Canal", 30.6, 32.32, "major", "The canal zone was the political and military prize of Operation Musketeer."),
      marker("Sinai front", 30.5, 33.7, "minor", "Israel's Sinai campaign unfolded in parallel with the Anglo-French operation."),
    ],
    [sinaiRegion]
  );

  setEventMap(
    dive.find((e) => e.id === "battle-of-burullus"),
    { center: [31.6, 31.1], zoom: 8 },
    [
      marker("Burullus coast", 31.6, 31.1, "target", "Egyptian naval forces fought off the Nile Delta coast as the crisis spread offshore."),
      marker("Port Said", 31.2653, 32.3019, "major", "The naval battle connected to the pressure around the canal's northern entrance."),
    ]
  );

  setEventMap(
    dive.find((e) => e.id === "withdrawal-of-israel-defense-forces-from-sinai-and-gaza"),
    { center: [30.8, 34.0], zoom: 6 },
    [
      marker("Sinai withdrawal", 30.4, 33.8, "target", "Israel withdrew from Sinai under international pressure after the campaign."),
      marker("Gaza Strip", 31.42, 34.36, "major", "Israeli forces also withdrew from Gaza as UNEF and diplomatic arrangements followed."),
      marker("Straits of Tiran", 28.0, 34.45, "major", "Navigation guarantees here became a central Israeli concern after withdrawal."),
    ],
    [sinaiRegion, gazaRegion]
  );

  clearMapHighlights(dive);
  writeDive(id, dive);
}

function patchFedayeen() {
  const id = "palestinian-fedayeen-insurgency";
  const dive = readDive(id);
  normalizeStats(dive);
  cleanPerspectiveLanguage(dive);

  const replacements = {
    "border-infiltration":
      "Thousands crossed the armistice lines for varied reasons, including recovering property, smuggling, and returning to villages or fields cut off by the 1949 lines. Some infiltrations turned violent through theft, sabotage, ambushes, and attacks on Israeli civilians. Israeli patrols and restrictive border policies also killed unarmed infiltrators, making the border a place of constant fear and escalation.\n\nFor Israel, the problem was that the new armistice lines were not quiet borders. Small agricultural communities, roads, and outlying settlements felt exposed, and leaders searched for a way to restore deterrence without triggering a wider war.",
    "unit-101":
      "Israel created Unit 101 under Ariel Sharon in August 1953 to conduct retaliatory raids against bases and villages linked to cross-border attacks. The unit was small, aggressive, and influential: it helped shape later IDF doctrine around initiative, night movement, and reprisal operations.\n\nIts methods also caused serious civilian harm and sharpened international criticism. The unit became important because it showed how Israel was moving from static border defense toward offensive deterrence, a pattern that would shape the next years of the conflict.",
    qibya:
      "After an Israeli mother and two children were murdered at Yehud, Israeli forces attacked Qibya in Jordanian-controlled territory in October 1953. Sixty-nine villagers were killed, most of them civilians, and the raid brought strong international condemnation.\n\nThe attack was meant to signal that cross-border violence would bring a heavy price, but it also revealed the danger of reprisal strategy: deterrence could come with political isolation and severe civilian casualties.",
    "gaza-raid":
      "An Israeli raid on Egyptian military positions in Gaza on 28 February 1955 killed dozens of Egyptian soldiers. The operation was meant to answer fedayeen activity and demonstrate that Israel would strike across the armistice line when border attacks continued.\n\nThe result was escalation rather than quiet. Egypt expanded fedayeen sponsorship, moved closer to Soviet-bloc arms supplies, and the Gaza border became one of the main paths toward the 1956 Sinai war.",
    "egypt-sponsored-raids":
      "In 1955 and 1956 Egypt increasingly organized and deployed Palestinian fedayeen from Gaza. Raids, ambushes, and sabotage deepened Israeli civilian insecurity and turned the Gaza border into a strategic problem rather than only a policing issue.\n\nIsraeli leaders came to see the fedayeen campaign, Egypt's military buildup, and the blockade of Israeli shipping as connected parts of the same threat. That connection made a larger strike into Sinai more thinkable.",
    "sinai-campaign":
      "Israel invaded Sinai on 29 October 1956 in coordination with Britain and France after years of border attacks, Egypt's blockade policy, and the wider Suez Canal crisis. The fedayeen conflict now merged into an interstate war against Egypt.\n\nThe Sinai campaign aimed to destroy fedayeen bases, reduce Egyptian military pressure, and reopen maritime access through the Straits of Tiran. It did not end the Arab-Israeli conflict, but it temporarily changed the security balance around Gaza and Sinai.",
  };

  for (const event of dive) {
    const body = replacements[event.id];
    if (body) event.slides[0].body = body;
  }

  setEventMap(
    dive.find((e) => e.id === "origins-and-background"),
    { center: [31.7, 34.8], zoom: 7 },
    [
      marker("Gaza armistice line", 31.45, 34.47, "major", "The Gaza border became one of the most active zones of infiltration and reprisal."),
      marker("Jordanian-controlled West Bank", 31.95, 35.15, "major", "Many infiltrations and reprisal operations crossed the Jordanian armistice line."),
      marker("Israeli border communities", 31.65, 34.7, "target", "Small communities near the armistice lines faced raids, theft, ambushes, and fear of attack."),
    ],
    [gazaRegion, westBankRegion]
  );
  setEventMap(dive.find((e) => e.id === "border-infiltration"), { center: [31.7, 34.9], zoom: 7 }, [
    marker("Gaza border", 31.45, 34.47, "target", "A frequent route for infiltration, smuggling, and armed raids."),
    marker("Central border", 31.95, 35.02, "major", "The armistice line near Israeli towns and villages remained unstable."),
  ], [gazaRegion, westBankRegion]);
  setEventMap(dive.find((e) => e.id === "unit-101"), { center: [31.8, 35.0], zoom: 7 }, [
    marker("Unit 101 operating area", 31.8, 35.0, "target", "The unit conducted reprisal raids across armistice lines and influenced later IDF tactics."),
    marker("Sataf base area", 31.77, 35.13, "minor", "Unit 101 trained and operated from the Jerusalem hills area."),
  ]);
  setEventMap(dive.find((e) => e.id === "qibya"), { center: [31.98, 35.01], zoom: 10 }, [
    marker("Qibya", 31.977, 35.009, "target", "Israeli forces attacked the village after the Yehud murders; 69 villagers were killed."),
    marker("Yehud", 32.033, 34.89, "major", "The killing of an Israeli mother and two children here triggered the reprisal."),
  ]);
  setEventMap(dive.find((e) => e.id === "gaza-raid"), { center: [31.5, 34.45], zoom: 9 }, [
    marker("Gaza City", 31.5017, 34.4668, "target", "The 1955 raid targeted Egyptian military positions in the Gaza Strip."),
    marker("Israeli border settlements", 31.45, 34.6, "major", "Border communities were central to Israeli security concerns."),
  ], [gazaRegion]);
  setEventMap(dive.find((e) => e.id === "egypt-sponsored-raids"), { center: [31.35, 34.45], zoom: 8 }, [
    marker("Gaza fedayeen bases", 31.42, 34.36, "target", "Egypt-sponsored fedayeen activity from Gaza intensified in 1955-1956."),
    marker("Negev border", 31.1, 34.65, "major", "Raids and ambushes affected Israeli movement and settlement security in the south."),
  ], [gazaRegion, negevRegion]);
  setEventMap(dive.find((e) => e.id === "sinai-campaign"), { center: [30.6, 33.8], zoom: 7 }, [
    marker("Sinai axis", 30.6, 33.8, "target", "Israel's 1956 campaign moved into Sinai to strike Egyptian forces and fedayeen infrastructure."),
    marker("Gaza Strip", 31.42, 34.36, "major", "The fedayeen conflict around Gaza fed directly into the wider Sinai campaign."),
    marker("Straits of Tiran", 28.0, 34.45, "major", "Egyptian blockade policy here was a key Israeli grievance."),
  ], [sinaiRegion, gazaRegion]);
  setEventMap(dive.find((e) => e.id === "conflict-summary"), { center: [31.5, 34.8], zoom: 7 }, [
    marker("Gaza border", 31.42, 34.36, "target", "The fedayeen conflict helped turn the Gaza-Sinai frontier into the main road toward the 1956 war."),
    marker("Central armistice line", 31.95, 35.05, "major", "Raids and reprisals across the Jordanian line kept the border conflict active."),
    marker("Sinai", 30.6, 33.8, "major", "The cycle escalated into Israel's 1956 Sinai campaign."),
  ], [gazaRegion, westBankRegion, sinaiRegion]);

  clearMapHighlights(dive);
  writeDive(id, dive);
}

function patchSixDay() {
  const id = "six-day-war";
  let dive = readDive(id);
  normalizeStats(dive);
  cleanPerspectiveLanguage(dive);

  dive = dive.filter(
    (event) =>
      event.id !== "ras-sedr-massacre" &&
      event.id !== "egyptian-blockade-and-waiting-period"
  );
  dive.unshift({
    id: "egyptian-blockade-and-waiting-period",
    year: 1967,
    date: "1967-05-22",
    title: "Egyptian Blockade and the Waiting Period",
    sub: "The crisis before the Six-Day War",
    view: { center: [29.2, 34.5], zoom: 6 },
    markers: [
      marker("Straits of Tiran", 28.0, 34.45, "target", "Egypt closed the straits to Israeli shipping on 22 May 1967, cutting Israel's Red Sea route."),
      marker("Sharm el-Sheikh", 27.9158, 34.3299, "major", "Egyptian forces controlled the entrance to the Gulf of Aqaba from this area."),
      marker("Sinai buildup", 30.2, 33.8, "major", "Egypt moved large forces into Sinai after demanding UNEF's withdrawal."),
      marker("Eilat", 29.5577, 34.9519, "minor", "Israel's Red Sea port was directly affected by the blockade."),
    ],
    regions: [sinaiRegion],
    arrows: [
      {
        label: "Egyptian deployment into Sinai",
        color: "#c94f4f",
        coordinates: [
          [31.2, 30.05],
          [32.4, 30.25],
          [33.5, 30.25],
        ],
      },
    ],
    slides: [
      {
        title: "From Suez Crisis to Six-Day War",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Peace_in_the_Army_-_1967.jpg/250px-Peace_in_the_Army_-_1967.jpg",
        cap: "Israeli soldiers during the tense 1967 waiting period",
        body:
          "The Suez Crisis left a temporary arrangement rather than a peace. UNEF peacekeepers stood in Sinai, the Straits of Tiran remained central to Israel's sea access, and Arab-Israeli rivalry continued through raids, mobilization, and alliance politics.\n\nIn May 1967 Egypt ordered UNEF out of Sinai, moved major forces into the peninsula, and closed the Straits of Tiran to Israeli shipping. Israel had warned since 1957 that closing the straits would be treated as a casus belli. With reserves mobilized, the economy strained, and Arab armies coordinating around Israel, the waiting period became a national emergency.",
        stats: [
          { val: "Previous conflict in this path", lbl: "Suez Crisis" },
          { val: "Immediate trigger", lbl: "Egypt closed the Straits of Tiran" },
          { val: "Strategic danger", lbl: "Israel faced Egypt, Jordan, Syria, and Iraqi support" },
          {
            val: "Why it mattered",
            lbl: "The blockade, Egyptian deployment in Sinai, and removal of UNEF made the crisis feel like a direct threat to Israel's survival and freedom of navigation.",
            full: true,
          },
        ],
      },
      {
        title: "A Small State Surrounded",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Peace_in_the_Army_-_1967.jpg/250px-Peace_in_the_Army_-_1967.jpg",
        cap: "Israeli soldiers during the tense 1967 waiting period",
        body:
          "Israel tried diplomacy while mobilizing reserves. The problem was time: keeping much of the country in uniform could not be sustained for long, and waiting risked allowing enemy deployments to harden. The country was geographically narrow, with its coastal plain only a short distance from the Jordanian-held West Bank and its southern sea route blocked at Tiran.\n\nThat is why the victory became so astonishing. Israel began the war under deep pressure, with hostile armies on several fronts, yet within six days it destroyed enemy air forces, broke Egypt's Sinai defenses, captured East Jerusalem and the West Bank from Jordan, and took the Golan Heights from Syria.",
        stats: [
          { val: "9-15 miles", lbl: "Approximate narrowest width of pre-1967 Israel" },
          { val: "Reserve army", lbl: "Mobilization strained daily life and the economy" },
          { val: "Six days", lbl: "Time from opening strike to ceasefire" },
          {
            val: "What made it insane",
            lbl: "Israel converted a multi-front strategic crisis into air superiority, rapid maneuver, and territorial victory before its enemies could coordinate a sustained campaign.",
            full: true,
          },
        ],
      },
    ],
  });

  const focus = dive.find((e) => e.id === "operation-focus");
  focus.view = { center: [29.9, 33.5], zoom: 5 };
  focus.markers = [
    marker("Egyptian airfields", 30.1, 31.4, "target", "Operation Focus destroyed much of Egypt's air force on the ground in the opening hours."),
    marker("Sinai air bases", 30.4, 33.3, "major", "Airfield attacks disabled Egyptian operations over Sinai."),
    marker("Jordan and Syria airfields", 32.7, 35.8, "major", "After Jordanian and Syrian attacks, Israel struck their air bases too."),
  ];
  focus.regions = [sinaiRegion];
  focus.arrows = [
    { label: "IAF opening strikes", color: "#d6a536", coordinates: [[34.8, 31.9], [33.6, 30.6], [31.4, 30.1]] },
  ];

  setEventMap(dive.find((e) => e.id === "battle-of-abu-ageila"), { center: [30.84, 34.26], zoom: 9 }, [
    marker("Abu-Ageila", 30.83885, 34.25582778, "target", "A key Egyptian defensive complex broken by Israeli combined-arms tactics."),
    marker("El Arish axis", 31.13, 33.8, "major", "The breakthrough helped open the route across northern Sinai."),
  ], [sinaiRegion]);
  setEventMap(dive.find((e) => e.id === "battle-of-ammunition-hill"), { center: [31.7994, 35.2281], zoom: 11 }, [
    marker("Ammunition Hill", 31.7994, 35.2281, "target", "One of the fiercest battles in Jerusalem, opening the way toward Mount Scopus and the Old City."),
    marker("Old City", 31.7767, 35.2345, "major", "Israeli forces entered the Old City after the battle for East Jerusalem."),
  ]);
  setEventMap(dive.find((e) => e.id === "jordanian-campaign"), { center: [31.9, 35.2], zoom: 8 }, [
    marker("East Jerusalem", 31.778, 35.235, "target", "The Jordanian front brought the war into Jerusalem and changed Israeli history dramatically."),
    marker("West Bank", 31.95, 35.25, "major", "Jordanian-held territory was captured during the campaign."),
    marker("Jordan Valley", 32.05, 35.55, "major", "Israeli forces pushed east as Jordanian resistance collapsed."),
  ], [westBankRegion]);
  setEventMap(dive.find((e) => e.id === "attack-on-an-iraqi-tupolev-plane-in-israel"), { center: [32.0, 35.0], zoom: 7 }, [
    marker("Israeli airspace", 32.0, 35.0, "target", "The Iraqi aircraft episode reflected Israeli fears that the war could expand beyond Egypt, Jordan, and Syria."),
    marker("Jordanian front", 31.95, 35.2, "major", "Iraqi support was tied to the wider eastern-front danger facing Israel."),
  ]);
  setEventMap(dive.find((e) => e.id === "uss-liberty-incident"), { center: [31.39, 33.38], zoom: 8 }, [
    marker("USS Liberty", 31.39, 33.38, "target", "Israeli air and naval forces mistakenly attacked the American intelligence ship on 8 June 1967."),
    marker("Sinai coast", 31.1, 33.8, "major", "The incident occurred while Israel was fighting fast-moving operations near Sinai."),
  ]);
  setEventMap(dive.find((e) => e.id === "battle-of-tel-azaziat"), { center: [33.2, 35.7], zoom: 9 }, [
    marker("Tel Azaziat", 33.22571, 35.66719, "target", "A fortified Syrian post overlooking northern Israel."),
    marker("Golan Heights", 33.0, 35.75, "major", "Capturing the heights removed a long-standing artillery threat to northern communities."),
    marker("Hula Valley", 33.1, 35.6, "minor", "Israeli communities below the heights had lived under Syrian fire."),
  ], [galileeRegion]);

  const summary = dive.find((e) => e.id === "battle-of-tel-azaziat")?.slides?.find((s) => s.title.includes("War Summary"));
  if (summary) {
    summary.body =
      "Israel captured the Sinai Peninsula, Gaza Strip, West Bank, East Jerusalem, and Golan Heights in six days. The speed was extraordinary because Israel began under blockade, reserve mobilization, and the fear of encirclement, then won air superiority in hours and used it to support rapid ground breakthroughs on three fronts.\n\nThe victory transformed Israel's strategic depth and morale, but it also created the central territorial and political disputes that shaped the next decades: control of the territories, Jerusalem, settlements, refugees, and the search for peace with neighboring states.";
    const final = summary.stats.find((s) => s.lbl === "Final assessment");
    if (final) final.lbl = summary.body;
  }

  clearMapHighlights(dive);
  writeDive(id, dive);
}

function patchFinnish() {
  const id = "finnish-civil-war";
  const dive = readDive(id);
  normalizeStats(dive);

  setEventMap(dive.find((e) => e.id === "origins-and-road-to-war"), { center: [61.5, 25.0], zoom: 5 }, [
    marker("Helsinki", 60.1699, 24.9384, "target", "The Red Guard held the capital early in the war."),
    marker("Vaasa", 63.0951, 21.6165, "major", "The White Senate operated from Vaasa during the war."),
    marker("Tampere", 61.4978, 23.761, "major", "Finland's key industrial city became the decisive battlefield."),
  ], [
    region([[21.0, 63.5], [26.5, 63.2], [27.4, 61.4], [24.8, 60.6], [21.5, 61.2], [21.0, 63.5]], "#4f8ec9", 0.15),
    region([[22.0, 61.4], [30.4, 61.2], [30.6, 59.8], [24.3, 59.6], [22.0, 61.4]], "#c94f4f", 0.14),
  ]);
  setEventMap(dive.find((e) => e.id === "invasion-of-land"), { center: [60.18, 20.0], zoom: 8 }, [
    marker("Åland Islands", 60.1785, 19.9156, "target", "Swedish, German, Russian, White, and Red interests intersected on the islands."),
    marker("Mariehamn", 60.1, 19.934, "major", "The islands' main town was central to the intervention."),
  ]);
  setEventMap(dive.find((e) => e.id === "battle-of-tampere"), { center: [61.4978, 23.761], zoom: 9 }, [
    marker("Tampere", 61.4978, 23.761, "target", "The decisive urban battle broke Red power in inland Finland."),
    marker("Kalevankangas", 61.495, 23.81, "major", "A prison camp and execution site after the battle."),
  ]);
  setEventMap(dive.find((e) => e.id === "battle-of-ruovesi"), { center: [61.985, 24.057], zoom: 9 }, [
    marker("Ruovesi", 61.985, 24.057, "target", "A prolonged fight on the northern edge of the Red-held area."),
  ]);
  setEventMap(dive.find((e) => e.id === "battle-of-rautu"), { center: [60.5, 30.2], zoom: 9 }, [
    marker("Rautu", 60.5, 30.2, "target", "A hard-fought battle on the Karelian Isthmus involving Red forces and Russian Bolshevik support."),
  ]);
  setEventMap(dive.find((e) => e.id === "battle-of-helsinki"), { center: [60.1699, 24.9384], zoom: 10 }, [
    marker("Helsinki", 60.1699, 24.9384, "target", "German troops and Finnish Whites captured the Red-held capital in April 1918."),
    marker("Harbor approaches", 60.16, 24.96, "major", "German forces used the coast and city approaches in the assault."),
  ]);
  setEventMap(dive.find((e) => e.id === "battle-of-viipuri"), { center: [60.7108, 28.7359], zoom: 10 }, [
    marker("Viipuri", 60.7108, 28.7359, "target", "The battle captured a major Red stronghold near the end of the war."),
  ]);
  setEventMap(dive.find((e) => e.id === "battle-of-h-meenlinna"), { center: [60.995, 24.464], zoom: 10 }, [
    marker("Hämeenlinna", 60.995, 24.464, "target", "White forces captured this city as Red resistance collapsed."),
  ]);
  setEventMap(dive.find((e) => e.id === "vyborg-massacre"), { center: [60.7108, 28.7359], zoom: 10 }, [
    marker("Viipuri/Vyborg", 60.7108, 28.7359, "target", "White Guards killed hundreds of Russians and suspected Reds during and after the city's capture."),
  ]);
  setEventMap(dive.find((e) => e.id === "international-and-human-dimensions"), { center: [61.5, 25.0], zoom: 5 }, [
    marker("German intervention", 60.17, 24.94, "major", "German troops helped capture Helsinki and shaped the war's final phase."),
    marker("Prison camps", 61.5, 23.8, "target", "Executions, hunger, and disease in camps made the aftermath especially deadly."),
    marker("Russian collapse", 60.7, 28.7, "major", "Russia's revolution and retreat created the space in which Finland's internal conflict exploded."),
  ]);
  setEventMap(dive.find((e) => e.id === "outcome-and-legacy"), { center: [61.5, 25.0], zoom: 5 }, [
    marker("Helsinki", 60.1699, 24.9384, "target", "The capital returned to White control, but the country emerged traumatized and divided."),
    marker("Tampere", 61.4978, 23.761, "major", "The battle became the central symbol of the war's violence."),
    marker("Viipuri", 60.7108, 28.7359, "major", "The final phase left a bitter legacy of reprisals and ethnic violence."),
  ]);

  clearMapHighlights(dive);
  writeDive(id, dive);
}

patchFinnish();
patch1948();
patchFedayeen();
patchSuez();
patchSixDay();

console.log("Updated Finnish Civil War, 1948 Arab-Israeli War, Palestinian Fedayeen Insurgency, Suez Crisis, and Six-Day War deep dives.");
