import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUTPUT = "C:\\Users\\alons\\Terra-Historia-Backend\\events";
const API = "https://en.wikipedia.org/w/api.php";
const years = Array.from({ length: 65 }, (_, index) => 1915 + index).filter((year) => year !== 1948);
const requiredEvents = {
  1917: { name: "United States Enters World War I", date: "April 6 1917", location: "Washington, D.C., USA", coordinates: { lat: 38.9072, lng: -77.0369 }, summary: "The United States declares war on Germany and enters World War I, adding its industrial and military power to the Allied cause.", match: /United States.+(enters|declares war)/i },
  1950: { name: "Korean War Begins", date: "June 25 1950", location: "Korean Peninsula", coordinates: { lat: 38, lng: 127 }, summary: "North Korean forces invade South Korea, beginning the Korean War and prompting a United Nations-led military response.", match: /Korean War.+(begins|invades South Korea)/i },
  1961: { name: "Berlin Wall Is Built", date: "August 13 1961", location: "Berlin, Germany", coordinates: { lat: 52.52, lng: 13.405 }, summary: "East Germany seals the border through Berlin and begins building the Berlin Wall, making it the defining physical symbol of divided Europe.", match: /Berlin Wall/i },
  1963: { name: "Assassination of John F. Kennedy", date: "November 22 1963", location: "Dallas, USA", coordinates: { lat: 32.7767, lng: -96.797 }, summary: "United States President John F. Kennedy is assassinated in Dallas, and Vice President Lyndon B. Johnson succeeds him.", match: /Kennedy.+assass/i },
  1964: { name: "Civil Rights Act of 1964", date: "July 2 1964", location: "Washington, D.C., USA", coordinates: { lat: 38.9072, lng: -77.0369 }, summary: "The Civil Rights Act of 1964 becomes law, outlawing major forms of racial discrimination and segregation in the United States.", match: /Civil Rights Act.+becomes law/i },
  1968: { name: "Assassination of Martin Luther King Jr.", date: "April 4 1968", location: "Memphis, USA", coordinates: { lat: 35.1495, lng: -90.049 }, summary: "Civil rights leader Martin Luther King Jr. is assassinated in Memphis, triggering mourning and unrest across the United States.", match: /Martin Luther King.+assass/i },
  1979: { name: "Soviet Invasion of Afghanistan", date: "December 24 1979", location: "Afghanistan", coordinates: { lat: 34.5553, lng: 69.2075 }, summary: "The Soviet Union invades Afghanistan to preserve an allied communist government, beginning a decade-long war with global consequences.", match: /Soviet.+(invades|invasion of) Afghanistan/i },
};

const highImpact = [
  [/\b(world war|armistice|united nations|league of nations|cold war)\b/i, 45],
  [/\b(revolution|independence|declaration of independence|decolon|partition)\b/i, 35],
  [/\b(atomic bomb|hydrogen bomb|nuclear weapon|nuclear crisis)\b/i, 34],
  [/\b(nuclear test|thermonuclear device)\b/i, 10],
  [/\b(apollo|moon|spaceflight|satellite|sputnik|space station|first human|first woman)\b/i, 34],
  [/\b(genocide|holocaust|massacre|ethnic cleansing|famine|pandemic)\b/i, 31],
  [/\b(treaty|accord|charter|constitution|civil rights|suffrage|desegreg)\b/i, 27],
  [/\b(coup|assassinat|overthrow|abdicate|resign|elected president|general election)\b/i, 25],
  [/\b(hostage crisis|martial law|apartheid|cultural revolution)\b/i, 28],
  [/\b(war begins|war ends|invades|invasion|surrenders|ceasefire|withdrawal)\b/i, 25],
  [/\b(stock market|great depression|oil crisis|opec|bretton woods|currency)\b/i, 25],
  [/\b(computer|internet|transistor|penicillin|dna|vaccine|television|jet engine)\b/i, 23],
  [/\b(earthquake|cyclone|hurricane|disaster|eruption|crash)\b/i, 13],
  [/\b(first successful|first ever|becomes the first|founded|established|created)\b/i, 14],
];
const lowImpact = [
  [/\b(baseball|football|cricket|tennis|golf|horse race|grand prix|world series)\b/i, -38],
  [/\b(film|novel|song|album|comic|cartoon|broadcasts? for the first time)\b/i, -24],
  [/\b(battle of|offensive|siege of)\b/i, -15],
  [/\b(airliner|flight \d+|train crash|ship sinks|explosion kills)\b/i, -12],
  [/\b(opens? in theaters|premieres?|released)\b/i, -24],
];
const landmarks = [
  /\b(Lusitania|Armenian genocide|Easter Rising|Battle of the Somme)\b/i,
  /\b(February Revolution|October Revolution|Russian Revolution|United States enters World War I)\b/i,
  /\b(Armistice|Treaty of Versailles|League of Nations)\b/i,
  /\b(Wall Street Crash|Great Depression|Hitler.+Chancellor|Nazi Germany invades Poland)\b/i,
  /\b(Pearl Harbor|D-Day|Normandy landings|Hiroshima|Nagasaki|atomic bomb)\b/i,
  /\b(Germany surrenders|Victory in Europe|Japanese Instrument of Surrender|United Nations is founded)\b/i,
  /\b(Partition of India|Indian independence|State of Israel|People's Republic of China|NATO)\b/i,
  /\b(Korean War|Stalin dies|Brown v\.? Board|Warsaw Pact|Suez Crisis|Hungarian Revolution)\b/i,
  /\b(Sputnik|Cuban Revolution|Berlin Wall|Yuri Gagarin|first human.+space)\b/i,
  /\b(Cuban Missile Crisis|John F\.? Kennedy.+assass|Civil Rights Act|Voting Rights Act)\b/i,
  /\b(Vietnam War|Six-Day War|Prague Spring|Apollo 11|Moon landing|ARPANET)\b/i,
  /\b(Nixon.+China|Munich massacre|Yom Kippur War|oil crisis|Watergate|Nixon resigns)\b/i,
  /\b(Fall of Saigon|Vietnam War ends|Iranian Revolution|Iran hostage crisis|invades Afghanistan)\b/i,
  /\b(DNA|transistor|polio vaccine|first heart transplant)\b/i,
];
const genericTitles = new Set([
  "United States", "United Kingdom", "France", "Germany", "Italy", "Japan", "China", "India",
  "Russia", "Soviet Union", "Canada", "Australia", "Spain", "Portugal", "Israel", "Egypt",
  "Turkey", "Poland", "Belgium", "Netherlands", "Sweden", "Norway", "Finland", "Denmark",
  "Mexico", "Brazil", "Argentina", "Africa", "Europe", "Asia", "World War I", "World War II",
]);
const fallbackCoordinates = [
  [/\bmoon\b/i, { lat: 0.7, lng: 23.4 }],
  [/\bglobal|worldwide|international\b/i, { lat: 0, lng: 0 }],
  [/\bunited nations|new york\b/i, { lat: 40.7128, lng: -74.006 }],
  [/\bunited states|washington\b/i, { lat: 38.9072, lng: -77.0369 }],
  [/\bsoviet union|moscow|russia\b/i, { lat: 55.7558, lng: 37.6173 }],
  [/\bunited kingdom|britain|london\b/i, { lat: 51.5074, lng: -0.1278 }],
  [/\bfrance|paris\b/i, { lat: 48.8566, lng: 2.3522 }],
  [/\bgermany|berlin\b/i, { lat: 52.52, lng: 13.405 }],
  [/\bchina|beijing\b/i, { lat: 39.9042, lng: 116.4074 }],
  [/\bjapan|tokyo\b/i, { lat: 35.6762, lng: 139.6503 }],
  [/\bindia|delhi\b/i, { lat: 28.6139, lng: 77.209 }],
  [/\bisrael|jerusalem\b/i, { lat: 31.7683, lng: 35.2137 }],
  [/\begypt|cairo\b/i, { lat: 30.0444, lng: 31.2357 }],
  [/\bsouth africa\b/i, { lat: -30.5595, lng: 22.9375 }],
  [/\bvietnam\b/i, { lat: 16.0544, lng: 108.2022 }],
  [/\bkorea\b/i, { lat: 37.5665, lng: 126.978 }],
  [/\bcuba\b/i, { lat: 23.1136, lng: -82.3666 }],
  [/\biran\b/i, { lat: 35.6892, lng: 51.389 }],
  [/\bafghanistan\b/i, { lat: 34.5553, lng: 69.2075 }],
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chunks = (items, size) => Array.from({ length: Math.ceil(items.length / size) }, (_, i) => items.slice(i * size, i * size + size));
const decode = (text) => text
  .replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#39;/g, "'")
  .replace(/&ndash;|&mdash;/g, "-").replace(/&nbsp;/g, " ");

async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: "json", origin: "*", ...params })}`;
  let lastStatus = "unknown";
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch(url, { headers: { "user-agent": "Terra-Historia event curator/1.0" } });
    if (response.ok) return response.json();
    lastStatus = `${response.status} ${response.statusText}`;
    await sleep(3000 * (attempt + 1));
  }
  throw new Error(`Wikipedia API request failed (${lastStatus}): ${url}`);
}

function plainText(wikitext) {
  return decode(wikitext
    .replace(/<ref\b[^>]*>[\s\S]*?<\/ref>/gi, "")
    .replace(/<ref\b[^/>]*\/>/gi, "")
    .replace(/\{\{[^{}]*\}\}/g, "")
    .replace(/\{\{[^{}]*\}\}/g, "")
    .replace(/\[\[(?:File|Image):[\s\S]*?\]\]/gi, "")
    .replace(/\[\[[^|\]]+\|([^\]]+)\]\]/g, "$1")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/\[https?:\/\/[^\s\]]+\s?([^\]]*)\]/g, "$1")
    .replace(/'{2,}/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim());
}

function parseEvents(wikitext, year) {
  const candidates = [];
  const eventsSection = wikitext.match(/==\s*Events\s*==([\s\S]*?)(?=\n==[^=]|\s*$)/i)?.[1] || wikitext;
  let inheritedDate = "";
  let inheritedPrefix = "";
  for (const line of eventsSection.split(/\r?\n/)) {
    if (!line.startsWith("*")) continue;
    const depth = line.match(/^\*+/)?.[0].length || 0;
    const links = [...line.matchAll(/\[\[([^|\]#]+)(?:#[^|\]]*)?(?:\|([^\]]+))?\]\]/g)]
      .map((match) => ({ title: match[1].trim(), label: (match[2] || match[1]).trim() }))
      .filter((link) => !/^\d{1,2}(?:st|nd|rd|th)? century$/i.test(link.title));
    const text = plainText(line.slice(depth).trim());
    const dateMatch = text.match(/^([A-Z][a-z]+(?: \d{1,2})?(?:\s*[-–]\s*[A-Z][a-z]+ \d{1,2})?)\s*[-–]\s*(.+)$/);
    if (depth === 1 && dateMatch) {
      inheritedDate = dateMatch[1].replace(/\s*[-–]\s*/g, "-");
      inheritedPrefix = dateMatch[2].endsWith(":") ? dateMatch[2] : "";
    }
    if ((!dateMatch && !inheritedDate) || text.length < 15) continue;
    const date = `${dateMatch ? dateMatch[1].replace(/\s*[-–]\s*/g, "-") : inheritedDate} ${year}`;
    const detail = dateMatch ? dateMatch[2] : text;
    const summary = `${!dateMatch && inheritedPrefix ? `${inheritedPrefix} ` : ""}${detail}`.replace(/\s+/g, " ").trim();
    if (/\b(born|births|dies|deaths)\b/i.test(summary)) continue;
    const articleLinks = links.filter((link) => !/^[A-Z][a-z]+ \d{1,2}$/.test(link.title) && !genericTitles.has(link.title));
    let score = Math.min(articleLinks.length, 7) * 2;
    for (const [pattern, weight] of highImpact) if (pattern.test(summary)) score += weight;
    for (const [pattern, weight] of lowImpact) if (pattern.test(summary)) score += weight;
    if (landmarks.some((pattern) => pattern.test(summary))) score += 120;
    candidates.push({ year, date, summary, links: articleLinks, score });
  }
  return candidates;
}

async function addArticleImportance(candidates) {
  for (const candidate of candidates) {
    candidate.primary = [...candidate.links].sort((a, b) => {
      const impact = (title) => highImpact.reduce((total, [pattern, weight]) => total + (pattern.test(title) ? weight : 0), 0);
      return impact(b.title) - impact(a.title);
    })[0];
  }
}

function selectTen(candidates) {
  const selected = [];
  const seen = new Set();
  for (const candidate of [...candidates].sort((a, b) => b.score - a.score)) {
    const identity = candidate.primary?.title || candidate.summary.slice(0, 70);
    if (seen.has(identity)) continue;
    const category = [
      /\bwar|battle|invasion|military|army|bomb|massacre|genocide\b/i.test(candidate.summary) ? "conflict" : "",
      /\belection|government|president|king|coup|revolution|independence|treaty\b/i.test(candidate.summary) ? "politics" : "",
      /\bspace|moon|science|computer|nuclear|medical|vaccine|technology\b/i.test(candidate.summary) ? "science" : "",
    ].find(Boolean) || "other";
    if (selected.filter((item) => item.category === category).length >= (category === "conflict" ? 6 : 5)) continue;
    seen.add(identity);
    selected.push({ ...candidate, category });
    if (selected.length === 10) break;
  }
  return selected.sort((a, b) => {
    const month = (date) => new Date(`${date.replace("-", " ")} UTC`).getTime() || 0;
    return month(a.date) - month(b.date);
  });
}

function titleFor(candidate) {
  const linked = candidate.primary?.title;
  if (linked && linked.length >= 5 && linked.length <= 72 && /^[A-Z0-9]/.test(linked) && !/^\d{4}/.test(linked)) return linked.replace(/\s*\([^)]*\)$/, "");
  const clause = candidate.summary.split(/[.;:]/)[0].replace(/^(The|A|An) /, "");
  return clause.length <= 76 ? clause : `${clause.slice(0, 73).trim()}...`;
}
function coordinateFor(candidate) {
  if (candidate.coordinate) return { lat: candidate.coordinate.lat, lng: candidate.coordinate.lon };
  return fallbackCoordinates.find(([pattern]) => pattern.test(candidate.summary))?.[1] || { lat: 0, lng: 0 };
}
function slug(value) {
  return value.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 70);
}
function locationFor(candidate) {
  if (/\bmoon\b/i.test(candidate.summary)) return "Moon";
  const matches = fallbackCoordinates.filter(([pattern]) => pattern.test(candidate.summary));
  return matches.length ? plainText(matches[0][0].source).replace(/\\b|\|/g, " / ") : (candidate.coordinate ? "Event location" : "Global");
}

await mkdir(OUTPUT, { recursive: true });
for (const year of years) {
  const outputPath = join(OUTPUT, `${year}.json`);
  if (!process.argv.includes("--force")) {
    try {
      await access(outputPath);
      console.log(`${year}: already exists, skipping`);
      continue;
    } catch {
      // Generate only missing years so a rate-limited run can resume cleanly.
    }
  }
  const parsed = await api({ action: "parse", page: String(year), prop: "wikitext" });
  const candidates = parseEvents(parsed.parse.wikitext["*"], year);
  await addArticleImportance(candidates);
  const selected = selectTen(candidates);
  if (selected.length !== 10) throw new Error(`${year}: selected only ${selected.length} events`);
  const records = selected.map((candidate, index) => ({
    id: `${slug(titleFor(candidate))}-${year}-${index + 1}`,
    name: titleFor(candidate),
    date: candidate.date,
    location: locationFor(candidate),
    coordinates: coordinateFor(candidate),
    summary: candidate.summary,
  }));
  await writeFile(outputPath, `${JSON.stringify(records, null, 2)}\n`, "utf8");
  console.log(`${year}: wrote ${records.length} events`);
  await sleep(5000);
}

for (const year of years) {
  const outputPath = join(OUTPUT, `${year}.json`);
  const records = JSON.parse(await readFile(outputPath, "utf8"));
  const required = requiredEvents[year];
  if (required && !records.some((event) => required.match.test(event.summary))) {
    records.pop();
    records.push({ id: `${slug(required.name)}-${year}-required`, ...required });
    delete records.at(-1).match;
  }
  records.sort((a, b) => (new Date(a.date).getTime() || 0) - (new Date(b.date).getTime() || 0));
  records.forEach((event, index) => {
    if (event.name.length < 5 || /^[a-z]/.test(event.name) || event.name.endsWith("...")) {
      const clause = event.summary.split(/[.;:]/)[0].replace(/^(The|A|An) /, "");
      event.name = clause.length <= 76 ? clause : `${clause.slice(0, 73).trim()}...`;
    }
    if (event.location.includes("/")) event.location = "Global";
    event.id = `${slug(event.name)}-${year}-${index + 1}`;
  });
  await writeFile(outputPath, `${JSON.stringify(records, null, 2)}\n`, "utf8");
}
