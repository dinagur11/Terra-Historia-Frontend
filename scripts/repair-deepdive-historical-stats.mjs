import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DRAFT_DIR =
  "C:\\Users\\alons\\Terra-Historia-Backend\\deepdives-drafts";
const STAT_LABELS = new Set([
  "Historical detail",
  "Human cost",
  "Operational detail",
  "Outcome",
  "Political result",
]);

const overrides = {
  "croat-bosniak-war.generated.json/q16781947": {
    title: "Vrbanja massacre",
    label: "Human cost",
    detail:
      "The Vrbanja massacre killed 45 people during the Croat-Bosniak War.",
  },
  "croat-bosniak-war.generated.json/kavanjina-ambush": {
    label: "Historical detail",
    detail:
      "The draft dates the Kavanjina Ambush to 9 August 1992, during the opening phase of the Croat-Bosniak War.",
  },
  "estonian-war-of-independence.generated.json/revolt-of-saaremaa": {
    label: "Historical detail",
    detail:
      "The Saaremaa revolt was an armed uprising on the Estonian islands of Saaremaa and Muhu against the Estonian government from 16 to 21 February 1919.",
  },
  "lapland-war.generated.json/lapland-evacuation": {
    label: "Human cost",
    detail:
      "Almost the entire civilian population of Finnish Lapland, about 168,000 people, was evacuated before Finnish and German troops began fighting.",
  },
  "lapland-war.generated.json/r-ytt-landing": {
    label: "Operational detail",
    detail:
      "Finnish transport ships began the risky Röyttä landings on 30 September 1944, opening the Battle of Tornio without air or naval escort.",
  },
  "lapland-war.generated.json/battle-of-muonio": {
    label: "Outcome",
    detail:
      "German forces withdrew through Muonio during the Lapland War while using delaying and scorched-earth tactics across northern Finland.",
  },
  "lapland-war.generated.json/battle-of-tankavaara": {
    label: "Outcome",
    detail:
      "At Tankavaara, four Finnish battalions failed to dislodge the fortified German 169th Infantry Division between 26 and 31 October 1944.",
  },
  "rwandan-civil-war.generated.json/second-rwanda-war": {
    label: "Outcome",
    detail:
      "The Rwandan Patriotic Front captured Kigali in July 1994, defeating the government forces and ending the genocide against the Tutsi.",
  },
  "soviet-finnish-wars.generated.json/soviet-finnish-wars": {
    label: "Historical detail",
    detail:
      "The principal Soviet-Finnish conflicts were the Winter War of 1939–1940 and the Continuation War of 1941–1944.",
  },
  "tajikistani-civil-war.generated.json/operation-hisar": {
    label: "Outcome",
    detail:
      "With Russian and Uzbek support, Popular Front forces routed opposition groups in late 1992 and shifted control of Tajikistan toward Emomali Rahmon's government.",
  },
  "tajikistani-civil-war.generated.json/battle-at-the-12th-outpost-of-the-moscow-border-detachment":
    {
      label: "Operational detail",
      detail:
        "On 13 July 1993, Russian border troops at the 12th Moscow detachment outpost fought Afghan and Tajik militants along the Tajik-Afghan frontier.",
    },
  "tajikistani-civil-war.generated.json/agreement-about-public-consent-in-tajikistan":
    {
      label: "Political result",
      detail:
        "The March 1996 public-consent agreement formed part of the negotiations that preceded the UN-sponsored 1997 peace settlement.",
    },
  "transnistria-war.generated.json/moldovan-mig-29-incident-1992": {
    label: "Operational detail",
    detail:
      "On 22 June 1992, two Moldovan MiG-29s bombed the bridge linking Bender and Parcani; the bombs missed the bridge but caused blast and splinter damage.",
  },
  "war-in-southern-vietnam.generated.json/war-in-southern-vietnam": {
    label: "Outcome",
    detail:
      "The 1945–1946 war ended with a Franco-British victory, the French reoccupation of southern Vietnam, and growing tensions that led into the First Indochina War.",
  },
  "war-of-dagestan.generated.json/battle-of-karamakhi": {
    label: "Outcome",
    detail:
      "Federal forces began bombarding the fortified Karamakhi area in late August 1999; militants withdrew by 13 September and the villages were left ruined.",
  },
  "war-of-dagestan.generated.json/tsumadinsky-botlikhsky-campaign": {
    label: "Operational detail",
    detail:
      "On 7 August 1999, roughly 1,500–2,000 militants invaded Dagestan and seized villages in the Tsumadi and Botlikh districts.",
  },
  "war-of-dagestan.generated.json/battle-for-donkey-s-ear-height": {
    label: "Human cost",
    detail:
      "The August 1999 fighting for the strategic Donkey's Ear height involved federal paratroopers and Islamist militants; one six-hour battle killed 12 paratroopers and wounded 25.",
  },
  "war-of-dagestan.generated.json/wahhabi-capture-of-height-715-3": {
    label: "Human cost",
    detail:
      "Militants captured Height 715.3 on 5–6 September 1999; up to 50 militants were killed or wounded in the fighting.",
  },
  "war-of-dagestan.generated.json/wahhabi-capture-of-novolakskoye": {
    label: "Outcome",
    detail:
      "Militants seized Novolakskoye on 5–6 September 1999, but federal forces restored control of the village on 14 September.",
  },
  "war-of-dagestan.generated.json/disaster-of-the-armavir-spetsnaz": {
    label: "Human cost",
    detail:
      "The Armavir Spetsnaz battle for Height 715.3 on 10–11 September 1999 resulted in 80 deaths according to the military prosecutor's case materials.",
  },
  "chadian-libyan-war.generated.json/operation-manta": {
    label: "Operational detail",
    detail:
      "France launched Operation Manta in 1983 to halt Libyan-backed forces advancing south and to stabilize Hissene Habre's government.",
  },
  "croat-bosniak-war.generated.json/q16781947": {
    title: "Vrbanja massacre",
    label: "Human cost",
    detail:
      "The Vrbanja massacre killed 45 people during the Croat-Bosniak War.",
    body:
      "The Vrbanja massacre killed 45 people during the Croat-Bosniak War. It occurred on 17 July 1993 amid the fighting and violence against civilians that marked the conflict.",
  },
  "croat-bosniak-war.generated.json/zenica-massacre": {
    label: "Human cost",
    detail:
      "Shells fired into a crowd in Zenica on 19 April 1993 killed 16 civilians and injured more than 50.",
  },
  "first-chechen-war.generated.json/budyonnovsk-hospital-hostage-crisis": {
    label: "Human cost",
    detail:
      "From 14 to 19 June 1995, Chechen fighters held more than 1,500 hostages in Budyonnovsk; at least 129 people were killed.",
  },
  "first-chechen-war.generated.json/shatoy-ambush": {
    label: "Operational detail",
    detail:
      "Chechen fighters led by Ibn al-Khattab ambushed a Russian military convoy near Shatoy in a battle lasting roughly three hours.",
  },
  "gulf-war.generated.json/1991-iraqi-missile-attacks-against-israel": {
    label: "Operational detail",
    detail:
      "Beginning on 17 January 1991, Iraq launched a missile campaign against Israeli cities in an attempt to widen the Gulf War.",
  },
  "gulf-war.generated.json/battle-of-khafji": {
    label: "Outcome",
    detail:
      "Iraqi forces briefly captured the Saudi border town of Khafji in January 1991 before Saudi, Qatari, and coalition forces retook it.",
  },
  "gulf-war.generated.json/highway-of-death": {
    label: "Operational detail",
    detail:
      "Coalition aircraft attacked retreating Iraqi military columns on Highway 80 between Kuwait City and Basra on 26-27 February 1991.",
  },
  "iran-israel-proxy-conflict.generated.json/operation-true-promise-i": {
    label: "Operational detail",
    detail:
      "On 13 April 2024, Iran and allied groups launched drones, cruise missiles, and ballistic missiles toward Israel and the Israeli-occupied Golan Heights.",
  },
  "lapland-war.generated.json/battle-of-olhava": {
    label: "Operational detail",
    detail:
      "At the Olhava River on 29 September 1944, German troops demolished a bridge as Finnish soldiers tried to disarm its explosives.",
  },
  "lapland-war.generated.json/battle-of-rovaniemi": {
    label: "Human cost",
    detail:
      "The October 1944 battle and German withdrawal left Rovaniemi, the capital of Finnish Lapland, almost entirely destroyed.",
  },
  "second-chechen-war.generated.json/battle-of-komsomolskoye": {
    label: "Operational detail",
    detail:
      "The March 2000 Battle of Komsomolskoye became one of the last major conventional engagements of the Second Chechen War.",
  },
  "south-lebanon-conflict.generated.json/night-time-operation": {
    label: "Outcome",
    detail:
      "On 16 February 1992, an Israeli airstrike killed Hezbollah secretary-general Abbas al-Musawi while he traveled through southern Lebanon.",
  },
  "south-lebanon-conflict.generated.json/ansariya-ambush": {
    label: "Human cost",
    detail:
      "In the 1997 Ansariya ambush, Hezbollah killed 12 members of a 16-man Israeli Shayetet 13 force.",
  },
  "war-in-abkhazia.generated.json/siege-of-tkvarcheli": {
    label: "Human cost",
    detail:
      "The 1992-1993 siege of Tkvarcheli isolated the Abkhaz-held mining town and created a prolonged humanitarian crisis.",
  },
  "war-on-terrorism.generated.json/war-in-afghanistan-2001-2021": {
    label: "Outcome",
    detail:
      "The twenty-year war ended in August 2021 when foreign forces withdrew, the Afghan republic collapsed, and the Taliban returned to power.",
  },
};

const templatePhrases = [
  "marked an important episode",
  "showed how the conflict's political goals",
  "was more than an isolated engagement",
  "helped define the conflict's direction",
  "reflected the changing balance of power",
  "the effects of ",
  "its place in the wider campaign",
  "generated draft",
  "significant event during",
];

function normalize(value) {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

function splitSentences(value) {
  return value
    .replace(/\[[^\]]+\]/g, "")
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 35);
}

function sentenceScore(sentence, event) {
  const lower = sentence.toLowerCase();
  if (templatePhrases.some((phrase) => lower.includes(phrase))) return -1000;

  const titleWords = normalize(event.title)
    .split(" ")
    .filter((word) => word.length > 3);
  const normalized = normalize(sentence);
  let score = titleWords.filter((word) => normalized.includes(word)).length * 3;

  if (/\d/.test(sentence)) score += 5;
  if (/killed|dead|wounded|captured|victory|defeat|signed|ended|began/.test(lower)) {
    score += 4;
  }
  if (/fought|attack|offensive|operation|battle|raid|massacre|agreement/.test(lower)) {
    score += 2;
  }
  if (sentence.length > 360) score -= 3;
  return score;
}

function bestBodyFact(event) {
  return (event.slides || [])
    .flatMap((slide) => splitSentences(slide.body || ""))
    .map((sentence) => ({ sentence, score: sentenceScore(sentence, event) }))
    .sort((a, b) => b.score - a.score)[0]?.sentence;
}

function labelFor(detail) {
  const lower = detail.toLowerCase();
  if (/killed|dead|wounded|casualt|massacre|civilian/.test(lower)) return "Human cost";
  if (/agreement|accord|treaty|signed|ceasefire|cease-fire/.test(lower)) {
    return "Political result";
  }
  if (/victory|defeat|captur|withdrew|withdrawal|ended|restored control/.test(lower)) {
    return "Outcome";
  }
  if (/fought|attack|offensive|operation|battle|raid|invasion/.test(lower)) {
    return "Operational detail";
  }
  return "Historical detail";
}

const files = (await readdir(DRAFT_DIR)).filter((file) => file.endsWith(".json"));
let repaired = 0;

for (const file of files) {
  const path = join(DRAFT_DIR, file);
  const events = JSON.parse((await readFile(path, "utf8")).replace(/^\uFEFF/, ""));
  if (!Array.isArray(events)) continue;
  let changed = false;

  for (const event of events) {
    const stats = (event.slides || []).flatMap((slide) =>
      (slide.stats || []).filter((stat) => STAT_LABELS.has(stat.val))
    );
    if (!stats.length) continue;

    const override = overrides[`${file}/${event.id}`];
    if (override?.title) {
      event.title = override.title;
      for (const slide of event.slides || []) {
        if (slide.title === "Q16781947") slide.title = override.title;
      }
    }
    if (override?.body && event.slides?.[0]) event.slides[0].body = override.body;

    const detail = override?.detail || bestBodyFact(event);
    if (!detail || sentenceScore(detail, event) < 0) {
      throw new Error(`No reliable detail found for ${file} / ${event.title}`);
    }

    for (const stat of stats) {
      stat.val = override?.label || labelFor(detail);
      stat.lbl = detail;
      stat.full = true;
    }
    repaired += stats.length;
    changed = true;
  }

  if (changed) await writeFile(path, `${JSON.stringify(events, null, 2)}\n`, "utf8");
}

console.log(`Repaired ${repaired} researched historical stats.`);
