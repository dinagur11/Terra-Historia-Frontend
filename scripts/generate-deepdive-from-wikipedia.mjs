#!/usr/bin/env node

import { mkdir, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const WIKIDATA_API = "https://www.wikidata.org/w/api.php";
const WIKIDATA_SPARQL = "https://query.wikidata.org/sparql";
const DEFAULT_USER_AGENT =
  "Terra-Historia/1.0 (educational deep-dive generator; Wikimedia attribution preserved)";

const args = readOptions(process.argv.slice(2));

if (args.help) {
  showHelp();
  process.exit(0);
}

const language = String(args.language ?? "en").toLowerCase();
if (!/^[a-z][a-z0-9-]{1,11}$/.test(language)) {
  stop(`Invalid --language value: ${language}`);
}

const eventLimit = readWholeNumber(args["event-limit"] ?? 12, "--event-limit", 1, 40);
const requestDelay = readWholeNumber(args.delay ?? 250, "--delay", 0, 10_000);
const startYear = readOptionalNumber(args["start-year"], "--start-year");
const endYear = readOptionalNumber(args["end-year"], "--end-year");
const overwrite = Boolean(args.overwrite);
const retrievedAt = new Date().toISOString();
const userAgent = process.env.WIKIMEDIA_USER_AGENT || DEFAULT_USER_AGENT;

if (!args.title && !args.qid) {
  stop("Provide either --title=\"Conflict name\" or --qid=Q12345. Use --help for examples.");
}

if (args.qid && !/^Q\d+$/i.test(String(args.qid))) {
  stop(`Invalid Wikidata item ID: ${args.qid}`);
}

console.log("Resolving the conflict in Wikidata...");
const conflict = args.qid
  ? await loadWikidataItem(String(args.qid).toUpperCase(), language)
  : await findConflict(String(args.title), language);

if (!conflict?.id) {
  stop(`No Wikidata item was found for "${args.title ?? args.qid}".`);
}

const title = String(args.title || conflict.label || conflict.id);
const id = makeSlug(String(args.id || title));
const outputPath = resolve(
  String(args.output || `deepdives-drafts/${id}.wikipedia.generated.json`),
);
const provenancePath = outputPath.replace(/\.json$/i, ".sources.json");

console.log(`Collecting structured events for ${title} (${conflict.id})...`);
const [conflictRow, rawEventRows] = await Promise.all([
  fetchConflictDetails(conflict.id, language),
  fetchConflictEvents(conflict.id, language, Math.max(eventLimit * 5, 50)),
]);

const selectedRows = chooseBestEvents(rawEventRows, {
  eventLimit,
  startYear,
  endYear,
});

console.log(`Fetching ${selectedRows.length + 1} Wikipedia lead summaries...`);
const conflictArticleTitle =
  getWikipediaTitle(conflictRow?.article) || conflict.label || title;
const conflictSummary = await fetchWikipediaSummary(conflictArticleTitle, language);
await wait(requestDelay);

const extractedEvents = [];
for (const [index, row] of selectedRows.entries()) {
  const wikiTitle = getWikipediaTitle(row.article) || row.eventLabel;
  process.stdout.write(`  [${index + 1}/${selectedRows.length}] ${row.eventLabel}\n`);

  let lead = null;
  try {
    lead = await fetchWikipediaSummary(wikiTitle, language);
  } catch (error) {
    console.warn(`    Wikipedia summary unavailable: ${error.message}`);
  }

  extractedEvents.push(createTimelineEvent(row, lead, title, retrievedAt));
  if (index < selectedRows.length - 1) await wait(requestDelay);
}

const openingEvent = createOverview({
  conflict,
  conflictRow,
  conflictSummary,
  fallbackStart: selectedRows[0]?.date,
  title,
  retrievedAt,
});

const events = [openingEvent, ...extractedEvents]
  .filter(Boolean)
  .sort((left, right) => {
    if (left.id === "conflict-overview") return -1;
    if (right.id === "conflict-overview") return 1;
    return left.date.localeCompare(right.date) || left.title.localeCompare(right.title);
  });

const validation = checkDeepDive(events);
if (validation.errors.length) {
  for (const error of validation.errors) console.error(`ERROR: ${error}`);
  stop("The generated draft did not pass schema validation; no files were written.");
}
for (const warning of validation.warnings) console.warn(`WARNING: ${warning}`);

const provenance = createSourceReport({
  conflict,
  title,
  language,
  retrievedAt,
  events,
  generatorOptions: { eventLimit, startYear, endYear },
});

if (args.preview) {
  console.log(JSON.stringify(events, null, 2));
  console.log("\nPreview complete; no files were written.");
  process.exit(0);
}

await saveJson(outputPath, events, overwrite);
await saveJson(provenancePath, provenance, overwrite);

console.log(`\nWrote ${events.length} events to ${outputPath}`);
console.log(`Wrote source manifest to ${provenancePath}`);
console.log("This is a sourced draft. Review dates, selection, wording, and contested claims before publishing.");

function readOptions(values) {
  const result = {};
  for (const value of values) {
    if (!value.startsWith("--")) stop(`Unexpected positional argument: ${value}`);
    const [rawKey, ...rest] = value.slice(2).split("=");
    const key = rawKey.trim();
    result[key] = rest.length ? rest.join("=") : true;
  }
  return result;
}

function showHelp() {
  console.log(`
Generate a sourced Terra Historia deep-dive draft from Wikipedia and Wikidata.

Required (choose one):
  --title="NAME"          Search Wikidata for a conflict by name
  --qid=Q12345           Use an exact Wikidata item ID

Options:
  --id=SLUG              Override the generated deep-dive ID
  --output=PATH          Output JSON path (default: deepdives-drafts/<id>.wikipedia.generated.json)
  --event-limit=N        Maximum chronological events (default: 12; maximum: 40)
  --language=CODE        Wikipedia language edition (default: en)
  --start-year=YEAR      Exclude events before this year
  --end-year=YEAR        Exclude events after this year
  --delay=MS             Delay between Wikipedia requests (default: 250)
  --preview              Print JSON without writing files
  --overwrite            Permit replacement of existing output files
  --help                 Show this message

Environment:
  WIKIMEDIA_USER_AGENT   Optional identifying User-Agent for Wikimedia requests

Outputs:
  1. A JSON array compatible with the Terra Historia deep-dive event schema.
  2. A sibling *.sources.json manifest containing attribution and retrieval metadata.
`);
}

async function findConflict(search, lang) {
  const data = await requestJson(WIKIDATA_API, {
    action: "wbsearchentities",
    search,
    language: lang,
    uselang: lang,
    type: "item",
    limit: "5",
    format: "json",
    origin: "*",
  });

  const exact = data.search?.find(
    (item) => item.label?.localeCompare(search, undefined, { sensitivity: "accent" }) === 0,
  );
  return exact || data.search?.[0] || null;
}

async function loadWikidataItem(qid, lang) {
  const data = await requestJson(WIKIDATA_API, {
    action: "wbgetentities",
    ids: qid,
    languages: `${lang}|en`,
    props: "labels|descriptions",
    format: "json",
    origin: "*",
  });
  const entity = data.entities?.[qid];
  if (!entity || entity.missing !== undefined) return null;
  return {
    id: qid,
    label: entity.labels?.[lang]?.value || entity.labels?.en?.value || qid,
    description:
      entity.descriptions?.[lang]?.value || entity.descriptions?.en?.value || "",
  };
}

async function fetchConflictDetails(qid, lang) {
  const query = `
SELECT ?start ?end ?coord ?image ?article WHERE {
  VALUES ?conflict { wd:${qid} }
  OPTIONAL { ?conflict wdt:P580 ?start. }
  OPTIONAL { ?conflict wdt:P582 ?end. }
  OPTIONAL { ?conflict wdt:P625 ?coord. }
  OPTIONAL { ?conflict wdt:P18 ?image. }
  OPTIONAL {
    ?article schema:about ?conflict;
             schema:isPartOf <https://${lang}.wikipedia.org/>.
  }
}
LIMIT 1`;
  return (await queryWikidata(query))[0] || null;
}

async function fetchConflictEvents(qid, lang, queryLimit) {
  const query = `
SELECT DISTINCT ?event ?eventLabel ?date ?end ?coord ?image ?article ?sitelinks WHERE {
  VALUES ?conflict { wd:${qid} }
  ?event (wdt:P361|wdt:P1344) ?conflict;
         (wdt:P585|wdt:P580) ?date.
  FILTER(?event != ?conflict)
  OPTIONAL { ?event wdt:P582 ?end. }
  OPTIONAL { ?event wdt:P625 ?coord. }
  OPTIONAL { ?event wdt:P18 ?image. }
  OPTIONAL { ?event wikibase:sitelinks ?sitelinks. }
  OPTIONAL {
    ?article schema:about ?event;
             schema:isPartOf <https://${lang}.wikipedia.org/>.
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "${lang},en". }
}
ORDER BY DESC(?sitelinks)
LIMIT ${queryLimit}`;
  return queryWikidata(query);
}

async function queryWikidata(query) {
  const body = new URLSearchParams({ query, format: "json" });
  const data = await requestWithRetry(WIKIDATA_SPARQL, {
    method: "POST",
    headers: {
      Accept: "application/sparql-results+json",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body,
  });
  const json = await data.json();
  return (json.results?.bindings || []).map(readQueryResult);
}

async function fetchWikipediaSummary(titleOrUrl, lang) {
  if (!titleOrUrl) return null;
  const title = getWikipediaTitle(titleOrUrl) || titleOrUrl;
  const api = `https://${lang}.wikipedia.org/w/api.php`;
  const data = await requestJson(api, {
    action: "query",
    prop: "extracts|pageimages|info",
    titles: title,
    redirects: "1",
    exintro: "1",
    explaintext: "1",
    piprop: "original",
    inprop: "url",
    format: "json",
    origin: "*",
  });
  const page = Object.values(data.query?.pages || {})[0];
  if (!page || page.missing !== undefined) return null;
  return {
    title: page.title,
    extract: tidyText(page.extract || ""),
    url: page.fullurl || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
    image: page.original?.source || "",
  };
}

async function requestJson(baseUrl, params) {
  const url = `${baseUrl}?${new URLSearchParams(params)}`;
  const response = await requestWithRetry(url, { headers: { Accept: "application/json" } });
  return response.json();
}

async function requestWithRetry(url, options = {}) {
  let lastError;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: { "User-Agent": userAgent, ...options.headers },
        signal: AbortSignal.timeout(30_000),
      });
      if (response.ok) return response;

      const retryable = response.status === 429 || response.status >= 500;
      const message = `${response.status} ${response.statusText}`;
      if (!retryable) throw new Error(`Wikimedia request failed: ${message}`);

      const error = new Error(`Temporary Wikimedia response: ${message}`);
      error.retryAfter = Number(response.headers.get("retry-after") || 0);
      throw error;
    } catch (error) {
      lastError = error;
      if (attempt === 5) break;
      const backoff = error.retryAfter
        ? error.retryAfter * 1000
        : Math.min(750 * 2 ** (attempt - 1), 12_000);
      await wait(backoff);
    }
  }
  throw lastError;
}

function chooseBestEvents(rows, options) {
  const byEntity = new Map();
  for (const row of rows) {
    const qid = getWikidataId(row.event);
    const year = getYear(row.date);
    if (!qid || !year || !row.eventLabel) continue;
    if (options.startYear !== null && year < options.startYear) continue;
    if (options.endYear !== null && year > options.endYear) continue;

    const candidate = {
      ...row,
      qid,
      year,
      relevance: Number(row.sitelinks || 0) + (row.article ? 100 : 0) + (row.coord ? 10 : 0),
    };
    const previous = byEntity.get(qid);
    if (!previous || candidate.relevance > previous.relevance) byEntity.set(qid, candidate);
  }

  return [...byEntity.values()]
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, options.eventLimit)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

function createOverview({ conflict, conflictRow, conflictSummary, fallbackStart, title, retrievedAt: retrieved }) {
  const point = readCoordinates(conflictRow?.coord);
  const start =
    formatIsoDate(conflictRow?.start) ||
    formatIsoDate(fallbackStart) ||
    findDateInText(conflictSummary?.extract) ||
    "1914-01-01";
  const image = conflictSummary?.image || conflictRow?.image || "";
  const sourceUrl = conflictSummary?.url || wikidataUrl(conflict.id);
  const body = conflictSummary?.extract || conflict.description || `Overview draft for ${title}.`;

  return {
    id: "conflict-overview",
    year: getYear(start) || 1914,
    date: start,
    title,
    sub: "Wikipedia overview and research starting point",
    view: { center: point ? [point.lat, point.lng] : [30, 15], zoom: point ? 5 : 2 },
    markers: point
      ? [{ label: title, latlng: [point.lat, point.lng], type: "major", description: "Conflict location supplied by Wikidata." }]
      : [],
    regions: [],
    sources: listSources(conflict.id, conflictSummary, retrieved),
    slides: [
      {
        title: `${title}: Overview`,
        ...(image ? { img: image, cap: `Lead image from Wikimedia; see source manifest for attribution.` } : {}),
        body,
        stats: [
          { val: conflict.id, lbl: "Wikidata item" },
          ...(conflictRow?.start ? [{ val: showDate(conflictRow.start), lbl: "Start date" }] : []),
          ...(conflictRow?.end ? [{ val: showDate(conflictRow.end), lbl: "End date" }] : []),
          { val: sourceUrl, lbl: "Source", full: true },
        ],
        sourceUrl,
        retrievedAt: retrieved,
      },
    ],
  };
}

function createTimelineEvent(row, lead, conflictTitle, retrieved) {
  const point = readCoordinates(row.coord);
  const date = formatIsoDate(row.date) || `${row.year}-01-01`;
  const sourceUrl = lead?.url || row.article || wikidataUrl(row.qid);
  const image = lead?.image || row.image || "";
  const body = lead?.extract || `No Wikipedia lead summary was available for ${row.eventLabel}. This event requires editorial research.`;

  return {
    id: makeSlug(row.eventLabel),
    year: row.year,
    date,
    title: row.eventLabel,
    sub: `Part of ${conflictTitle}`,
    view: { center: point ? [point.lat, point.lng] : [30, 15], zoom: point ? 7 : 2 },
    markers: point
      ? [{ label: row.eventLabel, latlng: [point.lat, point.lng], type: "major", description: "Event location supplied by Wikidata." }]
      : [],
    regions: [],
    sources: listSources(row.qid, lead, retrieved),
    slides: [
      {
        title: row.eventLabel,
        ...(image ? { img: image, cap: `Lead image from Wikimedia; see source manifest for attribution.` } : {}),
        body,
        stats: [
          { val: showDate(row.date), lbl: "Date" },
          ...(row.end ? [{ val: showDate(row.end), lbl: "End date" }] : []),
          { val: row.qid, lbl: "Wikidata item" },
          { val: sourceUrl, lbl: "Source", full: true },
        ],
        sourceUrl,
        retrievedAt: retrieved,
      },
    ],
  };
}

function listSources(qid, lead, retrieved) {
  return [
    ...(lead?.url
      ? [{ title: lead.title, url: lead.url, publisher: "Wikipedia", retrievedAt: retrieved }]
      : []),
    { title: qid, url: wikidataUrl(qid), publisher: "Wikidata", retrievedAt: retrieved },
  ];
}

function createSourceReport({ conflict, title, language: lang, retrievedAt: retrieved, events, generatorOptions }) {
  const uniqueSources = new Map();
  for (const event of events) {
    for (const source of event.sources || []) uniqueSources.set(source.url, source);
  }
  return {
    schemaVersion: 1,
    generatedBy: "scripts/generate-deepdive-from-wikipedia.mjs",
    generatedAt: retrieved,
    status: "draft-requires-editorial-review",
    subject: { id: conflict.id, title, language: lang, wikidataUrl: wikidataUrl(conflict.id) },
    options: generatorOptions,
    methodology: [
      "Resolve the conflict to a Wikidata item.",
      "Query related, dated events through Wikidata P361 (part of) and P1344 (participant in).",
      "Rank candidates by Wikipedia availability, sitelink count, and coordinate availability.",
      "Retrieve plain-text lead summaries and lead images from the selected Wikipedia language edition.",
      "Normalize the material into the Terra Historia event schema without generating unsupported historical claims.",
    ],
    editorialNotice:
      "Wikipedia is a tertiary source. Verify disputed interpretations and quantitative claims against reliable scholarly or primary sources before publication.",
    licensingNotice:
      "Wikipedia text is generally available under CC BY-SA; Wikidata structured data is CC0. Consult each linked page and image description page for exact attribution and license terms.",
    sources: [...uniqueSources.values()],
  };
}

function checkDeepDive(events) {
  const errors = [];
  const warnings = [];
  const ids = new Set();
  if (!Array.isArray(events) || !events.length) errors.push("Deep dive must contain at least one event.");

  for (const [index, event] of events.entries()) {
    const path = `events[${index}]`;
    for (const field of ["id", "date", "title", "sub"]) {
      if (typeof event[field] !== "string" || !event[field].trim()) errors.push(`${path}.${field} is required.`);
    }
    if (ids.has(event.id)) errors.push(`${path}.id duplicates "${event.id}".`);
    ids.add(event.id);
    if (!Number.isInteger(event.year)) errors.push(`${path}.year must be an integer.`);
    if (!/^\d{4,6}-\d{2}-\d{2}$/.test(event.date)) warnings.push(`${path}.date is not a full ISO date: ${event.date}`);
    if (!Array.isArray(event.slides) || !event.slides.length) errors.push(`${path}.slides must not be empty.`);
    if (!Array.isArray(event.markers) || !Array.isArray(event.regions)) errors.push(`${path} requires marker and region arrays.`);
    if (!event.sources?.length) warnings.push(`${path} has no source records.`);
  }
  return { errors, warnings };
}

async function saveJson(path, value, mayOverwrite) {
  await mkdir(dirname(path), { recursive: true });
  const json = `${JSON.stringify(value, null, 2)}\n`;
  if (!mayOverwrite) {
    try {
      await writeFile(path, json, { encoding: "utf8", flag: "wx" });
      return;
    } catch (error) {
      if (error.code === "EEXIST") stop(`Refusing to overwrite ${path}; pass --overwrite to replace it.`);
      throw error;
    }
  }

  const temporary = `${path}.${process.pid}.tmp`;
  await writeFile(temporary, json, "utf8");
  await rename(temporary, path);
}

function readQueryResult(binding) {
  return Object.fromEntries(Object.entries(binding).map(([key, value]) => [key, value.value]));
}

function getWikipediaTitle(url) {
  if (!url || !String(url).includes("/wiki/")) return "";
  return decodeURIComponent(String(url).split("/wiki/").pop()).replace(/_/g, " ");
}

function getWikidataId(url) {
  return String(url || "").match(/Q\d+$/i)?.[0]?.toUpperCase() || "";
}

function readCoordinates(value) {
  const match = String(value || "").match(/Point\(([-+\d.]+)\s+([-+\d.]+)\)/i);
  if (!match) return null;
  const lng = Number(match[1]);
  const lat = Number(match[2]);
  return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
}

function formatIsoDate(value) {
  const match = String(value || "").match(/^(-?\d{1,6})-(\d{2})-(\d{2})/);
  if (!match || Number(match[1]) < 0) return "";
  return `${match[1].padStart(4, "0")}-${match[2]}-${match[3]}`;
}

function getYear(value) {
  const match = String(value || "").match(/^(-?\d{1,6})/);
  return match ? Number(match[1]) : null;
}

function findDateInText(text) {
  const year = String(text || "").match(/\b(1[5-9]\d{2}|20\d{2})\b/)?.[1];
  return year ? `${year}-01-01` : "";
}

function showDate(value) {
  return formatIsoDate(value) || String(value || "Date unavailable").slice(0, 10);
}

function tidyText(value) {
  return String(value || "")
    .replace(/\s*\n+\s*/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function makeSlug(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "deep-dive";
}

function wikidataUrl(qid) {
  return `https://www.wikidata.org/wiki/${qid}`;
}

function readWholeNumber(value, name, minimum, maximum) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < minimum || number > maximum) {
    stop(`${name} must be an integer between ${minimum} and ${maximum}.`);
  }
  return number;
}

function readOptionalNumber(value, name) {
  if (value === undefined) return null;
  const number = Number(value);
  if (!Number.isInteger(number)) stop(`${name} must be an integer.`);
  return number;
}

function wait(milliseconds) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
}

function stop(message) {
  console.error(`\n${message}`);
  process.exit(1);
}
