const GERMANY_LABEL_ALIASES = [
  "Germany",
  "German Empire",
  "German Reich",
  "Weimar Germany",
  "Weimar Republic",
  "Nazi Germany",
  "Third Reich",
];

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
  const numericYear = Number.parseInt(year, 10);
  let germanStateName = null;

  if (numericYear >= 1914 && numericYear <= 1918) {
    germanStateName = "German Empire";
  } else if (numericYear >= 1919 && numericYear <= 1933) {
    germanStateName = "Weimar Republic";
  } else if (numericYear >= 1934 && numericYear <= 1945) {
    germanStateName = "German Reich";
  }

  if (!germanStateName) return englishName;

  return [
    "case",
    ["in", englishName, ["literal", GERMANY_LABEL_ALIASES]],
    germanStateName,
    englishName,
  ];
}
