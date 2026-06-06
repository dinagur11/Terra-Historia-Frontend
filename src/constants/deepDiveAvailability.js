const HIDDEN_DEEP_DIVE_IDS = new Set([
  "bangladesh-liberation-war",
]);

export function isDeepDiveAvailable(id) {
  return !HIDDEN_DEEP_DIVE_IDS.has(id);
}
