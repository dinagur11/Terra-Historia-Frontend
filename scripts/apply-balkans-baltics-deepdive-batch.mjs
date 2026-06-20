import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const BACKEND_ROOT = "C:\\Users\\alons\\Terra-Historia-Backend";
const DRAFT_DIR = join(BACKEND_ROOT, "deepdives-drafts");
const INDEX_PATH = join(BACKEND_ROOT, "deepdives-index.json");

const indexUpdates = {
  "croatian-war-of-independence": {
    image: "https://i.namu.wiki/i/pEKy5sIZgO1RO9PJtP_wN2Pylt25JtHj30lrLmyOWgg7PhS93WqRIh-UnFfeDKi1YxebfiS7jnzz-3rG7eX9lg.webp",
    description:
      "Follow Croatia's break from Yugoslavia through early clashes, sieges, UN diplomacy, Croatian offensives, displacement, and the war's contested legacy.",
  },
  "croat-bosniak-war": {
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Croat%E2%80%93Bosniak_War_collage.jpg",
    description:
      "Trace the Croat-Bosniak War from the collapse of alliance politics in Bosnia to massacres, Mostar, international pressure, and the Washington Agreement.",
  },
  "kosovo-war": {
    image:
      "https://www.reuters.com/resizer/v2/https%3A%2F%2Farchive-images.prod.global.a201836.reutersmedia.net%2F2009%2F02%2F17%2F2009-02-17T201017Z_02_RP1DRIHUUFAB_RTRRPP_0_YUGOSLAVIA-KOSOVO.JPG?auth=92eb574ca4ace4f63c5ee44fd4f9782710e11dd620116f8be7ffa18c1607f97c&width=1920&quality=80",
    description:
      "Explore Kosovo's road from lost autonomy and insurgency to massacres, NATO intervention, displacement, UN administration, and disputed independence.",
  },
  "lithuanian-soviet-war": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Soviet_POWs_in_Lithuania.jpg/330px-Soviet_POWs_in_Lithuania.jpg",
    description:
      "Follow Lithuania's 1918-1919 war against Soviet forces through the collapse of empire, battles around Kaunas and Alytus, German support, and the defense of independence.",
  },
  "polish-lithuanian-war": {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Soldiers_of_the_Lithuanian_Army_in_Vilnius%2C_Lithuania%2C_1920.jpg/250px-Soldiers_of_the_Lithuanian_Army_in_Vilnius%2C_Lithuania%2C_1920.jpg",
    description:
      "Trace the Polish-Lithuanian War through the dispute over Vilnius, Sejny and Suwałki, the Polish-Soviet War overlap, Żeligowski's mutiny, and the frozen diplomatic rupture.",
  },
};

const imageUpdates = {
  "croatian-war-of-independence": {
    "origins-and-road-to-war": "https://i.namu.wiki/i/pEKy5sIZgO1RO9PJtP_wN2Pylt25JtHj30lrLmyOWgg7PhS93WqRIh-UnFfeDKi1YxebfiS7jnzz-3rG7eX9lg.webp",
    "pakrac-clash": "https://devedesete.vip/h-content/uploads/2021/06/okrsaj-u-pakracu-martovske-ide-1.jpg",
    "plitvice-lakes-incident": "https://historydraft.com/files/c208a5e0-1b85-47de-a719-935af9cea077",
    "operation-maslenica": "https://preview.redd.it/croatian-soldiers-of-111th-brigade-during-assault-on-v0-hqn5ji91dbme1.png?width=1080&crop=smart&auto=webp&s=2fa9ba3fcfa82c3c99a5ddf0ba26f122967b21e7",
    "operation-medak-pocket": "https://d3d0lqu00lnqvz.cloudfront.net/media/media/c2680d9b-a338-43ec-a4e4-a58bcf6a56f8.jpg",
    "operation-flash": "https://balkaninsight.com/wp-content/uploads/2012/05/bljesak-tenkovi-i-vojnici-beta.jpg",
    "operation-storm": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Croatian_Air_Force_Mikoyan-Gurevich_MiG-21bisD.jpg",
    "international-and-human-dimensions": "https://cdn.historycollection.com/wp-content/uploads/2017/07/Santa-Claus-with-the-children-during-Croatian-War-of-Independence.-Vukovar-1992.-Rare-Historical-Photos.jpg",
    "outcome-and-legacy": "https://www.memoriesofawar.com/wp-content/uploads/2017/10/Croatia-War.jpg",
  },
  "croat-bosniak-war": {
    "origins-and-road-to-war": "https://upload.wikimedia.org/wikipedia/commons/7/7c/Croat%E2%80%93Bosniak_War_collage.jpg",
    "kavanjina-ambush": "https://upload.wikimedia.org/wikipedia/en/thumb/6/6d/HVO%2C_ARBiH%2C_and_HOS_soldiers_in_Mostar%2C_June_1992.jpg/250px-HVO%2C_ARBiH%2C_and_HOS_soldiers_in_Mostar%2C_June_1992.jpg",
    "ahmi-i-massacre": "https://ahmici.sensecentar.org/assets/Uploads/section-covers/vertical1.jpg",
    "trusina-massacre": "https://gdb.rferl.org/c7123089-cf4c-4514-82ca-b6f38924460a_w1200_h630.jpg",
    "zenica-massacre": "https://static01.nyt.com/images/2025/07/11/multimedia/11int-bosnia-genocide-scrolly-FPO-hvcz/11int-bosnia-genocide-scrolly-FPO-hvcz-mobileMasterAt3x.jpg",
    "vrbanja-massacre": "https://cdn.britannica.com/44/142344-050-03FB6863/Bodies-people-Vitez-conflict-Bosnia-and-Herzegovina-April-1993.jpg",
    "mokronoge-massacre": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Srebrenica_massacre_memorial_gravestones_2009_1.jpg/1280px-Srebrenica_massacre_memorial_gravestones_2009_1.jpg",
    "stupni-do-massacre": "https://balkaninsight.com/wp-content/uploads/2020/10/Stupni-Do-e1603378813283.jpg",
    "kri-an-evo-selo-massacre": "https://upload.wikimedia.org/wikipedia/commons/e/e6/Spomenik_%C5%BErtvama-Kri%C5%BEan%C4%8Devo_selo09420.JPG",
    "international-and-human-dimensions": "https://balkaninsight.com/wp-content/uploads/2021/02/14377430247_cbb3767a60_o-e1614266521395.jpg",
    "outcome-and-legacy": "https://balkaninsight.com/wp-content/uploads/2015/05/bleiburg-hvo-flags.jpg",
  },
  "kosovo-war": {
    "origins-and-road-to-war": "https://www.reuters.com/resizer/v2/https%3A%2F%2Farchive-images.prod.global.a201836.reutersmedia.net%2F2009%2F02%2F17%2F2009-02-17T201017Z_02_RP1DRIHUUFAB_RTRRPP_0_YUGOSLAVIA-KOSOVO.JPG?auth=92eb574ca4ace4f63c5ee44fd4f9782710e11dd620116f8be7ffa18c1607f97c&width=1920&quality=80",
    "drenica-massacres": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Masakra_n%C3%AB_Poklek.jpg/250px-Masakra_n%C3%AB_Poklek.jpg",
    "ra-ak-massacre": "https://live-production.wcms.abc-cdn.net.au/32a0e563765997e6f34e6d2c6148fd85?impolicy=wcms_crop_resize&cropH=1364&cropW=2048&xPos=0&yPos=5&width=862&height=575",
    "izbica-massacre": "https://www.hrw.org/sites/default/files/styles/16x9_large/public/multimedia_images_2019/201906eca_kosovoanniversary_main_0.jpg?itok=0az_PO2z",
    "meja-massacre": "https://president-ksgov.net/wp-content/uploads/Meja-1.jpg",
    "u-ka-massacre": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/RCMP_in_Kosovo.jpg/250px-RCMP_in_Kosovo.jpg",
    "international-and-human-dimensions": "https://www.pbs.org/wgbh/pages/frontline/shows/kosovo/art/ncleansep.jpg",
    "outcome-and-legacy": "https://www.bozar.be/sites/default/files/styles/open_graph_style/public/efficy/images/2291308_photo_kosovo.jpg?h=be46d029&itok=5Dg47shj",
  },
};

const markerUpdates = {
  "croatian-war-of-independence": {
    "origins-and-road-to-war": [
      m("Zagreb", [45.815, 15.9819], "major", "Croatia's leadership moved from republican politics toward independence as Yugoslavia's federal order broke down."),
      m("Knin", [44.0408, 16.1969], "target", "The Serb Autonomous Krajina centered on Knin became the core territorial challenge to the Croatian state."),
    ],
    "pakrac-clash": [m("Pakrac", [45.4364, 17.1889], "target", "Pakrac showed how police authority, local Serb rebellion, and federal intervention could turn administrative control into armed confrontation.")],
    "plitvice-lakes-incident": [m("Plitvice Lakes", [44.8806, 15.6164], "target", "The Easter confrontation at Plitvice produced some of the first deaths of the war and made escalation harder to reverse.")],
    "battle-of-vukovar": [m("Vukovar", [45.3433, 18.9997], "target", "Vukovar's siege became the war's central symbol of urban destruction, resistance, and civilian suffering.")],
    "siege-of-dubrovnik": [m("Dubrovnik", [42.6507, 18.0944], "target", "The shelling of Dubrovnik drew international attention because a historic city far from the main front was attacked.")],
    "operation-maslenica": [
      m("Maslenica Bridge area", [44.2206, 15.5417], "target", "Croatia attacked to reopen a strategic link between Dalmatia and the rest of the country."),
      m("Zadar hinterland", [44.1194, 15.2314], "major", "The operation pushed front lines away from Zadar but left a tense pocket of fighting."),
    ],
    "operation-medak-pocket": [m("Medak Pocket", [44.54, 15.45], "target", "The Croatian attack reduced a Serb-held salient near Gospić but became internationally notorious for crimes against civilians and prisoners.")],
    "operation-flash": [m("Western Slavonia", [45.25, 17.2], "target", "Operation Flash rapidly retook western Slavonia and previewed Croatia's improved 1995 offensive capacity.")],
    "operation-storm": [
      m("Knin", [44.0408, 16.1969], "target", "The capture of Knin broke the political center of the Republic of Serbian Krajina."),
      m("Krajina corridors", [44.45, 16.1], "major", "The offensive reopened territory while triggering a mass Serb refugee flight."),
    ],
    "international-and-human-dimensions": [
      m("Vukovar", [45.3433, 18.9997], "major", "Vukovar anchors the human story of siege, detention, missing persons, and postwar memory."),
      m("UN Protected Areas", [44.5, 16.0], "target", "UN peacekeeping froze front lines without resolving sovereignty, displacement, or accountability."),
    ],
    "outcome-and-legacy": [
      m("Eastern Slavonia", [45.35, 18.8], "target", "Eastern Slavonia returned through a UN-backed transition rather than another major Croatian offensive."),
      m("Knin", [44.0408, 16.1969], "major", "Knin remains central to Croatian victory memory and Serbian displacement memory."),
    ],
  },
  "croat-bosniak-war": {
    "origins-and-road-to-war": [
      m("Mostar", [43.3438, 17.8078], "target", "Mostar became the war's most visible urban fracture between former Croat and Bosniak allies."),
      m("Central Bosnia", [44.1, 17.7], "major", "Mixed towns in the Lašva Valley and central Bosnia became the core battlefield."),
    ],
    "kavanjina-ambush": [m("Mostar", [43.3438, 17.8078], "target", "The ambush belongs to the breakdown of cooperation among HVO, ARBiH, and local armed formations around Mostar.")],
    "ahmi-i-massacre": [m("Ahmići", [44.136, 17.86], "target", "Ahmići became one of the defining atrocity sites of the Croat-Bosniak War.")],
    "trusina-massacre": [m("Trusina", [43.62, 17.96], "target", "The Trusina killings show that atrocities were committed against civilians and prisoners on both sides of the conflict.")],
    "zenica-massacre": [m("Zenica", [44.2034, 17.9077], "target", "The shelling of Zenica's market area brought the wider Bosnian war's urban civilian vulnerability into the Croat-Bosniak front.")],
    "vrbanja-massacre": [m("Vrbanja / Vitez area", [44.15, 17.79], "target", "The Vitez area saw repeated violence against civilians as front lines hardened inside mixed communities.")],
    "mokronoge-massacre": [m("Mokronoge", [43.62, 17.29], "target", "Mokronoge marks the spread of revenge killings and local terror beyond the best-known towns.")],
    "stupni-do-massacre": [m("Stupni Do", [44.13, 18.15], "target", "Stupni Do became a key atrocity case tied to attacks on Bosniak civilians in central Bosnia.")],
    "kri-an-evo-selo-massacre": [m("Križančevo Selo", [44.18, 17.79], "target", "The massacre remains part of Croat victim memory around Vitez and the late-1993 fighting.")],
    "international-and-human-dimensions": [
      m("Mostar bridge line", [43.337, 17.815], "major", "Mostar's divided cityscape turned a local front into an international symbol of cultural and communal rupture."),
      m("Washington", [38.9072, -77.0369], "minor", "US diplomacy helped push Croat and Bosniak leaders into the Washington Agreement."),
    ],
    "outcome-and-legacy": [m("Federation of Bosnia and Herzegovina", [43.8563, 18.4131], "target", "The Washington Agreement ended Croat-Bosniak fighting by creating a federation that could fight beside Bosnian government forces.")],
  },
  "kosovo-war": {
    "origins-and-road-to-war": [
      m("Pristina", [42.6629, 21.1655], "major", "Kosovo's lost autonomy, parallel institutions, and police control centered political pressure in Pristina."),
      m("Drenica", [42.7, 20.85], "target", "Drenica became a KLA stronghold and one of the first major zones of Serbian security operations."),
    ],
    "drenica-massacres": [m("Drenica region", [42.7, 20.85], "target", "Serbian operations in Drenica radicalized the conflict and expanded support for armed resistance.")],
    "attack-on-prekaz": [m("Prekaz", [42.746, 20.788], "target", "The attack on the Jashari compound became a founding martyrdom story for the KLA.")],
    "ra-ak-massacre": [m("Račak", [42.466, 21.007], "target", "Račak shifted international diplomacy by making civilian killing impossible to treat as a local security incident.")],
    "nato-bombing-of-yugoslavia": [
      m("Belgrade", [44.8125, 20.4612], "major", "NATO struck Yugoslav command, infrastructure, and military targets to force withdrawal from Kosovo."),
      m("Kosovo front", [42.6, 21.0], "target", "The air campaign coincided with intensified expulsions and violence on the ground."),
    ],
    "izbica-massacre": [m("Izbica", [42.72, 20.78], "target", "Izbica became one of the massacre sites later documented by human-rights investigators.")],
    "meja-massacre": [m("Meja", [42.44, 20.37], "target", "Meja was one of the largest single massacres of Kosovo Albanian civilians during the war.")],
    "u-ka-massacre": [m("Ćuška / Qyshk", [42.65, 20.29], "target", "Ćuška marks the Peja-area violence and the broader pattern of expulsions, killings, and cover-up.")],
    "incident-at-pristina-airport": [m("Pristina Airport", [42.5736, 21.0358], "target", "Russian troops' arrival at the airport exposed the diplomatic tension behind the postwar NATO-led deployment.")],
    "international-and-human-dimensions": [
      m("Kukës refugee route", [42.0767, 20.4217], "major", "Hundreds of thousands of refugees crossed into Albania during the expulsions."),
      m("North Macedonia border", [42.16, 21.37], "major", "Another huge flow of refugees crossed south toward Macedonia."),
    ],
    "outcome-and-legacy": [
      m("Pristina", [42.6629, 21.1655], "target", "Kosovo came under UN administration after Yugoslav withdrawal."),
      m("Mitrovica", [42.8914, 20.866], "major", "Mitrovica became a symbol of the unresolved Serb-Albanian divide after the war."),
    ],
  },
};

const customDeepDives = {
  "lithuanian-soviet-war": [
    e("origins-and-road-to-war", 1918, "1918-11-11", "Origins and Road to War", "Lithuania builds a state as empires collapse", [55.1, 24.0], 6, [
      m("Vilnius", [54.6872, 25.2797], "major", "Lithuania claimed Vilnius as its capital, but control of the city shifted as German forces withdrew and Soviet forces advanced."),
      m("Kaunas", [54.8985, 23.9036], "target", "Kaunas became the practical center of Lithuanian state-building when Vilnius became unsafe."),
    ], s("Independence Under Immediate Pressure", "Lithuania declared independence in the ruins of World War I, but sovereignty existed first as a claim more than a settled reality. German occupation authorities were withdrawing, Soviet forces moved west through the former empire, and the Lithuanian government had to build an army, administration, and foreign ties while the front approached.", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Volunteers_of_the_Lithuanian_Armed_Forces_heading_to_the_Lithuanian_Wars_of_Independence_in_Vilkavi%C5%A1kis%2C_1919.jpg/250px-Volunteers_of_the_Lithuanian_Armed_Forces_heading_to_the_Lithuanian_Wars_of_Independence_in_Vilkavi%C5%A1kis%2C_1919.jpg", "Lithuanian volunteers heading to the independence wars.", [st("1918", "Independence year"), st("German withdrawal and Soviet advance", "Opening crisis"), st("State-building and war begin together", "Core theme", true)])),
    e("soviet-westward-offensive", 1918, "1918-12-12", "Soviet Westward Offensive", "Red Army forces enter Lithuania", [55.4, 25.6], 6, [
      m("Daugavpils axis", [55.874, 26.536], "major", "Soviet forces advanced from the northeast through the old imperial rail and road corridors."),
      m("Vilnius", [54.6872, 25.2797], "target", "The advance threatened the city before Lithuania had a mature army."),
    ], s("The Red Army Moves West", "Soviet forces advanced into Lithuania as part of a broader westward push after Germany's defeat. The campaign aimed to spread revolutionary power into the former imperial borderlands. Lithuania's problem was brutally practical: there were too few trained troops, too little equipment, and too little time to defend every symbolic place.", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Soviet_POWs_in_Lithuania.jpg/330px-Soviet_POWs_in_Lithuania.jpg", "Soviet prisoners of war in a Lithuanian camp.", [st("Dec 1918", "Soviet advance"), st("Northeastern Lithuania", "Initial pressure"), st("Lithuania is forced to trade space for time", "Effect", true)])),
    e("government-withdraws-to-kaunas", 1919, "1919-01-02", "Government Withdraws to Kaunas", "The capital question becomes a survival question", [54.8985, 23.9036], 7, [
      m("Vilnius", [54.6872, 25.2797], "major", "Vilnius was lost as a secure seat of government during the first Soviet advance."),
      m("Kaunas", [54.8985, 23.9036], "target", "Kaunas became Lithuania's temporary capital and organizational hub."),
    ], s("A Retreat That Preserved the State", "The Lithuanian government withdrew to Kaunas as Vilnius became exposed. Losing the historic capital was a severe blow, but the move preserved the institutions needed to keep fighting: ministries, recruitment, foreign contacts, and command structures. Kaunas became the working capital of a state still fighting to prove it could exist.", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Enlistment_in_the_Lithuanian_Army%2C_Panemun%C4%97%2C_Kaunas_1919.jpg/250px-Enlistment_in_the_Lithuanian_Army%2C_Panemun%C4%97%2C_Kaunas_1919.jpg", "Enlistment in the Lithuanian Army in Kaunas, 1919.", [st("Jan 1919", "Government move"), st("Kaunas", "Temporary capital"), st("Institutional survival matters as much as battlefield control", "Significance", true)])),
    e("battle-of-kedainiai", 1919, "1919-02-08", "Battle of Kėdainiai", "Lithuanian forces hold the road to Kaunas", [55.2883, 23.9747], 8, [
      m("Kėdainiai", [55.2883, 23.9747], "target", "Fighting around Kėdainiai helped block Soviet movement toward Kaunas."),
      m("Kaunas approaches", [54.95, 24.1], "major", "The defense of Kaunas was the defense of the Lithuanian government's survival."),
    ], s("Stopping the Advance Toward Kaunas", "Kėdainiai mattered because it sat on the approaches to the temporary capital. Lithuanian volunteers and early regular units fought to stop Soviet movement before it could break the government's center. The battle showed that the young army could do more than retreat: it could hold key nodes long enough for recruitment and outside support to matter.", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Volunteers_of_the_Lithuanian_Armed_Forces_heading_to_the_Lithuanian_Wars_of_Independence_in_Vilkavi%C5%A1kis%2C_1919.jpg/250px-Volunteers_of_the_Lithuanian_Armed_Forces_heading_to_the_Lithuanian_Wars_of_Independence_in_Vilkavi%C5%A1kis%2C_1919.jpg", "Lithuanian volunteers heading to the independence wars.", [st("Feb 1919", "Battle period"), st("Kėdainiai", "Defensive node"), st("Helps shield Kaunas from Soviet advance", "Result", true)])),
    e("battle-of-jieznas", 1919, "1919-02-10", "Battle of Jieznas", "A local defeat becomes an army lesson", [54.6, 24.18], 8, [
      m("Jieznas", [54.6, 24.18], "target", "The fighting exposed weaknesses in Lithuanian command, training, and coordination."),
    ], s("The Cost of Learning Under Fire", "The Battle of Jieznas was a painful early fight for Lithuanian forces. Poor coordination and inexperience contributed to losses, but the episode also clarified what the army had to fix quickly: command discipline, reconnaissance, communications, and the ability to coordinate volunteers with regular units.", "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Lithuanian_soldiers_during_the_Lithuanian_Wars_of_Independence_%28between_1919%E2%80%931920%29.jpg/250px-Lithuanian_soldiers_during_the_Lithuanian_Wars_of_Independence_%28between_1919%E2%80%931920%29.jpg", "Lithuanian soldiers during the independence wars.", [st("Feb 1919", "Battle period"), st("Jieznas", "Battlefield"), st("Early setbacks shape a more capable army", "Lesson", true)])),
    e("battle-of-alytus", 1919, "1919-02-12", "Battle of Alytus", "Southern Lithuania becomes a battlefield", [54.3963, 24.0459], 8, [
      m("Alytus", [54.3963, 24.0459], "target", "Alytus guarded southern approaches and became one of the early tests of Lithuanian defense."),
      m("Nemunas crossing", [54.4, 24.05], "major", "River crossings shaped movement and supply in southern Lithuania."),
    ], s("Holding the Southern Approach", "Alytus was important because southern routes and Nemunas crossings could open the way toward the Lithuanian interior. Fighting there showed the war's geographic spread: this was not only a struggle for Vilnius, but a contest over roads, rivers, towns, and the fragile state network being built behind them.", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Chief_Commander_of_the_Lithuanian_Army_Silvestras_%C5%BDukauskas_heading_to_the_front%2C_1919.jpg/250px-Chief_Commander_of_the_Lithuanian_Army_Silvestras_%C5%BDukauskas_heading_to_the_front%2C_1919.jpg", "Chief Commander Silvestras Žukauskas heading to the front, 1919.", [st("Feb 1919", "Battle period"), st("Alytus", "Southern front"), st("River and road control shaped the campaign", "Operational context", true)])),
    e("saxon-volunteers-and-german-support", 1919, "1919-03-01", "Saxon Volunteers and German Support", "Foreign support buys time", [55.0, 24.0], 6, [
      m("Kaunas", [54.8985, 23.9036], "major", "German assistance and Saxon volunteers helped stabilize Lithuanian defenses while the army organized."),
      m("Rail corridors", [55.1, 24.3], "minor", "Rail access mattered for moving troops, weapons, and supplies in a state short of resources."),
    ], s("An Uneasy but Useful Partnership", "German support and Saxon volunteer formations helped Lithuania resist the Soviet advance. The partnership was not simple: Germany had its own regional interests after defeat in World War I. Still, weapons, officers, and trained troops gave Lithuania time to turn volunteers into a functioning army.", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Enlistment_in_the_Lithuanian_Army%2C_Panemun%C4%97%2C_Kaunas_1919.jpg/250px-Enlistment_in_the_Lithuanian_Army%2C_Panemun%C4%97%2C_Kaunas_1919.jpg", "Enlistment in the Lithuanian Army in Kaunas, 1919.", [st("1919", "Support period"), st("Saxon volunteers", "Outside military aid"), st("Foreign support helps Lithuania survive the army-building phase", "Significance", true)])),
    e("battle-of-ukmerge", 1919, "1919-05-03", "Battle of Ukmergė", "Lithuania begins pushing back", [55.2453, 24.7636], 8, [
      m("Ukmergė", [55.2453, 24.7636], "target", "The Lithuanian advance toward Ukmergė marked the shift from defense to counteroffensive."),
    ], s("From Defense to Counteroffensive", "By spring 1919, Lithuanian forces were better organized and able to push Soviet troops back from parts of central Lithuania. Ukmergė mattered as a road hub and as evidence that the front was changing. The army that had improvised around Kaunas was now capable of coordinated offensive action.", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Soviet_POWs_in_Lithuania.jpg/330px-Soviet_POWs_in_Lithuania.jpg", "Soviet prisoners in Lithuania during the war.", [st("May 1919", "Battle period"), st("Ukmergė", "Road hub"), st("Lithuanian counteroffensive gains momentum", "Result", true)])),
    e("zarasai-operation", 1919, "1919-08-25", "Zarasai Operation", "The Red Army is pushed out of Lithuania", [55.7333, 26.25], 7, [
      m("Zarasai", [55.7333, 26.25], "target", "The northeastern offensive helped clear Soviet forces from Lithuanian territory."),
      m("Daugavpils direction", [55.874, 26.536], "major", "The campaign linked Lithuania's front to the wider anti-Bolshevik fighting around Latvia and Belarus."),
    ], s("Clearing the Northeast", "The Zarasai operation helped push Soviet forces out of Lithuania's northeast. By this phase, the Lithuanian army had gained experience, outside support had stabilized the front, and the Soviet position was strained by several wars at once. The operation gave Lithuania a stronger military position before new disputes with Poland and Bermondtian forces complicated independence.", "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Lithuanian_soldiers_during_the_Lithuanian_Wars_of_Independence_%28between_1919%E2%80%931920%29.jpg/250px-Lithuanian_soldiers_during_the_Lithuanian_Wars_of_Independence_%28between_1919%E2%80%931920%29.jpg", "Lithuanian soldiers during the independence wars.", [st("Aug 1919", "Operation period"), st("Zarasai", "Northeastern objective"), st("Soviet forces are pushed beyond Lithuania's core territory", "Outcome", true)])),
    e("international-and-human-dimensions", 1919, "1919-09-01", "International and Human Dimensions", "A small state fights in a crowded borderland", [55.1, 24.0], 6, [
      m("Kaunas", [54.8985, 23.9036], "target", "Government institutions, recruitment, and diplomacy made Kaunas the human and political center of the war."),
      m("Vilnius region", [54.6872, 25.2797], "major", "The unresolved status of Vilnius connected the Soviet war to the coming Polish-Lithuanian conflict."),
    ], s("War, Mobilization, and Uncertain Borders", "Lithuanian civilians lived through requisitions, mobilization, shifting authorities, and fear that independence might disappear before it was recognized. Internationally, the war overlapped with German withdrawal, the Russian Civil War, Latvian fighting, and Poland's rise. Every battlefield decision also affected later border diplomacy.", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Enlistment_in_the_Lithuanian_Army%2C_Panemun%C4%97%2C_Kaunas_1919.jpg/250px-Enlistment_in_the_Lithuanian_Army%2C_Panemun%C4%97%2C_Kaunas_1919.jpg", "Enlistment and mobilization in the Lithuanian Army, 1919.", [st("German, Soviet, Polish, and local forces", "Crowded conflict environment"), st("Mobilization and displacement", "Human cost"), st("The war leaves border questions unresolved", "Legacy", true)])),
    e("outcome-and-legacy", 1919, "1919-09-01", "Outcome and Legacy", "Lithuania survives but its borders remain contested", [55.1, 24.0], 6, [
      m("Kaunas", [54.8985, 23.9036], "target", "Kaunas remained Lithuania's temporary capital after the war because Vilnius stayed disputed."),
      m("Vilnius", [54.6872, 25.2797], "major", "The unresolved Vilnius question led directly into the Polish-Lithuanian struggle."),
    ], s("Victory Without a Settled Map", "Lithuania survived the Soviet offensive and built an army capable of defending the state. That was a major victory. But independence did not settle the map: Vilnius, Suwałki, and relations with Poland remained open wounds. The Lithuanian-Soviet War therefore ends with survival, not closure.", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Soldiers_of_the_Lithuanian_Army_in_Vilnius%2C_Lithuania%2C_1920.jpg/250px-Soldiers_of_the_Lithuanian_Army_in_Vilnius%2C_Lithuania%2C_1920.jpg", "Lithuanian soldiers in the contested Vilnius period.", [st("Lithuanian victory", "Outcome"), st("Vilnius unresolved", "Unfinished issue"), st("Survival against Soviet forces leads into new border wars", "Legacy", true)])),
  ],
  "polish-lithuanian-war": [
    e("origins-and-road-to-war", 1919, "1919-04-01", "Origins and Road to War", "Two new states claim Vilnius", [54.8, 24.7], 6, [
      m("Vilnius", [54.6872, 25.2797], "target", "Vilnius was claimed by Lithuania as its historic capital and by Poland as a city with deep Polish political and cultural ties."),
      m("Kaunas", [54.8985, 23.9036], "major", "Kaunas became Lithuania's seat of government while Vilnius remained contested."),
    ], s("Allies Against Bolshevism, Rivals Over Vilnius", "Poland and Lithuania both emerged from the collapse of empires with urgent security problems and incompatible national projects. Vilnius was the heart of the dispute. The city was Lithuanian in state symbolism, heavily Polish and Jewish in urban demography, and strategically important to Polish plans for a federation in the east.", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Soldiers_of_the_Lithuanian_Army_in_Vilnius%2C_Lithuania%2C_1920.jpg/250px-Soldiers_of_the_Lithuanian_Army_in_Vilnius%2C_Lithuania%2C_1920.jpg", "Lithuanian soldiers in Vilnius during the contested independence period.", [st("1919-1920", "Conflict period"), st("Vilnius", "Central dispute"), st("Border-making after empire turns partners into rivals", "Core theme", true)])),
    e("polish-capture-of-vilnius-1919", 1919, "1919-04-19", "Polish Capture of Vilnius", "Polish forces take the disputed city", [54.6872, 25.2797], 8, [
      m("Vilnius", [54.6872, 25.2797], "target", "Polish forces captured Vilnius from Bolshevik control, but Lithuania saw the move as occupation of its capital."),
    ], s("Liberation for One Side, Occupation for the Other", "Polish forces captured Vilnius in April 1919 during the Polish-Soviet War. For Warsaw, the operation removed Bolshevik control and strengthened Poland's eastern position. For Lithuania, it meant the loss of the capital to another claimant. The same battle therefore had opposite meanings from the start.", "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Sejny_Parada.jpg/250px-Sejny_Parada.jpg", "Polish cavalry parade in Sejny during the conflict period.", [st("19 Apr 1919", "Polish capture"), st("Vilnius", "Disputed capital"), st("The city question hardens into interstate conflict", "Consequence", true)])),
    e("sejny-uprising", 1919, "1919-08-23", "Sejny Uprising", "The Suwałki border ignites", [54.108, 23.346], 8, [
      m("Sejny", [54.108, 23.346], "target", "Polish forces and local fighters took Sejny from Lithuanian control during the border struggle."),
      m("Suwałki", [54.1115, 22.9308], "major", "The Suwałki region became a second flashpoint beyond Vilnius."),
    ], s("A Local Border War", "The Sejny uprising showed that the conflict was not only about Vilnius. Around Suwałki and Sejny, mixed populations, rival administrations, and shifting demarcation lines turned local control into armed confrontation. The violence made compromise harder by tying national claims to village-level fear and revenge.", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/J%C3%B3zef_Pi%C5%82sudski_w_Sejnach_%2822-320-1%29.jpg/250px-J%C3%B3zef_Pi%C5%82sudski_w_Sejnach_%2822-320-1%29.jpg", "Józef Piłsudski in Sejny, 1919.", [st("Aug 1919", "Uprising"), st("Sejny-Suwałki", "Border flashpoint"), st("Local violence deepens national mistrust", "Significance", true)])),
    e("foch-line-and-entente-mediation", 1919, "1919-07-26", "Foch Line and Entente Mediation", "Great-power lines fail to settle the border", [54.3, 23.4], 6, [
      m("Suwałki region", [54.2, 23.1], "target", "Entente demarcation efforts tried to separate Polish and Lithuanian forces but did not resolve sovereignty."),
      m("Paris Peace Conference", [48.8566, 2.3522], "minor", "Western diplomats drew lines, but local armies and governments contested them."),
    ], s("Lines on Paper, Forces on the Ground", "The Entente-backed Foch Line tried to reduce fighting by separating Polish and Lithuanian forces. It did not solve the deeper dispute. Both governments believed outside mediation misunderstood their security and historical claims, while armed units on the ground kept changing facts faster than diplomats could stabilize them.", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Commemoration_of_the_Day_of_Independence_of_Lithuania_on_16_February_1920_in_Kaunas.jpg/250px-Commemoration_of_the_Day_of_Independence_of_Lithuania_on_16_February_1920_in_Kaunas.jpg", "Lithuanian independence commemoration in Kaunas, 1920.", [st("1919", "Demarcation efforts"), st("Foch Line", "Mediation tool"), st("Diplomacy cannot keep pace with contested front lines", "Lesson", true)])),
    e("polish-soviet-war-overlap", 1920, "1920-07-12", "Polish-Soviet War Overlap", "Lithuania and Soviet Russia sign a treaty", [54.6872, 25.2797], 6, [
      m("Moscow", [55.7558, 37.6173], "minor", "The Soviet-Lithuanian treaty recognized Lithuanian claims while the Red Army was fighting Poland."),
      m("Vilnius", [54.6872, 25.2797], "target", "Soviet transfer and Lithuanian entry into Vilnius occurred during Poland's crisis against the Red Army."),
    ], s("The Wider War Changes the Dispute", "The Polish-Soviet War transformed the Polish-Lithuanian conflict. Soviet Russia recognized Lithuania and its claim to Vilnius in July 1920 while the Red Army advanced against Poland. Lithuania regained the city briefly, but the sequence tied Vilnius to Poland's existential war with the Soviets and made Polish leaders even less willing to accept Lithuanian control.", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Soldiers_of_the_Lithuanian_Army_in_Vilnius%2C_Lithuania%2C_1920.jpg/250px-Soldiers_of_the_Lithuanian_Army_in_Vilnius%2C_Lithuania%2C_1920.jpg", "Lithuanian soldiers in Vilnius, 1920.", [st("12 Jul 1920", "Soviet-Lithuanian treaty"), st("Vilnius", "Transferred question"), st("A bilateral border dispute is pulled into the Polish-Soviet War", "Context", true)])),
    e("suwalki-agreement", 1920, "1920-10-07", "Suwałki Agreement", "A ceasefire that leaves Vilnius exposed", [54.1115, 22.9308], 8, [
      m("Suwałki", [54.1115, 22.9308], "target", "The agreement tried to halt fighting along the Suwałki line."),
      m("Vilnius", [54.6872, 25.2797], "major", "The agreement did not fully secure Vilnius, leaving room for the next crisis."),
    ], s("A Ceasefire With a Trapdoor", "The Suwałki Agreement attempted to stop Polish-Lithuanian fighting and set a demarcation line. It briefly offered diplomatic relief, but the Vilnius question remained exposed. Within days, a Polish-aligned force under Lucjan Żeligowski moved on the city, turning the agreement into a symbol of failed mediation for Lithuania.", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Suvalk%C5%B3sutartis1920-10-09.jpg/250px-Suvalk%C5%B3sutartis1920-10-09.jpg", "Lithuanian and Polish delegations negotiating the Suwałki Agreement.", [st("7 Oct 1920", "Agreement signed"), st("Suwałki", "Negotiation site"), st("Ceasefire fails to protect Vilnius from the next move", "Consequence", true)])),
    e("zeligowski-mutiny", 1920, "1920-10-09", "Żeligowski's Mutiny", "Polish-aligned troops seize Vilnius", [54.6872, 25.2797], 8, [
      m("Vilnius", [54.6872, 25.2797], "target", "Żeligowski's force captured the city and created a Polish-backed fait accompli."),
      m("Vilnius approaches", [54.75, 25.2], "major", "The operation was framed as a mutiny, but Lithuania viewed it as Polish aggression."),
    ], s("A Plausibly Deniable Seizure", "General Lucjan Żeligowski's so-called mutiny seized Vilnius and created the Republic of Central Lithuania. The move let Poland deny direct responsibility while achieving its strategic goal. For Lithuania, it confirmed that agreements and mediation could be bypassed by force. The event poisoned relations for the entire interwar period.", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Lithuanian_soldiers_of_the_Fifth_Infantry_Regiment_in_the_forests_of_Vievis_during_the_fighting_with_the_%C5%BBeligowski%27s_unit_of_the_Polish_Army.jpg/250px-Lithuanian_soldiers_of_the_Fifth_Infantry_Regiment_in_the_forests_of_Vievis_during_the_fighting_with_the_%C5%BBeligowski%27s_unit_of_the_Polish_Army.jpg", "Lithuanian soldiers fighting Żeligowski's forces near Vievis.", [st("9 Oct 1920", "Vilnius seized"), st("Republic of Central Lithuania", "Political result"), st("A military fait accompli freezes the dispute", "Legacy", true)])),
    e("republic-of-central-lithuania", 1920, "1920-10-12", "Republic of Central Lithuania", "A buffer state prepares annexation", [54.6872, 25.2797], 7, [
      m("Vilnius", [54.6872, 25.2797], "target", "Central Lithuania used Vilnius as the center of a Polish-aligned statelet."),
      m("Kaunas", [54.8985, 23.9036], "major", "Lithuania refused to accept the new entity and kept Kaunas as its temporary capital."),
    ], s("Statelet as Strategy", "The Republic of Central Lithuania functioned as a buffer and political bridge toward incorporation into Poland. It gave the seizure of Vilnius a local institutional form, but Lithuania rejected its legitimacy. The result was not a settled compromise; it was a frozen conflict dressed in state paperwork.", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Lithuanian_soldiers_of_the_Fifth_Infantry_Regiment_in_the_forests_of_Vievis_during_the_fighting_with_the_%C5%BBeligowski%27s_unit_of_the_Polish_Army.jpg/250px-Lithuanian_soldiers_of_the_Fifth_Infantry_Regiment_in_the_forests_of_Vievis_during_the_fighting_with_the_%C5%BBeligowski%27s_unit_of_the_Polish_Army.jpg", "Lithuanian soldiers fighting Żeligowski's forces.", [st("1920-1922", "Statelet period"), st("Vilnius", "Administrative center"), st("Creates the path to Polish annexation", "Purpose", true)])),
    e("league-of-nations-mediation", 1921, "1921-01-01", "League of Nations Mediation", "International talks fail to repair relations", [46.2044, 6.1432], 5, [
      m("Geneva", [46.2044, 6.1432], "major", "League mediation attempted to find a political settlement but could not bridge the Vilnius dispute."),
      m("Kaunas", [54.8985, 23.9036], "target", "Lithuania maintained its claim and refused normal relations with Poland."),
    ], s("No Settlement From Geneva", "League of Nations mediation could not reconcile the competing claims. Proposed plebiscites, federative ideas, and demarcation schemes all ran into distrust and incompatible national narratives. The failure mattered because it left two neighboring states diplomatically frozen while the wider region remained insecure.", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Suvalk%C5%B3sutartis1920-10-09.jpg/250px-Suvalk%C5%B3sutartis1920-10-09.jpg", "The Suwałki negotiations illustrate failed mediation around the border dispute.", [st("1921", "Mediation phase"), st("Geneva", "Diplomatic venue"), st("International mediation fails to normalize Polish-Lithuanian relations", "Outcome", true)])),
    e("international-and-human-dimensions", 1921, "1921-06-01", "International and Human Dimensions", "Mixed communities live inside rival national projects", [54.7, 24.5], 6, [
      m("Vilnius region", [54.6872, 25.2797], "target", "Poles, Lithuanians, Jews, Belarusians, and others lived inside a city claimed by competing states."),
      m("Suwałki-Sejny region", [54.12, 23.2], "major", "Border violence made local identity and security inseparable from national politics."),
    ], s("The Human Geography of a Border War", "The war's human dimension was rooted in mixed communities. Vilnius was not a simple national space, and neither was the Suwałki-Sejny region. Families, schools, churches, synagogues, veterans, and local officials all found themselves inside rival state projects. That is why the dispute lasted beyond battlefield operations: it was about belonging as much as borders.", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Commemoration_of_the_Day_of_Independence_of_Lithuania_on_16_February_1920_in_Kaunas.jpg/250px-Commemoration_of_the_Day_of_Independence_of_Lithuania_on_16_February_1920_in_Kaunas.jpg", "Lithuanian public commemoration in Kaunas during the conflict period.", [st("Mixed population", "Human setting"), st("Vilnius and Suwałki", "Core regions"), st("Local communities absorb the cost of national border-making", "Human dimension", true)])),
    e("outcome-and-legacy", 1922, "1922-03-24", "Outcome and Legacy", "Vilnius enters Poland; Lithuania refuses closure", [54.6872, 25.2797], 6, [
      m("Vilnius", [54.6872, 25.2797], "target", "Poland incorporated Vilnius after Central Lithuania's election and annexation process."),
      m("Kaunas", [54.8985, 23.9036], "major", "Kaunas remained Lithuania's temporary capital and the symbol of refusal to accept the loss of Vilnius."),
    ], s("A Frozen Victory", "Poland gained Vilnius, but the outcome did not produce reconciliation. Lithuania treated Kaunas as a temporary capital and refused normal diplomatic relations with Poland for years. The Polish-Lithuanian War therefore ended with a winner on the map and a lasting rupture in regional politics.", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Soldiers_of_the_Lithuanian_Army_in_Vilnius%2C_Lithuania%2C_1920.jpg/250px-Soldiers_of_the_Lithuanian_Army_in_Vilnius%2C_Lithuania%2C_1920.jpg", "Lithuanian soldiers in Vilnius, the city at the heart of the dispute.", [st("1922", "Vilnius incorporated into Poland"), st("Lithuanian non-recognition", "Diplomatic result"), st("The dispute shapes the entire interwar relationship", "Legacy", true)])),
  ],
};

const rewrites = {
  "croatian-war-of-independence": {
    "origins-and-road-to-war": "The Croatian War of Independence grew from Yugoslavia's political collapse, Croatia's move toward sovereignty, and the refusal of Serb leaders in parts of Croatia to accept rule from Zagreb. The JNA, local Serb forces, and Croatian police all became instruments of a state crisis that turned into war.",
    "pakrac-clash": "Pakrac was an early armed confrontation over police stations, municipal authority, and who could claim legitimacy in Serb-majority areas. It showed how quickly local institutions could become military objectives.",
    "plitvice-lakes-incident": "The Plitvice Lakes incident, remembered as Bloody Easter, produced some of the first Croatian deaths of the war. A national park became a battlefield because control of roads, police posts, and symbols all mattered.",
    "battle-of-vukovar": "Vukovar endured a destructive siege by JNA and Serb forces. Its defense slowed the campaign and became a symbol of Croatian resistance, while the city's destruction and post-capture killings became central to war memory.",
    "siege-of-dubrovnik": "The siege of Dubrovnik internationalized the war's image. Shelling a UNESCO-listed city damaged Croatia's heritage and made it harder for outside observers to treat the war as a distant internal Yugoslav matter.",
    "operation-maslenica": "Operation Maslenica was Croatia's attempt to restore a strategic connection to Dalmatia and push threats away from Zadar. The operation showed Croatia's army becoming more capable, but the fighting remained costly and unresolved.",
    "operation-medak-pocket": "Operation Medak Pocket reduced a Serb-held salient near Gospić. It also brought allegations and prosecutions over crimes against Serb civilians and prisoners, making it a military success with a heavy accountability shadow.",
    "operation-flash": "Operation Flash rapidly retook western Slavonia in May 1995. It showed how far Croatian forces had developed since 1991 and signaled that frozen UN lines would not necessarily remain frozen.",
    "operation-storm": "Operation Storm broke the Republic of Serbian Krajina and restored Croatian control over most occupied territory. It also caused the flight of many Serb civilians, making victory and displacement inseparable in the war's legacy.",
    "international-and-human-dimensions": "International recognition, UN peacekeeping, arms embargoes, war-crimes investigations, and refugee flows all shaped the conflict. Civilians experienced siege, expulsion, detention, missing relatives, and years of return and reconstruction.",
    "outcome-and-legacy": "Croatia secured independence and restored most territory by force, while Eastern Slavonia returned through a UN-backed transition. The legacy remains divided between liberation, loss, accountability, and unresolved memories of displacement.",
  },
  "croat-bosniak-war": {
    "origins-and-road-to-war": "The Croat-Bosniak War grew from the collapse of cooperation inside Bosnia's wider war. Former allies against Bosnian Serb forces began fighting over territory, command authority, supply routes, and incompatible political futures.",
    "kavanjina-ambush": "The Kavanjina Ambush belongs to the early rupture around Mostar, where local alliances among HVO, ARBiH, and HOS forces broke down. The event signaled that mistrust could turn quickly into armed confrontation.",
    "ahmi-i-massacre": "The Ahmići massacre became one of the war's defining atrocities. Civilians were targeted in a village that symbolized how mixed communities could be destroyed by military plans and ethnic cleansing.",
    "trusina-massacre": "The Trusina massacre showed that the violence was not one-directional. Bosniak forces killed Croat civilians and prisoners, adding another layer of fear, revenge, and accountability to the conflict.",
    "zenica-massacre": "The Zenica massacre brought civilian vulnerability into sharp focus. Shelling in an urban area showed how people far from front-line trenches could still become targets or victims of battlefield escalation.",
    "vrbanja-massacre": "The Vrbanja massacre reflected the lethal fragmentation around Vitez and central Bosnia. Localized killing hardened front lines and made later coexistence much harder.",
    "mokronoge-massacre": "Mokronoge illustrates the war's smaller atrocity geography: places outside the most famous headlines still carried grief, fear, and postwar demands for recognition.",
    "stupni-do-massacre": "Stupni Do became a key massacre site in the campaign against Bosniak civilians. The destruction of the village showed how ethnic cleansing operated through local attacks with strategic effects.",
    "kri-an-evo-selo-massacre": "Križančevo Selo became part of Croat memory of victimhood in central Bosnia. Its place in the timeline matters because the war's atrocities shaped both justice processes and competing public memory.",
    "international-and-human-dimensions": "International pressure, humanitarian reporting, and US diplomacy helped push the sides toward the Washington Agreement. For civilians, the war meant detention, massacres, divided towns, destroyed homes, and broken mixed communities.",
    "outcome-and-legacy": "The Washington Agreement ended Croat-Bosniak fighting and created the Federation of Bosnia and Herzegovina. It turned former enemies back into military partners, but it did not erase the trauma of the war within the war.",
  },
  "kosovo-war": {
    "origins-and-road-to-war": "The Kosovo War grew from the loss of Kosovo's autonomy, Serbian police control, Albanian parallel institutions, failed nonviolent resistance, and the rise of the KLA. By 1998, repression and insurgency had made compromise increasingly unlikely.",
    "drenica-massacres": "The Drenica massacres radicalized the conflict. Serbian operations against KLA-linked areas killed civilians and helped transform the KLA from a marginal armed group into a wider symbol of resistance.",
    "attack-on-prekaz": "The attack on Prekaz killed Adem Jashari and many members of his family. For Kosovo Albanians, it became a martyrdom story that increased recruitment and hardened the war's emotional stakes.",
    "ra-ak-massacre": "The Račak massacre became a diplomatic turning point. International observers treated the killings as evidence that the conflict could not be contained by negotiations alone.",
    "nato-bombing-of-yugoslavia": "NATO's bombing campaign aimed to force Yugoslav withdrawal from Kosovo after diplomacy failed. The air war changed the strategic balance but also coincided with mass expulsions and civilian suffering on the ground.",
    "izbica-massacre": "Izbica became one of the documented massacre sites of spring 1999. It showed how village-level killings formed part of a wider campaign of expulsion and terror.",
    "meja-massacre": "The Meja massacre was one of the largest killings of Kosovo Albanian civilians during the war. It remains central to memory, missing-persons work, and accountability efforts.",
    "u-ka-massacre": "The Ćuška massacre belongs to the Peja-area pattern of killings, expulsions, and property destruction. It shows how the war's violence moved through villages and family networks, not only formal battlefields.",
    "incident-at-pristina-airport": "The Pristina Airport incident exposed postwar great-power tension. Russian troops reached the airport before NATO, creating a brief standoff over who would shape Kosovo's security order.",
    "international-and-human-dimensions": "The war produced mass displacement, refugee columns into Albania and North Macedonia, NATO intervention, Russian diplomacy, and UN administration. Civilians were the central victims of expulsions, massacres, airstrikes, and reprisal attacks.",
    "outcome-and-legacy": "Yugoslav forces withdrew and Kosovo came under UN administration and NATO-led security. Kosovo later declared independence, but Serbia rejects it, leaving the war's political legacy unresolved.",
  },
};

function e(id, year, date, title, sub, center, zoom, markers, slide) {
  return { id, year, date, title, sub, view: { center, zoom }, markers, regions: [], slides: [slide] };
}

function m(label, latlng, type, description) {
  return { label, latlng, type, description };
}

function s(title, body, img, cap, stats = []) {
  return { title, img, cap, body, stats };
}

function st(val, lbl, full = false) {
  return full ? { val, lbl, full } : { val, lbl };
}

async function readJson(path) {
  return JSON.parse((await readFile(path, "utf8")).replace(/^\uFEFF/, ""));
}

async function writeJson(path, value) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function statsFor(event, body) {
  const yearLabel = String(event.date || event.year).slice(0, 4);
  return [
    st(yearLabel, "Timeline year"),
    st(event.title, "Event focus"),
    st(body, "Why this moment matters", true),
  ];
}

for (const [id, eventBodies] of Object.entries(rewrites)) {
  const path = join(DRAFT_DIR, `${id}.generated.json`);
  const events = await readJson(path);
  for (const event of events) {
    const body = eventBodies[event.id];
    if (!body) continue;
    const img = imageUpdates[id]?.[event.id] || event.slides?.find((slide) => slide.img)?.img || indexUpdates[id]?.image;
    event.markers = markerUpdates[id]?.[event.id] || event.markers || [];
    event.view = event.view || {};
    if (event.markers.length) {
      event.view.center = event.markers[0].latlng;
      event.view.zoom = event.id.includes("international") || event.id.includes("outcome") || event.id.includes("origins") ? 6 : 8;
    }
    event.slides = [
      s(event.title, body, img, `Visual reference for ${event.title}.`, statsFor(event, body)),
    ];
  }
  await writeJson(path, events);
  console.log(`Updated ${id}.generated.json (${events.length} events)`);
}

for (const [id, events] of Object.entries(customDeepDives)) {
  await writeJson(join(DRAFT_DIR, `${id}.generated.json`), events);
  console.log(`Expanded ${id}.generated.json (${events.length} events)`);
}

const index = await readJson(INDEX_PATH);
for (const item of index) {
  if (indexUpdates[item.id]) Object.assign(item, indexUpdates[item.id]);
}
await writeJson(INDEX_PATH, index);
console.log("Updated deepdives-index.json");
