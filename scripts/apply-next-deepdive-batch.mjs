import { readFile, writeFile, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const BACKEND_ROOT = "C:\\Users\\alons\\Terra-Historia-Backend";
const DRAFT_DIR = join(BACKEND_ROOT, "deepdives-drafts");
const INDEX_PATH = join(BACKEND_ROOT, "deepdives-index.json");
const BACKEND_RELATIONSHIPS_PATH = join(BACKEND_ROOT, "deepdive-relationships.json");
const FRONTEND_RELATIONSHIPS_PATH = join(process.cwd(), "src", "constants", "deepDiveRelationships.json");

const REMOVED_IDS = ["sand-war", "soviet-finnish-wars", "toyota-war"];

const indexUpdates = {
  "chadian-libyan-war": {
    image: "https://apanews.net/wp-content/uploads/2025/11/chad-libya-joint-force.jpg",
    description:
      "Explore the Chadian-Libyan War from the Aouzou Strip dispute through French intervention and the mobile Toyota War campaign that forced Libya out of Chad.",
  },
  "falklands-war": {
    image: "https://www.collectair.co.uk/images/black-buck-650.jpg",
    description:
      "Follow the 1982 Falklands War from Argentina's seizure of the islands through Britain's long-range air, naval, amphibious, and ground campaign.",
  },
  "lapland-war": {
    image: "https://www.warhistoryonline.com/wp-content/uploads/sites/64/2017/03/finns-1.jpg",
    description:
      "Trace Finland's 1944-1945 war to expel German forces from the Arctic north after the Moscow Armistice ended the Continuation War.",
  },
  "estonian-war-of-independence": {
    image:
      "https://alchetron.com/cdn/estonian-war-of-independence-494db584-388d-44b4-9eec-41e26cefaa5-resize-750.jpeg",
    description:
      "Explore Estonia's fight for independence against Soviet forces, Baltic German formations, and the wider turmoil left by the Russian Civil War.",
  },
  "first-libyan-civil-war": {
    image:
      "https://live-production.wcms.abc-cdn.net.au/4020e5060f8ced1ebda073e63d618d1c?impolicy=wcms_crop_resize&cropH=1970&cropW=3500&xPos=0&yPos=0&width=862&height=485",
    description:
      "Explore Libya's 2011 uprising, NATO intervention, the fall of Tripoli, Gaddafi's death, and the unresolved security vacuum after victory.",
  },
};

const deepDives = {
  "falklands-war": [
    event("operation-black-buck", 1982, "1982-05-01", "Operation Black Buck", "Long-range Vulcan raids from Ascension Island", [-51.69, -57.85], 4, [
      marker("RAF Ascension Island", [-7.9467, -14.3559], "major", "Ascension Island was the staging base for the Vulcan bombers and Victor tankers that made the extraordinary round trip possible."),
      marker("Port Stanley airfield", [-51.6857, -57.7776], "target", "Black Buck targeted Stanley's runway to restrict Argentine air operations and signal that Britain could strike the occupied islands."),
    ], slide(
      "A Bomber Route Across the Atlantic",
      "Operation Black Buck sent RAF Vulcan bombers from Ascension Island to attack the runway at Port Stanley. The raids required complex chains of Victor tankers and became a test of range, planning, and endurance as much as bombing accuracy. Militarily, the runway damage was limited; strategically, the operation showed Argentina that the islands were within British reach and forced planners to consider the vulnerability of mainland-linked air operations.",
      "https://www.collectair.co.uk/images/black-buck-650.jpg",
      "RAF Vulcan imagery associated with the Black Buck raids.",
      [
        stat("1 May 1982", "First raid"),
        stat("Ascension to Stanley", "Route"),
        stat("Long-range deterrent signal", "Main significance", true),
      ]
    )),
    event("operation-rosary", 1982, "1982-04-02", "Operation Rosary", "Argentina seizes the Falkland Islands", [-51.6917, -57.8728], 7, [
      marker("Government House, Stanley", [-51.696, -57.852], "target", "The small Royal Marine garrison resisted around Stanley before surrendering to a much larger Argentine landing force."),
      marker("Mullet Creek landing area", [-51.74, -58.02], "major", "Argentine units came ashore around Stanley, turning a long-running sovereignty dispute into an armed occupation."),
    ], slide(
      "The Seizure That Started the War",
      "Operation Rosary was Argentina's 2 April 1982 invasion of the Falkland Islands. Argentine commanders expected a quick occupation to strengthen Buenos Aires's claim and perhaps avoid a major British response. Instead, the landing created a political crisis in London, rallied British public opinion, and forced both governments into a war neither side could easily de-escalate.",
      "https://upload.wikimedia.org/wikipedia/commons/4/4d/LVTP7-IMARA-17may07.jpg",
      "An Argentine LVTP-7 amphibious vehicle of the type associated with Argentine marine landings.",
      [
        stat("2 Apr 1982", "Argentine landing"),
        stat("Stanley", "Main objective"),
        stat("Occupation triggers British task force", "Consequence", true),
      ]
    )),
    event("invasion-of-south-georgia", 1982, "1982-04-03", "Invasion of South Georgia", "Argentina extends the crisis to South Georgia", [-54.2852, -36.4991], 6, [
      marker("Grytviken", [-54.2811, -36.5092], "major", "Grytviken was the center of the brief British resistance and later an early target for British recapture."),
      marker("Leith Harbour", [-54.1405, -36.6891], "minor", "The earlier scrap-metal workers dispute around Leith helped escalate tensions before the Argentine military landing."),
    ], slide(
      "A Remote Island Becomes an Early Test",
      "Argentina's move on South Georgia widened the campaign beyond the Falklands themselves. The island had little immediate military value compared with East Falkland, but it mattered symbolically and operationally: retaking it would let Britain prove that the task force could fight, coordinate helicopters and ships in severe weather, and reverse Argentine gains before the main amphibious landing.",
      "https://i.guim.co.uk/img/media/4244ea5b45e8d407af82a11ef4d16b07ba634b5c/0_980_2293_1375/master/2293.jpg?width=465&dpr=1&s=none&crop=none",
      "South Georgia during the 1982 crisis.",
      [
        stat("3 Apr 1982", "Argentine seizure"),
        stat("Grytviken", "Key location"),
        stat("Sets up Britain's first recapture operation", "Consequence", true),
      ]
    )),
    event("operation-algeciras", 1982, "1982-04-24", "Operation Algeciras", "A covert Argentine plot near Gibraltar", [36.1311, -5.3961], 8, [
      marker("Gibraltar anchorage", [36.1311, -5.3961], "target", "Argentine commandos planned to attack British naval targets with limpet mines near Gibraltar."),
      marker("Algeciras", [36.1408, -5.4562], "major", "Spanish police disrupted the team before the planned attack could be carried out."),
    ], slide(
      "The War's Covert European Edge",
      "Operation Algeciras was Argentina's attempt to strike British shipping at Gibraltar with commandos and limpet mines. The plan failed after Spanish authorities uncovered the team, but the episode shows that the conflict was not confined to the South Atlantic. Argentina looked for asymmetric pressure points, while Britain had to think about port security, intelligence, and escalation far from the islands.",
      "https://nuttersworld.com/gibraltars-secret-wars/operation-algeciras/belgrano.webp",
      "Image associated with Operation Algeciras and the wider Gibraltar plot.",
      [
        stat("Gibraltar", "Planned target"),
        stat("Limpet mines", "Intended method"),
        stat("Foiled by Spanish authorities", "Outcome", true),
      ]
    )),
    event("operation-paraquet", 1982, "1982-04-25", "Operation Paraquet", "Britain retakes South Georgia", [-54.2852, -36.4991], 6, [
      marker("Grytviken", [-54.2811, -36.5092], "target", "British forces accepted the Argentine surrender at Grytviken after disabling the submarine ARA Santa Fe."),
      marker("South Georgia approaches", [-54.2, -36.6], "minor", "Bad weather, helicopter losses, and improvised special-forces movement shaped the operation."),
    ], slide(
      "First British Success",
      "Operation Paraquet recaptured South Georgia and gave Britain its first clear victory of the campaign. The operation mixed special forces, naval aviation, ships, and rapid improvisation in harsh weather. Its military scale was smaller than the later Falklands landing, but the political effect was large: it proved the task force was not just sailing south, it was already reversing Argentine control.",
      "https://i.guim.co.uk/img/media/4244ea5b45e8d407af82a11ef4d16b07ba634b5c/0_980_2293_1375/master/2293.jpg?width=465&dpr=1&s=none&crop=none",
      "South Georgia, the first territory retaken by British forces in the campaign.",
      [
        stat("25 Apr 1982", "South Georgia retaken"),
        stat("ARA Santa Fe disabled", "Key military result"),
        stat("Boosts British morale before the Falklands landing", "Significance", true),
      ]
    )),
    event("battle-of-san-carlos", 1982, "1982-05-21", "Battle of San Carlos", "The amphibious landing and Bomb Alley", [-51.5078, -59.0797], 8, [
      marker("San Carlos Water", [-51.5078, -59.0797], "target", "British troops landed here to create the beachhead for the ground campaign across East Falkland."),
      marker("Falkland Sound", [-51.6, -59.05], "major", "Argentine aircraft attacked ships in the confined waters that British sailors called Bomb Alley."),
    ], slide(
      "The Beachhead Under Air Attack",
      "The Battle of San Carlos opened the land campaign. British troops got ashore, but the ships supporting them endured repeated low-level Argentine air attacks while unloading men, ammunition, vehicles, and supplies. Holding the anchorage made the advance on Stanley possible; the losses and damage to ships also made San Carlos one of the war's defining lessons in air defense, naval logistics, and amphibious risk.",
      "https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/Heading_into_Port_Stanley.jpg/250px-Heading_into_Port_Stanley.jpg",
      "British troops advancing after the San Carlos landing.",
      [
        stat("21 May 1982", "Landing begins"),
        stat("San Carlos Water", "Beachhead"),
        stat("Amphibious success under heavy air attack", "Operational result", true),
      ]
    )),
    event("battle-of-goose-green", 1982, "1982-05-28", "Battle of Goose Green", "2 Para fights the first major land battle", [-51.8288, -58.9692], 9, [
      marker("Goose Green", [-51.8288, -58.9692], "target", "The settlement and nearby Argentine garrison became the first major British land objective after San Carlos."),
      marker("Darwin", [-51.812, -58.986], "major", "The Darwin-Goose Green isthmus forced attackers through exposed ground under fire."),
    ], slide(
      "Momentum on Land",
      "Goose Green was the first major land battle after the British landing. 2 Para attacked over open ground against a larger Argentine garrison, and Lieutenant Colonel H. Jones was killed during the fighting. The British victory freed civilians, captured hundreds of prisoners, and gave the ground campaign momentum before the final advance toward Stanley.",
      "https://upload.wikimedia.org/wikipedia/en/5/51/Goose_Green_school.jpg",
      "Goose Green school, one of the recognizable sites from the battle area.",
      [
        stat("28-29 May 1982", "Battle dates"),
        stat("2 Para", "Main British unit"),
        stat("First major British land victory", "Significance", true),
      ]
    )),
    event("1982-british-army-gazelle-friendly-fire-incident", 1982, "1982-06-06", "1982 British Army Gazelle Friendly Fire Incident", "Command-and-control failure in a crowded battlespace", [-51.7836, -58.4678], 8, [
      marker("Pleasant Peak area", [-51.7836, -58.4678], "major", "A British Gazelle helicopter was mistakenly shot down by British forces, killing four servicemen."),
      marker("Stanley approaches", [-51.7, -58.2], "minor", "The incident occurred as British forces were pushing toward the final battles around Stanley."),
    ], slide(
      "A Small Incident With a Large Lesson",
      "The Gazelle friendly-fire incident exposed how hard identification can become when helicopters, ships, ground forces, and air defenses operate under stress. Four British servicemen were killed when a British helicopter was mistaken for hostile aircraft. The episode did not decide the campaign, but it belongs in the deep dive because it reveals the human cost of command friction and the limits of battlefield awareness.",
      "https://commons.wikimedia.org/wiki/Special:FilePath/GazelleAH1_Ahlhorn_May1983.jpeg",
      "A British Army Gazelle helicopter, the aircraft type involved in the incident.",
      [
        stat("6 Jun 1982", "Incident date"),
        stat("4 British dead", "Human cost"),
        stat("Friendly-fire risk in joint operations", "Lesson", true),
      ]
    )),
  ],
  "lapland-war": [
    event("origins-and-road-to-war", 1944, "1944-09-19", "Origins and Road to War", "Finland turns against its former German partner", [67.5, 26.5], 5, [
      marker("Helsinki", [60.1699, 24.9384], "major", "Finland accepted the Moscow Armistice, including the requirement to remove German troops from Finnish territory."),
      marker("Rovaniemi", [66.5039, 25.7294], "target", "Rovaniemi became the symbolic center of the northern destruction that followed the German retreat."),
    ], slide(
      "Armistice Terms Become a New War",
      "The Lapland War grew from Finland's September 1944 armistice with the Soviet Union. Finland had to demobilize, cede territory, pay reparations, and expel German forces that had been stationed in the north as former partners against the USSR. What began with cautious disengagement became open fighting as Soviet pressure increased and German forces withdrew through Lapland using delaying and scorched-earth tactics.",
      "https://www.warhistoryonline.com/wp-content/uploads/sites/64/2017/03/finns-1.jpg",
      "Finnish troops in the northern theater.",
      [
        stat("19 Sep 1944", "Moscow Armistice"),
        stat("Expel German forces", "Finnish obligation"),
        stat("Former allies become enemies under Soviet pressure", "Core dynamic", true),
      ]
    )),
    event("lapland-evacuation", 1944, "1944-09-01", "Lapland Evacuation", "Civilians leave the northern war zone", [66.5, 25.7], 6, [
      marker("Rovaniemi", [66.5039, 25.7294], "major", "The regional capital became a major evacuation and destruction symbol."),
      marker("Sodankyla", [67.4167, 26.6], "minor", "Civilian movement from communities across Lapland reduced casualties but uprooted nearly the entire region."),
    ], slide(
      "Moving a Region Out of the Fire",
      "Finland evacuated most civilians from Lapland before the fighting and German retreat destroyed roads, bridges, homes, and public buildings. The evacuation saved lives, but it also turned the war into a social catastrophe: families left farms and towns with little certainty about what would remain. That civilian experience is central to understanding why the Lapland War is remembered as liberation and devastation at the same time.",
      "https://upload.wikimedia.org/wikipedia/commons/e/ed/LapinSota.jpeg",
      "Evacuees and wartime movement in Lapland.",
      [
        stat("About 168,000", "Civilians evacuated"),
        stat("Autumn 1944", "Main evacuation period"),
        stat("Displacement became one of the war's defining human costs", "Human dimension", true),
      ]
    )),
    event("operation-tanne-ost", 1944, "1944-09-15", "Operation Tanne Ost", "Germany tries to seize Suursaari", [60.05, 26.95], 7, [
      marker("Suursaari / Hogland", [60.05, 26.95], "target", "German forces tried to seize the island to control the Gulf of Finland mine barrier and deny it to the Soviets."),
      marker("Gulf of Finland", [60.1, 27.8], "major", "The operation shows how the Lapland War connected to the Baltic naval situation as well as the Arctic retreat."),
    ], slide(
      "A Baltic Opening Clash",
      "Operation Tanne Ost was Germany's failed attempt to capture Suursaari in the Gulf of Finland after Finland changed sides. The island mattered because it helped control the mine barriers and sea routes near the Soviet Baltic Fleet. Finnish resistance showed that the break with Germany was real, while the failed operation pushed both sides closer to open conflict in the north.",
      "https://i.ytimg.com/vi/Z6SekED4CWE/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC_8779x8TvfHoLdedxjMup6jM7qQ",
      "Visual reference for Operation Tanne Ost.",
      [
        stat("15 Sep 1944", "Operation date"),
        stat("Suursaari", "Objective"),
        stat("German landing fails against Finnish defense", "Outcome", true),
      ]
    )),
    event("battle-of-olhava", 1944, "1944-09-28", "Battle of Olhava", "The first serious Finnish-German firefight", [65.27, 25.42], 8, [
      marker("Olhava River", [65.27, 25.42], "target", "Finnish and German troops exchanged full-scale fire around bridge demolitions and withdrawal routes."),
    ], slide(
      "From Tension to Shooting War",
      "At Olhava, Finnish and German troops moved from staged withdrawal and friction into real combat. German forces demolished bridges to slow Finnish pursuit; Finnish units tried to keep pressure on the retreat while proving compliance with the armistice. The battle was small, but it marked the moment when the former alliance became an unmistakable shooting war.",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Memorial_Stone_Olhava_Ii_20170624.jpg",
      "Memorial stone at Olhava.",
      [
        stat("28-29 Sep 1944", "Battle period"),
        stat("Bridge demolitions", "Tactical issue"),
        stat("First substantial Finnish-German combat in Lapland", "Significance", true),
      ]
    )),
    event("r-ytt-landing", 1944, "1944-09-30", "Röyttä Landing", "Finnish troops land near Tornio", [65.848, 24.146], 8, [
      marker("Roytta harbor", [65.848, 24.146], "target", "Finnish transport ships landed troops near Tornio without strong air or naval protection."),
      marker("Tornio", [65.8481, 24.1466], "major", "The landing opened the fight for Tornio and threatened the German withdrawal route toward Norway."),
    ], slide(
      "A Risky Landing at the German Rear",
      "The Röyttä landing put Finnish troops near Tornio in an attempt to accelerate the German withdrawal and satisfy Soviet demands for action. The landing was bold because Finnish forces lacked the naval and air cover normally expected for an amphibious move. Its success created the conditions for the Battle of Tornio and forced German commanders to treat the Finnish pursuit as a serious operational threat.",
      "https://commons.wikimedia.org/wiki/Special:FilePath/FinnishTroops%20Tornio1944%20007.jpg",
      "Finnish troops during the Tornio operation.",
      [
        stat("30 Sep 1944", "Landing begins"),
        stat("Roytta-Tornio", "Landing area"),
        stat("Finnish troops threaten German retreat routes", "Operational effect", true),
      ]
    )),
    event("battle-of-tornio", 1944, "1944-10-01", "Battle of Tornio", "The main early battle of the Lapland War", [65.8481, 24.1466], 8, [
      marker("Tornio", [65.8481, 24.1466], "target", "Finnish troops fought to hold the town and disrupt German movement toward the northwest."),
      marker("Kemi-Tornio road", [65.74, 24.55], "minor", "Road and rail links mattered because the northern campaign revolved around withdrawal routes and demolitions."),
    ], slide(
      "Holding the Northern Gateway",
      "The Battle of Tornio became the Lapland War's first major engagement. Finnish troops landed, expanded their foothold, and fought German counterattacks while local infrastructure and captured supplies shaped the tempo. The battle convinced German commanders that Finland would not simply perform a symbolic pursuit, and it widened the destruction as the retreat accelerated.",
      "https://commons.wikimedia.org/wiki/Special:FilePath/FinnishTroops_Tornio1944_002.jpg",
      "Finnish troops during the Battle of Tornio.",
      [
        stat("1-8 Oct 1944", "Battle period"),
        stat("Tornio", "Key town"),
        stat("Finnish victory forces faster German withdrawal", "Result", true),
      ]
    )),
    event("battle-of-rovaniemi", 1944, "1944-10-14", "Battle of Rovaniemi", "The destruction of Lapland's capital", [66.5039, 25.7294], 8, [
      marker("Rovaniemi", [66.5039, 25.7294], "target", "German withdrawal and fires left much of the town destroyed, making Rovaniemi the war's central symbol of devastation."),
    ], slide(
      "A Capital Burned in Retreat",
      "Rovaniemi's destruction captured the civilian cost of the Lapland War. German rear guards, demolitions, ammunition explosions, and fires devastated the town as Finnish forces advanced. The event matters because it turned a military obligation into a national memory of burned homes, broken roads, and a northern region that had to be rebuilt almost from scratch.",
      "https://upload.wikimedia.org/wikipedia/commons/6/64/Sodankyl%C3%A4_1944.jpg",
      "Destruction in Finnish Lapland during the German retreat.",
      [
        stat("Oct 1944", "Rovaniemi destroyed"),
        stat("Scorched-earth retreat", "Cause"),
        stat("Devastation becomes the war's central memory", "Legacy", true),
      ]
    )),
    event("battle-of-muonio", 1944, "1944-10-26", "Battle of Muonio", "Finnish pursuit reaches the northwest", [67.955, 23.68], 8, [
      marker("Muonio", [67.955, 23.68], "target", "Fighting around Muonio reflected the slow, road-bound pursuit through damaged Arctic terrain."),
      marker("Tornio-Muonio route", [67.25, 24.1], "minor", "German demolitions made every bridge and road section operationally important."),
    ], slide(
      "Fighting Along Broken Roads",
      "The Battle of Muonio showed the pattern of the later Lapland War: Finnish forces pushed along limited roads while German rear guards delayed, demolished bridges, and withdrew toward Norway. The battle was less dramatic than Tornio, but it reveals the geography of the campaign. In Arctic terrain, mobility depended on roads, bridges, fuel, and weather as much as manpower.",
      "https://www.researchgate.net/profile/Oula-Sakarin-Pentin-Ilarin-Oula/publication/323389425/figure/fig1/AS:597925159768064@1519567875565/Original-caption-Traces-of-the-battle-at-West-Lemetti-notice-the-improvised-snow_Q320.jpg",
      "Battlefield traces used as a visual reference for northern winter combat.",
      [
        stat("Late Oct 1944", "Battle period"),
        stat("Muonio", "Northwestern focus"),
        stat("Road-bound pursuit through demolished terrain", "Operational challenge", true),
      ]
    )),
    event("battle-of-tankavaara", 1944, "1944-10-26", "Battle of Tankavaara", "German defenses slow the Arctic advance", [68.179, 27.122], 8, [
      marker("Tankavaara", [68.179, 27.122], "target", "German mountain troops used prepared positions to delay Finnish movement northward."),
      marker("Sodankyla-Ivalo road", [68.0, 27.0], "minor", "The road corridor was crucial for both Finnish pursuit and German withdrawal."),
    ], slide(
      "A Delaying Battle in the Arctic",
      "At Tankavaara, German forces used terrain and prepared positions to delay the Finnish advance toward the far north. The battle illustrates why the war lasted into 1945 despite Finland's political urgency: the Germans could trade space for time, destroy infrastructure, and use narrow road corridors to slow pursuit. For Finnish troops, each advance brought both military progress and more evidence of destruction behind the German line.",
      "https://www.salisburypost.com/wp-content/uploads/sites/9/2014/10/SP_20140519_SP01_1405196942.jpg?w=590",
      "Arctic warfare visual reference for the Tankavaara fighting.",
      [
        stat("Oct-Nov 1944", "Battle period"),
        stat("Tankavaara", "Defensive position"),
        stat("German rear guards slow Finland's advance", "Result", true),
      ]
    )),
    event("international-and-human-dimensions", 1945, "1945-01-01", "International and Human Dimensions", "Armistice pressure, Arctic retreat, and civilian survival", [67.5, 26.5], 5, [
      marker("Soviet armistice pressure", [60.1699, 24.9384], "major", "Finland's actions were judged against Soviet armistice demands, limiting Helsinki's freedom of maneuver."),
      marker("Norwegian border", [69.47, 25.8], "target", "German forces withdrew toward occupied Norway, linking the campaign to the broader Arctic front."),
    ], slide(
      "A Small War Shaped by Larger Powers",
      "The Lapland War was fought by Finland and Germany, but Soviet pressure framed Finland's choices. Helsinki had to show real action while demobilizing and recovering from the Continuation War. Civilians carried the heaviest noncombat burden: evacuation, destroyed towns, mined roads, burned bridges, and the slow return to a damaged Arctic home.",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Gebirgsj%C3%A4ger_advancing_in_Arctic_Front.jpg/1920px-Gebirgsj%C3%A4ger_advancing_in_Arctic_Front.jpg",
      "German mountain troops on the Arctic front.",
      [
        stat("Soviet Union", "Armistice enforcer"),
        stat("German Arctic retreat", "Wider context"),
        stat("Evacuation and scorched earth define the civilian experience", "Human dimension", true),
      ]
    )),
    event("outcome-and-legacy", 1945, "1945-04-27", "Outcome and Legacy", "Finland clears German forces but inherits a devastated north", [67.5, 26.5], 5, [
      marker("Kilpisjarvi", [69.045, 20.79], "target", "The last German troops left Finnish territory near the northwestern border in April 1945."),
      marker("Sodankyla", [67.4167, 26.6], "major", "Destroyed northern communities symbolized the reconstruction burden after victory."),
    ], slide(
      "Victory With a Burned Inheritance",
      "Finland fulfilled the armistice requirement by pushing German troops into Norway, but the victory left Lapland devastated. Roads, bridges, public buildings, homes, and communications had to be rebuilt, and evacuees returned to communities transformed by fire and demolition. The war's legacy was therefore double: Finland preserved its postwar position, while northern Finland paid the price of the break with Germany.",
      "https://upload.wikimedia.org/wikipedia/commons/6/64/Sodankyl%C3%A4_1944.jpg",
      "Destroyed Sodankyla in 1944.",
      [
        stat("27 Apr 1945", "Last Germans leave Finland"),
        stat("Finnish victory", "Outcome"),
        stat("Northern reconstruction becomes the lasting legacy", "Legacy", true),
      ]
    )),
  ],
};

deepDives["chadian-libyan-war"] = [
  event("origins-and-road-to-war", 1978, "1978-01-01", "Origins and Road to War", "The Aouzou Strip and Chad's civil wars draw Libya south", [18, 19], 5, [
    marker("Aouzou Strip", [21.4, 17.0], "target", "Libya claimed and occupied the Aouzou Strip, turning a border dispute into a long intervention in Chad."),
    marker("N'Djamena", [12.1348, 15.0557], "major", "Chad's capital was repeatedly shaped by factional fighting and outside intervention."),
  ], slide(
    "Border Claim Meets Civil War",
    "The Chadian-Libyan War began where Libya's claim to the Aouzou Strip met Chad's internal fragmentation. Muammar Gaddafi backed Chadian factions, deployed Libyan troops, and tried to shape the central Sahara's politics. Chad's governments and rival armed movements fought each other as well as Libya, which made the war both an international conflict and a civil-war battlefield.",
    "https://upload.wikimedia.org/wikipedia/commons/8/84/33F_Sikorsky_H34_Tchad.jpg",
    "A French Sikorsky H-34 in Chad, reflecting the long outside military role in the conflict.",
    [stat("Aouzou Strip", "Core territorial dispute"), stat("1978-1987", "War period"), stat("Libyan intervention fused with Chadian factional politics", "Cause", true)]
  )),
  event("second-battle-of-n-djamena", 1980, "1980-12-01", "Second Battle of N'Djamena", "Factional fighting and Libyan-backed power politics", [12.1348, 15.0557], 7, [
    marker("N'Djamena", [12.1348, 15.0557], "target", "The capital became the central prize in Chad's factional struggle and Libya's effort to shape the government."),
  ], slide(
    "The Capital as the Prize",
    "The Second Battle of N'Djamena showed how Chad's civil war and Libya's intervention reinforced each other. Control of the capital meant access to legitimacy, ministries, foreign recognition, and the ability to invite or resist outside troops. Libyan support helped some factions, but it also deepened resistance among Chadians who saw Gaddafi's role as occupation rather than alliance.",
    "https://pbs.twimg.com/media/EVQb0yzUEAEyzlE.jpg",
    "N'Djamena during the era of Chadian-Libyan conflict.",
    [stat("1980", "Battle year"), stat("N'Djamena", "Political center"), stat("Capital fighting internationalized Chad's civil war", "Significance", true)]
  )),
  event("operation-manta", 1983, "1983-08-01", "Operation Manta", "France draws a line against Libyan advance", [15.0, 18.0], 6, [
    marker("Manta line", [15.0, 18.0], "major", "French forces deployed south of Libya's zone of influence to deter further advance."),
    marker("N'Djamena air bridge", [12.1348, 15.0557], "minor", "French airpower and logistics helped stabilize the Chadian government."),
  ], slide(
    "A French Stop Line in the Desert",
    "Operation Manta was France's 1983 intervention to prevent Libya and its Chadian allies from overrunning the south. Paris avoided a full reconquest of the north, but it created a military barrier that protected Hissene Habre's government and bought time for Chad's forces to reorganize. The operation made the war a visible Cold War-era test of French credibility in Africa.",
    "https://pbs.twimg.com/media/Ee_J88zXsAEptF8.jpg",
    "French forces in Chad during Operation Manta.",
    [stat("1983-1984", "Operation period"), stat("French deterrent line", "Military role"), stat("Stops Libya from converting northern control into national victory", "Result", true)]
  )),
  event("operation-pervier", 1986, "1986-02-01", "Operation Épervier", "France returns as Libya escalates", [15.0, 18.0], 6, [
    marker("N'Djamena", [12.1348, 15.0557], "major", "French aircraft and troops helped defend the Chadian government after renewed Libyan pressure."),
    marker("Ouadi Doum", [18.53, 19.27], "target", "Libya's northern air base became a major target as Chad and France pushed back."),
  ], slide(
    "Airpower, Deterrence, and the Northern Bases",
    "Operation Épervier renewed and expanded the French role after Libyan-backed forces crossed the earlier line. French airpower, intelligence, and logistics helped prevent a Libyan breakthrough while Chadian units prepared for a more mobile northern campaign. The intervention did not win the war by itself, but it shaped the conditions that let Chad attack isolated Libyan bases.",
    "https://www.defense.gouv.fr/sites/default/files/styles/16_9_sm/public/operations/20220525_MA_OP_EPERVIER.jpg?h=52c4eadb&itok=bPOyGyOl",
    "French Operation Epervier imagery.",
    [stat("1986", "Operation begins"), stat("Air cover and logistics", "French role"), stat("Enables Chadian counteroffensive momentum", "Effect", true)]
  )),
  event("toyota-war", 1987, "1987-01-01", "Toyota War", "Chad's mobile campaign breaks Libya's desert army", [18.5, 19.5], 6, [
    marker("Fada", [17.185, 21.584], "target", "The victory at Fada opened the decisive mobile phase of the war."),
    marker("Ouadi Doum", [18.53, 19.27], "major", "Chadian forces captured the Libyan base and large quantities of equipment."),
    marker("Maaten al-Sarra", [21.687, 21.833], "major", "Chadian raids reached deep into Libya's rear area near the end of the campaign."),
  ], slide(
    "The Decisive Campaign, Folded Into the Larger War",
    "The Toyota War was the final and decisive phase of the Chadian-Libyan War, not a separate story here. Chadian forces used fast pickup trucks, anti-tank missiles, local desert knowledge, and flexible command to outmaneuver Libya's heavier formations. At Fada, Ouadi Doum, Aouzou, and Maaten al-Sarra, mobility turned Libya's bases into traps. The campaign shattered Gaddafi's position in northern Chad and forced Libya toward a ceasefire.",
    "https://neptuneprime.com.ng/wp-content/uploads/2026/06/1000702987.png",
    "Visual reference for the mobile Chadian campaign.",
    [stat("1986-1987", "Decisive phase"), stat("Fast pickup columns", "Chadian advantage"), stat("Libyan forces expelled from most of northern Chad", "Result", true)]
  )),
  event("battle-of-fada", 1987, "1987-01-02", "Battle of Fada", "A mobile Chadian victory opens the endgame", [17.185, 21.584], 8, [
    marker("Fada", [17.185, 21.584], "target", "Chadian forces destroyed or captured much of a Libyan armored force around Fada."),
  ], slide(
    "Speed Against Armor",
    "At Fada, Chadian forces demonstrated the method that would define the final campaign. Fast columns struck Libyan armor and fixed positions before heavier units could react effectively. The battle damaged Libyan morale, delivered captured equipment to Chad, and proved that the northern occupation could be broken by mobility rather than matched tank for tank.",
    "https://neptuneprime.com.ng/wp-content/uploads/2026/06/1000702987.png",
    "Image selected for the Battle of Fada event.",
    [stat("2 Jan 1987", "Battle date"), stat("Fada", "Battlefield"), stat("Chadian mobile tactics defeat heavier Libyan forces", "Significance", true)]
  )),
  event("international-and-human-dimensions", 1987, "1987-09-01", "International and Human Dimensions", "Foreign intervention and civilian strain across the Sahara", [16, 18], 5, [
    marker("Paris-N'Djamena axis", [12.1348, 15.0557], "major", "French support repeatedly prevented Libya from turning battlefield gains into control of Chad."),
    marker("Northern Chad", [18.8, 19.5], "target", "Occupation, raids, and base warfare placed desert communities under prolonged pressure."),
  ], slide(
    "A Regional War Watched From Abroad",
    "France, the United States, Sudan, and regional governments all read the war through the lens of Libyan expansion. For Chadians, the war meant factional violence, occupation in the north, displacement, and repeated battles around towns and oases. The international dimension mattered because outside airpower and support shaped the battlefield, but the human cost remained local and long-lasting.",
    "https://media.gettyimages.com/id/847160722/photo/battle-of-fada-in-chad.jpg?s=594x594&w=gi&k=20&c=arVNrWdquM_t4K_DKOvP9eFBBwzLXi7ocZFE9_0ZkgM=",
    "Battle of Fada imagery reflecting the war's final phase.",
    [stat("France", "Principal outside military backer"), stat("Thousands", "Killed or captured"), stat("Civil war, occupation, and intervention overlapped", "Human dimension", true)]
  )),
  event("outcome-and-legacy", 1987, "1987-09-11", "Outcome and Legacy", "Libya withdraws and the Aouzou question moves to court", [18, 19], 5, [
    marker("Aouzou Strip", [21.4, 17.0], "target", "The disputed strip remained the legal issue after Libya's military defeat."),
    marker("International Court of Justice", [52.086, 4.295], "minor", "The ICJ awarded the Aouzou Strip to Chad in 1994."),
  ], slide(
    "Military Defeat, Legal Settlement",
    "Chad's 1987 victories forced Libya to accept a ceasefire and ended Gaddafi's attempt to dominate northern Chad by force. The remaining Aouzou Strip dispute moved from battlefield to law, and the International Court of Justice awarded the territory to Chad in 1994. The legacy is a rare case where a smaller, mobile force defeated a larger expeditionary army and then converted that result into recognized sovereignty.",
    "https://defensenigeria.wordpress.com/wp-content/uploads/2021/06/images286029.jpeg",
    "Chadian-Libyan War legacy imagery.",
    [stat("1987", "Ceasefire after Chadian victories"), stat("1994", "ICJ awards Aouzou to Chad"), stat("Chadian victory", "Outcome", true)]
  )),
];

deepDives["estonian-war-of-independence"] = [
  event("origins-and-road-to-war", 1918, "1918-11-28", "Origins and Road to War", "A new republic fights for survival", [58.8, 25.5], 6, [
    marker("Tallinn", [59.437, 24.7536], "major", "The provisional government had to build armed forces and state authority while enemies advanced."),
    marker("Narva frontier", [59.45, 28.0333], "target", "The Red Army attack at Narva opened the war for independence."),
  ], slide(
    "Independence in the Vacuum of Empire",
    "Estonia declared independence amid the collapse of the Russian Empire, German occupation, and the Russian Civil War. When German forces withdrew, the Red Army advanced to restore Bolshevik control. The new republic had to create an army, secure foreign support, and fight on multiple fronts before independence existed as more than a declaration.",
    "https://alchetron.com/cdn/estonian-war-of-independence-494db584-388d-44b4-9eec-41e26cefaa5-resize-750.jpeg",
    "Estonian War of Independence visual reference.",
    [stat("1918-1920", "War period"), stat("Russian imperial collapse", "Opening condition"), stat("State-building and battlefield survival happen at the same time", "Core theme", true)]
  )),
  event("battle-of-narva", 1918, "1918-11-28", "Battle of Narva", "The Red Army opens the war", [59.45, 28.0333], 8, [
    marker("Narva", [59.45, 28.0333], "target", "The Red Army attack at Narva marked the start of the Estonian War of Independence."),
    marker("Jaanilinn / Ivangorod", [59.376, 28.208], "minor", "The Narva River frontier became a contested gateway between Estonia and Soviet Russia."),
  ], slide(
    "The Frontier Ignites",
    "The Battle of Narva began the war when Soviet forces attacked as German troops were leaving Estonia. The Estonian defense was fragile, but the battle clarified the stakes: either the new republic would build a fighting force quickly, or independence would collapse before it took institutional form. Narva became the eastern gateway around which much of the war's later fighting revolved.",
    "https://upload.wikimedia.org/wikipedia/commons/0/0f/Joala_lahing_2.jpg",
    "Fighting near the Narva front.",
    [stat("28 Nov 1918", "Opening battle"), stat("Narva River", "Frontier"), stat("Soviet attack turns independence into war", "Significance", true)]
  )),
  event("battle-of-tartu", 1919, "1919-01-14", "Battle of Tartu", "Estonia recaptures a key southern city", [58.3776, 26.729], 8, [
    marker("Tartu", [58.3776, 26.729], "target", "Recapturing Tartu helped secure southern Estonia and boosted confidence in the new army."),
  ], slide(
    "Southern Estonia Turns",
    "The Battle of Tartu was a key early Estonian success against Red Latvian Riflemen and Soviet-aligned forces. Recapturing the city helped restore government control in southern Estonia and proved that armored trains, volunteers, and newly organized units could reverse the Red Army's advance. It also gave the republic a psychological lift at a moment when survival was still uncertain.",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Soomusronglased_1919._aasta_jaanuaris_Tartut_vabastamas.jpg",
    "Estonian armored train troops associated with the liberation of Tartu.",
    [stat("13-14 Jan 1919", "Battle dates"), stat("Tartu", "Key city"), stat("Southern Estonia begins returning to Estonian control", "Result", true)]
  )),
  event("battle-of-utria", 1919, "1919-01-17", "Battle of Utria", "A coastal landing threatens the Red flank", [59.4, 27.9167], 8, [
    marker("Utria landing area", [59.4, 27.9167], "target", "Estonian and Finnish volunteer forces landed near Utria to threaten Soviet positions near Narva."),
    marker("Narva", [59.45, 28.0333], "major", "The landing supported operations aimed at retaking Narva."),
  ], slide(
    "Amphibious Pressure Near Narva",
    "The Utria landing used coastal mobility to pressure Soviet forces near Narva. Estonian units and Finnish volunteers came ashore behind or beside the Red front, turning the coastline into an operational advantage. The battle matters because it shows Estonia's survival depended not only on holding lines, but on bold moves that disrupted a larger enemy's assumptions.",
    "https://alchetron.com/cdn/battle-of-utria-a04c441b-5934-4ae8-9bcb-83387f0597a-resize-750.jpeg",
    "Battle of Utria visual reference.",
    [stat("17-20 Jan 1919", "Landing and battle"), stat("Finnish volunteers", "Foreign support"), stat("Coastal maneuver supports the Narva counteroffensive", "Effect", true)]
  )),
  event("battle-of-laagna", 1919, "1919-01-18", "Battle of Laagna", "Fighting near the Narva approaches", [59.3833, 27.9833], 8, [
    marker("Laagna", [59.3833, 27.9833], "target", "Estonian marines and Finnish volunteers attacked Red Army positions near Laagna."),
  ], slide(
    "Closing on Narva",
    "At Laagna, Estonian marines and Finnish volunteers fought Red Army positions as part of the wider effort to retake the Narva area. The engagement was local, but it belonged to a larger pattern: Estonia used small mobile formations, volunteers, armored trains, and coastal operations to regain initiative against Soviet forces.",
    "https://alchetron.com/cdn/estonian-war-of-independence-aff64214-939a-4801-97a5-ef5b9e33d6e-resize-750.jpeg",
    "Estonian War of Independence fighters near the Narva front.",
    [stat("18 Jan 1919", "Battle date"), stat("Laagna", "Battlefield"), stat("Part of the Narva counteroffensive", "Significance", true)]
  )),
  event("battle-of-paju", 1919, "1919-01-31", "Battle of Paju", "A costly victory near Valga", [57.8201, 26.1116], 8, [
    marker("Paju Manor", [57.8201, 26.1116], "target", "Heavy fighting around Paju Manor opened the route toward Valga."),
    marker("Valga", [57.7778, 26.0473], "major", "Control of Valga mattered for southern communications and the Latvian front."),
  ], slide(
    "A Fierce Southern Battle",
    "The Battle of Paju was one of the fiercest early battles of the war. Estonian forces and Finnish volunteers attacked Red Latvian Riflemen near Valga, suffering heavy losses, including the mortal wounding of commander Julius Kuperjanov. The victory helped secure the southern front, but its cost made it one of the war's most remembered engagements.",
    "https://i.redd.it/m2g6jcrl15231.jpg",
    "Battle of Paju visual reference.",
    [stat("31 Jan 1919", "Battle date"), stat("Julius Kuperjanov", "Fallen commander"), stat("Costly victory secures the Valga direction", "Result", true)]
  )),
  event("revolt-of-saaremaa", 1919, "1919-02-16", "Revolt of Saaremaa", "Internal revolt tests the new state", [58.35, 22.5], 8, [
    marker("Saaremaa", [58.35, 22.5], "target", "The island revolt showed that the independence war also contained domestic social and political strain."),
    marker("Muhu", [58.6, 23.25], "minor", "The uprising spread across the western islands before being suppressed."),
  ], slide(
    "War Behind the Lines",
    "The Saaremaa revolt was an armed uprising against the Estonian government on the western islands. It reflected war weariness, social tension, resentment of mobilization, and the fragility of a new state trying to fight external enemies while imposing authority at home. Its suppression secured the rear but left a darker domestic chapter inside the independence struggle.",
    "https://upload.wikimedia.org/wikipedia/commons/a/ab/Estonian_soldiers_killed_by_rebels_in_Saarenmaa.jpg",
    "Estonian soldiers killed during the Saaremaa revolt.",
    [stat("16-21 Feb 1919", "Revolt period"), stat("Saaremaa and Muhu", "Affected islands"), stat("Internal resistance exposes the strain of mobilization", "Meaning", true)]
  )),
  event("battle-of-c-sis", 1919, "1919-06-19", "Battle of Cēsis", "Estonian and Latvian forces defeat the Landeswehr", [57.3131, 25.2747], 8, [
    marker("Cēsis", [57.3131, 25.2747], "target", "The battle checked Baltic German ambitions and strengthened Estonian-Latvian cooperation."),
    marker("Võnnu front", [57.35, 25.35], "minor", "The battle is remembered in Estonia as Võnnu, a major victory beyond Estonia's own border."),
  ], slide(
    "A Baltic War Within the War",
    "The Battle of Cēsis was decisive in the conflict with Baltic German Landeswehr forces in Latvia. Estonian units fighting alongside Latvian allies stopped a German-led attempt to dominate the region's political future. The victory mattered beyond the battlefield because it protected Estonia's southern flank and supported Latvian independence at the same time.",
    "https://static.lsm.lv/media/2024/06/large/1/nz1m.jpg",
    "Cesis battle commemoration imagery.",
    [stat("June 1919", "Battle period"), stat("Estonian-Latvian victory", "Outcome"), stat("Checks Baltic German power in Latvia", "Strategic result", true)]
  )),
  event("battle-of-krivasoo", 1919, "1919-11-18", "Battle of Krivasoo", "Late fighting before the ceasefire", [59.2558, 27.9326], 8, [
    marker("Krivasoo", [59.2558, 27.9326], "target", "Late fighting around Krivasoo came as both sides approached exhaustion and negotiation."),
    marker("Narva front", [59.45, 28.0333], "major", "The eastern front remained central until the final ceasefire and Treaty of Tartu."),
  ], slide(
    "The Last Hard Front",
    "Krivasoo was one of the late engagements near the Narva front before the ceasefire. By then Estonia had survived the most dangerous early months, but Soviet pressure still tested the eastern defense. The fighting showed why the eventual peace mattered: independence had to be won not only by declarations and victories, but by holding the front long enough to force recognition.",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Patarei_nr_2_1919.jpg",
    "Estonian artillery position in 1919.",
    [stat("Nov 1919", "Late-war fighting"), stat("Narva front", "Operational area"), stat("Pressure continues until negotiations take hold", "Significance", true)]
  )),
  event("international-and-human-dimensions", 1919, "1919-12-01", "International and Human Dimensions", "Volunteers, British naval support, and a mobilized society", [58.8, 25.5], 6, [
    marker("Tallinn harbor", [59.444, 24.761], "major", "British naval support helped secure sea access and deter Soviet naval pressure."),
    marker("Finnish volunteer route", [60.1699, 24.9384], "minor", "Finnish volunteers crossed the Gulf of Finland to support Estonia's army."),
  ], slide(
    "A Small State With Outside Help",
    "Estonia's war was fought by Estonians, but outside support mattered. British naval power helped secure the coast, Finnish volunteers added manpower and morale, and events in Latvia and Russia shaped every front. Civilians faced mobilization, shortages, executions, occupation fears, and the uncertainty of whether a new state could survive the year.",
    "https://upload.wikimedia.org/wikipedia/commons/b/be/Estonian_heavy_machinegun.jpg?utm_source=www.wikidata.org&utm_campaign=index&utm_content=thumbnail_unscaled",
    "Estonian heavy machine-gun crew.",
    [stat("British navy", "Key outside support"), stat("Finnish volunteers", "Regional aid"), stat("Mobilization strained a small population", "Human dimension", true)]
  )),
  event("outcome-and-legacy", 1920, "1920-02-02", "Outcome and Legacy", "The Treaty of Tartu recognizes Estonian independence", [58.8, 25.5], 6, [
    marker("Tartu", [58.3776, 26.729], "target", "The Treaty of Tartu recognized Estonia's independence from Soviet Russia."),
    marker("Tallinn", [59.437, 24.7536], "major", "The new republic emerged with international recognition and a hard-won national army."),
  ], slide(
    "Recognition Won by Force",
    "The Treaty of Tartu ended the war and recognized Estonia's independence. That outcome was not inevitable in 1918: it required rapid mobilization, foreign help, victories against Soviet forces, success against the Landeswehr, and the ability to hold the Narva front until Moscow negotiated. The legacy became foundational for Estonian statehood, even after later Soviet occupation interrupted independence.",
    "https://primary.jwwb.nl/public/p/n/u/temp-drutgektdyvefhccyffm/sxke7a/soldiers.jpg",
    "Estonian soldiers after the independence struggle.",
    [stat("2 Feb 1920", "Treaty of Tartu"), stat("Estonian victory", "Outcome"), stat("Independence recognized by Soviet Russia", "Legacy", true)]
  )),
];

deepDives["first-libyan-civil-war"] = [
  event("origins-and-background", 2011, "2011-02-15", "From Arab Spring to First Libyan Civil War", "Protests become an armed revolt", [28, 17], 5, [
    marker("Benghazi", [32.1167, 20.0667], "target", "Early protests and repression in Benghazi helped turn unrest into open revolt."),
    marker("Tripoli", [32.8872, 13.1913], "major", "Gaddafi's capital remained the regime's political and military center."),
  ], slide(
    "Uprising Against the Jamahiriya",
    "Libya's 2011 revolt grew from Arab Spring protests, local anger at repression, and decades of rule by Muammar Gaddafi's security state. Demonstrations spread quickly, the regime used force, and opposition-held cities began organizing armed resistance. The conflict soon became a civil war over whether Gaddafi's system would survive or collapse.",
    "https://commons.wikimedia.org/wiki/Special:FilePath/First%20Libyan%20Civil%20War%20(2011).png",
    "Map of the First Libyan Civil War.",
    [stat("Feb 2011", "Uprising begins"), stat("Benghazi", "Early opposition center"), stat("Protest movement turns into armed revolt", "Turning point", true)]
  )),
  event("uprising", 2011, "2011-02-17", "Uprising Begins", "Opposition cities break from regime control", [32.1167, 20.0667], 7, [
    marker("Benghazi", [32.1167, 20.0667], "target", "Benghazi became the opposition's main eastern stronghold."),
    marker("Misrata", [32.3775, 15.092], "major", "Misrata's resistance later became crucial to the anti-Gaddafi war effort."),
  ], slide(
    "Cities Become the Revolution's Base",
    "The uprising began with protests and quickly moved into armed confrontation as security forces fired on demonstrators and local units defected or collapsed. Eastern cities, especially Benghazi, became opposition centers. The speed of the revolt shocked the regime, but the lack of a unified opposition command also foreshadowed the militia fragmentation that would follow victory.",
    "https://upload.wikimedia.org/wikipedia/commons/8/8e/Libyan_Civil_War_in_October_2011_%2809%29.jpg",
    "Opposition fighters during the 2011 Libyan Civil War.",
    [stat("17 Feb 2011", "Day of Rage"), stat("Eastern Libya", "Early rebel base"), stat("Regime violence accelerates armed rebellion", "Cause", true)]
  )),
  event("gaddafi-counteroffensive", 2011, "2011-03-06", "Gaddafi Counteroffensive", "Regime forces push toward Benghazi", [30.75, 18.08], 6, [
    marker("Ras Lanuf", [30.5, 18.55], "major", "Oil-coast towns changed hands as regime forces regained momentum."),
    marker("Benghazi", [32.1167, 20.0667], "target", "The threatened assault on Benghazi drove the international debate over civilian protection."),
  ], slide(
    "The Revolt Nearly Breaks",
    "Gaddafi's counteroffensive reversed early rebel gains along the coast and threatened Benghazi. Better-armed regime forces used armor, artillery, aircraft, and loyal units to exploit the opposition's weak organization. The advance made the war's central question immediate: would outside powers allow the regime to retake rebel cities by force, or intervene before Benghazi fell?",
    "https://live-production.wcms.abc-cdn.net.au/4020e5060f8ced1ebda073e63d618d1c?impolicy=wcms_crop_resize&cropH=1970&cropW=3500&xPos=0&yPos=0&width=862&height=485",
    "Libyan battlefield imagery during the regime counteroffensive.",
    [stat("Mar 2011", "Counteroffensive"), stat("Benghazi threatened", "Immediate danger"), stat("Regime momentum triggers intervention debate", "Significance", true)]
  )),
  event("resolution-1973", 2011, "2011-03-17", "UN Security Council Resolution 1973", "The UN authorizes civilian protection", [40.7494, -73.968], 5, [
    marker("UN Headquarters", [40.7494, -73.968], "major", "The Security Council authorized a no-fly zone and all necessary measures to protect civilians."),
    marker("Benghazi", [32.1167, 20.0667], "target", "The threat to Benghazi framed the urgency of the vote."),
  ], slide(
    "A Legal Mandate for Intervention",
    "UN Security Council Resolution 1973 authorized a no-fly zone and the use of all necessary measures to protect civilians, while excluding a foreign occupation force. The resolution gave international legal cover to military action. It also created later controversy because a mission framed around civilian protection helped produce regime change.",
    "https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2011/3/18/1300436044208/UN-security-council-membe-007.jpg?width=465&dpr=1&s=none&crop=none",
    "UN Security Council members during the Libya vote.",
    [stat("17 Mar 2011", "Resolution adopted"), stat("No-fly zone", "Authorized tool"), stat("Civilian protection mandate leads to NATO campaign", "Consequence", true)]
  )),
  event("nato-intervention", 2011, "2011-03-19", "Western and NATO Intervention", "Airpower stops the regime advance", [32.1167, 20.0667], 5, [
    marker("Benghazi approaches", [32.05, 20.1], "target", "Coalition airstrikes stopped regime forces near Benghazi."),
    marker("Mediterranean air corridor", [35.0, 15.0], "major", "NATO aircraft and ships enforced the no-fly zone and struck regime forces."),
  ], slide(
    "From No-Fly Zone to Air Campaign",
    "Western and NATO intervention began with strikes against Libyan air defenses and regime forces threatening Benghazi. The campaign prevented an immediate rebel defeat, then evolved into sustained air support that weakened Gaddafi's military across the country. Airpower changed the balance, but it could not by itself build a unified postwar state.",
    "https://thedailyeconomy.org/wp-content/uploads/2025/01/Shutterstock_2314112451.jpg",
    "Aircraft imagery representing the NATO-led intervention.",
    [stat("19 Mar 2011", "Military action begins"), stat("Operation Unified Protector", "NATO mission"), stat("Air campaign shifts momentum to the opposition", "Effect", true)]
  )),
  event("fall-of-tripoli", 2011, "2011-08-20", "Fall of Tripoli", "Rebels enter the capital", [32.8872, 13.1913], 8, [
    marker("Tripoli", [32.8872, 13.1913], "target", "Opposition fighters entered the capital in August 2011, collapsing Gaddafi's central authority."),
    marker("Bab al-Aziziya", [32.872, 13.173], "major", "The capture of Gaddafi's compound symbolized the fall of the regime."),
  ], slide(
    "The Capital Falls",
    "The fall of Tripoli broke the regime's political center. Rebel forces entered the city with support from local uprisings and NATO pressure, while Gaddafi's command structure unraveled. The victory was decisive for the dictatorship, but it also exposed the opposition's central weakness: many armed groups could defeat the regime, yet no single authority could easily control them afterward.",
    "https://static.guim.co.uk/sys-images/Guardian/Pix/pictures/2011/8/24/1314180272976/A-Libyan-rebel-walks-past-007.jpg",
    "A Libyan rebel walks near damaged regime symbols in Tripoli.",
    [stat("Aug 2011", "Tripoli falls"), stat("Bab al-Aziziya", "Symbolic target"), stat("Regime center collapses before state authority is rebuilt", "Consequence", true)]
  )),
  event("gaddafi-killed", 2011, "2011-10-20", "Gaddafi Killed at Sirte", "The dictator's death ends organized regime resistance", [31.2, 16.6], 7, [
    marker("Sirte", [31.2, 16.6], "target", "Gaddafi was captured and killed near Sirte after his convoy was struck and surrounded."),
    marker("Coastal escape route", [31.25, 16.4], "minor", "The convoy's failed escape showed the regime had lost operational space."),
  ], slide(
    "The End of Gaddafi",
    "Muammar Gaddafi was captured and killed near Sirte after the collapse of his final stronghold. His death ended organized loyalist resistance and gave the revolution a clear symbolic victory. It did not end Libya's crisis. Weapons, militias, local rivalries, and weak institutions remained, turning victory into a difficult and unstable transition.",
    "https://s.france24.com/media/display/31037c6e-0a82-11e9-8069-005056a964fe/w:1280/p:1x1/Libya-gaddafi-Captured_1.jpg",
    "France 24 image associated with Gaddafi's capture.",
    [stat("20 Oct 2011", "Gaddafi killed"), stat("Sirte", "Final stronghold"), stat("Regime defeat does not resolve militia fragmentation", "Legacy", true)]
  )),
  event("nato-mission-ends", 2011, "2011-10-31", "NATO Mission Ends", "Operation Unified Protector closes", [28, 17], 5, [
    marker("Libyan coast", [32.0, 18.0], "major", "NATO ended its air and maritime mission after Gaddafi's death and the fall of loyalist strongholds."),
    marker("Tripoli", [32.8872, 13.1913], "target", "The new authorities inherited the capital without a monopoly on force."),
  ], slide(
    "The Intervention Ends Before the Aftermath Is Solved",
    "NATO ended Operation Unified Protector on 31 October 2011. The mission had helped protect opposition-held cities and destroy much of Gaddafi's military capability. Its ending exposed the harder political problem: Libya had no strong security institutions ready to absorb militias, secure weapons, or create a durable national settlement.",
    "https://www.aljazeera.com/wp-content/uploads/2011/10/2011103119361553734_20.jpeg?resize=570%2C380&quality=80",
    "Al Jazeera image from the end of NATO's Libya mission.",
    [stat("31 Oct 2011", "NATO mission ends"), stat("Unified Protector", "Mission name"), stat("Military success leaves unresolved state-building problem", "Lesson", true)]
  )),
  event("conflict-summary", 2011, "2011-10-31", "Conflict Summary: First Libyan Civil War", "Victory, intervention, and the unstable aftermath", [28, 17], 5, [
    marker("Benghazi", [32.1167, 20.0667], "major", "The revolt's eastern base survived because local resistance and foreign intervention stopped the regime counteroffensive."),
    marker("Tripoli", [32.8872, 13.1913], "target", "The capital's fall ended Gaddafi's rule but did not create a unified postwar security order."),
    marker("Sirte", [31.2, 16.6], "major", "Gaddafi's death at Sirte closed the war's regime-change phase."),
  ], slide(
    "What the War Changed",
    "The First Libyan Civil War overthrew Gaddafi and prevented the immediate destruction of the opposition, but it did not produce a stable postwar order. The deep dive's central lesson is the gap between battlefield success and political settlement. Airpower, rebel courage, and diplomatic action could defeat the regime; building a state after the regime collapsed proved far harder.",
    "https://s.france24.com/media/display/90d9cd58-0a07-11e9-8d21-005056bff430/w:1024/p:16x9/libya-nato.jpg",
    "Libya and NATO imagery from the 2011 war's aftermath.",
    [stat("Gaddafi overthrown", "Outcome"), stat("Thousands killed and displaced", "Human cost"), stat("Unstable transition leads toward renewed conflict", "Lasting legacy", true)]
  )),
];

function event(id, year, date, title, sub, center, zoom, markers, slideData) {
  return {
    id,
    year,
    date,
    title,
    sub,
    view: { center, zoom },
    markers,
    regions: [],
    slides: [slideData],
  };
}

function marker(label, latlng, type, description) {
  return { label, latlng, type, description };
}

function slide(title, body, img, cap, stats) {
  return { title, img, cap, body, stats };
}

function stat(val, lbl, full = false) {
  return full ? { val, lbl, full } : { val, lbl };
}

async function readJson(path) {
  return JSON.parse((await readFile(path, "utf8")).replace(/^\uFEFF/, ""));
}

async function writeJson(path, value) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function removeGraphIds(graph) {
  const nodes = { ...graph.nodes };
  for (const id of REMOVED_IDS) delete nodes[id];
  const relationships = graph.relationships.filter(
    (item) => !REMOVED_IDS.includes(item.from) && !REMOVED_IDS.includes(item.to)
  );

  if (!relationships.some((item) => item.from === "algerian-war" && item.to === "chadian-libyan-war")) {
    relationships.push({
      from: "algerian-war",
      to: "chadian-libyan-war",
      type: "regional",
      label: "Post-colonial Saharan border politics",
    });
  }

  return { ...graph, nodes, relationships };
}

for (const id of REMOVED_IDS) {
  const path = join(DRAFT_DIR, `${id}.generated.json`);
  if (existsSync(path)) {
    await unlink(path);
    console.log(`Deleted ${id}.generated.json`);
  }
}

for (const [id, events] of Object.entries(deepDives)) {
  await writeJson(join(DRAFT_DIR, `${id}.generated.json`), events);
  console.log(`Rewrote ${id}.generated.json (${events.length} events)`);
}

const index = await readJson(INDEX_PATH);
const filteredIndex = index
  .filter((item) => !REMOVED_IDS.includes(item.id))
  .map((item) => (indexUpdates[item.id] ? { ...item, ...indexUpdates[item.id] } : item));
await writeJson(INDEX_PATH, filteredIndex);
console.log(`Updated backend deepdives-index.json (${index.length} -> ${filteredIndex.length})`);

const relationshipGraph = removeGraphIds(await readJson(FRONTEND_RELATIONSHIPS_PATH));
await writeJson(FRONTEND_RELATIONSHIPS_PATH, relationshipGraph);
await writeJson(BACKEND_RELATIONSHIPS_PATH, relationshipGraph);
console.log(`Updated ${FRONTEND_RELATIONSHIPS_PATH}`);
console.log(`Synced ${BACKEND_RELATIONSHIPS_PATH}`);
