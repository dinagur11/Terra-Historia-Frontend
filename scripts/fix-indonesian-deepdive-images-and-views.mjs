import { readFile, writeFile } from "node:fs/promises";

const PATH =
  "C:\\Users\\alons\\Terra-Historia-Backend\\deepdives-drafts\\indonesian-national-revolution.generated.json";

const imageUpdates = {
  "origins-and-road-to-war":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/COLLECTIE_TROPENMUSEUM_%27Javaanse_Revolutionairen_strijden_voor_onafhankelijkheid._Ze_zijn_voor_het_merendeel_bewapend_met_bamboesperen_de_enkele_geweren_zijn_afkomstig_van_Japanners%27_TMnr_10001495.jpg/250px-thumbnail.jpg",
  "battle-of-medan":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Medan_bij_de_bezetting_van_Baoengan_maakten_onze_troepen_een_aantal_gevangenen%2C_Bestanddeelnr_7557.jpg/1920px-Medan_bij_de_bezetting_van_Baoengan_maakten_onze_troepen_een_aantal_gevangenen%2C_Bestanddeelnr_7557.jpg",
  "3-july-affair":
    "https://upload.wikimedia.org/wikipedia/commons/8/86/Sutan_Sjahrir%2C_10_Orang_Indonesia_Terbesar_Sekarang_%281952%29%2C_p136.jpg",
  "international-and-human-dimensions":
    "https://commons.wikimedia.org/wiki/Special:FilePath/IWM-SE-5865-tank-Surabaya-19451127.jpg",
  "outcome-and-legacy":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Indonesia_declaration_of_independence_17_August_1945.jpg/250px-Indonesia_declaration_of_independence_17_August_1945.jpg",
};

const viewUpdates = {
  "origins-and-road-to-war": { center: [-7.0, 108.6], zoom: 6 },
  "battle-of-surabaya": { center: [-7.2575, 112.7521], zoom: 10 },
  "battle-of-ambarawa": { center: [-7.263, 110.405], zoom: 9 },
  "battle-of-medan": { center: [3.5952, 98.6722], zoom: 9 },
  "3-july-affair": { center: [-7.69, 110.6], zoom: 8 },
  "police-actions-indonesia": { center: [-4.5, 108.5], zoom: 5 },
  "operation-kraai": { center: [-7.792, 110.4], zoom: 10 },
  "rengat-massacre": { center: [-0.375, 102.5469], zoom: 10 },
  "1-march-general-offensive": { center: [-7.798, 110.368], zoom: 10 },
  "international-and-human-dimensions": { center: [-3.0, 113.0], zoom: 5 },
  "outcome-and-legacy": { center: [-7.0, 108.6], zoom: 6 },
};

const events = JSON.parse((await readFile(PATH, "utf8")).replace(/^\uFEFF/, ""));

for (const event of events) {
  const image = imageUpdates[event.id];
  if (image) {
    for (const slide of event.slides || []) {
      slide.img = image;
      slide.cap = `Visual reference for ${event.title}.`;
    }
  }
  if (viewUpdates[event.id]) event.view = viewUpdates[event.id];
}

await writeFile(PATH, `${JSON.stringify(events, null, 2)}\n`, "utf8");
console.log("Updated Indonesian National Revolution images and event views.");
