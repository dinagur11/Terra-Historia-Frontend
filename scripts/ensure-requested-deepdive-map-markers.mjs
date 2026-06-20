import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const backend = process.argv[2] ?? "C:\\Users\\alons\\Terra-Historia-Backend";
const drafts = join(backend, "deepdives-drafts");

const files = [
  "wwii-events.json",
  "russian-civil-war.json",
  "spanish-civil-war.json",
  "winter-war.json",
  "continuation-war.json",
  "first-chechen-war.generated.json",
  "second-chechen-war.generated.json",
  "war-of-dagestan.generated.json",
];

const markerDescriptions = {
  "wwii-events.json": {
    "poland:Westerplatte": "Westerplatte marks the first German attack of the invasion of Poland.",
    "poland:Warsaw": "Warsaw marks the Polish capital, besieged and bombed before surrendering in September 1939.",
    "poland:Brest-Litovsk": "Brest-Litovsk marks eastern Poland, where German and Soviet occupation zones met.",
    "britain:London": "London marks the political center and the main target of the Blitz.",
    "britain:Calais": "Calais marks the Luftwaffe's forward approach area across the Channel from Britain.",
    "britain:Dover": "Dover marks Britain's Channel gateway and a key front-line air defense area.",
    "pearl:Pearl Harbour": "Pearl Harbour marks the U.S. Pacific Fleet base attacked by Japan on 7 December 1941.",
    "dday:Omaha & Utah": "Omaha and Utah mark the American landing beaches in Normandy.",
    "dday:Gold · Juno · Sword": "Gold, Juno, and Sword mark the British and Canadian landing beaches.",
    "dday:Portsmouth": "Portsmouth marks one of the main embarkation ports for the invasion fleet.",
    "auschwitz:Auschwitz": "Auschwitz marks the Nazi camp complex liberated by Soviet forces in January 1945.",
    "berlin:Berlin": "Berlin marks the final Soviet assault and the collapse of Nazi Germany.",
    "vj:Hiroshima": "Hiroshima marks the first atomic bombing, on 6 August 1945.",
    "vj:Nagasaki": "Nagasaki marks the second atomic bombing, on 9 August 1945.",
  },
  "winter-war.json": {
    "molotov-ribbentrop-shadow:Helsinki": "Helsinki marks Finland's capital as Soviet pressure increased after the Molotov-Ribbentrop Pact.",
    "molotov-ribbentrop-shadow:Leningrad": "Leningrad marks the Soviet security concern used to demand Finnish border concessions.",
    "molotov-ribbentrop-shadow:Karelian Isthmus": "The Karelian Isthmus marks the disputed border zone between Finland and Leningrad.",
    "mainila-invasion:Mainila area": "The Mainila area marks the shelling incident Moscow used as a pretext for invasion.",
    "mainila-invasion:Helsinki": "Helsinki marks the Finnish capital attacked from the air as the war opened.",
    "mainila-invasion:Leningrad": "Leningrad marks the Soviet base area near the invasion front.",
    "mannerheim-line:Mannerheim Line": "The Mannerheim Line marks Finland's main defensive belt on the Karelian Isthmus.",
    "mannerheim-line:Viipuri / Vyborg": "Viipuri / Vyborg marks the key city behind the Finnish defensive line.",
    "mannerheim-line:Summa sector": "The Summa sector marks the strongest Soviet pressure point against the Mannerheim Line.",
    "suomussalmi-raate:Suomussalmi": "Suomussalmi marks the Finnish victory that destroyed Soviet formations in central Finland.",
    "suomussalmi-raate:Raate Road": "Raate Road marks the narrow road where Finnish motti tactics trapped Soviet columns.",
    "salla-kollaa:Salla": "Salla marks the northern front where Soviet forces tried to cut across Finland.",
    "salla-kollaa:Kollaa River": "The Kollaa River marks the defensive stand remembered as 'Kollaa holds.'",
    "salla-kollaa:Oulu": "Oulu marks the strategic target Soviet advances threatened to cut Finland in two.",
    "international-reaction:Stockholm": "Stockholm marks Sweden's central role in volunteers, supplies, and diplomacy.",
    "international-reaction:London": "London marks British debate over aid and possible intervention.",
    "international-reaction:Paris": "Paris marks French support planning during the Winter War.",
    "soviet-reorganization:Summa": "Summa marks the sector where renewed Soviet tactics began breaking Finnish defenses.",
    "soviet-reorganization:Viipuri / Vyborg": "Viipuri / Vyborg marks the city threatened by the reorganized Soviet offensive.",
    "viborg-crisis:Viipuri / Vyborg": "Viipuri / Vyborg marks the crisis point as Finnish defenses neared exhaustion.",
    "viborg-crisis:Viipuri Bay": "Viipuri Bay marks the frozen-water approach used in the final Soviet attacks.",
    "moscow-peace:Moscow": "Moscow marks the treaty negotiations that ended the Winter War.",
    "moscow-peace:Viipuri / Vyborg": "Viipuri / Vyborg marks territory Finland ceded to the Soviet Union.",
    "moscow-peace:Helsinki": "Helsinki marks the Finnish government accepting peace while preserving independence.",
    "legacy:Helsinki": "Helsinki marks Finland's survival as an independent state after the war.",
    "legacy:Leningrad": "Leningrad marks the Soviet security objective that shaped the war's legacy.",
  },
  "continuation-war.json": {
    "interim-peace:Helsinki": "Helsinki marks Finland during the tense interim peace after the Winter War.",
    "interim-peace:Viipuri / Vyborg": "Viipuri / Vyborg marks the lost Karelia territory Finland hoped to recover.",
    "interim-peace:Leningrad": "Leningrad marks the nearby Soviet city that kept the border question dangerous.",
    "operation-barbarossa:Leningrad": "Leningrad marks the Soviet city threatened as Germany and Finland attacked in 1941.",
    "operation-barbarossa:Helsinki": "Helsinki marks Finland's entry into renewed war with the Soviet Union.",
    "operation-barbarossa:Northern Finland": "Northern Finland marks the German-Finnish front aimed toward Murmansk.",
    "reconquest-karelia:Sortavala": "Sortavala marks Finland's advance back into Ladoga Karelia.",
    "reconquest-karelia:Viipuri / Vyborg": "Viipuri / Vyborg marks the symbolic recovery of territory lost in 1940.",
    "reconquest-karelia:Petrozavodsk": "Petrozavodsk marks Finland's occupation zone in East Karelia.",
    "leningrad-front:Leningrad": "Leningrad marks the besieged Soviet city south of Finnish lines.",
    "leningrad-front:Finnish lines north of city": "Finnish lines north of the city mark Finland's role in the Leningrad front.",
    "leningrad-front:Lake Ladoga": "Lake Ladoga marks the supply and front-line geography around besieged Leningrad.",
    "east-karelia-occupation:Petrozavodsk": "Petrozavodsk marks the administrative center of occupied East Karelia.",
    "east-karelia-occupation:East Karelia": "East Karelia marks the occupied zone beyond Finland's prewar border.",
    "trench-war-1942:East Karelia front": "The East Karelia front marks the static positions held after the 1941 advance.",
    "trench-war-1942:Karelian Isthmus": "The Karelian Isthmus marks the fortified front north of Leningrad.",
    "trench-war-1942:Helsinki": "Helsinki marks the Finnish home front during the long static phase.",
    "soviet-offensive-1944:Viipuri / Vyborg": "Viipuri / Vyborg marks the city retaken by the Soviet offensive in 1944.",
    "soviet-offensive-1944:Tali-Ihantala sector": "Tali-Ihantala marks the decisive defensive battle that slowed the Soviet advance.",
    "soviet-offensive-1944:Petrozavodsk": "Petrozavodsk marks the Soviet recovery of East Karelia.",
    "tali-ihantala:Tali-Ihantala": "Tali-Ihantala marks Finland's largest battle and a key defensive success in 1944.",
    "tali-ihantala:Vyborg / Viipuri": "Vyborg / Viipuri marks the nearby city whose loss preceded the defensive stand.",
    "armistice:Helsinki": "Helsinki marks Finland's decision to seek an armistice and exit the war.",
    "armistice:Moscow": "Moscow marks the armistice terms imposed by the Soviet Union.",
    "armistice:Lapland": "Lapland marks the northern front Finland had to clear of German forces after the armistice.",
    "legacy:Helsinki": "Helsinki marks Finland's postwar survival under strict treaty constraints.",
    "legacy:Lost Karelia": "Lost Karelia marks the permanent territorial loss confirmed after the war.",
  },
};

const missingMapMarkers = {
  "wwii-events.json": {
    poland: [
      {
        latlng: [54.406, 18.671],
        label: "Westerplatte",
        type: "target",
        description: "Westerplatte marks the first German attack of the invasion of Poland.",
      },
      {
        latlng: [52.2297, 21.0122],
        label: "Warsaw",
        type: "minor",
        description: "Warsaw marks the Polish capital, besieged and bombed before surrendering in September 1939.",
      },
      {
        latlng: [52.0976, 23.7341],
        label: "Brest-Litovsk",
        type: "minor",
        description: "Brest-Litovsk marks eastern Poland, where German and Soviet occupation zones met.",
      },
    ],
  },
  "first-chechen-war.generated.json": {
    "origins-and-road-to-war": [{ latlng: [43.3178, 45.6986], label: "Grozny", type: "target", description: "Grozny marks the Chechen capital and the political center of the separatist crisis before the war." }],
    "november-1994-battle-of-grozny": [{ latlng: [43.3178, 45.6986], label: "Grozny", type: "target", description: "Grozny marks the failed November 1994 armored attempt to remove Dzhokhar Dudayev." }],
    "shatoy-ambush": [{ latlng: [42.869, 45.688], label: "Shatoy", type: "target", description: "Shatoy marks the mountain ambush that inflicted heavy losses on a Russian column in April 1996." }],
    "khasavyurt-accord": [{ latlng: [43.25, 46.59], label: "Khasavyurt", type: "target", description: "Khasavyurt marks the accord that ended major fighting in the First Chechen War." }],
    "international-and-human-dimensions": [{ latlng: [43.3178, 45.6986], label: "Grozny", type: "target", description: "Grozny marks the war's heaviest destruction and the civilian impact that drew international attention." }],
    "outcome-and-legacy": [{ latlng: [43.3178, 45.6986], label: "Grozny", type: "target", description: "Grozny marks Chechnya's unresolved postwar status and the instability that followed the 1996 settlement." }],
  },
  "second-chechen-war.generated.json": {
    "origins-and-road-to-war": [{ latlng: [43.3178, 45.6986], label: "Grozny", type: "target", description: "Grozny marks the Chechen capital as Russia prepared to reenter the republic after Dagestan and the bombings." }],
    "1999-russian-apartment-bombings": [{ latlng: [55.7558, 37.6173], label: "Moscow", type: "target", description: "Moscow marks the apartment bombings that helped trigger public support for renewed war in Chechnya." }],
    "pankisi-gorge-crisis": [{ latlng: [42.24, 45.3], label: "Pankisi Gorge", type: "target", description: "Pankisi Gorge marks the Georgian border area where militants and refugees became an international concern." }],
    "2005-nalchik-raid": [{ latlng: [43.4853, 43.6071], label: "Nalchik", type: "target", description: "Nalchik marks the large 2005 raid showing the insurgency had spread beyond Chechnya." }],
    "international-and-human-dimensions": [{ latlng: [43.3178, 45.6986], label: "Grozny", type: "target", description: "Grozny marks the devastated urban center and the wider civilian cost of the second war." }],
    "outcome-and-legacy": [{ latlng: [43.3178, 45.6986], label: "Grozny", type: "target", description: "Grozny marks the reassertion of Russian federal control and the postwar Chechen administration." }],
  },
  "war-of-dagestan.generated.json": {
    "origins-and-road-to-war": [{ latlng: [42.65, 46.22], label: "Botlikh", type: "target", description: "Botlikh marks the Dagestani district first attacked by militants crossing from Chechnya." }],
    "international-and-human-dimensions": [{ latlng: [42.97, 47.4], label: "Karamakhi", type: "target", description: "Karamakhi marks the fortified village fighting and the civilian disruption caused by the campaign." }],
    "outcome-and-legacy": [{ latlng: [42.65, 46.22], label: "Botlikh", type: "target", description: "Botlikh marks the failed incursion whose aftermath helped trigger the Second Chechen War." }],
  },
};

async function load(file) {
  return JSON.parse(await readFile(join(drafts, file), "utf8"));
}

async function save(file, data) {
  await writeFile(join(drafts, file), `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function hasMapElement(event) {
  return Boolean(event.markers?.length || event.regions?.length || event.arrows?.length);
}

function describeMarker(file, event, marker) {
  const key = `${event.id}:${marker.label}`;
  return (
    markerDescriptions[file]?.[key] ||
    marker.description ||
    `${marker.label} is marked because it is a key location in ${event.title || "this event"}.`
  );
}

for (const file of files) {
  const data = await load(file);
  let changed = false;

  for (const event of data) {
    if (!hasMapElement(event)) {
      const markers = missingMapMarkers[file]?.[event.id];
      if (markers?.length) {
        event.markers = markers;
        changed = true;
      }
    }

    if (Array.isArray(event.markers)) {
      for (const marker of event.markers) {
        if (!marker.description) {
          marker.description = describeMarker(file, event, marker);
          changed = true;
        }
      }
    }
  }

  if (changed) await save(file, data);
  console.log(`${changed ? "updated" : "ok"} ${file}`);
}
