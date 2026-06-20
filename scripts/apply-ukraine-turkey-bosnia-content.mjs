import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DRAFT_DIR = "C:\\Users\\alons\\Terra-Historia-Backend\\deepdives-drafts";

const imageUpdates = {
  "russo-ukrainian-war": {
    "annexation-of-crimea": "https://d3i6fh83elv35t.cloudfront.net/static/2021/11/onedge-1024x682.jpg",
    "war-in-donbas": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/A_Russia-backed_rebel_armored_fighting_vehicles_convoy_near_Donetsk%2C_Eastern_Ukraine%2C_May_30%2C_2015.jpg/1920px-A_Russia-backed_rebel_armored_fighting_vehicles_convoy_near_Donetsk%2C_Eastern_Ukraine%2C_May_30%2C_2015.jpg",
    "minsk-agreements": "https://www.brookings.edu/wp-content/uploads/2016/06/ukraine_peace_talks001.jpg?quality=50",
    "full-scale-invasion": "https://www.atlanticcouncil.org/wp-content/uploads/2022/04/2022-04-17T173359Z_1852816522_RC2ZOT9TOINT_RTRMADP_3_UKRAINE-CRISIS-MARIUPOL-1024x669.jpg",
    "ukrainian-counteroffensives": "https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/7E6VKEBWBQI63IGWIFJJTP7L2U.jpg&w=1440&impolicy=high_res",
    "attritional-war": "https://i.guim.co.uk/img/media/2832a1688b9563aeb9538c34a43a7407c2f3673e/0_100_3000_1800/master/3000.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=8c915067014a8b3935ba98bbcd22c3e4",
    "conflict-summary": "https://www.aspistrategist.org.au/wp-content/uploads/2022/10/GettyImages-1238921487.jpg",
  },
  "turkish-war-of-independence": {
    "franco-turkish-war": "https://www.historiascripta.org/wp-content/uploads/2024/03/The-Siege-of-Maras-1920-turbulent-days-of-resistance-and-tragedy-at-the-beginning-of-Franco-Turkish-war.jpg",
    "battle-of-karbo-az": "https://upload.wikimedia.org/wikipedia/commons/9/91/Resim_2022-12-16_161008564.png",
    "turkish-armenian-war": "https://upload.wikimedia.org/wikipedia/commons/c/c2/Armenians_fleeing_Kars.jpg",
    "bombardment-of-samsun": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg6-jzvCk3ZDaAQL0EOkIIb6W71uJlY6GKNssYb-ixmAHcn_VKY23XTVaF5adQOV5G5FkC75rxF6HxMJpXyiFYd55kHdMTa_0zDT6tEc2M9sY7OB0TFvP-9PCzzZS2XcVnFqw6CTLmopLVGphFG_GiVsAahlGkby7rsU0mws9j5WFkemfIQIg/s899/USS_Sands_(DD-243)_at_Danzig_in_1921.jpg",
    "international-and-human-dimensions": "https://upload.wikimedia.org/wikipedia/commons/4/48/Turkish_infantryman_during_the_War_of_Independence.jpg",
    "outcome-and-legacy": "https://i.pinimg.com/1200x/5b/52/dc/5b52dc1b349794827bf05cf28ec8c567.jpg",
  },
  "bosnian-war": {
    "siege-of-sarajevo": "https://i.guim.co.uk/img/media/c8f45cbca8c943b12bfcb140f31e4d718af4bff8/1_35_2488_1492/master/2488.jpg?width=700&quality=85&auto=format&fit=max&s=0721fe0286aafd80eebfdc0bdc5cf012",
    "ethnic-cleansing": "https://www.hmd.org.uk/wp-content/uploads/2018/07/Trnopolje-300x203.jpeg",
    "srebrenica": "https://cloudfront-us-east-2.images.arcpublishing.com/reuters/35VKBHPLJJPZLIE5R7DRMA4D54.jpg",
    "operation-deliberate-force": "https://upload.wikimedia.org/wikipedia/commons/6/65/F-16_deliberate_force.JPG",
    "dayton-accords": "https://i.guim.co.uk/img/media/48f6be352efe796e4a4cfc5ce2c961a8f5a1c11b/0_97_2200_1320/master/2200.jpg?width=1200&quality=85&auto=format&fit=max&s=7709fe4e3bee867cabcdf01c82a9e638",
    "conflict-summary": "https://cdn.britannica.com/44/142344-050-03FB6863/Bodies-people-Vitez-conflict-Bosnia-and-Herzegovina-April-1993.jpg",
  },
  "yugoslav-wars": {
    "origins-and-background": "https://www.nationalww2museum.org/sites/default/files/styles/wide_large/public/2021-09/Partisans%20liberate%20Sarajevo%2C%206%20April%201945%20-%20Wikimedia%20Commons.jpg?h=dec22bcf",
    "ten-day-war": "https://upload.wikimedia.org/wikipedia/commons/0/06/Teritorialci_so_z_armbrustom_zadeli_tank_v_kri%C5%BEi%C5%A1%C4%8Du_pred_MMP_Ro%C5%BEna_Dolina..jpg",
    "bosnian-war": "https://www.irmct.org/specials/war-bosnia/img/01_bijeljina.jpg",
    "nato-bosnia": "https://warontherocks.com/wp-content/uploads/2022/08/EUFOR-troops.jpg?v=1660240433",
    "milosevic-falls": "https://ichef.bbci.co.uk/images/ic/1200x675/p0d6r6wb.jpg",
  },
};

const bodyUpdates = {
  "turkish-war-of-independence": {
    "greco-turkish-war": "The Greco-Turkish War was the largest military theater of the Turkish War of Independence. Greek forces landed at İzmir in May 1919 with Allied approval and advanced into western Anatolia, aiming to secure territories claimed under the postwar settlement. Turkish nationalist forces first stabilized the front at İnönü, then stopped the Greek advance toward Ankara at the Battle of the Sakarya in 1921. The Great Offensive of August 1922 broke the Greek army at Dumlupınar and carried Turkish forces back to İzmir. The campaign ended in military defeat for Greece, the burning and mass flight at Smyrna, and the compulsory population exchange that transformed both states.",
    "ala-ehir-congress": "The Alaşehir Congress brought together delegates from western Anatolian towns threatened by the Greek occupation. Meeting in August 1919, participants coordinated local Defense of Rights organizations, discussed recruitment and supply, rejected partition, and tried to place scattered militia resistance under a common political program. The congress belonged to a chain of regional assemblies, alongside Balıkesir, Erzurum, and Sivas, that turned local protest into a national movement. It did not command the entire war, but it helped build the networks, legitimacy, and shared language that Ankara later centralized.",
    "battle-of-karbo-az": "At Karboğazı Pass in May 1920, a small Turkish nationalist force used the narrow Taurus Mountain terrain to ambush a much larger French column. The nationalists blocked movement through the pass, attacked from commanding ground, and forced most of the isolated French battalion to surrender. The engagement was modest compared with Sakarya or Dumlupınar, but strategically useful: it disrupted French movement in Cilicia, captured weapons, strengthened local morale, and showed how irregular forces could offset conventional superiority through terrain and surprise.",
    "turkish-armenian-war": "The Turkish-Armenian War of 1920 was fought between the Turkish National Movement and the First Republic of Armenia over eastern Anatolia and the frontier created by the post-Ottoman settlement. Turkish forces under Kâzım Karabekir captured Sarıkamış and Kars, advanced toward Alexandropol, and forced Armenia to accept severe territorial terms. The campaign overlapped with the Soviet invasion that ended Armenian independence. Military deaths ran into several thousand, while massacres, famine, disease, and the flight of Armenian civilians drove the wider human toll into the tens of thousands; exact totals remain disputed.",
    "international-and-human-dimensions": "The war was shaped by Greek, Armenian, French, British, Italian, and Soviet decisions, while Ankara used diplomacy to isolate opponents and secure arms. The connected campaigns killed tens of thousands of soldiers. Civilian deaths from massacres, reprisals, deportation, famine, disease, and communal violence drove the broader toll into the hundreds of thousands. The 1923 compulsory exchange then uprooted roughly 1.5 million Orthodox Christians from Turkey and about half a million Muslims from Greece, making population removal part of the new regional order.",
  },
};

const ukraineDeathEstimate =
  "A cautious mid-2026 estimate places combined military and civilian deaths at roughly 300,000-400,000 or more. The exact total cannot be independently verified: both governments restrict military-loss data, outside estimates vary substantially, and civilian deaths in occupied areas are undercounted.";

function marker(label, latlng, type, description) {
  return { label, latlng, type, description };
}

function droneEvent() {
  return {
    id: "drone-warfare-transforms-the-front",
    year: 2024,
    date: "2024-01-01",
    title: "Drone Warfare Transforms the Front",
    sub: "A new type of warfare reshapes reconnaissance, attack, logistics, and naval operations",
    view: { center: [47.8, 36.6], zoom: 5 },
    markers: [
      marker("Donbas front", [48.1, 37.8], "target", "FPV drones became a primary means of attacking vehicles, trenches, artillery, and individual soldiers near the front line."),
      marker("Kyiv", [50.4501, 30.5234], "major", "Long-range one-way attack drones made air defense and civilian infrastructure protection a daily strategic problem."),
      marker("Sevastopol", [44.6167, 33.5254], "major", "Ukrainian naval drones challenged Russia's Black Sea Fleet and changed how ships operated around occupied Crimea."),
    ],
    regions: [],
    slides: [
      {
        title: "Drone Warfare Transforms the Front",
        img: "https://cloudfront-ap-northeast-1.images.arcpublishing.com/chosun/EUDYDVNQLNCF7ASHK7B6UF4U2I.jpg",
        cap: "Drone warfare became one of the defining military innovations of the Russo-Ukrainian War.",
        body: "The Russo-Ukrainian War accelerated a new form of mass drone warfare. Cheap quadcopters provided constant reconnaissance and corrected artillery fire; FPV drones attacked vehicles, trenches, antennas, and individual soldiers; larger one-way attack drones struck cities and infrastructure hundreds of kilometers away. Electronic warfare became essential for jamming navigation and control links, while both sides rapidly modified hardware and software in response. Ukraine also used naval drones against Russian ships and facilities in the Black Sea. Drones did not replace artillery, infantry, armor, or airpower, but they made the battlefield more visible, more lethal, and much harder to move across without detection.",
        stats: [
          { val: "FPV drones", lbl: "Low-cost precision attack at tactical range" },
          { val: "Electronic warfare", lbl: "Jamming and adaptation became continuous" },
          { val: "Why it matters", lbl: "The war demonstrated how commercial technology, rapid production, and software iteration can reshape conventional warfare.", full: true },
        ],
      },
    ],
  };
}

async function readJson(path) {
  return JSON.parse((await readFile(path, "utf8")).replace(/^\uFEFF/, ""));
}

async function writeJson(path, data) {
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function setImage(event, image) {
  for (const slide of event.slides || []) {
    slide.img = image;
    slide.cap = `Visual reference for ${event.title}.`;
  }
}

function setHumanNote(event, text) {
  const slide = [...(event.slides || [])].reverse().find((item) => (item.stats || []).length) || event.slides?.[0];
  if (!slide) return;
  const existing = (slide.stats || []).find((stat) => stat.full && /human|casual|dead|cost/i.test(`${stat.val} ${stat.lbl}`));
  if (existing) {
    existing.val = "Human cost";
    existing.lbl = text;
    existing.full = true;
  } else {
    slide.stats = [...(slide.stats || []), { val: "Human cost", lbl: text, full: true }];
  }
}

for (const [id, eventsImages] of Object.entries(imageUpdates)) {
  const path = join(DRAFT_DIR, `${id}.generated.json`);
  const events = await readJson(path);
  for (const event of events) {
    if (eventsImages[event.id]) setImage(event, eventsImages[event.id]);
    if (bodyUpdates[id]?.[event.id]) {
      for (const slide of event.slides || []) slide.body = bodyUpdates[id][event.id];
    }
  }

  if (id === "russo-ukrainian-war") {
    const drone = droneEvent();
    const existingIndex = events.findIndex((event) => event.id === drone.id);
    if (existingIndex >= 0) events[existingIndex] = drone;
    else {
      const summaryIndex = events.findIndex((event) => event.id === "conflict-summary");
      events.splice(summaryIndex >= 0 ? summaryIndex : events.length, 0, drone);
    }

    const minsk = events.find((event) => event.id === "minsk-agreements");
    if (minsk) minsk.view = { center: [52.15, 32.98], zoom: 5 };

    const summary = events.find((event) => event.id === "conflict-summary");
    if (summary?.slides?.[0]) {
      summary.slides[0].body = `${summary.slides[0].body}\n\n${ukraineDeathEstimate}`;
      setHumanNote(summary, ukraineDeathEstimate);
    }
  }

  if (id === "turkish-war-of-independence") {
    const armenianWar = events.find((event) => event.id === "turkish-armenian-war");
    if (armenianWar) setHumanNote(armenianWar, "Several thousand soldiers were killed; civilian deaths from massacres, famine, disease, and flight reached into the tens of thousands, although exact totals remain disputed.");
    const international = events.find((event) => event.id === "international-and-human-dimensions");
    if (international) setHumanNote(international, "Tens of thousands of soldiers and hundreds of thousands of civilians died across the connected campaigns; roughly two million people were uprooted by the compulsory Greek-Turkish population exchange.");
  }

  await writeJson(path, events);
  console.log(`Updated ${id}`);
}
