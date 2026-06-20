import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const backend = process.argv[2] ?? "C:\\Users\\alons\\Terra-Historia-Backend";
const drafts = join(backend, "deepdives-drafts");

const markerPlans = {
  "korean-war.generated.json": {
    "first-battle-of-seoul": [
      marker(37.5665, 126.978, "Seoul", "target", "Seoul marks the South Korean capital seized by North Korean forces in the opening days of the Korean War."),
    ],
  },
  "vietnam-war.generated.json": {
    "laotian-civil-war": [
      marker(17.9757, 102.6331, "Vientiane", "target", "Vientiane marks the Laotian capital and the political center of the neighboring civil war tied to the Vietnam conflict."),
    ],
    "cambodian-civil-war": [
      marker(11.5564, 104.9282, "Phnom Penh", "target", "Phnom Penh marks the Cambodian capital as the civil war widened the Vietnam conflict into Cambodia."),
    ],
    "tet-offensive": [
      marker(10.7769, 106.7009, "Saigon", "target", "Saigon marks one of the most visible Tet Offensive battlegrounds, including attacks on symbolic government and U.S. targets."),
      marker(16.4637, 107.5909, "Hue", "minor", "Hue marks the prolonged urban battle that became one of the Tet Offensive's hardest fights."),
    ],
  },
  "laotian-civil-war.generated.json": {
    "battle-of-luang-namtha": [
      marker(20.9486, 101.4019, "Luang Namtha", "target", "Luang Namtha marks the northern Lao town whose fall exposed Royal Lao weakness early in the civil war."),
    ],
    "battle-of-lak-sao": [
      marker(18.205, 104.956, "Lak Sao", "target", "Lak Sao marks the central Lao crossroads where Royal Lao forces fought North Vietnamese and Pathet Lao troops."),
    ],
    "1967-opium-war": [
      marker(20.35, 100.38, "Ban Khwan", "target", "Ban Khwan marks the northwestern Lao battlefield where rival opium forces and Royal Lao troops clashed in 1967."),
      marker(20.2775, 100.4128, "Ban Houayxay", "minor", "Ban Houayxay marks the nearby Mekong base area involved in the Opium War fighting."),
    ],
    "battle-of-nam-bac": [
      marker(20.78, 102.18, "Nam Bac Valley", "target", "Nam Bac Valley marks the Royal Lao stronghold whose collapse became a major communist victory."),
    ],
    "operation-phalat": [
      marker(20.18, 100.62, "Xieng Lom", "target", "Xieng Lom marks the Mekong border area where Thai-backed forces established a forward defensive position in Laos."),
      marker(19.89, 101.13, "Pakbeng", "minor", "Pakbeng marks the Mekong corridor and Chinese road concern behind Thai intervention planning."),
    ],
    "operation-sourisak-montry-viii": [
      marker(20.18, 100.62, "Xieng Lom", "target", "Xieng Lom marks the Mekong sector around which Operation Sourisak Montry VIII unfolded."),
      marker(19.89, 101.13, "Pakbeng", "minor", "Pakbeng marks the nearby Mekong crossing area tied to the Chinese road and Thai security fears."),
    ],
    "vientiane-treaty": [
      marker(17.9757, 102.6331, "Vientiane", "target", "Vientiane marks the treaty negotiations that produced the 1973 coalition settlement."),
    ],
    "1973-laotian-coup": [
      marker(17.9757, 102.6331, "Vientiane", "target", "Vientiane marks the political center of the 1973 coup attempt and postwar instability."),
    ],
  },
  "cambodian-civil-war.generated.json": {
    "1970-cambodian-coup-d-tat": [
      marker(11.5564, 104.9282, "Phnom Penh", "target", "Phnom Penh marks the capital where Lon Nol's coup removed Prince Sihanouk in March 1970."),
    ],
    "operation-chenla-i": [
      marker(12.32, 104.75, "Tang Kauk / Route 6", "target", "Tang Kauk and Route 6 mark the Chenla I corridor opened by Khmer Republic forces before the offensive stalled."),
      marker(12.0, 105.46, "Kampong Cham", "minor", "Kampong Cham marks the eastern road and river area central to the Chenla I fighting."),
    ],
    "operation-chenla-ii": [
      marker(12.711, 104.888, "Kampong Thom", "target", "Kampong Thom marks the isolated garrison Chenla II tried to reconnect along Route 6."),
      marker(12.51, 104.83, "Phnom Santuk", "minor", "Phnom Santuk marks a key high-ground objective during the Chenla II advance."),
    ],
    "battle-of-k-mp-ng-cham": [
      marker(11.993, 105.464, "Kampong Cham", "target", "Kampong Cham marks the Mekong city fought over during the Cambodian Civil War."),
    ],
    "operation-eagle-pull": [
      marker(11.5696, 104.921, "LZ Hotel / Phnom Penh", "target", "LZ Hotel in Phnom Penh marks the helicopter evacuation point used during Operation Eagle Pull."),
    ],
  },
  "third-indochina-war.generated.json": {
    "insurgency-in-laos": [
      marker(19.45, 103.18, "Xieng Khouang / Plain of Jars", "target", "Xieng Khouang and the Plain of Jars mark a core area of post-1975 insurgency and state control struggles in Laos."),
    ],
    "cambodian-vietnamese-war": [
      marker(11.5564, 104.9282, "Phnom Penh", "target", "Phnom Penh marks the Vietnamese capture of Cambodia's capital and the overthrow of the Khmer Rouge regime."),
      marker(10.99, 106.1, "Vietnam-Cambodia border", "minor", "The Vietnam-Cambodia border marks the frontier where raids, massacres, and invasion routes escalated the war."),
    ],
    "sino-vietnamese-conflicts-1979-1991": [
      marker(22.82, 104.98, "Vi Xuyen front", "target", "Vi Xuyen marks one of the long-running Sino-Vietnamese border fronts after the 1979 invasion."),
    ],
    "sino-vietnamese-war": [
      marker(21.8537, 106.7615, "Lang Son", "target", "Lang Son marks one of the major northern Vietnamese cities captured during China's 1979 offensive."),
      marker(22.4856, 103.9707, "Lao Cai", "minor", "Lao Cai marks the western attack axis of the Sino-Vietnamese War."),
    ],
    "thai-laotian-border-war": [
      marker(17.72, 100.97, "Ban Rom Klao border area", "target", "Ban Rom Klao marks the disputed Thai-Lao border area where fighting broke out in 1987-1988."),
    ],
  },
};

const wwiDescriptions = {
  "sarajevo:Sarajevo": "Sarajevo marks the assassination of Archduke Franz Ferdinand, the crisis point that triggered the July Crisis.",
  "belgium-marne:Brussels": "Brussels marks Belgium's invasion route and the violation of Belgian neutrality.",
  "belgium-marne:Marne": "The Marne marks the Allied counterattack that halted Germany's 1914 advance toward Paris.",
  "belgium-marne:Liege": "Liege marks the Belgian fortress city whose resistance slowed the German advance.",
  "trench-stalemate:Ypres Salient": "The Ypres Salient marks the dangerous front where trench warfare hardened in Flanders.",
  "trench-stalemate:Somme sector": "The Somme sector marks part of the Western Front trench system that became a symbol of stalemate.",
  "gallipoli:Gallipoli Peninsula": "The Gallipoli Peninsula marks the Allied landing area in the campaign to force the Dardanelles.",
  "gallipoli:Dardanelles": "The Dardanelles marks the strait the Allies hoped to open to reach the Ottoman capital and Russia.",
  "verdun:Verdun": "Verdun marks the fortress city Germany attacked in one of the war's longest battles.",
  "verdun:Fort Douaumont": "Fort Douaumont marks a key Verdun strongpoint whose capture and recapture shaped the battle.",
  "somme:Somme battlefield": "The Somme battlefield marks the 1916 Allied offensive and its enormous casualties.",
  "somme:Thiepval": "Thiepval marks one of the Somme's most fought-over sectors and later its major memorial.",
  "jutland:Jutland battle area": "The Jutland battle area marks the North Sea clash between the British Grand Fleet and German High Seas Fleet.",
  "jutland:British Grand Fleet base": "The British Grand Fleet base marks Scapa Flow, the main Royal Navy base for the North Sea war.",
  "us-enters:Washington, D.C.": "Washington, D.C. marks the U.S. declaration of war in April 1917.",
  "us-enters:Paris": "Paris marks the Allied capital whose defense American manpower and resources helped sustain.",
  "russia-exits:Petrograd": "Petrograd marks the revolutionary center where Russia's wartime government collapsed.",
  "russia-exits:Brest-Litovsk": "Brest-Litovsk marks the treaty that took Russia out of World War I.",
  "hundred-days:Amiens": "Amiens marks the Allied attack that opened the Hundred Days Offensive.",
  "hundred-days:Marne sector": "The Marne sector marks the failed German offensive and Allied counterstroke in 1918.",
  "armistice-versailles:Compiegne Forest": "Compiegne Forest marks the railway carriage where Germany signed the armistice.",
  "armistice-versailles:Versailles": "Versailles marks the peace treaty that formally ended the war with Germany.",
};

const descriptionsByMarker = {
  "korean-war.generated.json": {
    "battle-of-osan:Battle of Osan": "Osan marks the first ground combat between U.S. forces and North Korean troops in July 1950.",
    "battle-of-taejon:Battle of Taejon": "Taejon marks the delaying battle where U.S. and South Korean forces tried to slow the North Korean advance.",
    "tunam-massacre:Tunam massacre": "Tunam marks the massacre site near Daejeon during the early Korean War.",
    "battle-of-pusan-perimeter:Battle of Pusan Perimeter": "The Pusan Perimeter marks the southeastern defensive line that held until the Inchon landing.",
    "battle-of-inchon:Battle of Inchon": "Inchon marks the amphibious landing that reversed the early course of the Korean War.",
    "battle-of-the-ch-ongch-on-river:Battle of the Ch'ongch'on River": "The Ch'ongch'on River marks the Chinese counteroffensive that drove UN forces back south.",
    "battle-of-changjin-reservoir:Battle of Changjin Reservoir": "Changjin Reservoir marks the brutal winter battle and UN breakout from northeast Korea.",
  },
  "vietnam-war.generated.json": {
    "gulf-of-tonkin-incident:Gulf of Tonkin incident": "The Gulf of Tonkin marks the naval incidents that helped lead to expanded U.S. military action in Vietnam.",
    "battle-of-khe-sanh:Battle of Khe Sanh": "Khe Sanh marks the besieged Marine combat base near the Demilitarized Zone.",
    "my-lai-massacre:My Lai Massacre": "My Lai marks the massacre of Vietnamese civilians by U.S. troops in March 1968.",
    "paris-peace-accords:Paris Peace Accords": "Paris marks the negotiations and accords intended to end direct U.S. involvement in Vietnam.",
    "fall-of-saigon:Fall of Saigon": "Saigon marks the collapse of South Vietnam and the end of the Vietnam War in April 1975.",
  },
  "cambodian-civil-war.generated.json": {
    "fall-of-phnom-penh:Fall of Phnom Penh": "Phnom Penh marks the Khmer Rouge capture of the capital and the collapse of the Khmer Republic.",
  },
};

const files = [
  "wwi-events.json",
  "korean-war.generated.json",
  "vietnam-war.generated.json",
  "laotian-civil-war.generated.json",
  "cambodian-civil-war.generated.json",
  "third-indochina-war.generated.json",
];

function marker(lat, lng, label, type, description) {
  return { latlng: [lat, lng], label, type, description };
}

function isDefaultView(view) {
  return !view || (view.center?.[0] === 50 && view.center?.[1] === 15);
}

function getDescription(file, event, markerData) {
  const key = `${event.id}:${markerData.label}`;
  return (
    (file === "wwi-events.json" ? wwiDescriptions[key] : undefined) ||
    descriptionsByMarker[file]?.[key] ||
    markerData.description ||
    `${markerData.label} is marked because it is a key location in ${event.title || "this event"}.`
  );
}

for (const file of files) {
  const path = join(drafts, file);
  const data = JSON.parse(await readFile(path, "utf8"));
  let changed = false;

  for (const event of data) {
    const plannedMarkers = markerPlans[file]?.[event.id];

    if ((!Array.isArray(event.markers) || event.markers.length === 0) && plannedMarkers?.length) {
      event.markers = plannedMarkers;
      changed = true;
    }

    if (Array.isArray(event.markers)) {
      for (const item of event.markers) {
        if (item.type === "major") {
          item.type = "target";
          changed = true;
        }
        if (!item.description) {
          item.description = getDescription(file, event, item);
          changed = true;
        }
      }

      if (event.markers.length && isDefaultView(event.view)) {
        const [lat, lng] = event.markers[0].latlng;
        event.view = { center: [lat, lng], zoom: 6 };
        changed = true;
      }
    }
  }

  if (changed) {
    await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  }

  console.log(`${changed ? "updated" : "ok"} ${file}`);
}
