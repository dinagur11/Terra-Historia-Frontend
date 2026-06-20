import fs from "node:fs";
import path from "node:path";

const backendRoot = "C:/Users/alons/Terra-Historia-Backend";
const draftsDir = path.join(backendRoot, "deepdives-drafts");
const frontRoot = "C:/Users/alons/Terra-Historia/Terra-Historia";

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function updateEventImage(fileName, eventId, imageUrl) {
  const file = path.join(draftsDir, fileName);
  const events = readJson(file);
  const event = events.find((item) => item.id === eventId);
  if (!event) throw new Error(`Missing event ${eventId} in ${fileName}`);

  for (const slide of event.slides || []) {
    slide.img = imageUrl;
  }

  writeJson(file, events);
}

function updateMarkerDescription(fileName, eventId, description) {
  const file = path.join(draftsDir, fileName);
  const events = readJson(file);
  const event = events.find((item) => item.id === eventId);
  if (!event) throw new Error(`Missing event ${eventId} in ${fileName}`);

  for (const marker of event.markers || []) {
    marker.description = description;
  }

  writeJson(file, events);
}

function updateEventViews(fileName, viewsByEventId) {
  const file = path.join(draftsDir, fileName);
  const events = readJson(file);

  for (const [eventId, view] of Object.entries(viewsByEventId)) {
    const event = events.find((item) => item.id === eventId);
    if (!event) throw new Error(`Missing event ${eventId} in ${fileName}`);
    event.view = view;
  }

  writeJson(file, events);
}

function updateRelationships(file) {
  const data = readJson(file);

  data.nodes["laotian-civil-war"] = {
    ...data.nodes["laotian-civil-war"],
    x: 1325,
    y: 245,
  };
  data.nodes["vietnam-war"] = {
    ...data.nodes["vietnam-war"],
    x: 1325,
    y: 405,
  };
  data.nodes["cambodian-civil-war"] = {
    ...data.nodes["cambodian-civil-war"],
    x: 1325,
    y: 565,
  };
  data.nodes["third-indochina-war"] = {
    ...data.nodes["third-indochina-war"],
    x: 1640,
    y: 405,
  };

  data.relationships = data.relationships.filter(
    ({ from, to }) =>
      !(
        (from === "vietnam-war" && to === "laotian-civil-war") ||
        (from === "vietnam-war" && to === "cambodian-civil-war") ||
        (from === "korean-war" && to === "laotian-civil-war") ||
        (from === "korean-war" && to === "cambodian-civil-war") ||
        (from === "vietnam-war" && to === "third-indochina-war") ||
        (from === "laotian-civil-war" && to === "third-indochina-war") ||
        (from === "cambodian-civil-war" && to === "third-indochina-war")
      )
  );

  const insertAfter = data.relationships.findIndex(
    ({ from, to }) => from === "korean-war" && to === "vietnam-war"
  );
  const parallelRelationships = [
    {
      from: "korean-war",
      to: "laotian-civil-war",
      type: "coldWar",
      label: "Parallel covert front in Indochina",
    },
    {
      from: "korean-war",
      to: "cambodian-civil-war",
      type: "coldWar",
      label: "Regional escalation of the Vietnam conflict",
    },
    {
      from: "vietnam-war",
      to: "third-indochina-war",
      type: "regional",
      label: "Post-1975 Indochina wars",
    },
    {
      from: "laotian-civil-war",
      to: "third-indochina-war",
      type: "regional",
      label: "Postwar Laos and regional instability",
    },
    {
      from: "cambodian-civil-war",
      to: "third-indochina-war",
      type: "regional",
      label: "Khmer Rouge and Vietnamese intervention",
    },
  ];

  data.relationships.splice(insertAfter + 1, 0, ...parallelRelationships);
  writeJson(file, data);
}

updateEventImage(
  "vietnam-war.generated.json",
  "tet-offensive",
  "https://daily.jstor.org/wp-content/uploads/2018/01/north_vietnamese_soldiers_1050x700.jpg"
);
updateMarkerDescription(
  "vietnam-war.generated.json",
  "tet-offensive",
  "The Tet marker sits in South Vietnam to represent the nationwide 1968 offensive, when North Vietnamese and Viet Cong forces struck cities, bases, and provincial capitals to shock the US-backed war effort."
);
updateEventImage(
  "vietnam-war.generated.json",
  "my-lai-massacre",
  "https://www.pbs.org/wgbh/americanexperience/media/gallery_images/My-lai-gallery-17-3000_NAR.jpg"
);
updateEventImage(
  "vietnam-war.generated.json",
  "paris-peace-accords",
  "https://media.defense.gov/2023/Jan/27/2003151190/1200/1200/0/230127-Z-F3895-1001.JPG"
);

updateEventImage(
  "laotian-civil-war.generated.json",
  "battle-of-luang-namtha",
  "https://external-preview.redd.it/rare-footage-of-the-battle-of-luang-namtha-in-laos-1962-v0-enpkNWl2MWViYTNkMboIMREHTJytw6YkzaAspW7x-R7BmT-znz-_-NEdMulu.png?format=pjpg&auto=webp&s=d56383eaba836bf6ce2650f42080ac0f818aab91"
);
updateEventImage(
  "laotian-civil-war.generated.json",
  "battle-of-lak-sao",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Laos_1973-02_CIA.png"
);
updateEventImage(
  "laotian-civil-war.generated.json",
  "battle-of-nam-bac",
  "https://alchetron.com/cdn/laotian-civil-war-27cab1a8-75d8-425e-8ca6-cd35f502763-resize-750.jpeg"
);
updateEventImage(
  "laotian-civil-war.generated.json",
  "vientiane-treaty",
  "https://autourasia.com/uploads/Travel-Guide-Laos/laos-history/700-Laotian-Civil-War.jpg"
);
updateEventImage(
  "laotian-civil-war.generated.json",
  "1973-laotian-coup",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Damaged_Laotian_North_American_T-28D_aircraft_at_Luang_Prabang%2C_Laos%2C_in_1967_%28110329-F-XN622-002%29.jpg/250px-Damaged_Laotian_North_American_T-28D_aircraft_at_Luang_Prabang%2C_Laos%2C_in_1967_%28110329-F-XN622-002%29.jpg"
);

updateEventImage(
  "cambodian-civil-war.generated.json",
  "1970-cambodian-coup-d-tat",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNOrMLjhuwukPWCvX4wXpK_8Or-7nHQWwzaTB38XNgIT2Pb29h4Ls2ptct&s=10"
);
updateEventImage(
  "cambodian-civil-war.generated.json",
  "fall-of-phnom-penh",
  "https://m.media-amazon.com/images/I/91wbrn9+fHL._AC_UF1000,1000_QL80_.jpg"
);

updateEventViews("first-chechen-war.generated.json", {
  "origins-and-road-to-war": { center: [43.3178, 45.6986], zoom: 7 },
  "november-1994-battle-of-grozny": { center: [43.3178, 45.6986], zoom: 9 },
  "first-battle-of-grozny": { center: [43.316666666, 45.716666666], zoom: 9 },
  "samashki-massacre": { center: [43.29, 45.3], zoom: 10 },
  "budyonnovsk-hospital-hostage-crisis": { center: [44.7839, 44.1658], zoom: 10 },
  "kizlyar-pervomayskoye-hostage-crisis": { center: [43.84, 46.727694], zoom: 8 },
  "shatoy-ambush": { center: [42.869, 45.688], zoom: 10 },
  "august-1996-battle-of-grozny": { center: [43.316666666, 45.7], zoom: 9 },
  "khasavyurt-accord": { center: [43.25, 46.59], zoom: 10 },
  "international-and-human-dimensions": { center: [43.3178, 45.6986], zoom: 7 },
  "outcome-and-legacy": { center: [43.3178, 45.6986], zoom: 7 },
});

updateEventViews("second-chechen-war.generated.json", {
  "origins-and-road-to-war": { center: [43.3178, 45.6986], zoom: 7 },
  "1999-russian-apartment-bombings": { center: [55.7558, 37.6173], zoom: 9 },
  "battle-of-grozny": { center: [43.316666666, 45.7], zoom: 9 },
  "novye-aldi-massacre": { center: [43.268333333, 45.651111111], zoom: 11 },
  "battle-for-height-776": { center: [42.96305556, 45.80472222], zoom: 10 },
  "battle-of-komsomolskoye": { center: [43.06027778, 45.60388889], zoom: 10 },
  "pankisi-gorge-crisis": { center: [42.24, 45.3], zoom: 8 },
  "2005-nalchik-raid": { center: [43.4853, 43.6071], zoom: 10 },
  "insurgency-in-ingushetia": { center: [43.2, 45], zoom: 8 },
  "international-and-human-dimensions": { center: [43.3178, 45.6986], zoom: 7 },
  "outcome-and-legacy": { center: [43.3178, 45.6986], zoom: 7 },
});

updateEventViews("war-of-dagestan.generated.json", {
  "origins-and-road-to-war": { center: [42.65, 46.22], zoom: 8 },
  "battle-of-karamakhi": { center: [42.97, 47.4], zoom: 10 },
  "tsumadinsky-botlikhsky-campaign": { center: [42.65, 46.22], zoom: 9 },
  "battle-for-donkey-s-ear-height": { center: [42.7, 46.1], zoom: 10 },
  "wahhabi-capture-of-height-715-3": { center: [42.76, 46.18], zoom: 10 },
  "tukhchar-massacre": { center: [43.221667, 46.4125], zoom: 10 },
  "wahhabi-capture-of-novolakskoye": { center: [43.18, 46.49], zoom: 10 },
  "disaster-of-the-armavir-spetsnaz": { center: [42.76, 46.18], zoom: 10 },
  "international-and-human-dimensions": { center: [42.97, 47.4], zoom: 8 },
  "outcome-and-legacy": { center: [42.65, 46.22], zoom: 8 },
});

updateRelationships(path.join(backendRoot, "deepdive-relationships.json"));
updateRelationships(path.join(frontRoot, "src/constants/deepDiveRelationships.json"));

console.log("Applied Indochina, Vietnam, Laos, Cambodia, Chechen/Dagestan requested fixes.");
