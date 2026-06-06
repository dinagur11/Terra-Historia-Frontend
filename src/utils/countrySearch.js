import countriesTopology from "world-atlas/countries-110m.json";

export const COUNTRY_SEARCH_ALIASES = {
  "United States of America": ["United States", "USA", "U.S.A.", "US", "U.S."],
  "United Kingdom": ["UK", "U.K.", "Great Britain", "Britain"],
  "Czechia": ["Czech Republic"],
  "Dem. Rep. Congo": ["Democratic Republic of the Congo", "DR Congo", "DRC"],
  "Congo": ["Republic of the Congo"],
  "Dominican Rep.": ["Dominican Republic"],
  "Central African Rep.": ["Central African Republic"],
  "Eq. Guinea": ["Equatorial Guinea"],
  "Bosnia and Herz.": ["Bosnia and Herzegovina"],
  "S. Sudan": ["South Sudan"],
  "W. Sahara": ["Western Sahara"],
  eSwatini: ["Eswatini", "Swaziland"],
  "Cote d'Ivoire": ["Ivory Coast"],
  "Fr. S. Antarctic Lands": ["French Southern and Antarctic Lands"],
  "N. Cyprus": ["Northern Cyprus"],
  "Falkland Is.": ["Falkland Islands"],
  "Solomon Is.": ["Solomon Islands"],
};

export const HISTORICAL_SEARCH_TARGETS = [
  {
    name: "Roman Empire",
    aliases: ["Ancient Rome", "Rome", "Roman Republic"],
    yearStart: -753,
    yearEnd: 476,
    center: [12.4964, 41.9028],
    bounds: {
      minLng: -10,
      maxLng: 42,
      minLat: 28,
      maxLat: 56,
    },
  },
  {
    name: "Sparta",
    aliases: ["Lacedaemon", "Lakedaimon", "Spartan city-state"],
    yearStart: -900,
    yearEnd: -192,
    center: [22.4297, 37.0745],
    bounds: {
      minLng: 22.2,
      maxLng: 22.7,
      minLat: 36.9,
      maxLat: 37.2,
    },
  },
  {
    name: "Achaemenid Empire",
    aliases: ["Persian Empire", "First Persian Empire"],
    yearStart: -550,
    yearEnd: -330,
    center: [52.8916, 29.9356],
    bounds: {
      minLng: 20,
      maxLng: 78,
      minLat: 20,
      maxLat: 45,
    },
  },
  {
    name: "Macedonian Empire",
    aliases: ["Empire of Alexander", "Alexander's Empire"],
    yearStart: -336,
    yearEnd: -323,
    center: [35, 32],
    bounds: {
      minLng: 18,
      maxLng: 75,
      minLat: 22,
      maxLat: 43,
    },
  },
  {
    name: "Carthage",
    aliases: ["Carthaginian Empire", "Punic Empire"],
    yearStart: -814,
    yearEnd: -146,
    center: [10.3233, 36.8528],
    bounds: {
      minLng: -6,
      maxLng: 18,
      minLat: 30,
      maxLat: 42,
    },
  },
  {
    name: "Ptolemaic Kingdom",
    aliases: ["Ptolemaic Egypt"],
    yearStart: -305,
    yearEnd: -30,
    center: [29.9, 26.8],
    bounds: {
      minLng: 24,
      maxLng: 36,
      minLat: 22,
      maxLat: 32,
    },
  },
  {
    name: "Seleucid Empire",
    aliases: ["Seleucid Kingdom"],
    yearStart: -312,
    yearEnd: -63,
    center: [43, 34],
    bounds: {
      minLng: 28,
      maxLng: 72,
      minLat: 25,
      maxLat: 42,
    },
  },
  {
    name: "Ottoman Empire",
    aliases: ["Ottoman Turkey", "Ottomans"],
    yearStart: 1299,
    yearEnd: 1922,
    center: [35, 39],
    bounds: {
      minLng: 18,
      maxLng: 49,
      minLat: 12,
      maxLat: 46,
    },
  },
  {
    name: "German Empire",
    aliases: ["Imperial Germany", "Second Reich"],
    yearStart: 1871,
    yearEnd: 1918,
    center: [10.5, 51],
    bounds: {
      minLng: 5.8,
      maxLng: 23,
      minLat: 47,
      maxLat: 56,
    },
  },
  {
    name: "Austria-Hungary",
    aliases: ["Austro-Hungarian Empire", "Habsburg Empire"],
    yearStart: 1867,
    yearEnd: 1918,
    center: [16.5, 47.5],
    bounds: {
      minLng: 9,
      maxLng: 26.5,
      minLat: 42,
      maxLat: 51.5,
    },
  },
  {
    name: "Russian Empire",
    aliases: ["Imperial Russia", "Tsarist Russia"],
    yearStart: 1721,
    yearEnd: 1917,
    center: [50, 57],
    bounds: {
      minLng: 19,
      maxLng: 180,
      minLat: 35,
      maxLat: 78,
    },
  },
  {
    name: "Kingdom of Italy",
    aliases: ["Italian Kingdom"],
    yearStart: 1861,
    yearEnd: 1946,
    center: [12.5, 42.8],
    bounds: {
      minLng: 6,
      maxLng: 19,
      minLat: 35,
      maxLat: 48,
    },
  },
  {
    name: "Weimar Republic",
    aliases: ["Weimar Germany"],
    yearStart: 1918,
    yearEnd: 1933,
    center: [10.5, 51],
    bounds: {
      minLng: 5.8,
      maxLng: 22.9,
      minLat: 47,
      maxLat: 55.2,
    },
  },
  {
    name: "Nazi Germany",
    aliases: ["Third Reich", "German Reich"],
    yearStart: 1933,
    yearEnd: 1945,
    center: [10.5, 51],
    bounds: {
      minLng: 5.8,
      maxLng: 24.2,
      minLat: 46.5,
      maxLat: 55.2,
    },
  },
  {
    name: "Soviet Union",
    aliases: ["USSR", "U.S.S.R.", "Union of Soviet Socialist Republics"],
    yearStart: 1922,
    yearEnd: 1991,
    center: [60, 57],
    bounds: {
      minLng: 19,
      maxLng: 180,
      minLat: 35,
      maxLat: 78,
    },
  },
  {
    name: "Czechoslovakia",
    aliases: ["Czecho-Slovakia"],
    yearStart: 1918,
    yearEnd: 1992,
    center: [16.5, 49],
    bounds: {
      minLng: 12,
      maxLng: 23,
      minLat: 47.5,
      maxLat: 51.2,
    },
  },
  {
    name: "Yugoslavia",
    aliases: ["Kingdom of Yugoslavia", "Socialist Yugoslavia"],
    yearStart: 1918,
    yearEnd: 1992,
    center: [20.5, 44],
    bounds: {
      minLng: 13,
      maxLng: 23.5,
      minLat: 40,
      maxLat: 47,
    },
  },
  {
    name: "East Germany",
    aliases: ["German Democratic Republic", "GDR"],
    yearStart: 1949,
    yearEnd: 1990,
    center: [12.5, 52],
    bounds: {
      minLng: 9.8,
      maxLng: 15.1,
      minLat: 50.2,
      maxLat: 54.8,
    },
  },
  {
    name: "West Germany",
    aliases: ["Federal Republic of Germany", "FRG"],
    yearStart: 1949,
    yearEnd: 1990,
    center: [9, 51],
    bounds: {
      minLng: 5.8,
      maxLng: 13.8,
      minLat: 47.2,
      maxLat: 55.1,
    },
  },
  {
    name: "British Empire",
    aliases: ["British colonial empire"],
    yearStart: 1607,
    yearEnd: 1997,
    center: [-2, 54],
    bounds: {
      minLng: -11,
      maxLng: 3,
      minLat: 49,
      maxLat: 61,
    },
  },
];

let countrySearchIndex = null;
let countrySearchEntries = null;

export function normalizeCountrySearch(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/^the\s+/, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function decodeArc(topology, arcIndex) {
  const arc = topology.arcs[arcIndex < 0 ? ~arcIndex : arcIndex];
  const points = [];
  const { scale, translate } = topology.transform;
  let x = 0;
  let y = 0;

  for (const point of arc) {
    x += point[0];
    y += point[1];
    points.push([
      x * scale[0] + translate[0],
      y * scale[1] + translate[1],
    ]);
  }

  return arcIndex < 0 ? points.reverse() : points;
}

function decodeRing(topology, ring) {
  return ring.flatMap((arcIndex, index) => {
    const points = decodeArc(topology, arcIndex);
    return index === 0 ? points : points.slice(1);
  });
}

function getGeometryRings(topology, geometry) {
  if (geometry.type === "Polygon") {
    return geometry.arcs.map(ring => decodeRing(topology, ring));
  }

  if (geometry.type === "MultiPolygon") {
    return geometry.arcs.flatMap(polygon => polygon.map(ring => decodeRing(topology, ring)));
  }

  return [];
}

function getRingArea(ring) {
  let area = 0;
  for (let i = 0; i < ring.length; i += 1) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area / 2);
}

function getRingCenter(ring) {
  const bounds = getRingBounds(ring);

  return [
    (bounds.minLng + bounds.maxLng) / 2,
    (bounds.minLat + bounds.maxLat) / 2,
  ];
}

function getRingBounds(ring) {
  return ring.reduce(
    (acc, [lng, lat]) => ({
      minLng: Math.min(acc.minLng, lng),
      maxLng: Math.max(acc.maxLng, lng),
      minLat: Math.min(acc.minLat, lat),
      maxLat: Math.max(acc.maxLat, lat),
    }),
    { minLng: Infinity, maxLng: -Infinity, minLat: Infinity, maxLat: -Infinity }
  );
}

function buildCountrySearchData() {
  if (countrySearchIndex && countrySearchEntries) {
    return { index: countrySearchIndex, entries: countrySearchEntries };
  }

  const index = new Map();
  const entries = [];
  const geometries = countriesTopology.objects.countries.geometries;

  for (const geometry of geometries) {
    const name = geometry.properties?.name;
    if (!name) continue;

    const rings = getGeometryRings(countriesTopology, geometry);
    const largestRing = rings.reduce((largest, ring) => {
      if (!largest) return ring;
      return getRingArea(ring) > getRingArea(largest) ? ring : largest;
    }, null);

    if (!largestRing?.length) continue;

    const country = {
      type: "modern",
      name,
      center: getRingCenter(largestRing),
      bounds: getRingBounds(largestRing),
    };
    const aliases = COUNTRY_SEARCH_ALIASES[name] || [];
    const searchableNames = [name, ...aliases];

    searchableNames.forEach(alias => {
      index.set(normalizeCountrySearch(alias), country);
    });

    entries.push({
      type: "modern",
      name,
      aliases,
      yearStart: -Infinity,
      yearEnd: Infinity,
      normalizedNames: searchableNames.map(normalizeCountrySearch),
    });
  }

  HISTORICAL_SEARCH_TARGETS.forEach(target => {
    const searchableNames = [target.name, ...target.aliases];
    const country = {
      type: "historical",
      name: target.name,
      center: target.center,
      bounds: target.bounds,
      yearStart: target.yearStart,
      yearEnd: target.yearEnd,
    };

    searchableNames.forEach(alias => {
      index.set(normalizeCountrySearch(alias), country);
    });

    entries.push({
      type: "historical",
      name: target.name,
      aliases: target.aliases,
      yearStart: target.yearStart,
      yearEnd: target.yearEnd,
      normalizedNames: searchableNames.map(normalizeCountrySearch),
    });
  });

  countrySearchIndex = index;
  countrySearchEntries = entries.sort((a, b) => a.name.localeCompare(b.name));

  return { index: countrySearchIndex, entries: countrySearchEntries };
}

export function resolveCountrySearch(query) {
  return buildCountrySearchData().index.get(normalizeCountrySearch(query)) || null;
}

export function getCountrySearchSuggestions(query, year = null, limit = 6) {
  const normalizedQuery = normalizeCountrySearch(query);
  if (!normalizedQuery) return [];
  const numericYear = typeof year === "number" ? year : null;

  return buildCountrySearchData()
    .entries.filter(entry => {
      const isYearMatch =
        numericYear === null ||
        entry.type === "modern" ||
        (numericYear >= entry.yearStart && numericYear <= entry.yearEnd);

      return isYearMatch && entry.normalizedNames.some(name => name.startsWith(normalizedQuery));
    })
    .slice(0, limit)
    .map(entry => entry.name);
}
