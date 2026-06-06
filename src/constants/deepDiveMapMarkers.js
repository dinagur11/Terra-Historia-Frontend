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
      },
    ],
  },
};

export const OVERRIDE_VIEWS_BY_TIMELINE = {
  "korean-war": {
    "first-battle-of-seoul": {
      center: [37.5665, 126.978],
      zoom: 8,
    },
  },
};

export const HIDDEN_REGIONS_BY_TIMELINE = {
  "wwi-events": new Set(["sarajevo"]),
  "wwii-events": new Set(["france"]),
};

export const OVERRIDE_REGIONS_BY_TIMELINE = {};

export const DIVISION_LINES_BY_TIMELINE = {};
