import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const BACKEND_ROOT = "C:\\Users\\alons\\Terra-Historia-Backend";
const DRAFT_DIR = join(BACKEND_ROOT, "deepdives-drafts");
const INDEX_PATH = join(BACKEND_ROOT, "deepdives-index.json");

const balticImageUpdates = {
  "lithuanian-soviet-war": {
    "battle-of-kedainiai": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Soviet_POWs_in_Lithuania.jpg/330px-Soviet_POWs_in_Lithuania.jpg",
    "battle-of-jieznas": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Bolseviku_7_pulko_kariai.jpg/250px-Bolseviku_7_pulko_kariai.jpg",
    "battle-of-alytus": "https://upload.wikimedia.org/wikipedia/commons/6/6b/Lithuanian_Wars_of_Independence%2C_War_with_Poland._Field_kitchen_of_the_5th_infantry_regiment_of_Grand_Duke_K%C4%99stutis_of_Lithuania_at_the_front_near_Vievis._1920%2C_Lithuania.jpg",
    "saxon-volunteers-and-german-support": "https://www.nevingtonwarmuseum.com/uploads/9/1/7/5/9175276/published/nevington-lithuiania-volunteers3_1.jpg?1552098465",
    "battle-of-ukmerge": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Bermontians_planes_captured_by_the_Lithuanian_Army.jpg/1920px-Bermontians_planes_captured_by_the_Lithuanian_Army.jpg",
    "international-and-human-dimensions": "https://preview.redd.it/lithuanian-troops-with-a-camel-that-was-taken-from-soviet-v0-40hicthdxac71.jpg?width=640&crop=smart&auto=webp&s=40e2b7913dea3987f3a52106d3f534418b7b1c33",
  },
  "polish-lithuanian-war": {
    "polish-capture-of-vilnius-1919": "https://commons.wikimedia.org/wiki/Special:FilePath/Polish_Army_enters_Vilnius%2C_1919.jpg",
    "sejny-uprising": "https://upload.wikimedia.org/wikipedia/commons/d/da/Sejny_Parada.jpg",
    "republic-of-central-lithuania": "https://upload.wikimedia.org/wikipedia/commons/8/81/Celebration_of_incorporation_of_Vilnius_Region_to_Poland_1922.PNG",
    "league-of-nations-mediation": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/J%C3%B3zef_Pi%C5%82sudski_w_Sejnach_%2822-320-1%29.jpg/250px-J%C3%B3zef_Pi%C5%82sudski_w_Sejnach_%2822-320-1%29.jpg",
    "international-and-human-dimensions": "https://i.redd.it/rmftfcbe8bj31.jpg",
    "outcome-and-legacy": "https://alchetron.com/cdn/1919-polish-coup-dtat-attempt-in-lithuania-8f28530f-1501-41bc-9b7c-0b67863e3f5-resize-750.jpg",
  },
};

const indexUpdates = {
  "transnistria-war": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Bender_1992.jpg/3840px-Bender_1992.jpg",
    description:
      "Trace the Transnistria War from Soviet collapse and language politics through Dubăsari, Bender, Russian 14th Army intervention, ceasefire, and the frozen conflict.",
  },
  "war-in-abkhazia": {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Parlament_of_Abkhazia.JPG",
    description:
      "Follow the War in Abkhazia through Georgia's 1992 entry, Gagra, Tkvarcheli, Gumista, Sukhumi, ethnic cleansing, Russian involvement, and the unresolved separatist legacy.",
  },
  "tajikistani-civil-war": {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Spetsnaz_soldiers_of_the_15th_Independent_Special_Forces_Brigade_during_the_Civil_War.jpg",
    description:
      "Explore the Tajikistani Civil War through regional factionalism, Dushanbe street politics, southern fighting, Afghan-border spillover, Russian involvement, UN mediation, and the 1997 peace.",
  },
  "russo-georgian-war": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Ruins_of_a_burnt_apartment_building_in_Gori.jpg/1920px-Ruins_of_a_burnt_apartment_building_in_Gori.jpg",
    description:
      "Trace the 2008 Russo-Georgian War through South Ossetian escalation, Tskhinvali, Russian intervention, attacks on Gori and Poti, ceasefire diplomacy, recognition, and occupation.",
  },
};

const deepDives = {
  "transnistria-war": [
    event("origins-and-road-to-war", 1990, "1990-09-02", "Origins and Road to War", "Soviet collapse turns identity and language politics into a state crisis", [47.2, 29.4], 7, [
      mark("Chișinău", [47.0105, 28.8638], "major", "Moldova's capital pushed language and sovereignty reforms that many east-bank industrial elites rejected."),
      mark("Tiraspol", [46.8482, 29.5968], "target", "Tiraspol became the political center of the separatist Transnistrian project."),
    ], slide("A State Splits Along the Dniester", "The Transnistria War grew out of the Soviet collapse, Moldovan sovereignty politics, language laws, and the fears of Russian-speaking industrial communities east of the Dniester. Separatist leaders in Tiraspol claimed they were defending Soviet-era rights and local industry; Chișinău saw a challenge to the territorial integrity of the new Moldovan state.", "", "No non-map Wikipedia image selected for this opening context.", [
      stat("1990-1992", "Conflict builds from sovereignty and language disputes."),
      note("Why this moment matters", "The political break came before the main shooting war, so the map needs to show both capitals: Chișinău as the recognized state center and Tiraspol as the separatist center."),
    ])),
    event("dubasari-clashes", 1990, "1990-11-02", "Dubăsari Clashes", "Early violence on the Dniester", [47.2631, 29.1608], 8, [
      mark("Dubăsari", [47.2631, 29.1608], "target", "Dubăsari saw early bloodshed and became one of the conflict's symbolic crossing points."),
      mark("Dniester crossings", [47.25, 29.12], "major", "Bridges and crossings mattered because Transnistria's geography is a narrow strip along the river."),
    ], slide("The First Bloodshed", "Violence around Dubăsari showed that the political conflict could become armed confrontation. Control of bridges, police posts, and local institutions mattered because the Dniester was not only a river boundary; it was the line along which authority, identity, and security began to separate.", "", "No non-map Wikipedia image selected for this event.", [
      stat("2 Nov 1990", "Early clash"),
      note("Why this moment matters", "Dubăsari turned constitutional argument into a security crisis and previewed the bridge-and-town geography of the 1992 war."),
    ])),
    event("pmr-state-building-and-14th-army", 1991, "1991-12-01", "PMR State-Building and the 14th Army", "Separatist institutions grow beside Soviet military stockpiles", [46.84, 29.62], 7, [
      mark("Tiraspol", [46.8482, 29.5968], "target", "The Pridnestrovian Moldavian Republic built ministries, guards, and political institutions around Tiraspol."),
      mark("Cobasna depot", [47.7667, 29.2], "major", "Former Soviet ammunition and Russian military presence became a strategic shadow over the conflict."),
    ], slide("Institutions Before Recognition", "By 1991, Transnistrian separatists were not only protesting Moldovan policy; they were building parallel institutions. The Russian 14th Army and Soviet stockpiles did not automatically decide every clash, but their presence shaped everyone's calculations. Moldova faced a separatist region with weapons, factories, local guards, and a powerful external military factor.", "", "No non-map Wikipedia image selected for this event.", [
      stat("1991", "Parallel institutions"),
      note("Why this moment matters", "A separatist movement is much harder to reverse once it has armed guards, administrative offices, and access to former Soviet military infrastructure."),
    ])),
    event("cocieri-and-dubasari-fighting", 1992, "1992-03-02", "Cocieri and Dubăsari Fighting", "The war's main phase begins", [47.301, 29.117], 8, [
      mark("Cocieri", [47.301, 29.117], "target", "Moldovan police and local forces fought around Cocieri as the main armed phase opened."),
      mark("Dubăsari", [47.2631, 29.1608], "major", "The Dubăsari area linked local clashes to the wider fight for control of the Dniester line."),
    ], slide("The Main War Opens", "The main armed phase began around Cocieri and Dubăsari in March 1992. Fighting involved Moldovan police, volunteers, Transnistrian guards, Cossacks, and former Soviet military networks. The battlefield was fragmented: villages, police stations, roadblocks, and bridges all carried political meaning.", "", "No non-map Wikipedia image selected for this event.", [
      stat("2 Mar 1992", "Main phase begins"),
      note("Why this moment matters", "The conflict became a real war when local armed incidents linked into a sustained campaign along the Dniester."),
    ])),
    event("battle-of-bender", 1992, "1992-06-19", "Battle of Bender", "The bloodiest battle of the war", [46.8316, 29.4777], 9, [
      mark("Bender / Tighina", [46.8316, 29.4777], "target", "Bender sits west of the Dniester but remained central to Transnistrian control, making it the war's most dangerous flashpoint."),
      mark("Dniester bridge", [46.84, 29.49], "major", "The bridge linked Bender to Tiraspol and made urban fighting strategically decisive."),
    ], slide("Urban War at Bender", "The Battle of Bender was the largest and bloodiest confrontation of the Transnistria War. Moldovan forces entered the city, Transnistrian forces counterattacked with support from Russian-linked elements, and civilians were trapped in urban fighting. The battle decided the war's military direction and made a negotiated ceasefire urgent.", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Bender_1992.jpg/3840px-Bender_1992.jpg", "Separatist forces during the Battle of Bender.", [
      stat("19-21 Jun 1992", "Battle period"),
      note("Why this moment matters", "Bender made the conflict impossible to treat as a low-level separatist dispute; it was now an urban war with heavy civilian risk and outside military involvement."),
    ])),
    event("lebeds-intervention-and-ceasefire", 1992, "1992-07-21", "Lebed's Intervention and Ceasefire", "Russian leverage freezes the front", [46.8482, 29.5968], 7, [
      mark("Tiraspol", [46.8482, 29.5968], "target", "The 14th Army's role and Alexander Lebed's arrival changed the balance after Bender."),
      mark("Moscow", [55.7558, 37.6173], "minor", "The ceasefire was shaped through Russian-Moldovan diplomacy."),
    ], slide("A Ceasefire With Russian Weight Behind It", "After Bender, the Russian 14th Army's role became decisive in stopping Moldova from restoring control by force. The July 1992 ceasefire froze the separation line and created a peacekeeping arrangement. It ended the main war but preserved the unresolved political conflict.", "", "No non-map Wikipedia image selected for this event.", [
      stat("21 Jul 1992", "Ceasefire"),
      note("Why this moment matters", "The ceasefire stopped the shooting but locked in a de facto statelet whose status remains unresolved."),
    ])),
    event("international-and-human-dimensions", 1992, "1992-07-22", "International and Human Dimensions", "Civilians, prisoners, and outside powers", [47.0, 29.3], 7, [
      mark("Bender", [46.8316, 29.4777], "major", "Bender concentrated the civilian trauma of shelling, street fighting, and contested casualty narratives."),
      mark("Security Zone", [47.1, 29.25], "target", "The postwar security zone became the physical expression of a frozen conflict."),
    ], slide("The Human Cost of a Frozen War", "The war displaced communities, produced civilian casualties, and left competing narratives of abuse by Moldovan and Transnistrian forces. Internationally, Russia, Romania, Ukraine, and the OSCE all mattered, but none produced a final status settlement. The people living around the security zone inherited the daily reality of unresolved sovereignty.", "", "No non-map Wikipedia image selected for this event.", [
      stat("Thousands displaced", "Human impact"),
      note("Why this moment matters", "The war's legacy is not only diplomatic; it is a lived geography of checkpoints, disputed memory, and families divided by unresolved status."),
    ])),
    event("outcome-and-legacy", 1992, "1992-07-21", "Outcome and Legacy", "A short war creates a long frozen conflict", [47.2, 29.4], 6, [
      mark("Tiraspol", [46.8482, 29.5968], "target", "Transnistria remained de facto separate after the ceasefire."),
      mark("Chișinău", [47.0105, 28.8638], "major", "Moldova retained international recognition over the territory but not effective control."),
    ], slide("No Final Settlement", "The Transnistria War ended with a ceasefire, not reintegration. Transnistria became a de facto state backed by Russian military presence, while Moldova remained internationally recognized within its Soviet-era borders. The conflict became one of the defining frozen conflicts of the post-Soviet space.", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Bender_1992.jpg/3840px-Bender_1992.jpg", "Bender remains one of the core memory sites of the war.", [
      stat("Frozen conflict", "Outcome"),
      note("Why this moment matters", "The front line hardened into a political reality that outlasted the war by decades."),
    ])),
  ],
  "war-in-abkhazia": [
    event("origins-and-road-to-war", 1992, "1992-08-14", "Origins and Road to War", "Georgia's state crisis reaches Abkhazia", [43.0, 41.0], 7, [
      mark("Tbilisi", [41.7151, 44.8271], "major", "Georgia's post-Soviet government was already weakened by internal conflict and legitimacy problems."),
      mark("Sukhumi", [43.0015, 41.0234], "target", "Sukhumi was the political prize and the capital of Abkhazia."),
    ], slide("A Separatist Crisis Inside a Georgian Crisis", "The War in Abkhazia began as Georgia tried to assert authority in a region where Abkhaz separatists feared domination by Tbilisi. The conflict overlapped with Georgia's own civil turmoil, Russian influence, North Caucasian volunteers, and competing memories of autonomy and demographic change.", "", "No non-map Wikipedia image selected for this opening context.", [
      stat("14 Aug 1992", "War begins"),
      note("Why this moment matters", "Abkhazia was not an isolated separatist fight; it unfolded while the Georgian state itself was fragile."),
    ])),
    event("georgian-entry-into-sukhumi", 1992, "1992-08-14", "Georgian Entry into Sukhumi", "The National Guard enters Abkhazia", [43.0015, 41.0234], 8, [
      mark("Sukhumi", [43.0015, 41.0234], "target", "Georgian forces entered the capital early in the war, shifting the crisis into full armed conflict."),
      mark("Abkhaz government retreat route", [43.1, 40.6], "major", "Abkhaz separatist leaders retreated toward Gudauta, where Russian military presence mattered."),
    ], slide("A Quick Entry With Long Consequences", "Georgian forces entered Abkhazia claiming to secure rail lines and free officials, but the move became the start of a full war. Georgian control of Sukhumi did not settle the conflict; it radicalized Abkhaz resistance and pulled in outside fighters and Russian military influence.", "", "No non-map Wikipedia image selected for this event.", [
      stat("Aug 1992", "Georgian entry"),
      note("Why this moment matters", "The opening operation achieved quick territorial control but helped create a wider coalition against Georgia."),
    ])),
    event("battle-of-gagra", 1992, "1992-10-01", "Battle of Gagra", "A ceasefire collapses on the northwest coast", [43.2786, 40.2719], 8, [
      mark("Gagra", [43.2786, 40.2719], "target", "The Abkhaz-led capture of Gagra reopened the war after a Moscow ceasefire."),
      mark("Russian border approach", [43.39, 40.0], "major", "The northwest coast connected Abkhaz forces to North Caucasian volunteers and Russian-side logistics."),
    ], slide("The War Turns at Gagra", "After a ceasefire, Abkhaz forces and North Caucasian volunteers attacked Gagra. The fall of the town changed the war's momentum and was followed by violence against Georgian civilians. Gagra showed that ceasefire lines could collapse quickly when outside support and local revenge converged.", "", "No non-map Wikipedia image selected for this event.", [
      stat("Oct 1992", "Gagra falls"),
      note("Why this moment matters", "Gagra shifted momentum away from Georgia and showed how the war's coastal geography linked Abkhazia to outside fighters."),
    ])),
    event("siege-of-tkvarcheli", 1992, "1992-10-01", "Siege of Tkvarcheli", "An isolated town becomes a humanitarian and military symbol", [42.8403, 41.6803], 8, [
      mark("Tkvarcheli", [42.8403, 41.6803], "target", "The besieged town became a symbol of Abkhaz endurance and outside humanitarian airlift."),
      mark("Eastern Abkhazia", [42.9, 41.7], "major", "The east mattered because it connected Abkhazia's war to the Georgian-populated Gali and Ochamchire areas."),
    ], slide("The Besieged Mining Town", "Tkvarcheli was isolated for much of the war and supplied partly by air. Its siege mattered militarily and symbolically: Abkhaz narratives emphasized survival under blockade, while Georgian narratives stressed the wider war and attacks on Georgian civilians elsewhere. The town became one of the conflict's competing memory sites.", "https://commons.wikimedia.org/wiki/Special:FilePath/Tkvarcheli_TEC.jpg", "Tkvarcheli power station area.", [
      stat("1992-1993", "Siege period"),
      note("Why this moment matters", "Tkvarcheli shows how the war was fought through isolation, supply, airlift, and competing humanitarian narratives."),
    ])),
    event("gumista-and-march-offensive", 1993, "1993-03-15", "Gumista and March Offensive", "The northern approaches to Sukhumi become decisive", [43.05, 40.96], 8, [
      mark("Gumista River", [43.05, 40.96], "target", "The Gumista line was the defensive barrier north of Sukhumi."),
      mark("Achadara-Kamani-Shroma area", [43.08, 41.05], "major", "Villages north and east of Sukhumi became routes for pressure on the capital."),
    ], slide("The River Line Before Sukhumi", "The Gumista front was central because whoever broke it could threaten Sukhumi directly. Abkhaz and allied forces repeatedly tested Georgian defenses, while Georgian troops tried to hold the capital's northern shield. The fighting made the geography around Sukhumi as important as the city itself.", "https://commons.wikimedia.org/wiki/Special:FilePath/Gumista_MO.jpg", "Gumista front memory site.", [
      stat("Mar-Jul 1993", "Offensive pressure"),
      note("Why this moment matters", "The road to Sukhumi ran through villages, river crossings, and ridgelines that made the capital vulnerable."),
    ])),
    event("battle-of-ochamchire", 1993, "1993-07-01", "Battle of Ochamchire", "The eastern front threatens Georgian-held territory", [42.7123, 41.4686], 8, [
      mark("Ochamchire", [42.7123, 41.4686], "target", "Fighting around Ochamchire connected the eastern front to the wider collapse of Georgian positions."),
      mark("Gali district", [42.626, 41.738], "major", "Gali's Georgian population later became central to displacement and return questions."),
    ], slide("Pressure in the East", "Fighting around Ochamchire and eastern Abkhazia widened pressure on Georgian positions and threatened routes toward Gali. The eastern front mattered because it linked battlefield movement to the fate of Georgian civilians in districts that would later be emptied or transformed by displacement.", "", "No non-map Wikipedia image selected for this event.", [
      stat("1993", "Eastern front"),
      note("Why this moment matters", "The eastern battles connected military pressure to the later geography of displacement."),
    ])),
    event("fall-of-sukhumi", 1993, "1993-09-27", "Fall of Sukhumi", "The capital falls after the ceasefire breaks", [43.0015, 41.0234], 9, [
      mark("Sukhumi", [43.0015, 41.0234], "target", "The fall of Sukhumi ended Georgian control over Abkhazia's capital."),
      mark("Supreme Soviet building", [43.003, 41.02], "major", "The damaged parliament building became one of the war's most recognizable images."),
    ], slide("The Capital Falls", "Sukhumi fell in September 1993 after Abkhaz and allied forces broke through. Georgian leaders and civilians fled, and members of the Abkhaz government-in-exile were killed. The fall of Sukhumi decided the war militarily and opened the worst phase of ethnic cleansing against Georgians.", "https://commons.wikimedia.org/wiki/Special:FilePath/Parlament_of_Abkhazia.JPG", "Damaged Supreme Soviet building in Sukhumi.", [
      stat("27 Sep 1993", "Sukhumi falls"),
      note("Why this moment matters", "The fall of the capital transformed Abkhazia from a contested war zone into a de facto separatist entity."),
    ])),
    event("ethnic-cleansing-of-georgians", 1993, "1993-09-28", "Ethnic Cleansing of Georgians", "Mass flight and violence reshape Abkhazia", [42.9, 41.3], 7, [
      mark("Sukhumi", [43.0015, 41.0234], "major", "Violence after the fall of Sukhumi became central to Georgian memory of the war."),
      mark("Gali return corridor", [42.626, 41.738], "target", "Gali later became the main district associated with partial Georgian return and continuing insecurity."),
    ], slide("A War That Remade the Population", "After Georgian defeat, large numbers of ethnic Georgians fled or were expelled from Abkhazia. Killings, looting, and fear remade the region's demography. The human legacy of the war is inseparable from displacement: Abkhazia became de facto independent, but at the cost of a massive refugee and return problem.", "", "No non-map Wikipedia image selected for this event.", [
      stat("Hundreds of thousands displaced", "Human impact"),
      note("Why this moment matters", "The war's outcome was not only territorial; it changed who could live safely in Abkhazia."),
    ])),
    event("outcome-and-legacy", 1993, "1993-09-30", "Outcome and Legacy", "De facto separation and unresolved return", [43.0, 41.0], 6, [
      mark("Sukhumi", [43.0015, 41.0234], "target", "Sukhumi remained the de facto capital of separatist Abkhazia."),
      mark("Tbilisi", [41.7151, 44.8271], "major", "Georgia continued to claim Abkhazia and treat displacement as a central national wound."),
    ], slide("Victory Without Recognition", "Abkhaz forces won the war and established de facto separation from Georgia. International recognition did not follow, and the unresolved status of Abkhazia became one of the central post-Soviet conflicts. The legacy includes Russian leverage, Georgian displacement, and a frozen political settlement that later shaped the 2008 war.", "https://commons.wikimedia.org/wiki/Special:FilePath/Parlament_of_Abkhazia.JPG", "The damaged Sukhumi parliament building remains a visual symbol of the war.", [
      stat("Abkhaz victory", "Military outcome"),
      note("Why this moment matters", "The unresolved Abkhazia conflict became part of the security architecture that led into later Georgian-Russian confrontation."),
    ])),
  ],
  "tajikistani-civil-war": [
    event("origins-and-road-to-war", 1992, "1992-05-05", "Origins and Road to War", "Regional politics and post-Soviet collapse become civil war", [38.56, 68.78], 6, [
      mark("Dushanbe", [38.5598, 68.787], "target", "The capital became the center of demonstrations, militia pressure, and government crisis."),
      mark("Garm and Gorno-Badakhshan", [38.9, 70.6], "major", "Opposition strength drew heavily from regions marginalized by the old ruling networks."),
    ], slide("A State Fractures by Region and Ideology", "The Tajikistani Civil War emerged from economic collapse, regional rivalry, post-Soviet state weakness, and a political opposition mixing democrats, Islamists, and regional movements. The government drew support from old Communist networks and powerful regional blocs, while the opposition mobilized communities that felt excluded from power.", "https://commons.wikimedia.org/wiki/Special:FilePath/Spetsnaz_soldiers_of_the_15th_Independent_Special_Forces_Brigade_during_the_Civil_War.jpg", "Spetsnaz soldiers of the 15th Independent Special Forces Brigade during the civil war.", [
      stat("1992-1997", "War period"),
      note("Why this moment matters", "The conflict cannot be understood as only Islamist versus secular; regional power, patronage, and state collapse mattered just as much."),
    ])),
    event("dushanbe-demonstrations-and-armed-clashes", 1992, "1992-05-05", "Dushanbe Demonstrations and Armed Clashes", "Street politics turns militarized", [38.5598, 68.787], 8, [
      mark("Dushanbe", [38.5598, 68.787], "target", "Rival demonstrations and armed groups turned the capital into the first major political battlefield."),
      mark("Government district", [38.573, 68.786], "major", "Control of ministries and broadcasting mattered as much as control of streets."),
    ], slide("The Capital Becomes a Battleground", "In Dushanbe, demonstrations over power, representation, and the presidential election escalated into armed confrontation. Weapons moved into politics, and politics moved into militias. The capital's crisis showed how quickly a weak post-Soviet state could lose its monopoly on force.", "", "No non-map Wikipedia image selected for this event.", [
      stat("May 1992", "Capital crisis"),
      note("Why this moment matters", "Once armed groups entered the capital's political struggle, compromise became far harder and regional militias gained leverage."),
    ])),
    event("southern-front-and-kulob-popular-front", 1992, "1992-09-01", "Southern Front and Popular Front", "Kulob-based forces gain momentum", [37.91, 69.78], 7, [
      mark("Kulob", [37.91, 69.78], "target", "The Popular Front drew major strength from Kulob networks that later helped Emomali Rahmon rise."),
      mark("Qurghonteppa / Bokhtar", [37.8364, 68.7803], "major", "Southern Tajikistan saw intense fighting and communal violence."),
    ], slide("The War Moves South", "The war's heaviest early violence unfolded in southern Tajikistan. Kulob-based Popular Front forces fought opposition-linked groups from Garm, Pamir, and Qurghonteppa networks. Local revenge, regional identity, and control of roads and farms made the southern front especially brutal for civilians.", "", "No non-map Wikipedia image selected for this event.", [
      stat("1992", "Southern escalation"),
      note("Why this moment matters", "The civil war's military balance shifted when regional militias became armies and local violence became national power politics."),
    ])),
    event("operation-hisar", 1992, "1992-09-20", "Operation Hisar", "Government-aligned forces contest the western approaches", [38.525, 68.551], 8, [
      mark("Hisor", [38.525, 68.551], "target", "Hisor controlled approaches west of Dushanbe and became a key zone in the struggle for the capital."),
      mark("Dushanbe western road", [38.54, 68.65], "major", "Road control around Dushanbe shaped whether militias could reinforce or isolate the capital."),
    ], slide("Holding the Roads Around Dushanbe", "Operation Hisar reflected the struggle to control the approaches to Dushanbe. In a country of mountains and limited road corridors, movement mattered. Whoever controlled the western roads could threaten the capital, protect it, or cut rivals off from reinforcements.", "", "No non-map Wikipedia image selected for this event.", [
      stat("1992", "Hisor fighting"),
      note("Why this moment matters", "The war was often decided by roads, valleys, and access to the capital rather than by large conventional front lines."),
    ])),
    event("afghan-border-and-refugee-crisis", 1993, "1993-01-01", "Afghan Border and Refugee Crisis", "The war spills across the Panj", [37.11, 68.3], 7, [
      mark("Panj River border", [37.11, 68.3], "target", "Refugees and opposition fighters crossed toward Afghanistan as the war intensified."),
      mark("Gorno-Badakhshan", [38.25, 72.0], "major", "Mountain regions became both opposition refuges and humanitarian crisis zones."),
    ], slide("A Civil War With an Afghan Rear Area", "The Tajik war was tied to Afghanistan through refugees, opposition bases, arms routes, and Islamist networks. Civilians fled across the Panj River, while Russian border troops and regional governments viewed the frontier as a security line against spillover.", "", "No non-map Wikipedia image selected for this event.", [
      stat("1992-1993", "Refugee crisis"),
      note("Why this moment matters", "The Afghan border made the Tajik war regional, connecting local civil conflict to post-Soviet security and Afghan factional politics."),
    ])),
    event("battle-at-the-12th-outpost", 1993, "1993-07-13", "Battle at the 12th Outpost", "Russian border troops become direct targets", [37.3, 69.2], 8, [
      mark("12th outpost area", [37.3, 69.2], "target", "The attack on Russian border guards showed how the frontier had become a combat zone."),
      mark("Tajik-Afghan border", [37.2, 69.0], "major", "Border posts were both military positions and symbols of Russian-backed security."),
    ], slide("The Border War Inside the Civil War", "The attack on the 12th outpost of the Moscow Border Detachment showed that Russian forces were not just observers. Border troops guarded the Afghan frontier, fought armed groups, and became part of the war's military structure. The battle hardened Russian and regional support for the government side.", "https://commons.wikimedia.org/wiki/Special:FilePath/Spetsnaz_soldiers_of_the_15th_Independent_Special_Forces_Brigade_during_the_Civil_War.jpg", "Russian special forces imagery from the Tajik Civil War context.", [
      stat("13 Jul 1993", "Outpost attack"),
      note("Why this moment matters", "The attack made the conflict a border-security war for Russia and neighboring states, not only a Tajik domestic struggle."),
    ])),
    event("un-mediation-and-inter-tajik-talks", 1994, "1994-12-01", "UN Mediation and Inter-Tajik Talks", "War fatigue opens a diplomatic track", [38.5598, 68.787], 6, [
      mark("Dushanbe", [38.5598, 68.787], "major", "The government needed international legitimacy and a route out of permanent war."),
      mark("Moscow talks", [55.7558, 37.6173], "minor", "Russia became a central diplomatic venue and security sponsor."),
    ], slide("From Battlefield to Negotiating Table", "By 1994, devastation and military stalemate made diplomacy more attractive. UN observers, Russia, Iran, and regional states all played roles in the Inter-Tajik talks. Negotiations did not end violence immediately, but they created a framework for power-sharing and reintegration of opposition forces.", "", "No non-map Wikipedia image selected for this event.", [
      stat("1994-1997", "Negotiation period"),
      note("Why this moment matters", "The war ended through a political bargain, so the peace process deserves as much attention as the fighting."),
    ])),
    event("general-agreement-on-peace", 1997, "1997-06-27", "General Agreement on Peace", "The Moscow Protocol ends the war", [55.7558, 37.6173], 6, [
      mark("Moscow", [55.7558, 37.6173], "target", "The final peace agreement was signed in Moscow by Emomali Rahmon and Sayid Abdulloh Nuri."),
      mark("Dushanbe", [38.5598, 68.787], "major", "The peace deal created mechanisms for reintegration and political power-sharing back in Tajikistan."),
    ], slide("A Negotiated End", "The 1997 General Agreement ended the civil war through power-sharing, amnesty, opposition integration, and international guarantees. The settlement did not create perfect democracy, but it stopped mass warfare and allowed Emomali Rahmon's state to consolidate around a controlled peace.", "", "No non-map Wikipedia image selected for this event.", [
      stat("27 Jun 1997", "Peace agreement"),
      note("Why this moment matters", "Tajikistan became one of the rare post-Soviet civil wars settled through negotiated inclusion of armed opposition."),
    ])),
    event("outcome-and-legacy", 1997, "1997-06-27", "Outcome and Legacy", "Peace, consolidation, and memory under state control", [38.56, 68.78], 6, [
      mark("Dushanbe", [38.5598, 68.787], "target", "The postwar state consolidated power in the capital."),
      mark("Garm and Badakhshan", [38.9, 70.6], "major", "Former opposition regions remained important to postwar integration and later tensions."),
    ], slide("A Devastated Country Rebuilt Under a Strong Presidency", "The war killed tens of thousands and displaced a huge share of Tajikistan's population. Peace allowed reconstruction, but the postwar order concentrated power under Rahmon and narrowed political pluralism. The legacy is both real peace and a tightly managed memory of what the war meant.", "https://commons.wikimedia.org/wiki/Special:FilePath/Spetsnaz_soldiers_of_the_15th_Independent_Special_Forces_Brigade_during_the_Civil_War.jpg", "Civil-war-era security forces remain one of the article's main Wikipedia images.", [
      stat("Armistice and consolidation", "Outcome"),
      note("Why this moment matters", "The settlement ended mass violence while creating the political structure that still shapes Tajikistan."),
    ])),
  ],
  "russo-georgian-war": [
    event("origins-and-background", 2008, "2008-08-01", "Origins and Background", "Frozen conflicts become a five-day war", [42.2, 43.9], 6, [
      mark("Tskhinvali", [42.2276, 43.9686], "target", "South Ossetia was the immediate trigger zone for the August 2008 war."),
      mark("Gori", [41.9842, 44.1158], "major", "Gori sat on the main route between South Ossetia and Georgia's east-west corridor."),
    ], slide("The Frozen Conflict That Thawed", "The Russo-Georgian War grew from unresolved South Ossetian and Abkhaz conflicts, Russian peacekeeping power, Georgian attempts to restore sovereignty, and years of escalating incidents. By August 2008, artillery exchanges, evacuations, and military movement made the conflict zone combustible.", "https://commons.wikimedia.org/wiki/Special:FilePath/Russo-Georgian%20War%20in%202008%20(1).jpg", "Russo-Georgian War imagery from 2008.", [
      stat("7-12 Aug 2008", "War period"),
      note("Why this moment matters", "The war was short because the escalation ladder had been built for years before the first major shots."),
    ])),
    event("august-escalation", 2008, "2008-08-07", "August Escalation", "Shelling, evacuations, and failed de-escalation", [42.2276, 43.9686], 8, [
      mark("Tskhinvali district", [42.2276, 43.9686], "target", "The final escalation centered on South Ossetian positions and Georgian villages around Tskhinvali."),
      mark("Ergneti area", [42.245, 43.96], "major", "Villages around the line of contact absorbed the prewar exchange of fire."),
    ], slide("The Last Hours Before War", "In the days before the war, violence around South Ossetia intensified through shelling, roadside bombs, evacuations, and claims that the other side was preparing an attack. The crisis moved faster than diplomacy. By the night of 7 August, Georgia launched operations toward Tskhinvali.", "", "No non-map Wikipedia image selected for this event.", [
      stat("7 Aug 2008", "Final escalation"),
      note("Why this moment matters", "The event shows how local incidents around a frozen conflict can become a state-to-state war."),
    ])),
    event("battle-for-tskhinvali", 2008, "2008-08-08", "Battle for Tskhinvali", "Georgia attacks the South Ossetian capital", [42.2276, 43.9686], 9, [
      mark("Tskhinvali", [42.2276, 43.9686], "target", "The city was the only major urban battle of the war."),
      mark("Russian peacekeeper bases", [42.23, 43.97], "major", "Russian peacekeeper casualties became central to Moscow's justification for intervention."),
    ], slide("The Fight for the City", "Georgian forces entered Tskhinvali after artillery preparation and fought South Ossetian forces and Russian peacekeepers. The battle was tactically intense and politically decisive: once Russian troops moved through the Roki Tunnel, the fighting in Tskhinvali became the opening phase of a wider Russian-Georgian war.", "", "No non-map Wikipedia image selected because the Battle of Tskhinvali article's lead image is a map.", [
      stat("8-10 Aug 2008", "Battle period"),
      note("Why this moment matters", "Tskhinvali converted a disputed peacekeeping zone into a direct clash between Georgia and Russia."),
    ])),
    event("russian-intervention", 2008, "2008-08-08", "Russian Intervention Through Roki Tunnel", "The 58th Army enters South Ossetia", [42.62, 44.11], 7, [
      mark("Roki Tunnel", [42.62, 44.11], "target", "The tunnel was Russia's key military gateway from North Ossetia into South Ossetia."),
      mark("Java", [42.399, 43.936], "major", "Russian columns moved through Java toward Tskhinvali."),
    ], slide("The Mountain Gateway", "Russian forces entered through the Roki Tunnel and moved down the mountain road toward Tskhinvali. The tunnel was the war's most important piece of terrain: it allowed Russia to turn local fighting into a rapid conventional intervention and forced Georgia to confront a much larger army.", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Ruins_of_a_burnt_apartment_building_in_Gori.jpg/1920px-Ruins_of_a_burnt_apartment_building_in_Gori.jpg", "Destroyed apartment building in Gori after Russian airstrikes.", [
      stat("8 Aug 2008", "Russian entry"),
      note("Why this moment matters", "The Roki Tunnel explains how Russian forces could reinforce South Ossetia quickly and change the war's scale."),
    ])),
    event("advance-toward-gori-and-poti", 2008, "2008-08-11", "Advance Toward Gori and Poti", "The war moves beyond South Ossetia", [41.9842, 44.1158], 7, [
      mark("Gori", [41.9842, 44.1158], "target", "Russian forces moved toward Gori, threatening Georgia's main east-west corridor."),
      mark("Poti", [42.15, 41.67], "major", "Russian forces also operated against the Black Sea port of Poti."),
    ], slide("Pressure Across Georgia", "Russian forces did not stop at Tskhinvali. They moved toward Gori, struck targets across Georgia, and operated near Poti on the Black Sea. The expansion showed that Moscow's goal was not only to defend South Ossetia; it was to punish Georgia and reshape the strategic environment.", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Ruins_of_a_burnt_apartment_building_in_Gori.jpg/1920px-Ruins_of_a_burnt_apartment_building_in_Gori.jpg", "Ruins in Gori after the war.", [
      stat("11 Aug 2008", "Advance widens"),
      note("Why this moment matters", "The move beyond South Ossetia made the war a national security crisis for Georgia."),
    ])),
    event("ceasefire", 2008, "2008-08-12", "Six-Point Ceasefire", "French mediation stops the main fighting", [41.7151, 44.8271], 6, [
      mark("Tbilisi", [41.7151, 44.8271], "target", "Georgia accepted an EU-brokered ceasefire as Russian forces held battlefield momentum."),
      mark("Moscow", [55.7558, 37.6173], "minor", "Russia accepted the ceasefire while keeping leverage through troops on the ground."),
    ], slide("Diplomacy Under Military Pressure", "The six-point ceasefire, brokered by French President Nicolas Sarkozy, stopped the main fighting but left many details contested. Withdrawal lines, security zones, and the status of Russian forces became the next battlefield in diplomatic form.", "", "No non-map Wikipedia image selected for this event.", [
      stat("12 Aug 2008", "Ceasefire"),
      note("Why this moment matters", "The ceasefire ended five days of war but left Russia in a stronger position on the ground."),
    ])),
    event("recognition-of-abkhazia-and-south-ossetia", 2008, "2008-08-26", "Russia Recognizes Abkhazia and South Ossetia", "Military victory becomes political rupture", [43.0, 41.0], 6, [
      mark("Sukhumi", [43.0015, 41.0234], "major", "Abkhazia gained Russian recognition after the war."),
      mark("Tskhinvali", [42.2276, 43.9686], "target", "South Ossetia also gained Russian recognition and deeper Russian military presence."),
    ], slide("Recognition After the War", "Russia recognized Abkhazia and South Ossetia as independent states on 26 August 2008. For Georgia and most of the world, this was occupation and partition. For Moscow, it formalized a new security reality after the war. The decision locked the conflict into a new phase.", "https://commons.wikimedia.org/wiki/Special:FilePath/Russo-Georgian%20War%20in%202008%20(1).jpg", "Russo-Georgian War imagery from 2008.", [
      stat("26 Aug 2008", "Recognition"),
      note("Why this moment matters", "Recognition turned battlefield victory into a lasting diplomatic confrontation."),
    ])),
    event("outcome-and-legacy", 2008, "2008-08-26", "Outcome and Legacy", "Occupation, displacement, and a warning for the post-Soviet order", [42.2, 43.9], 6, [
      mark("Akhalgori", [42.125, 44.485], "major", "Georgia lost control of Akhalgori after the war."),
      mark("Tskhinvali", [42.2276, 43.9686], "target", "South Ossetia remained under Russian-backed separation from Georgia."),
      mark("Gori", [41.9842, 44.1158], "major", "Gori symbolizes the war's civilian vulnerability inside undisputed Georgia."),
    ], slide("A Five-Day War With Long Consequences", "The Russo-Georgian War ended quickly but changed regional security. Russia entrenched itself in Abkhazia and South Ossetia, Georgia lost control of additional territory, civilians were displaced, and NATO-Russia tensions sharpened. The war became a warning about how frozen conflicts could become instruments of interstate coercion.", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Ruins_of_a_burnt_apartment_building_in_Gori.jpg/1920px-Ruins_of_a_burnt_apartment_building_in_Gori.jpg", "Gori after Russian strikes.", [
      stat("Russian victory", "Outcome"),
      note("Why this moment matters", "The war reshaped the post-Soviet security map and foreshadowed later Russian uses of frozen conflicts."),
    ])),
  ],
};

function event(id, year, date, title, sub, center, zoom, markers, slide) {
  return { id, year, date, title, sub, view: { center, zoom }, markers, regions: [], slides: [slide] };
}

function mark(label, latlng, type, description) {
  return { label, latlng, type, description };
}

function slide(title, body, img, cap, stats) {
  return { title, img, cap, body, stats };
}

function stat(val, lbl) {
  return { val, lbl };
}

function note(val, lbl) {
  return { val, lbl, full: true };
}

async function readJson(path) {
  return JSON.parse((await readFile(path, "utf8")).replace(/^\uFEFF/, ""));
}

async function writeJson(path, data) {
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function fixStats(slide, event) {
  const oldFull = (slide.stats || []).find((item) => item.full);
  const oldText = oldFull?.lbl?.length > oldFull?.val?.length ? oldFull.lbl : oldFull?.val;
  const noteText = oldText || slide.body || `${event.title} matters because it changed the direction of the conflict.`;
  slide.stats = [
    stat(String(event.date || event.year).slice(0, 4), "Timeline year"),
    stat(event.title, "Event focus"),
    note("Why this moment matters", noteText),
  ];
}

for (const [id, updates] of Object.entries(balticImageUpdates)) {
  const path = join(DRAFT_DIR, `${id}.generated.json`);
  const events = await readJson(path);
  for (const event of events) {
    const first = event.slides?.[0];
    if (!first) continue;
    if (updates[event.id]) {
      first.img = updates[event.id];
      first.cap = `Visual reference for ${event.title}.`;
    }
    fixStats(first, event);
  }
  await writeJson(path, events);
  console.log(`Fixed images and notes for ${id}`);
}

for (const [id, events] of Object.entries(deepDives)) {
  await writeJson(join(DRAFT_DIR, `${id}.generated.json`), events);
  console.log(`Expanded ${id}.generated.json (${events.length} events)`);
}

const index = await readJson(INDEX_PATH);
for (const item of index) {
  if (indexUpdates[item.id]) Object.assign(item, indexUpdates[item.id]);
}
await writeJson(INDEX_PATH, index);
console.log("Updated deepdives-index.json");
