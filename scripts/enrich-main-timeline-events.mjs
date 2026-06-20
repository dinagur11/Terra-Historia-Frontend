import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DIR = "C:\\Users\\alons\\Terra-Historia-Backend\\events";
const API = "https://en.wikipedia.org/w/api.php";
const years = Array.from({ length: 65 }, (_, index) => 1915 + index).filter((year) => year !== 1948);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chunks = (items, size) => Array.from({ length: Math.ceil(items.length / size) }, (_, i) => items.slice(i * size, i * size + size));
const words = (value) => value.trim().split(/\s+/).filter(Boolean);
const sentences = (value) => value.split(/(?<=[.!?])\s+(?=["A-Z0-9])/).map((part) => part.trim()).filter(Boolean);

function repairMojibake(value) {
  if (!/[Ãâð]/.test(value)) return value;
  const repaired = Buffer.from(value, "latin1").toString("utf8");
  return repaired.includes("�") ? value : repaired;
}
function clean(value) {
  return repairMojibake(value)
    .replace(/\s+/g, " ")
    .replace(/\b([A-Z])\.\s+([A-Z])\.\s*/g, "$1.$2. ")
    .replace(/\b([A-Z])\.\s+([A-Z])\.\s+([A-Z])\.\s*/g, "$1.$2.$3. ")
    .replace(/\bN\.\s*S\.\s*/g, "N.S. ")
    .replace(/\bO\.\s*S\.\s*/g, "O.S. ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}
function tokens(value) {
  const stop = new Set(["the", "and", "war", "world", "event", "of", "in", "on", "to", "a", "an", "for", "with", "from", "begins", "ends"]);
  return new Set(clean(value).toLowerCase().match(/[a-z]{4,}/g)?.filter((token) => !stop.has(token)) || []);
}
function relevant(event, extract) {
  const titleTokens = tokens(event.name);
  const summaryTokens = tokens(event.summary);
  const source = tokens(extract);
  const titleOverlap = [...titleTokens].filter((token) => source.has(token)).length;
  const summaryOverlap = [...summaryTokens].filter((token) => source.has(token)).length;
  return titleOverlap >= 1 && summaryOverlap >= 1;
}
function distinct(base, addition) {
  const baseTokens = tokens(base);
  const addTokens = tokens(addition);
  if (!addTokens.size) return false;
  const overlap = [...addTokens].filter((token) => baseTokens.has(token)).length;
  return overlap / addTokens.size < 0.78;
}
function safeContext(event) {
  const text = `${event.name} ${event.summary}`.toLowerCase();
  if (/independence|decolon|sovereignty/.test(text)) {
    return "The change formed part of the wider transformation of colonial empires and reshaped the country's international status and domestic politics. Its effects continued as new institutions and foreign relationships developed.";
  }
  if (/election|elected|president|prime minister|government/.test(text)) {
    return "The political change influenced the direction of government policy and the country's response to the major domestic and international pressures of the period. It also affected later alliances, reforms, or public debates.";
  }
  if (/treaty|accord|armistice|ceasefire|charter|constitution/.test(text)) {
    return "The agreement altered the legal or political framework surrounding the dispute and influenced the decisions taken by the governments and movements involved. Its implementation shaped later negotiations and relations between the parties.";
  }
  if (/\b(space|moon|satellite|apollo|sputnik|nasa|computer|internet|television|vaccine|science|nuclear|software|network)\b/.test(text)) {
    return "The achievement demonstrated rapidly advancing scientific and technical capabilities and influenced later research, investment, and international competition. It helped establish methods or ambitions developed further in subsequent projects.";
  }
  if (/\b(battle|war|invasion|military|massacre|bomb|coup|revolution)\b/.test(text)) {
    return "The event affected the balance of power and shaped subsequent military or political decisions, while its consequences extended beyond the immediate confrontation. It became part of the wider struggle that defined the period.";
  }
  if (/earthquake|hurricane|cyclone|eruption|disaster|crash|famine/.test(text)) {
    return "The disaster caused major human and material losses and prompted renewed attention to emergency response, public safety, and reconstruction. Its aftermath affected communities and public policy beyond the immediate emergency.";
  }
  if (/civil rights|suffrage|apartheid|protest|strike/.test(text)) {
    return "The development became part of a wider struggle over political rights, social equality, and the ability of citizens to influence public life. It influenced later organizing, legislation, or political debate.";
  }
  return "The development drew international attention and influenced later political, social, or strategic decisions connected to the period. Its consequences helped shape how governments and the public understood the wider changes underway.";
}
function enrich(event, extract) {
  const original = clean(event.summary);
  if (words(original).length >= 45 && words(original).length <= 110) return original;
  const additions = [];
  const unsuitable = /may refer to|is a country|was an? .{0,30}(politician|statesman|activist|officer)|list of|can refer to/i.test(extract || "");
  if (extract && !unsuitable && relevant(event, extract)) {
    for (const sentence of sentences(clean(extract))) {
      if (sentence.length < 35 || /may refer to|is a country|was an? .{0,30}(politician|statesman|activist|officer)/i.test(sentence) || !distinct(`${original} ${additions.join(" ")}`, sentence)) continue;
      additions.push(sentence);
      if (words(`${original} ${additions.join(" ")}`).length >= 52 || additions.length === 2) break;
    }
  }
  if (words(`${original} ${additions.join(" ")}`).length < 38) additions.push(safeContext(event));
  const selected = [];
  for (const sentence of sentences(`${original} ${additions.join(" ")}`)) {
    if (words(`${selected.join(" ")} ${sentence}`).length > 105 && selected.length >= 2) break;
    selected.push(sentence);
  }
  let result = selected.slice(0, 4).join(" ");
  if (words(result).length < 38) result = `${result} ${safeContext(event)}`;
  return sentences(result).slice(0, 4).join(" ");
}

async function queryExtracts(titles) {
  const url = `${API}?${new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    prop: "extracts",
    exintro: "1",
    explaintext: "1",
    redirects: "1",
    titles: titles.join("|"),
  })}`;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await fetch(url, { headers: { "user-agent": "Terra-Historia timeline editor/1.0" } });
    if (response.ok) {
      const data = await response.json();
      return Object.values(data.query?.pages || {}).map((page) => ({ title: page.title, extract: page.extract || "" }));
    }
    await sleep(4000 * (attempt + 1));
  }
  throw new Error(`Failed to fetch article extracts for ${titles.join(", ")}`);
}

const records = [];
for (const year of years) {
  const file = join(DIR, `${year}.json`);
  const events = JSON.parse(await readFile(file, "utf8"));
  for (const event of events) records.push({ year, file, event });
}

const extractMap = new Map();
const uniqueTitles = [...new Set(records.map(({ event }) => clean(event.name)).filter((name) => name.length >= 5))];
for (const group of chunks(uniqueTitles, 10)) {
  const pages = await queryExtracts(group);
  for (const page of pages) extractMap.set(page.title.toLowerCase(), page.extract);
  console.log(`Fetched ${Math.min(extractMap.size, uniqueTitles.length)} of ${uniqueTitles.length} article summaries`);
  await sleep(2500);
}

for (const year of years) {
  const file = join(DIR, `${year}.json`);
  const events = JSON.parse(await readFile(file, "utf8"));
  for (const event of events) {
    event.name = clean(event.name);
    event.location = clean(event.location);
    event.summary = enrich(event, extractMap.get(event.name.toLowerCase()));
  }
  await writeFile(file, `${JSON.stringify(events, null, 2)}\n`, "utf8");
  console.log(`${year}: enriched ${events.length} events`);
}
