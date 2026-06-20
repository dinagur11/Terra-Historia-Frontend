export const FALLBACK_MARKERS_BY_TIMELINE = {
  "wwii-events": {
    poland: [
      { latlng: [52.23, 21.01], label: "Warsaw", type: "target" },
      { latlng: [54.41, 18.67], label: "Westerplatte", type: "minor" },
      { latlng: [52.1, 23.7], label: "Brest-Litovsk", type: "minor" },
    ],
    barbarossa: [
      { latlng: [55.75, 37.62], label: "Moscow", type: "target" },
      { latlng: [53.9, 27.56], label: "Minsk", type: "minor" },
      { latlng: [50.45, 30.52], label: "Kyiv", type: "minor" },
      { latlng: [54.78, 32.05], label: "Smolensk", type: "minor" },
      { latlng: [59.93, 30.34], label: "Leningrad", type: "minor" },
    ],
    stalingrad: [
      { latlng: [48.71, 44.51], label: "Stalingrad", type: "target" },
      { latlng: [47.24, 39.71], label: "Rostov-on-Don", type: "minor" },
      { latlng: [51.67, 39.21], label: "Voronezh", type: "minor" },
    ],
  },
};

export const OVERRIDE_MARKERS_BY_TIMELINE = {
  "wwii-events": {
    france: [
      {
        latlng: [51.034, 2.376],
        label: "Dunkirk",
        type: "target",
        description:
          "Dunkirk marks Operation Dynamo, where Allied troops were evacuated across the Channel as German forces closed in during the Fall of France.",
      },
      {
        latlng: [48.86, 2.35],
        label: "Fall of Paris",
        type: "target",
        image: {
          src: "https://commons.wikimedia.org/wiki/Special:FilePath/Adolf_Hitler%2C_Eiffel_Tower%2C_Paris_23_June_1940.jpg",
          alt: "Adolf Hitler and his entourage visiting the Eiffel Tower in Paris on 23 June 1940",
          caption: "Hitler at the Eiffel Tower, Paris, 23 June 1940",
        },
      },
    ],
  },
  "korean-war": {
    "first-battle-of-seoul": [
      {
        latlng: [37.5665, 126.978],
        label: "Seoul",
        type: "target",
        description:
          "Seoul marks the South Korean capital seized by North Korean forces in the opening days of the Korean War.",
      },
    ],
  },
};

export const OVERRIDE_VIEWS_BY_TIMELINE = {
  "first-chechen-war": {
    "origins-and-road-to-war": {
      center: [43.3178, 45.6986],
      zoom: 7,
    },
    "november-1994-battle-of-grozny": {
      center: [43.3178, 45.6986],
      zoom: 9,
    },
    "first-battle-of-grozny": {
      center: [43.316666666, 45.716666666],
      zoom: 9,
    },
    "samashki-massacre": {
      center: [43.29, 45.3],
      zoom: 10,
    },
    "budyonnovsk-hospital-hostage-crisis": {
      center: [44.7839, 44.1658],
      zoom: 10,
    },
    "kizlyar-pervomayskoye-hostage-crisis": {
      center: [43.84, 46.727694],
      zoom: 8,
    },
    "shatoy-ambush": {
      center: [42.869, 45.688],
      zoom: 10,
    },
    "august-1996-battle-of-grozny": {
      center: [43.316666666, 45.7],
      zoom: 9,
    },
    "khasavyurt-accord": {
      center: [43.25, 46.59],
      zoom: 10,
    },
    "international-and-human-dimensions": {
      center: [43.3178, 45.6986],
      zoom: 7,
    },
    "outcome-and-legacy": {
      center: [43.3178, 45.6986],
      zoom: 7,
    },
  },
  "korean-war": {
    "first-battle-of-seoul": {
      center: [37.5665, 126.978],
      zoom: 8,
    },
    "battle-of-osan": {
      center: [37.185, 127.053],
      zoom: 8,
    },
    "battle-of-taejon": {
      center: [36.47472222, 127.27277778],
      zoom: 8,
    },
    "tunam-massacre": {
      center: [36.428511, 127.295006],
      zoom: 9,
    },
    "battle-of-pusan-perimeter": {
      center: [35.1, 129.040277777],
      zoom: 7,
    },
    "battle-of-inchon": {
      center: [37.476111111, 126.602777777],
      zoom: 9,
    },
    "battle-of-the-ch-ongch-on-river": {
      center: [39.71, 125.84],
      zoom: 7,
    },
    "battle-of-changjin-reservoir": {
      center: [40.37, 127.26],
      zoom: 7,
    },
  },
  "second-chechen-war": {
    "origins-and-road-to-war": {
      center: [43.3178, 45.6986],
      zoom: 7,
    },
    "1999-russian-apartment-bombings": {
      center: [55.7558, 37.6173],
      zoom: 9,
    },
    "battle-of-grozny": {
      center: [43.316666666, 45.7],
      zoom: 9,
    },
    "novye-aldi-massacre": {
      center: [43.268333333, 45.651111111],
      zoom: 11,
    },
    "battle-for-height-776": {
      center: [42.96305556, 45.80472222],
      zoom: 10,
    },
    "battle-of-komsomolskoye": {
      center: [43.06027778, 45.60388889],
      zoom: 10,
    },
    "pankisi-gorge-crisis": {
      center: [42.24, 45.3],
      zoom: 8,
    },
    "2005-nalchik-raid": {
      center: [43.4853, 43.6071],
      zoom: 10,
    },
    "insurgency-in-ingushetia": {
      center: [43.2, 45],
      zoom: 8,
    },
    "international-and-human-dimensions": {
      center: [43.3178, 45.6986],
      zoom: 7,
    },
    "outcome-and-legacy": {
      center: [43.3178, 45.6986],
      zoom: 7,
    },
  },
  "war-of-dagestan": {
    "origins-and-road-to-war": {
      center: [42.65, 46.22],
      zoom: 8,
    },
    "battle-of-karamakhi": {
      center: [42.97, 47.4],
      zoom: 10,
    },
    "tsumadinsky-botlikhsky-campaign": {
      center: [42.65, 46.22],
      zoom: 9,
    },
    "battle-for-donkey-s-ear-height": {
      center: [42.7, 46.1],
      zoom: 10,
    },
    "wahhabi-capture-of-height-715-3": {
      center: [42.76, 46.18],
      zoom: 10,
    },
    "tukhchar-massacre": {
      center: [43.221667, 46.4125],
      zoom: 10,
    },
    "wahhabi-capture-of-novolakskoye": {
      center: [43.18, 46.49],
      zoom: 10,
    },
    "disaster-of-the-armavir-spetsnaz": {
      center: [42.76, 46.18],
      zoom: 10,
    },
    "international-and-human-dimensions": {
      center: [42.97, 47.4],
      zoom: 8,
    },
    "outcome-and-legacy": {
      center: [42.65, 46.22],
      zoom: 8,
    },
  },
};

export const HIDDEN_REGIONS_BY_TIMELINE = {
  "wwi-events": new Set(["sarajevo"]),
  "wwii-events": new Set(),
};

export const OVERRIDE_REGIONS_BY_TIMELINE = {};

export const DIVISION_LINES_BY_TIMELINE = {};
