export const HISTORICAL_MAP_CUSTOM_LABELS = [
  {
    name: "German Reich",
    yearStart: 1938,
    yearEnd: 1944,
    coordinates: [10.45, 51.1],
  },
];

export function getEnglishMapLabelExpression() {
  return [
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
}