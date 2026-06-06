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
  if (name === "German Reich") {
    if (year < 1918) return "german-empire";
    if (year < 1933) return "weimar-republic";
    return "nazi-germany";
  }
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
