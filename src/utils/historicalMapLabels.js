const GERMANY_LABEL_ALIASES = [
  "Germany",
  "German Empire",
  "German Reich",
  "Weimar Germany",
  "Weimar Republic",
  "Nazi Germany",
  "Third Reich",
];

export const HISTORICAL_MAP_CUSTOM_LABELS = [
  {
    name: "German Reich",
    yearStart: 1935,
    yearEnd: 1945,
    coordinates: [10.45, 51.1],
  },
];

export function getHistoricalGermanStateName(year) {
  const numericYear = Number.parseInt(year, 10);

  if (numericYear >= 1914 && numericYear <= 1918) return "German Empire";
  if (numericYear >= 1919 && numericYear <= 1933) return "Weimar Republic";
  if (numericYear >= 1934 && numericYear <= 1945) return "German Reich";
  return null;
}

export function getEnglishMapLabelExpression(year) {
  const englishName = [
    "coalesce",
    ["get", "name:en"],
    ["get", "name_en"],
    ["get", "official_name:en"],
    ["get", "official_name_en"],
    ["get", "short_name:en"],
    ["get", "short_name_en"],
    ["get", "int_name"],
    ["get", "name:latin"],
    ["get", "name"],
  ];
  const germanStateName = getHistoricalGermanStateName(year);

  if (!germanStateName) return englishName;

  return [
    "case",
    [
      "any",
      ["==", ["get", "osm_id"], 2091139956],
      ["in", englishName, ["literal", GERMANY_LABEL_ALIASES]],
    ],
    germanStateName,
    englishName,
  ];
}
