import fs from "fs";
import path from "path";

const backendRoot =
  process.argv[2] || "C:/Users/alons/Terra-Historia-Backend";
const draftsDir = path.join(backendRoot, "deepdives-drafts");

const readDive = (id) =>
  JSON.parse(fs.readFileSync(path.join(draftsDir, `${id}.generated.json`), "utf8"));

const writeDive = (id, data) => {
  fs.writeFileSync(
    path.join(draftsDir, `${id}.generated.json`),
    `${JSON.stringify(data, null, 2)}\n`
  );
};

const marker = (label, lat, lng, type, description) => ({
  label,
  latlng: [lat, lng],
  type,
  description,
});

function getEvent(dive, id) {
  return dive.find((event) => event.id === id);
}

function setImages(event, img, cap) {
  if (!event) return;
  for (const slide of event.slides || []) {
    slide.img = img;
    if (cap) slide.cap = cap;
  }
}

function setMap(event, view, markers) {
  if (!event) return;
  event.view = view;
  event.markers = markers;
  event.regions = [];
  event.arrows = [];
}

function cleanExplicitPerspective(dive) {
  for (const event of dive) {
    for (const slide of event.slides || []) {
      slide.body = (slide.body || "")
        .replace(/From an Israeli security perspective,?\s*/gi, "")
        .replace(/from the Israeli point of view,?\s*/gi, "")
        .replace(/From the Israeli point of view,?\s*/g, "")
        .replace(/from the Israeli perspective,?\s*/gi, "")
        .replace(/From the Israeli perspective,?\s*/g, "")
        .replace(
          /This security context does not erase Palestinian, Lebanese, Iranian, or other civilian suffering; it explains why Israeli leaders and much of the Israeli public regarded inaction as an unacceptable choice\./gi,
          "The operation remains disputed internationally, but Israeli leaders treated inaction near the Golan frontier as an unacceptable security risk."
        );
    }
  }
}

function swapIntroStats(dive) {
  const labels = new Set([
    "Previous conflict in this path",
    "The next conflict to explore",
    "Why they connect",
    "Direct aftermath",
    "Regional conflict chain",
    "First major campaign of the War on Terror",
    "US regional presence and transnational militancy",
  ]);
  for (const event of dive) {
    for (const slide of event.slides || []) {
      for (const stat of slide.stats || []) {
        if (labels.has(stat.lbl)) {
          [stat.val, stat.lbl] = [stat.lbl, stat.val];
        }
        if (stat.lbl === "What was at stake" && stat.val.length > 80) {
          [stat.val, stat.lbl] = [stat.lbl, stat.val];
          stat.full = true;
        }
      }
    }
  }
}

function patchWarOnTerror() {
  const id = "war-on-terrorism";
  let dive = readDive(id);
  dive = dive.filter(
    (event) =>
      event.id !== "colombian-conflict" &&
      event.id !== "south-thailand-insurgency"
  );
  swapIntroStats(dive);

  const origins = getEvent(dive, "origins-and-road-to-war");
  origins.year = 2001;
  origins.date = "2001-09-11";
  setImages(
    origins,
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/WTC_smoking_on_9-11.jpeg/1280px-WTC_smoking_on_9-11.jpeg",
    "The World Trade Center smoking on September 11, 2001"
  );
  origins.slides[0].title = "September 11 and the War on Terror";
  origins.slides[0].body =
    "The War on Terror began as a direct response to the September 11, 2001 attacks. Nineteen al-Qaeda hijackers seized four commercial airliners: two were flown into the World Trade Center, one struck the Pentagon, and Flight 93 crashed in Pennsylvania after passengers fought back. Nearly 3,000 people were killed, thousands were injured, and the attacks transformed American security policy overnight.\n\nThe United States concluded that al-Qaeda had used Taliban-ruled Afghanistan as a sanctuary for planning, training, and command. Washington demanded that the Taliban hand over al-Qaeda leaders and shut down terrorist infrastructure. When the Taliban refused to comply, the U.S. and its allies moved toward military action in Afghanistan, while the broader campaign expanded into intelligence, policing, finance, surveillance, detention, drone warfare, and later wars in Iraq, Syria, Yemen, Somalia, and beyond.";
  origins.slides[1].title = "Before the War on Terror";
  origins.slides[1].body =
    "The 1990s had already shown the rise of transnational jihadist networks: the 1993 World Trade Center bombing, al-Qaeda's 1998 embassy bombings in Kenya and Tanzania, and the 2000 USS Cole attack all pointed to a growing threat. 9/11 made that threat impossible for U.S. leaders to treat as a distant problem.\n\nThe opening logic of the campaign was simple: deny safe havens, destroy al-Qaeda's leadership, and pressure states or armed groups that sheltered global terrorist networks. Over time, that mission became much wider and more controversial.";
  setMap(origins, { center: [38.9, -77.0], zoom: 4 }, [
    marker("World Trade Center", 40.7115, -74.0134, "target", "Two hijacked planes struck the Twin Towers in New York, causing their collapse and the largest loss of life on 9/11."),
    marker("Pentagon", 38.8719, -77.0563, "major", "American Airlines Flight 77 struck the Pentagon, killing 125 people inside the building and everyone aboard."),
    marker("Shanksville", 40.052, -78.905, "major", "United Flight 93 crashed in Pennsylvania after passengers fought the hijackers."),
  ]);

  const afghan = getEvent(dive, "afghan-conflict");
  setImages(
    afghan,
    "https://cdn.britannica.com/66/127566-050-2432C183/Afghan-resistance-fighters-village-forces-Soviet-1986.jpg",
    "Afghan resistance fighters during the Soviet-Afghan War"
  );
  setMap(afghan, { center: [34.5, 69.2], zoom: 5 }, [
    marker("Kabul", 34.5553, 69.2075, "target", "Decades of Afghan conflict created the conditions in which the Taliban and al-Qaeda sanctuary later emerged."),
    marker("Panjshir Valley", 35.3, 69.6, "major", "Anti-Taliban resistance networks remained important after 9/11."),
    marker("Afghan-Pakistan border", 34.0, 71.0, "major", "Militant networks used cross-border routes and sanctuaries throughout the wider conflict."),
  ]);
  setMap(getEvent(dive, "war-in-afghanistan-2001-2021"), { center: [34.5, 69.2], zoom: 5 }, [
    marker("Kabul", 34.5553, 69.2075, "target", "The Afghan campaign became the first major military theater of the War on Terror."),
    marker("Kandahar", 31.6289, 65.7372, "major", "The Taliban's southern heartland became an early objective of the U.S.-led intervention."),
  ]);
  setMap(getEvent(dive, "operation-enduring-freedom"), { center: [33.5, 66.0], zoom: 5 }, [
    marker("Afghanistan", 33.9, 67.7, "target", "Operation Enduring Freedom began the U.S.-led campaign against al-Qaeda and the Taliban."),
    marker("Bagram", 34.946, 69.265, "major", "Bagram became a central coalition air base and logistics hub."),
  ]);
  setMap(getEvent(dive, "insurgency-in-the-maghreb"), { center: [28.0, 2.6], zoom: 4 }, [
    marker("Algeria", 28.0, 2.6, "target", "Jihadist insurgency in Algeria and the wider Maghreb became one regional front of post-9/11 counterterrorism."),
    marker("Sahel routes", 17.6, 1.0, "major", "Militant networks moved across desert routes linking North and West Africa."),
  ]);
  setMap(getEvent(dive, "iraq-war"), { center: [33.3152, 44.3661], zoom: 5 }, [
    marker("Baghdad", 33.3152, 44.3661, "target", "The Iraq War became the most controversial expansion of the War on Terror."),
    marker("Fallujah", 33.35, 43.78, "major", "Insurgency and urban combat in Iraq reshaped the wider campaign."),
  ]);
  setMap(getEvent(dive, "insurgency-in-khyber-pakhtunkhwa"), { center: [34.0, 71.5], zoom: 6 }, [
    marker("Khyber Pakhtunkhwa", 34.0, 71.5, "target", "Militant sanctuaries and Pakistani military operations made this a major linked front."),
    marker("Waziristan", 32.9, 69.7, "major", "Tribal areas became key sanctuaries for Taliban and al-Qaeda-linked networks."),
  ]);
  setMap(getEvent(dive, "international-and-human-dimensions"), { center: [30.0, 45.0], zoom: 3 }, [
    marker("Afghanistan", 33.9, 67.7, "target", "Afghanistan was the first major war zone after 9/11."),
    marker("Iraq", 33.3152, 44.3661, "target", "Iraq became the largest and most controversial expansion of the campaign."),
    marker("Sahel and Horn of Africa", 12.0, 18.0, "major", "Counterterrorism expanded across Africa through local partners, drones, raids, and training missions."),
  ]);
  setMap(getEvent(dive, "outcome-and-legacy"), { center: [30.0, 45.0], zoom: 3 }, [
    marker("United States", 38.9, -77.0, "major", "9/11 reshaped U.S. security institutions, law, intelligence, and foreign policy."),
    marker("Afghanistan", 33.9, 67.7, "target", "The Taliban returned to power in 2021, showing the limits of the original intervention."),
    marker("Iraq and Syria", 34.5, 41.0, "major", "The campaign's later fronts helped shape ISIS, coalition air wars, and regional instability."),
  ]);

  writeDive(id, dive);
}

function patchAfghanistan() {
  const id = "war-in-afghanistan-2001-2021";
  const dive = readDive(id);
  swapIntroStats(dive);

  const origins = getEvent(dive, "origins-and-road-to-war");
  setImages(
    origins,
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/WTC_smoking_on_9-11.jpeg/1280px-WTC_smoking_on_9-11.jpeg",
    "The World Trade Center smoking on September 11, 2001"
  );
  origins.slides[1].body =
    "After the September 11 attacks, the United States demanded that the Taliban surrender Osama bin Laden and other al-Qaeda leaders, close terrorist training camps, and allow access to al-Qaeda infrastructure in Afghanistan. The Taliban refused to hand bin Laden over under U.S. terms and tried to bargain for evidence or third-country arrangements instead.\n\nThat refusal made Afghanistan the first battlefield of the War on Terror. The U.S. partnered with the Northern Alliance, used air power, CIA teams, and special operations forces, and quickly removed the Taliban government. The hard part came afterward: al-Qaeda leaders escaped, the Taliban reorganized, and a short punitive campaign turned into a twenty-year war of insurgency, state-building, corruption, counterterrorism, and exhaustion.";
  setMap(origins, { center: [34.5, 69.2], zoom: 5 }, [
    marker("World Trade Center", 40.7115, -74.0134, "major", "The 9/11 attacks triggered the U.S. demand that the Taliban surrender al-Qaeda leaders."),
    marker("Kabul", 34.5553, 69.2075, "target", "The Taliban government controlled Kabul before the U.S.-led intervention."),
    marker("Kandahar", 31.6289, 65.7372, "major", "The Taliban's southern base of power became central to the opening campaign."),
  ]);
  setMap(getEvent(dive, "operation-enduring-freedom"), { center: [33.5, 66.0], zoom: 5 }, [
    marker("Kabul", 34.5553, 69.2075, "target", "The U.S.-led campaign and Northern Alliance advance toppled Taliban rule in the capital."),
    marker("Kandahar", 31.6289, 65.7372, "major", "Kandahar's fall marked the collapse of the Taliban's first regime."),
  ]);
  setMap(getEvent(dive, "battle-of-tora-bora"), { center: [34.1, 70.2], zoom: 8 }, [
    marker("Tora Bora", 34.1, 70.2, "target", "U.S.-backed Afghan forces fought al-Qaeda in the mountain complex where bin Laden was believed to be hiding."),
    marker("Pakistan border", 34.0, 70.8, "major", "Al-Qaeda leaders escaped through rugged border routes, prolonging the war."),
  ]);
  const anaconda = getEvent(dive, "operation-anaconda");
  setImages(
    anaconda,
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Soldier_with_1st_Battalion%2C_187th_Infantry_Regiment%2C_101st_Airborne_Division_%28Air_Assault%29%2C_takes_a_knee_and_watches_for_enemy_movement_during_a_pause_in_a_road_march_during_Operation_Anaconda%2C_March_2002.jpg/250px-thumbnail.jpg",
    "U.S. soldiers during Operation Anaconda"
  );
  setMap(anaconda, { center: [33.35, 69.22], zoom: 9 }, [
    marker("Shah-i-Kot Valley", 33.35, 69.22, "target", "Operation Anaconda targeted al-Qaeda and Taliban fighters in this valley in March 2002."),
    marker("Gardez", 33.6, 69.22, "major", "The operation staged from nearby eastern Afghan positions."),
  ]);
  setMap(getEvent(dive, "operation-moshtarak"), { center: [31.62, 64.36], zoom: 8 }, [
    marker("Marjah", 31.62, 64.36, "target", "Operation Moshtarak was a major coalition-Afghan offensive in Helmand Province."),
    marker("Helmand Province", 31.0, 64.0, "major", "Helmand became one of the war's toughest Taliban strongholds."),
  ]);
  setMap(getEvent(dive, "resolute-support-mission"), { center: [34.946, 69.265], zoom: 6 }, [
    marker("Bagram", 34.946, 69.265, "target", "The mission shifted toward training and advising Afghan forces while U.S. counterterrorism continued."),
    marker("Kabul", 34.5553, 69.2075, "major", "The Afghan government depended on international support and security assistance."),
  ]);
  setMap(getEvent(dive, "2020-2021-u-s-troop-withdrawal-from-afghanistan"), { center: [34.5553, 69.2075], zoom: 6 }, [
    marker("Doha", 25.2854, 51.531, "major", "The U.S.-Taliban agreement set the path toward withdrawal."),
    marker("Kabul", 34.5553, 69.2075, "target", "The withdrawal left the Afghan government exposed to Taliban advances."),
  ]);
  setMap(getEvent(dive, "2021-taliban-offensive"), { center: [34.5, 66.0], zoom: 5 }, [
    marker("Kandahar", 31.6289, 65.7372, "major", "The Taliban swept through southern strongholds during the 2021 offensive."),
    marker("Kabul", 34.5553, 69.2075, "target", "The offensive ended with the fall of the capital."),
    marker("Northern cities", 36.7, 67.1, "major", "Rapid Taliban gains in the north shattered confidence in Afghan government defenses."),
  ]);
  setMap(getEvent(dive, "fall-of-kabul"), { center: [34.5553, 69.2075], zoom: 10 }, [
    marker("Kabul", 34.5553, 69.2075, "target", "The Taliban entered Kabul on 15 August 2021 as the Afghan government collapsed."),
    marker("Kabul airport", 34.5659, 69.2123, "major", "The evacuation became the final crisis of the U.S. withdrawal."),
  ]);
  const human = getEvent(dive, "international-and-human-dimensions");
  human.slides[0].body =
    "The war killed Afghans, coalition troops, contractors, aid workers, journalists, Taliban fighters, and Afghan security forces, while displacing millions and leaving trauma that outlasted the final withdrawal. U.S. losses were smaller than Afghan losses but politically central: about 2,459 U.S. military personnel died and about 20,769 were wounded in the Afghanistan war.\n\nThe financial cost was enormous. Brown University's Costs of War project estimates the Afghanistan war cost roughly $2.26 trillion when war operations, interest, reconstruction, and veterans' care are counted. The result was deeply contested: al-Qaeda's original sanctuary was disrupted, but the Taliban returned to power in 2021.";
  human.slides[0].stats = [
    {
      val: "2,459 U.S. dead / 20,769 wounded",
      lbl: "U.S. military casualties in Afghanistan, with total war costs estimated around $2.26 trillion.",
      full: true,
    },
  ];
  setMap(human, { center: [34.5, 66.0], zoom: 5 }, [
    marker("Kabul", 34.5553, 69.2075, "target", "The war's political endpoint was the Taliban's return to the capital."),
    marker("Helmand", 31.0, 64.0, "major", "Some of the heaviest coalition fighting and Afghan civilian harm occurred in the south."),
    marker("Kabul airport", 34.5659, 69.2123, "major", "The final evacuation symbolized the war's chaotic end."),
  ]);
  setMap(getEvent(dive, "outcome-and-legacy"), { center: [34.5, 66.0], zoom: 5 }, [
    marker("Kabul", 34.5553, 69.2075, "target", "The Taliban's return to Kabul ended the U.S.-backed Afghan republic."),
    marker("Doha", 25.2854, 51.531, "major", "The withdrawal agreement remains central to the war's legacy."),
  ]);

  writeDive(id, dive);
}

function patchIraqWar() {
  const id = "iraq-war";
  const dive = readDive(id);
  swapIntroStats(dive);
  const images = {
    "origins-and-background": "https://upload.wikimedia.org/wikipedia/commons/0/04/USAF_F-16A_F-15C_F-15E_Desert_Storm_edit2.jpg",
    invasion: "https://cdn.britannica.com/01/98301-050-E0E91CAF/soldiers-Iraqi-civilians.jpg",
    "fall-of-baghdad": "https://www.armyupress.army.mil/portals/7/military-review/img/English/SO-20/Baghdad-bridge.jpg",
    insurgency: "https://cosmonautmag.com/media/images/unnamed_vbWVcK9.format-webp.width-600.webp",
    fallujah: "https://upload.wikimedia.org/wikipedia/commons/f/f7/4-14_Marines_in_Fallujah.jpg",
    "samarra-sectarian-war": "https://gdb.rferl.org/bf1113d6-856f-42ec-9b47-c45fac9865ef_w1080_h608_s.jpg",
    surge: "https://warontherocks.com/wp-content/uploads/2016/11/Awakening-2007-meeting-Iraq.jpg?v=1479898066",
    "us-withdrawal": "https://news.mit.edu/sites/default/files/styles/news_article__image_gallery/public/images/201112/20111216110626-1_0.jpg?itok=jqAHSUNP",
  };
  for (const [eventId, img] of Object.entries(images)) setImages(getEvent(dive, eventId), img);

  setMap(getEvent(dive, "origins-and-background"), { center: [33.3152, 44.3661], zoom: 5 }, [
    marker("Baghdad", 33.3152, 44.3661, "target", "The Iraq War grew out of unresolved post-Gulf War confrontation with Saddam Hussein's regime."),
    marker("Kuwait theater", 29.38, 47.98, "major", "The 1991 Gulf War shaped U.S. policy and the later invasion debate."),
  ]);
  setMap(getEvent(dive, "invasion"), { center: [31.5, 46.0], zoom: 6 }, [
    marker("Kuwait-Iraq border", 30.0, 47.7, "target", "U.S.-led ground forces crossed from Kuwait into Iraq in March 2003."),
    marker("Baghdad axis", 32.5, 45.2, "major", "Coalition forces advanced rapidly toward the capital."),
  ]);
  setMap(getEvent(dive, "fall-of-baghdad"), { center: [33.3152, 44.3661], zoom: 10 }, [
    marker("Baghdad", 33.3152, 44.3661, "target", "The capital fell on 9 April 2003, ending Saddam Hussein's open rule."),
    marker("Tigris bridges", 33.32, 44.42, "major", "Control of bridges and routes into the capital mattered in the final advance."),
  ]);
  setMap(getEvent(dive, "insurgency"), { center: [33.35, 43.78], zoom: 7 }, [
    marker("Fallujah-Ramadi corridor", 33.35, 43.78, "target", "Sunni insurgent networks grew in Anbar Province after the regime collapsed."),
    marker("Baghdad", 33.3152, 44.3661, "major", "Bombings and attacks in the capital showed the insurgency was becoming a national crisis."),
  ]);
  setMap(getEvent(dive, "fallujah"), { center: [33.35, 43.78], zoom: 10 }, [
    marker("Fallujah", 33.35, 43.78, "target", "U.S. and Iraqi forces fought one of the war's largest urban battles here."),
  ]);
  setMap(getEvent(dive, "samarra-sectarian-war"), { center: [34.1966, 43.8739], zoom: 9 }, [
    marker("Al-Askari shrine", 34.1966, 43.8739, "target", "The shrine bombing in Samarra accelerated sectarian killing across Iraq."),
    marker("Baghdad sectarian front", 33.3152, 44.3661, "major", "Baghdad became the center of Sunni-Shia displacement and militia violence."),
  ]);
  setMap(getEvent(dive, "surge"), { center: [33.3152, 44.3661], zoom: 7 }, [
    marker("Baghdad security plan", 33.3152, 44.3661, "target", "The U.S. surge concentrated additional troops in and around Baghdad."),
    marker("Anbar Awakening", 33.35, 43.78, "major", "Sunni tribal forces turned against al-Qaeda in Iraq, helping reduce violence."),
  ]);
  setMap(getEvent(dive, "us-withdrawal"), { center: [33.3152, 44.3661], zoom: 6 }, [
    marker("Baghdad", 33.3152, 44.3661, "target", "The U.S. withdrawal left Iraq sovereign but politically fragile."),
    marker("Kuwait exit route", 30.0, 47.7, "major", "The final U.S. convoy left Iraq toward Kuwait in December 2011."),
  ]);
  setMap(getEvent(dive, "conflict-summary"), { center: [33.3152, 44.3661], zoom: 5 }, [
    marker("Baghdad", 33.3152, 44.3661, "target", "The war removed Saddam but left a violent and unstable political order."),
    marker("Mosul", 36.34, 43.13, "major", "Later ISIS gains showed that the war's consequences continued after U.S. withdrawal."),
  ]);

  writeDive(id, dive);
}

function patchSyrianCivilWar() {
  const id = "syrian-civil-war";
  const dive = readDive(id);
  swapIntroStats(dive);
  const images = {
    "daraa-protests": "https://media.cnn.com/api/v1/images/stellar/prod/120228112937-syria-2011-protests.jpg?q=w_5184,h_3456,x_0,y_0,c_fill",
    "battle-of-aleppo": "https://media.newyorker.com/photos/59097c942179605b11ad9122/master/pass/Wright-Aleppo-ceasefire-2.jpg",
    "ghouta-chemical-attack": "https://snhr.org/arabic/wp-content/uploads/sites/2/2014/08/masecr11200.jpg",
    "rise-of-isis": "https://www.pbs.org/wgbh/frontline/media/uploads/2015/11/2014710123051_5192.jpg",
    "russian-intervention": "https://d2uecu6cucl1lj.cloudfront.net/ari/2018/09/25180746/Arab_Reform_Initiative_Russian_Forces_in_Syria_and_the_Building_of_a_Sustainable_Military_Presence-I.jpg?w=640",
    "fall-of-baghuz": "https://static01.nyt.com/images/2019/03/24/world/middleeast/24ISIS/ISIS-HFO-slide-0BSE-articleLarge.jpg?quality=75&auto=webp&disable=upscale",
    "conflict-summary": "https://c.files.bbci.co.uk/4CAB/production/_88772691_88772680.jpg",
  };
  for (const [eventId, img] of Object.entries(images)) setImages(getEvent(dive, eventId), img);

  setMap(getEvent(dive, "origins-and-background"), { center: [35.0, 38.0], zoom: 5 }, [
    marker("Damascus", 33.5138, 36.2765, "major", "The Assad regime's center of power faced spreading protest and armed revolt."),
    marker("Daraa", 32.625, 36.106, "target", "The uprising began after the arrest and abuse of schoolchildren in Daraa."),
  ]);
  setMap(getEvent(dive, "daraa-protests"), { center: [32.625, 36.106], zoom: 9 }, [
    marker("Daraa", 32.625, 36.106, "target", "Protests and regime violence in Daraa helped ignite the national uprising."),
  ]);
  setMap(getEvent(dive, "battle-of-aleppo"), { center: [36.2021, 37.1343], zoom: 9 }, [
    marker("Aleppo", 36.2021, 37.1343, "target", "Years of urban warfare made Aleppo one of the war's defining battles."),
  ]);
  setMap(getEvent(dive, "ghouta-chemical-attack"), { center: [33.52, 36.35], zoom: 9 }, [
    marker("Eastern Ghouta", 33.52, 36.35, "target", "Rockets carrying sarin struck opposition-held suburbs near Damascus."),
    marker("Damascus", 33.5138, 36.2765, "major", "The attack occurred on the capital's doorstep and triggered global outrage."),
  ]);
  setMap(getEvent(dive, "rise-of-isis"), { center: [35.95, 39.01], zoom: 6 }, [
    marker("Raqqa", 35.95, 39.01, "target", "Raqqa became ISIS's de facto Syrian capital."),
    marker("Mosul", 36.34, 43.13, "major", "ISIS's Iraq-Syria expansion made the war regional."),
  ]);
  setMap(getEvent(dive, "russian-intervention"), { center: [35.4, 35.95], zoom: 7 }, [
    marker("Hmeimim airbase", 35.401, 35.948, "target", "Russian air power from Hmeimim helped rescue Assad's position."),
    marker("Latakia", 35.52, 35.78, "major", "Russia anchored its Syrian intervention on the Mediterranean coast."),
  ]);
  setMap(getEvent(dive, "fall-of-baghuz"), { center: [34.45, 40.95], zoom: 9 }, [
    marker("Baghuz", 34.45, 40.95, "target", "The Syrian Democratic Forces captured ISIS's last territorial enclave here."),
    marker("Euphrates Valley", 35.0, 40.5, "major", "ISIS's final territorial fight unfolded along the Euphrates."),
  ]);
  setMap(getEvent(dive, "fall-of-assad"), { center: [33.5138, 36.2765], zoom: 7 }, [
    marker("Damascus", 33.5138, 36.2765, "target", "The fall of Damascus ended Assad family rule in the main civil-war phase."),
    marker("Aleppo-Hama-Homs axis", 35.0, 37.0, "major", "A rapid opposition offensive moved through Syria's western spine."),
  ]);
  setMap(getEvent(dive, "conflict-summary"), { center: [35.0, 38.0], zoom: 5 }, [
    marker("Damascus", 33.5138, 36.2765, "target", "The regime's collapse did not end Syria's fragmentation or humanitarian crisis."),
    marker("Northern Syria", 36.5, 38.8, "major", "Kurdish, Turkish-backed, jihadist, and post-regime forces remained central to the aftermath."),
  ]);

  writeDive(id, dive);
}

function patchIsraeliOperationSyria() {
  const id = "israeli-operation-in-syria-2024-present";
  const dive = readDive(id);
  cleanExplicitPerspective(dive);
  const druzeImage =
    "https://ichef.bbci.co.uk/news/480/cpsprodpb/af96/live/cee5bc90-629f-11f0-b903-f515e3045d80.jpg.webp";
  const images = {
    "origins-and-background": "https://assets.cfr.org/images/t_gct_w1200/v1755542657/globalconflicttracker/Conflict-in-Syria-Syria20Fall20of20Assad202/Conflict-in-Syria-Syria20Fall20of20Assad202.jpg?_i=AA",
    "buffer-zone": "https://static01.nyt.com/images/2024/01/07/multimedia/07syria-israel-reax-vqtg/07syria-israel-reax-vqtg-articleLarge.jpg?quality=75&auto=webp&disable=upscale",
    "demilitarized-south": "https://vid.alarabiya.net/images/2025/02/17/9dc1553f-50b9-4db4-96a4-d72932cb2ea8/9dc1553f-50b9-4db4-96a4-d72932cb2ea8_16x9_1200x676.JPG?width=555",
    "druze-protection-strikes": druzeImage,
    "continued-operations": druzeImage,
    "conflict-summary": "https://innov8.krd/wp-content/uploads/2026/01/Syria-and-Israel-flags.jpg",
  };
  for (const [eventId, img] of Object.entries(images)) setImages(getEvent(dive, eventId), img);

  const replacements = {
    "buffer-zone":
      "Israeli forces moved into the UN-monitored separation zone and positions on Mount Hermon after Syrian troops withdrew during Assad's collapse. Israel described the deployment as temporary and defensive, aimed at preventing jihadist or Iranian-linked forces from rushing into positions overlooking the Golan Heights.\n\nThe move created a new security reality on the border. It gave Israel more tactical depth, but it also drew criticism from Syria's new authorities and from states that viewed the deployment as a violation of Syrian sovereignty.",
    "arrow-of-bashan":
      "Israel struck Syrian aircraft, naval vessels, air defenses, missiles, and weapons sites to prevent strategic systems from falling to hostile armed groups after the regime collapse. The scale of the strikes showed how quickly Israel tried to reshape the military balance before a new Syrian order could consolidate.\n\nThe operation reduced immediate weapons risks near Israel, but it also signaled that Israel would act unilaterally in Syria whenever it judged the post-Assad vacuum dangerous.",
    "demilitarized-south":
      "Israel called for southern Syria to remain free of heavy forces and hostile armed groups. The demand reflected fear that the collapse of central control could allow Iranian-backed networks, jihadists, or unstable new security forces to establish positions near the Golan frontier.\n\nFor Israel, a demilitarized south would create warning time and reduce rocket, drone, and raid risks. For Syria's new authorities, the demand raised hard questions about sovereignty, border control, and whether outside powers would define the limits of the post-Assad state.",
    "druze-protection-strikes":
      "Israel struck targets near Damascus amid violence involving Druze communities, presenting the action as connected to protection of vulnerable Druze and to security near the southern Syrian frontier. The issue resonated strongly inside Israel because of the Druze community's role in Israeli society and military service.\n\nThe strikes showed how humanitarian, communal, and strategic arguments could overlap. They also risked pulling Israel deeper into Syria's internal fractures if local violence continued.",
    "continued-operations":
      "As of June 15, 2026, Israel continues raids and maintains forward positions to prevent hostile military buildup near the Golan Heights. The operation is shaped by the same fear that drove the first moves after Assad's fall: a vacuum in southern Syria could be filled by jihadist groups, Iranian-linked networks, or armed factions hostile to Israel.\n\nThe longer the operation continues, the more it becomes a political problem as well as a military one. Israel gains local security advantages, but it also faces criticism over sovereignty, escalation risks, and the possibility of becoming entangled in Syria's unstable transition.",
  };
  for (const [eventId, body] of Object.entries(replacements)) {
    const event = getEvent(dive, eventId);
    if (event?.slides?.[0]) event.slides[0].body = body;
  }
  setMap(getEvent(dive, "origins-and-background"), { center: [33.2, 35.9], zoom: 7 }, [
    marker("Golan Heights", 33.05, 35.75, "target", "Assad's collapse created a security vacuum near Israel's most sensitive Syrian frontier."),
    marker("Damascus", 33.5138, 36.2765, "major", "The fall of central authority in Damascus changed the military balance in southern Syria."),
  ]);
  setMap(getEvent(dive, "buffer-zone"), { center: [33.2, 35.85], zoom: 9 }, [
    marker("UN buffer zone", 33.2, 35.85, "target", "Israeli forces entered parts of the separation zone after Syrian troops withdrew."),
    marker("Mount Hermon", 33.416, 35.85, "major", "High ground on Hermon gives observation and warning advantages."),
  ]);
  setMap(getEvent(dive, "arrow-of-bashan"), { center: [33.7, 36.2], zoom: 7 }, [
    marker("Damascus military sites", 33.5138, 36.2765, "target", "Israeli strikes targeted strategic weapons and military infrastructure after Assad's collapse."),
    marker("Syrian air and naval assets", 35.5, 35.8, "major", "Strikes also hit assets beyond the immediate border area."),
  ]);
  setMap(getEvent(dive, "demilitarized-south"), { center: [32.8, 36.0], zoom: 8 }, [
    marker("Southern Syria", 32.8, 36.0, "target", "Israel demanded that this area remain free of heavy or hostile forces."),
    marker("Golan frontier", 33.05, 35.75, "major", "The demand centered on preventing threats from forming next to northern Israel."),
  ]);
  setMap(getEvent(dive, "druze-protection-strikes"), { center: [32.7, 36.6], zoom: 8 }, [
    marker("Suwayda / Druze region", 32.7, 36.6, "target", "Violence involving Druze communities became linked to Israeli warnings and strikes."),
    marker("Damascus approaches", 33.35, 36.25, "major", "Strikes near the capital signaled Israel's willingness to intervene beyond the buffer zone."),
  ]);
  setMap(getEvent(dive, "continued-operations"), { center: [33.05, 35.85], zoom: 8 }, [
    marker("Golan frontier", 33.05, 35.85, "target", "Ongoing Israeli operations focus on preventing hostile buildup near the frontier."),
    marker("Southern Syria", 32.8, 36.0, "major", "The unresolved security vacuum keeps the operation active."),
  ]);
  setMap(getEvent(dive, "conflict-summary"), { center: [33.05, 35.85], zoom: 8 }, [
    marker("Israel-Syria frontier", 33.05, 35.85, "target", "The operation remains centered on the post-Assad frontier and the Golan Heights."),
    marker("Damascus", 33.5138, 36.2765, "major", "Syria's new authorities contest Israeli moves while trying to consolidate power."),
  ]);

  writeDive(id, dive);
}

patchWarOnTerror();
patchAfghanistan();
patchIraqWar();
patchSyrianCivilWar();
patchIsraeliOperationSyria();

console.log("Updated War on Terror, Afghanistan, Iraq War, Syrian Civil War, and Israeli Operation in Syria deep dives.");
