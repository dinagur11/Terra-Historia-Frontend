import fs from "fs";
import path from "path";

const backendRoot = process.argv[2] || "C:/Users/alons/Terra-Historia-Backend";
const file = path.join(backendRoot, "deepdives-drafts", "2026-lebanon-war.generated.json");

const images = {
  "origins-and-background":
    "https://timep.org/wp-content/uploads/2026/03/How-Did-Lebanon-Get-Pulled-Into-the-War-and-Whats-Happened-Since-TIMEP-scaled.jpg",
  "hezbollah-renews-fire":
    "https://www.terrorism-info.org.il/app/uploads/2024/07/word-image-1720449045078.png",
  "ground-operations":
    "https://c.files.bbci.co.uk/7f2b/live/284cb140-2149-11f1-a79a-77e93010d956.jpg",
  "litani-security-zone":
    "https://static.jns.org/dims4/default/7ce2da5/2147483647/strip/true/crop/1024x577+0+53/resize/1000x563!/format/webp/quality/90/?url=https%3A%2F%2Fstatic.jns.org%2Fuploads%2F2025%2F01%2FIDF-soldiers-in-the-Litani-River-area.jpg",
  "operation-eternal-darkness":
    "https://wanaen.com/wp-content/uploads/2026/04/photo_2026-04-08_16-51-56.jpg?v=1775654718",
  "bint-jbeil-fighting":
    "https://cdn.i24news.tv/uploads/85/89/2c/bc/6f/7d/d5/7f/64/d9/6d/35/00/79/3f/84/85892cbc6f7dd57f64d96d3500793f84.jpg?width=996",
};

const bodies = {
  "origins-and-background":
    "After the 2006 Lebanon War, Resolution 1701 was supposed to keep armed groups away from the Israel-Lebanon border. Instead, Hezbollah rebuilt a far larger missile, drone, tunnel, and commando network while the Lebanese state and international mechanisms failed to enforce the border regime.\n\nThe 2026 war grew out of that failure. Hezbollah renewed major fire during the wider Iran war, and Israel treated the renewed attacks as proof that northern communities could not safely return home while Hezbollah retained military control near the border.",
  "hezbollah-renews-fire":
    "Hezbollah renewed major rocket, missile, and drone fire toward northern Israel in March 2026, reopening a front that had already displaced Israeli communities since 2023. The escalation also put Lebanon's government under pressure because Hezbollah was again making war-and-peace decisions outside state authority.\n\nIsrael answered with strikes on Hezbollah launch sites, command nodes, and communications infrastructure. The central Israeli aim was to stop Hezbollah from turning intermittent ceasefires into time for rearmament and then using Lebanon as an Iranian-backed launchpad against Israeli civilians.",
  "ground-operations":
    "Israeli ground operations moved into southern Lebanon after airstrikes alone could not remove Hezbollah's border infrastructure. The terrain was prepared with anti-tank positions, observation posts, tunnels, and launch areas close enough to threaten Israeli towns directly.\n\nThe operation focused on clearing Hezbollah positions near the Blue Line, disrupting Radwan Force staging areas, and creating conditions for northern Israelis to return home. In Israeli terms, the question was simple: a border that civilians cannot live beside is not a secure border.",
  "litani-security-zone":
    "The Litani River became the practical symbol of the war's security objective. Israel argued that Hezbollah forces, weapons, and launch infrastructure had to be pushed north of the river because previous diplomatic guarantees had not kept the border demilitarized.\n\nThe security-zone concept was not presented as a return to permanent occupation, but as leverage to force a real border arrangement: Lebanese state control, no Hezbollah attack infrastructure near Israel, and enforcement strong enough that another withdrawal would not simply reset the threat.",
  "operation-eternal-darkness":
    "Operation Eternal Darkness was a major Israeli wave against Hezbollah command centers, missile infrastructure, Radwan Force assets, and military communications across Lebanon. Israel said the Iran ceasefire did not include Lebanon while Hezbollah remained armed and active on the northern front.\n\nThe operation was meant to break Hezbollah's ability to coordinate fire, recover from earlier losses, and preserve a strategic reserve for Iran. Its logic was deterrent as well as tactical: after repeated ceasefire failures, Israel wanted Hezbollah leaders to understand that rebuilding near the border would bring immediate cost.",
  "bint-jbeil-fighting":
    "Bint Jbeil again became a central battlefield because of its position in Hezbollah's southern network and its symbolic value after 2006. Israeli forces fought to encircle and clear the area while Hezbollah tried to preserve a stronghold close to the Israeli border.\n\nFor Israel, Bint Jbeil mattered because leaving fortified towns intact would leave the same threat architecture in place: anti-tank teams, launch crews, observation points, and local command cells positioned to make northern Israel unlivable again.",
  "conflict-summary":
    "The 2026 Lebanon War was another test of whether Hezbollah could be kept away from Israel's northern border by diplomacy alone. Israel's campaign targeted Hezbollah's renewed fire, southern infrastructure, command system, and positions between the border and the Litani.\n\nThe broader result remained tied to enforcement. If Lebanon and international guarantors can prevent Hezbollah from rebuilding, Israel gains a safer north and Lebanon gains a chance to restore state sovereignty. If Hezbollah keeps its independent army, the same border crisis will return.",
};

const stats = {
  "origins-and-background": [
    { val: "2006", lbl: "Resolution 1701 leaves Hezbollah disarmament unresolved" },
    { val: "2026", lbl: "Renewed war grows from Hezbollah rearmament and Iranian pressure" },
    {
      val: "Strategic background",
      lbl: "Israel saw the war as the result of years in which Hezbollah rebuilt south of the Litani while northern Israeli towns remained exposed to rockets, drones, and commando raids.",
      full: true,
    },
  ],
  "hezbollah-renews-fire": [
    { val: "2 Mar 2026", lbl: "Renewed major fire begins" },
    { val: "Northern Israel", lbl: "Primary Israeli home front" },
    {
      val: "Why it mattered",
      lbl: "Hezbollah's renewed fire showed that the previous ceasefire had not removed the threat to Israeli civilians or restored Lebanese state control over war decisions.",
      full: true,
    },
  ],
  "ground-operations": [
    { val: "16 Mar 2026", lbl: "Ground phase begins" },
    { val: "Southern Lebanon", lbl: "Main battlefield" },
    {
      val: "Operational aim",
      lbl: "Israeli forces sought to clear Hezbollah border infrastructure that could support rockets, anti-tank fire, observation, infiltration, and renewed attacks on northern communities.",
      full: true,
    },
  ],
  "litani-security-zone": [
    { val: "Litani River", lbl: "Declared security depth" },
    { val: "Hezbollah removal", lbl: "Israeli border objective" },
    {
      val: "Security logic",
      lbl: "The Litani line mattered because previous agreements named it as the area from which Hezbollah weapons should be absent, but enforcement repeatedly failed.",
      full: true,
    },
  ],
  "operation-eternal-darkness": [
    { val: "8 Apr 2026", lbl: "Major escalation" },
    { val: "100+ targets", lbl: "Reported Israeli opening-wave claim" },
    {
      val: "Campaign purpose",
      lbl: "The strikes aimed to damage Hezbollah's command, missile, and elite-force systems before the group could exploit the Iran ceasefire to regroup in Lebanon.",
      full: true,
    },
  ],
  "bint-jbeil-fighting": [
    { val: "Bint Jbeil", lbl: "Major battle zone" },
    { val: "Border stronghold", lbl: "Operational significance" },
    {
      val: "Why the town mattered",
      lbl: "Israel viewed the battle as a way to dismantle a fortified Hezbollah node close enough to support future attacks on northern Israeli towns.",
      full: true,
    },
  ],
  "conflict-summary": [
    { val: "Ongoing in 2026", lbl: "Outcome / present status" },
    { val: "Heavy displacement and casualties", lbl: "Human cost on both sides of the border" },
    {
      val: "Final assessment",
      lbl: "The war's Israeli lesson was that ceasefires without enforcement let Hezbollah rebuild; a durable outcome depends on Lebanese state control, a weapons-free border, and preventing Iran from rearming Hezbollah.",
      full: true,
    },
  ],
};

const markers = {
  "origins-and-background": [
    marker("Blue Line", 33.10, 35.55, "major", "The post-2006 border regime was meant to keep Hezbollah forces away from Israel."),
    marker("Northern Israel", 33.08, 35.33, "target", "Israeli communities remained exposed when Hezbollah rebuilt near the border."),
  ],
  "hezbollah-renews-fire": [
    marker("Kiryat Shmona", 33.207, 35.57, "major", "Northern Israeli civilians again faced rocket and drone danger."),
    marker("Southern Lebanon launch areas", 33.24, 35.39, "target", "Hezbollah fire came from areas where the Lebanese state did not control armed action."),
  ],
  "ground-operations": [
    marker("Khiam", 33.329, 35.613, "major", "A key hilltop area near routes connecting southern Lebanon and the border."),
    marker("Kfar Kila / Metula sector", 33.275, 35.576, "target", "Border villages and nearby Israeli towns shaped the ground campaign."),
  ],
  "litani-security-zone": [
    marker("Litani River bend", 33.33, 35.32, "major", "The river marked the depth Israel wanted Hezbollah kept behind."),
    marker("Qasmiyeh crossing", 33.31, 35.28, "target", "Crossings over the Litani mattered for Hezbollah movement and supply."),
  ],
  "operation-eternal-darkness": [
    marker("Beirut / Dahieh", 33.85, 35.50, "major", "Hezbollah command and political infrastructure made Beirut a key target area."),
    marker("Bekaa Valley", 33.85, 35.99, "target", "The Bekaa was important to Hezbollah's logistics and Iranian-backed supply routes."),
  ],
  "bint-jbeil-fighting": [
    marker("Bint Jbeil", 33.119, 35.433, "major", "A fortified Hezbollah node and symbolic battlefield from 2006 and 2026."),
    marker("Ainata approaches", 33.126, 35.451, "target", "Approach routes around Bint Jbeil shaped the close fighting."),
  ],
  "conflict-summary": [
    marker("Northern border theater", 33.12, 35.50, "major", "The war centered on whether Israeli civilians could safely return north."),
    marker("Litani security depth", 33.32, 35.35, "target", "The final outcome depends on whether Hezbollah is kept away from the border."),
  ],
};

const views = {
  "origins-and-background": [33.10, 35.45, 8],
  "hezbollah-renews-fire": [33.16, 35.48, 9],
  "ground-operations": [33.28, 35.56, 10],
  "litani-security-zone": [33.32, 35.34, 9],
  "operation-eternal-darkness": [33.75, 35.73, 8],
  "bint-jbeil-fighting": [33.119, 35.433, 11],
  "conflict-summary": [33.15, 35.46, 8],
};

const divisionLines = {
  "litani-security-zone": [
    {
      label: "Litani River",
      color: "#2f8cff",
      coordinates: [
        [35.69, 33.55],
        [35.63, 33.48],
        [35.53, 33.40],
        [35.41, 33.34],
        [35.30, 33.31],
        [35.22, 33.28],
      ],
    },
  ],
};

function marker(label, lat, lng, type, description) {
  return { label, latlng: [lat, lng], type, description };
}

function fixFullStats(slide) {
  if (!Array.isArray(slide.stats)) return;
  slide.stats = slide.stats.map((item) => {
    if (
      item.full &&
      typeof item.val === "string" &&
      typeof item.lbl === "string" &&
      item.val.length > 65 &&
      item.lbl.length < 45
    ) {
      return { ...item, val: item.lbl, lbl: item.val };
    }
    return item;
  });
}

const data = JSON.parse(fs.readFileSync(file, "utf8"));

for (const event of data) {
  const slide = event.slides?.[0];
  if (!slide) continue;

  if (images[event.id]) slide.img = images[event.id];
  if (bodies[event.id]) slide.body = bodies[event.id];
  if (stats[event.id]) slide.stats = stats[event.id];
  fixFullStats(slide);

  if (markers[event.id]) event.markers = markers[event.id];
  if (views[event.id]) {
    const [lat, lng, zoom] = views[event.id];
    event.view = { center: [lat, lng], zoom };
  }

  if (divisionLines[event.id]) {
    event.divisionLines = divisionLines[event.id];
  } else {
    delete event.divisionLines;
  }
}

fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
console.log("Updated 2026 Lebanon War deep dive.");
