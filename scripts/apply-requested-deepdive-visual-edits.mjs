import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const backend = process.argv[2] ?? "C:\\Users\\alons\\Terra-Historia-Backend";
const drafts = join(backend, "deepdives-drafts");

const images = {
  wwii: {
    poland: "https://warsawinstitute.org/wp-content/uploads/2018/03/wir_infographic2018Warsaw-Institute.jpg",
    france: "https://www.english-heritage.org.uk/siteassets/home/visit/places-to-visit/dover-castle/history-and-stories/fall-of-france/germans-in-paris-1940.jpg?w=640&mode=none&scale=downscale&quality=60&anchor=&WebsiteVersion=20200219",
    britain: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Heinkel_He_111_during_the_Battle_of_Britain.jpg/250px-Heinkel_He_111_during_the_Battle_of_Britain.jpg",
    barbarossa: "https://www.historyhit.com/app/uploads/2018/07/Operation-barbarossa-alamy-750px.jpg",
  },
  russian: {
    "constituent-assembly": "https://static.lsm.lv/media/2018/01/large/1/8roy.jpg",
    "czechoslovak-legion": "https://upload.wikimedia.org/wikipedia/commons/0/0d/Traintop1.jpg",
  },
  winter: {
    "mainila-invasion": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Shells_addressed_to_Mainila.jpg/250px-Shells_addressed_to_Mainila.jpg",
    "mannerheim-line": "https://i.ytimg.com/vi/U5tHkDk4IIE/maxresdefault.jpg",
    "suomussalmi-raate": "https://battlefieldtravels.com/wp-content/uploads/2024/06/26232567_10155944258704477_1540845561015313497_o.jpg",
    "salla-kollaa": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/A_Finnish_guard_during_the_Battle_of_Salla.jpg/960px-A_Finnish_guard_during_the_Battle_of_Salla.jpg",
    "international-reaction": "https://i.imgur.com/WMqkRLJ.jpg",
    "soviet-reorganization": "https://upload.wikimedia.org/wikipedia/commons/b/b7/A_Finnish_Maxim_M-32_machine_gun_nest_during_the_Winter_War.jpg",
    "viborg-crisis": "https://warfarehistorynetwork.com/wp-content/uploads/2016/11/M-WinterWar-1-4C-Jun11-crop.jpg",
    "moscow-peace": "https://secure-images.rarenewspapers.com/ebayimgs/2.7.2012/image008.jpg",
    legacy: "https://media.iwm.org.uk/ciim5/31/414/super_000000.jpg",
  },
  continuation: {
    "interim-peace": "https://i.imgur.com/NDd2U1q.jpg",
    "operation-barbarossa": "https://preview.redd.it/this-day-in-1941-as-the-soviet-union-launched-air-raids-v0-b7x2ubhd0l771.jpg?auto=webp&s=f5a14bcd24c3a7d5a3240015edf44d9b7c145c49",
    "reconquest-karelia": "https://upload.wikimedia.org/wikipedia/commons/3/33/Karelian_Isthmus.png",
    "leningrad-front": "https://upload.wikimedia.org/wikipedia/commons/1/1e/1943_Leningrad_Front_%2830583363960%29.jpg",
    "east-karelia-occupation": "https://upload.wikimedia.org/wikipedia/commons/3/39/East_and_West_Karelias.png",
    "trench-war-1942": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Finnish_soldiers_1944.jpg",
    "soviet-offensive-1944": "https://www.ww2incolor.com/api/image/67c0856a-1575-47ba-ac68-5f0c8768dfed.false",
    "tali-ihantala": "https://upload.wikimedia.org/wikipedia/commons/9/9b/Tali-Ihantala.jpg",
    armistice: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/End_of_Soviet_Finland_war_1944.jpg/250px-End_of_Soviet_Finland_war_1944.jpg",
    legacy: "https://i.redd.it/b7x2ubhd0l771.jpg",
  },
};

function setEventImage(events, id, image) {
  const event = events.find((item) => item.id === id);
  if (!event) throw new Error(`Missing event: ${id}`);
  for (const slide of event.slides ?? []) slide.img = image;
}

async function update(file, mutate) {
  const path = join(drafts, file);
  const data = JSON.parse(await readFile(path, "utf8"));
  mutate(data);
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`);
}

await update("wwii-events.json", (events) => {
  for (const [id, image] of Object.entries(images.wwii)) setEventImage(events, id, image);
  const barbarossa = events.find((event) => event.id === "barbarossa");
  barbarossa.arrows = [
    {
      id: "central-drive-moscow",
      label: "German advance toward Moscow",
      color: "#e74c3c",
      coordinates: [[13.405, 52.52], [19.5, 52.2], [24.1, 53.9], [30.3, 54.7], [37.6173, 55.7558]],
    },
  ];
});

await update("russian-civil-war.json", (events) => {
  for (const [id, image] of Object.entries(images.russian)) setEventImage(events, id, image);
  events.find((event) => event.id === "foreign-intervention").regions = [];
});

await update("winter-war.json", (events) => {
  for (const [id, image] of Object.entries(images.winter)) setEventImage(events, id, image);
  const invasion = events.find((event) => event.id === "mainila-invasion");
  invasion.regions = [];
  invasion.arrows = [
    { id: "karelian-isthmus", label: "Toward Viipuri", color: "#c0392b", coordinates: [[30.35, 59.95], [29.95, 60.25], [29.2, 60.7], [28.75, 60.71]] },
    { id: "ladoga-karelia", label: "Toward Ladoga Karelia", color: "#c0392b", coordinates: [[32.4, 61.2], [31.3, 61.4], [30.2, 61.7]] },
    { id: "central-finland", label: "Toward Suomussalmi", color: "#c0392b", coordinates: [[31.6, 64.0], [30.2, 64.6], [28.9, 64.9]] },
    { id: "salla-front", label: "Toward Salla", color: "#c0392b", coordinates: [[31.2, 66.4], [29.5, 66.7], [28.65, 66.83]] },
  ];
  events.find((event) => event.id === "salla-kollaa").regions = [];
  events.find((event) => event.id === "moscow-peace").regions = [];
});

await update("continuation-war.json", (events) => {
  for (const [id, image] of Object.entries(images.continuation)) setEventImage(events, id, image);

  for (const id of ["interim-peace", "operation-barbarossa", "east-karelia-occupation", "armistice"]) {
    events.find((event) => event.id === id).regions = [];
  }

  const karelia = events.find((event) => event.id === "reconquest-karelia");
  karelia.regions = [{
    id: "karelian-isthmus",
    label: "Karelian Isthmus",
    color: "#3498db",
    opacity: 0.2,
    coordinates: [[28.1, 60.1], [30.4, 59.9], [31.0, 60.7], [30.4, 61.3], [28.6, 61.2], [28.1, 60.1]],
  }];

  const offensive = events.find((event) => event.id === "soviet-offensive-1944");
  offensive.view = { center: [61.0, 29.2], zoom: 5 };
  offensive.markers = [
    { latlng: [60.7108, 28.7528], label: "Viipuri / Vyborg", type: "target" },
    { latlng: [61.195, 29.52], label: "Tali-Ihantala sector", type: "minor" },
    { latlng: [61.79, 34.36], label: "Petrozavodsk", type: "minor" },
  ];
  offensive.regions = [{
    id: "vyborg-petrozavodsk-offensive",
    label: "Soviet offensive sectors",
    color: "#c0392b",
    opacity: 0.18,
    coordinates: [[27.9, 60.0], [31.0, 59.8], [34.9, 61.2], [35.2, 62.4], [32.0, 63.0], [28.7, 61.8], [27.9, 60.0]],
  }];
  offensive.arrows = [
    { id: "vyborg-drive", label: "Soviet drive toward Viipuri", color: "#c0392b", coordinates: [[30.35, 59.95], [29.8, 60.25], [29.2, 60.55], [28.7528, 60.7108]] },
    { id: "petrozavodsk-drive", label: "Svir-Petrozavodsk advance", color: "#c0392b", coordinates: [[34.3, 60.2], [34.5, 61.0], [34.36, 61.79]] },
  ];
});

console.log("Applied requested WWII, Russian Civil War, Winter War, and Continuation War visual edits.");
