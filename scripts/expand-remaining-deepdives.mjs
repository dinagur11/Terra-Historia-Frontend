import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DRAFT_DIR =
  "C:\\Users\\alons\\Terra-Historia-Backend\\deepdives-drafts";

const wars = {
  "chadian-libyan-war": {
    title: "Chadian-Libyan War", years: [1978, 1987], center: [17, 18],
    origins: "Libya's claim to the Aouzou Strip drew Muammar Gaddafi into Chad's civil conflicts. Libyan troops and local allies repeatedly occupied northern Chad, while rival Chadian factions competed for power.",
    stakes: "Control of northern Chad, the survival of the Chadian state, and Libya's ambition to shape the central Sahara were all at stake.",
    international: "France repeatedly intervened to prevent a Libyan conquest, while the United States and regional governments supported anti-Libyan forces.",
    human: "Years of invasion and civil conflict displaced communities across northern Chad and left civilians exposed to occupation, reprisals, and unstable front lines.",
    outcome: "Fast-moving Chadian forces defeated Libya during the Toyota War. Libya withdrew, and the International Court of Justice awarded the Aouzou Strip to Chad in 1994.",
    casualties: "Thousands killed; roughly 7,500 Libyan troops killed or captured", winner: "Chadian victory",
  },
  "croat-bosniak-war": {
    title: "Croat-Bosniak War", years: [1992, 1994], center: [44, 17],
    origins: "Bosnian Croat and Bosniak forces initially fought together against Bosnian Serb forces, but incompatible territorial projects and local competition shattered that alliance.",
    stakes: "The conflict determined control of central Bosnia and Herzegovina and threatened to divide the internationally recognized Bosnian state.",
    international: "Croatia supported the Bosnian Croat leadership, while international diplomacy and American pressure eventually pushed the former allies back together.",
    human: "Ethnic cleansing, detention camps, massacres, and the destruction of towns and cultural sites devastated mixed communities.",
    outcome: "The Washington Agreement ended Croat-Bosniak fighting and created a federation. Their renewed alliance changed the balance in the wider Bosnian War.",
    casualties: "Approximately 10,000 killed", winner: "Negotiated settlement",
  },
  "croatian-war-of-independence": {
    title: "Croatian War of Independence", years: [1991, 1995], center: [45, 16],
    origins: "Croatia's declaration of independence from Yugoslavia was rejected by Croatian Serb leaders, who received military support from the Yugoslav People's Army and Serbia.",
    stakes: "The war concerned Croatian independence, the borders of the new state, and the future of Serb-majority territories inside Croatia.",
    international: "European mediation, United Nations peacekeepers, sanctions, and shifting regional alliances shaped the conflict without quickly stopping it.",
    human: "Sieges, expulsions, massacres, and the flight of both Croat and Serb civilians transformed communities across the country.",
    outcome: "Croatian offensives recovered most separatist-held territory in 1995. Eastern Slavonia returned peacefully under a later UN-backed agreement.",
    casualties: "Roughly 20,000 killed and hundreds of thousands displaced", winner: "Croatian victory",
  },
  "eastern-front": {
    title: "Eastern Front of World War II", years: [1941, 1945], center: [52, 35],
    origins: "Nazi Germany invaded the Soviet Union in June 1941 in a war of conquest, annihilation, and ideology. The invasion opened the largest land theater in history.",
    stakes: "The survival of the Soviet Union, Germany's access to land and resources, and the fate of millions under Nazi occupation depended on this front.",
    international: "Allied aid helped sustain the Soviet war effort, while Germany relied on Axis partners and resources drawn from occupied Europe.",
    human: "Mass murder, starvation, forced labor, scorched-earth retreats, and immense battlefield losses made civilians central victims of the campaign.",
    outcome: "The Red Army destroyed the main strength of Nazi Germany and captured Berlin. Victory came at extraordinary military and civilian cost.",
    casualties: "More than 30 million military and civilian deaths", winner: "Soviet and Allied victory",
  },
  "estonian-war-of-independence": {
    title: "Estonian War of Independence", years: [1918, 1920], center: [59, 25],
    origins: "Estonia declared independence as the German occupation ended, but the Red Army invaded to restore Bolshevik control over the former Russian imperial province.",
    stakes: "The young republic fought for national survival against Soviet forces and later against German-led Landeswehr formations.",
    international: "British naval support, Finnish volunteers, White Russian forces, and fighting in neighboring Latvia affected Estonia's ability to survive.",
    human: "Mobilization and shifting fronts placed severe pressure on a small population already exhausted by world war and occupation.",
    outcome: "Estonian forces secured the country, and Soviet Russia recognized Estonian independence in the Treaty of Tartu.",
    casualties: "Several thousand killed and wounded", winner: "Estonian victory",
  },
  "finnish-civil-war": {
    title: "Finnish Civil War", years: [1918, 1918], center: [62, 25],
    origins: "Finland's independence from Russia coincided with food shortages, social polarization, armed militias, and the revolutionary crisis created by World War I.",
    stakes: "The Red and White camps fought over political power, social order, and the future direction of the new Finnish state.",
    international: "German troops supported the Whites, while Russian forces and the wider revolutionary struggle influenced the Reds.",
    human: "Executions, prison camps, hunger, and political terror killed many people after the largest battles had ended.",
    outcome: "The White victory secured a non-socialist government but left deep divisions that shaped Finnish politics for decades.",
    casualties: "Approximately 36,000 dead, many from executions and camps", winner: "White victory",
  },
  "first-chechen-war": {
    title: "First Chechen War", years: [1994, 1996], center: [43.3, 45.7],
    origins: "Chechnya declared independence during the collapse of the Soviet Union. Russia attempted to restore federal authority after political pressure and covert intervention failed.",
    stakes: "Moscow fought to preserve Russia's territorial integrity, while Chechen separatists fought for independence.",
    international: "Foreign volunteers and journalists drew attention to the war, but outside governments avoided direct intervention.",
    human: "Indiscriminate bombardment, urban warfare, hostage crises, and abuses by both sides caused severe civilian suffering.",
    outcome: "Chechen forces retook Grozny and forced the Khasavyurt Accord. Russian troops withdrew, but Chechnya's final status remained unresolved.",
    casualties: "Tens of thousands killed, including many civilians", winner: "Chechen tactical victory",
  },
  "gulf-war": {
    title: "Gulf War", years: [1990, 1991], center: [29, 47],
    origins: "Iraq invaded Kuwait after disputes over debt, oil production, and territorial claims. Saddam Hussein expected the annexation to strengthen Iraq's regional position.",
    stakes: "Kuwait's sovereignty, Persian Gulf oil security, and the credibility of the post-Cold War international order were at stake.",
    international: "A United States-led coalition operated under UN authorization and included Arab and European forces.",
    human: "Occupation abuses, aerial bombardment, battlefield deaths, displacement, and burning oil wells produced lasting harm.",
    outcome: "Coalition forces liberated Kuwait and destroyed much of Iraq's deployed army, but Saddam Hussein remained in power.",
    casualties: "Tens of thousands of Iraqi deaths; fewer than 400 coalition deaths", winner: "Coalition victory",
  },
  "indochina-wars": {
    title: "Indochina Wars", years: [1946, 1991], center: [16, 105],
    origins: "The collapse of French colonial authority and competing nationalist, communist, and anti-communist movements produced decades of interconnected warfare.",
    stakes: "Vietnamese independence, the political future of Laos and Cambodia, and the regional balance of the Cold War were all contested.",
    international: "France, the United States, China, and the Soviet Union supplied or deployed forces, turning local struggles into international wars.",
    human: "Repeated bombing, displacement, political violence, and unexploded ordnance affected generations across Vietnam, Laos, and Cambodia.",
    outcome: "Colonial rule ended and communist governments prevailed in much of Indochina, but regional wars continued after the fall of Saigon.",
    casualties: "Millions killed across several connected wars", winner: "Communist and anti-colonial victories, followed by regional conflict",
  },
  "indonesian-national-revolution": {
    title: "Indonesian National Revolution", years: [1945, 1949], center: [-3, 113],
    origins: "Indonesian nationalists declared independence after Japan's surrender, while the Netherlands attempted to restore colonial rule.",
    stakes: "The revolution determined whether the Indonesian Republic would survive and whether Dutch colonial power could return.",
    international: "British forces initially managed the Japanese surrender, while the United Nations and United States later pressured the Netherlands toward negotiation.",
    human: "Urban battles, guerrilla warfare, reprisals, and population displacement caused extensive military and civilian losses.",
    outcome: "The Netherlands transferred sovereignty in 1949 after military campaigns failed to eliminate the republic and international pressure increased.",
    casualties: "More than 100,000 Indonesians and several thousand Dutch troops killed", winner: "Indonesian victory",
  },
  "iran-israel-proxy-conflict": {
    title: "Iran-Israel Proxy Conflict", years: [1985, 2026], center: [33, 42],
    origins: "After Iran's 1979 revolution, Tehran and Israel became strategic enemies. Iran built partnerships with armed groups while Israel sought to disrupt Iranian influence and military capabilities.",
    stakes: "Regional deterrence, nuclear and missile capabilities, influence in Lebanon and Syria, and the security of Israel and Iran's partners drive the conflict.",
    international: "The United States, Gulf states, Syria, Russia, and non-state armed groups shape a confrontation spread across several countries.",
    human: "Civilians have faced missile attacks, airstrikes, displacement, and the risk that limited exchanges could become a wider regional war.",
    outcome: "The conflict evolved from covert operations and proxy warfare into direct exchanges. No durable settlement has ended the confrontation.",
    casualties: "Thousands killed across interconnected regional conflicts", winner: "Ongoing; no decisive winner",
  },
  "kosovo-war": {
    title: "Kosovo War", years: [1998, 1999], center: [42.6, 21],
    origins: "Years of repression and failed peaceful resistance gave way to an armed insurgency by the Kosovo Liberation Army and a Serbian counterinsurgency.",
    stakes: "The conflict concerned Serbian sovereignty, Kosovo Albanian self-determination, and the protection of civilians.",
    international: "Failed diplomacy was followed by a NATO air campaign against Yugoslavia and the deployment of international forces.",
    human: "Mass displacement, massacres, reprisals, and postwar attacks uprooted Albanian, Serb, Roma, and other communities.",
    outcome: "Yugoslav forces withdrew and Kosovo came under international administration. Kosovo later declared independence, which Serbia still rejects.",
    casualties: "Approximately 13,000 killed and over one million displaced", winner: "Kosovo Albanian and NATO strategic victory",
  },
  "lapland-war": {
    title: "Lapland War", years: [1944, 1945], center: [67, 26],
    origins: "Finland's armistice with the Soviet Union required it to remove German forces that had been stationed in northern Finland during the Continuation War.",
    stakes: "Finland needed to satisfy Soviet armistice terms while avoiding the destruction of its northern territory.",
    international: "The war was shaped by Finland's armistice obligations and Germany's wider retreat from the Arctic.",
    human: "German scorched-earth tactics destroyed towns, roads, and bridges and displaced much of Lapland's civilian population.",
    outcome: "Finnish forces pushed the Germans into Norway. Finland fulfilled the armistice requirement but inherited a devastated north.",
    casualties: "Roughly 2,000 military casualties and extensive civilian displacement", winner: "Finnish victory",
  },
  "lithuanian-soviet-war": {
    title: "Lithuanian-Soviet War", years: [1918, 1919], center: [55, 24],
    origins: "Lithuania declared independence during the collapse of imperial Russia and Germany, but Soviet forces invaded as German troops withdrew.",
    stakes: "The campaign decided whether Lithuania would become an independent republic or a Soviet republic.",
    international: "German volunteer formations, Polish forces, and the wider Russian Civil War shaped the rapidly changing front.",
    human: "The young state mobilized scarce resources while towns repeatedly changed hands and civilians endured requisitions and insecurity.",
    outcome: "Lithuanian forces halted and expelled the Soviet offensive, preserving the republic despite further wars over its borders.",
    casualties: "Several thousand killed, wounded, or captured", winner: "Lithuanian victory",
  },
  "polish-lithuanian-war": {
    title: "Polish-Lithuanian War", years: [1919, 1920], center: [54.7, 24.8],
    origins: "Poland and Lithuania emerged from World War I with overlapping claims, especially over Vilnius and the surrounding region.",
    stakes: "The conflict determined control of Vilnius and poisoned relations between two newly independent neighboring states.",
    international: "The fighting overlapped with the Polish-Soviet War, while the League of Nations attempted unsuccessfully to mediate.",
    human: "Military operations and contested administration divided communities with Polish, Lithuanian, Belarusian, and Jewish populations.",
    outcome: "Polish-aligned forces seized Vilnius, which Poland later annexed. Lithuania refused to recognize the settlement until 1938.",
    casualties: "Thousands killed and wounded", winner: "Polish territorial victory",
  },
  "rwandan-civil-war": {
    title: "Rwandan Civil War", years: [1990, 1994], center: [-2, 30],
    origins: "The Rwandan Patriotic Front, formed largely by Tutsi exiles, invaded Rwanda in 1990 against a government facing political crisis and entrenched ethnic division.",
    stakes: "The war concerned refugee return, political power, and the survival of communities targeted by extremist ideology.",
    international: "Uganda supported the RPF, France backed the Rwandan government, and a weak UN mission struggled to implement the Arusha Accords.",
    human: "The 1994 genocide against the Tutsi and killings of moderate Hutu transformed the war into one of the century's worst human catastrophes.",
    outcome: "The RPF captured Kigali and ended the genocide, but mass flight and armed groups in Zaire helped ignite further regional wars.",
    casualties: "Approximately 800,000 people murdered during the genocide, plus war deaths", winner: "Rwandan Patriotic Front victory",
  },
  "second-chechen-war": {
    title: "Second Chechen War", years: [1999, 2009], center: [43.3, 45.7],
    origins: "An Islamist incursion into Dagestan and apartment bombings in Russia preceded a renewed Russian invasion of separatist Chechnya.",
    stakes: "Russia sought permanent control and the destruction of separatist forces, while the insurgency increasingly adopted Islamist and regional aims.",
    international: "Foreign fighters joined parts of the insurgency, but Moscow largely prevented international involvement.",
    human: "Urban destruction, disappearances, torture, terrorism, and counterinsurgency abuses deeply affected civilians across the North Caucasus.",
    outcome: "Russia restored control through overwhelming force and a loyal Chechen government, while insurgency spread into neighboring republics before declining.",
    casualties: "Tens of thousands killed", winner: "Russian federal victory",
  },
  "shaba-ii": {
    title: "Shaba II", years: [1978, 1978], center: [-11, 27],
    origins: "Exiled Katangan fighters entered Zaire's mineral-rich Shaba Province from Angola in a renewed attempt to challenge Mobutu Sese Seko's government.",
    stakes: "The invasion threatened Kolwezi, foreign civilians, strategic mines, and the stability of Zaire.",
    international: "French and Belgian airborne forces intervened, while Western and African governments supported Mobutu during the Cold War crisis.",
    human: "Fighting and killings in Kolwezi endangered civilians and triggered a large evacuation.",
    outcome: "Foreign intervention retook Kolwezi and defeated the incursion, preserving Mobutu's government without resolving Zaire's deeper instability.",
    casualties: "Hundreds killed", winner: "Zairian and allied victory",
  },
  "south-lebanon-conflict": {
    title: "South Lebanon Conflict", years: [1985, 2000], center: [33.3, 35.5],
    origins: "After Israel's partial withdrawal from Lebanon in 1985, it maintained a security zone with the South Lebanon Army while Hezbollah led an expanding resistance campaign.",
    stakes: "Israel sought border security; Hezbollah sought to end the occupation and establish itself as a leading military and political force.",
    international: "Iran and Syria supported Hezbollah, while Israel backed the South Lebanon Army and conducted repeated operations across Lebanon.",
    human: "Shelling, raids, occupation practices, and attacks on villages caused civilian casualties and repeated displacement.",
    outcome: "Israel withdrew in 2000 and the South Lebanon Army collapsed. Hezbollah claimed victory, but the border remained volatile.",
    casualties: "Thousands of combatants and civilians killed", winner: "Hezbollah strategic victory",
  },
  "soviet-finnish-wars": {
    title: "Soviet-Finnish Wars", years: [1939, 1944], center: [64, 28],
    origins: "Soviet security demands and Finland's refusal to cede strategic territory led to the Winter War; Finland later joined Germany's invasion to recover its losses.",
    stakes: "Finland fought for survival and lost territory, while the Soviet Union sought to secure Leningrad and its northwestern frontier.",
    international: "The wars intersected first with Allied sympathy for Finland and later with the German-Soviet struggle on the Eastern Front.",
    human: "Repeated mobilization, evacuation, territorial loss, and frontline destruction burdened Finnish and Soviet civilians and soldiers.",
    outcome: "Finland preserved independence but ceded territory and accepted strict armistice terms. It then expelled German troops from Lapland.",
    casualties: "Hundreds of thousands of military casualties across the wars", winner: "Soviet territorial victory; Finland retained independence",
  },
  "tajikistani-civil-war": {
    title: "Tajikistani Civil War", years: [1992, 1997], center: [39, 71],
    origins: "Political competition after Soviet collapse split Tajikistan among regional, former communist, democratic, and Islamist factions.",
    stakes: "The war determined control of the new state and the political place of opposition movements and regional communities.",
    international: "Russia and Uzbekistan backed the government, while opposition forces operated from Afghanistan and peace talks involved the UN and Iran.",
    human: "Fighting, persecution, and economic collapse killed tens of thousands and displaced hundreds of thousands.",
    outcome: "A 1997 peace agreement integrated parts of the opposition into government, though power later became increasingly centralized.",
    casualties: "Approximately 50,000-100,000 killed", winner: "Negotiated settlement favoring the government",
  },
  "toyota-war": {
    title: "Toyota War", years: [1986, 1987], center: [18, 20],
    origins: "The final phase of the Chadian-Libyan conflict began when unified Chadian forces challenged Libya's fortified occupation of northern Chad.",
    stakes: "The campaign would decide control of northern Chad and expose whether Libya's larger, heavily equipped army could hold the desert.",
    international: "France provided air protection and outside governments supplied intelligence and weapons to Chad.",
    human: "The rapid campaign reduced prolonged occupation but brought intense fighting and losses around bases and desert communities.",
    outcome: "Chadian units using fast civilian trucks outmaneuvered and destroyed Libyan formations, forcing Libya to accept a ceasefire.",
    casualties: "Roughly 1,000 Chadian and 7,500 Libyan troops killed or captured", winner: "Chadian victory",
  },
  "transnistria-war": {
    title: "Transnistria War", years: [1990, 1992], center: [47.2, 29.4],
    origins: "As the Soviet Union collapsed, Russian-speaking authorities east of the Dniester rejected Moldovan nationalism and declared a separate republic.",
    stakes: "The conflict concerned Moldova's territorial integrity, Transnistrian autonomy, and Russia's influence in the former Soviet space.",
    international: "Elements of Russia's 14th Army supported Transnistrian forces and ultimately imposed a ceasefire.",
    human: "Short but intense fighting displaced civilians and divided communities along a militarized de facto border.",
    outcome: "A ceasefire froze the conflict. Transnistria remains internationally recognized as part of Moldova but outside its control.",
    casualties: "Roughly 1,000 killed", winner: "Transnistrian de facto victory",
  },
  "turkish-war-of-independence": {
    title: "Turkish War of Independence", years: [1919, 1923], center: [39, 35],
    origins: "The Ottoman defeat in World War I brought Allied occupation and plans to partition Anatolia, provoking a nationalist movement led by Mustafa Kemal.",
    stakes: "The war determined whether Anatolia would be partitioned and whether a sovereign Turkish national state would replace the Ottoman order.",
    international: "Greek, Armenian, French, British, Italian, and Soviet policies all shaped the connected campaigns and negotiations.",
    human: "Conventional war, forced migration, communal violence, and population exchange transformed Anatolia and neighboring regions.",
    outcome: "Nationalist victories overturned the proposed partition. The Treaty of Lausanne recognized the Republic of Turkey.",
    casualties: "Hundreds of thousands killed and more than one million displaced", winner: "Turkish nationalist victory",
  },
  "war-in-abkhazia": {
    title: "War in Abkhazia", years: [1992, 1993], center: [43, 41],
    origins: "The collapse of the Soviet Union intensified disputes between the Georgian government and Abkhaz separatists over autonomy, identity, and political control.",
    stakes: "The conflict determined control of Abkhazia and the status of its Georgian and Abkhaz populations.",
    international: "North Caucasian volunteers and Russian military elements aided Abkhaz forces, while Russia later became the principal mediator and peacekeeper.",
    human: "Massacres and ethnic cleansing drove most ethnic Georgians from Abkhazia and left deep demographic and political scars.",
    outcome: "Abkhaz forces captured Sukhumi and established de facto independence. The dispute remains unresolved internationally.",
    casualties: "Approximately 10,000-30,000 killed and over 200,000 displaced", winner: "Abkhaz separatist victory",
  },
  "war-in-afghanistan-2001-2021": {
    title: "War in Afghanistan", years: [2001, 2021], center: [34, 66],
    origins: "After the September 11 attacks, the United States demanded that the Taliban surrender al-Qaeda leaders. A US-led intervention then removed the Taliban government.",
    stakes: "The war evolved from counterterrorism into an attempt to build and defend an Afghan republic against a renewed Taliban insurgency.",
    international: "NATO, neighboring states, aid organizations, and Pakistan's relationship with the Taliban all shaped the twenty-year campaign.",
    human: "Bombings, raids, insurgent attacks, displacement, and institutional collapse killed and injured large numbers of Afghan civilians.",
    outcome: "Foreign forces withdrew in 2021, the Afghan republic collapsed, and the Taliban returned to power.",
    casualties: "More than 170,000 killed, including over 46,000 civilians", winner: "Taliban victory",
  },
  "war-in-southern-vietnam": {
    title: "War in Southern Vietnam", years: [1955, 1975], center: [11, 107],
    origins: "Vietnam's post-Geneva division left rival governments in Hanoi and Saigon. Communist cadres and southern insurgents challenged the South Vietnamese state.",
    stakes: "The conflict concerned Vietnamese reunification, the survival of South Vietnam, and the credibility of American containment policy.",
    international: "North Vietnam supported the insurgency, while the United States escalated from advisers to a large combat force and extensive air power.",
    human: "Guerrilla warfare, bombing, forced relocation, and political violence devastated rural communities.",
    outcome: "North Vietnamese forces captured Saigon in 1975, ending South Vietnam and reunifying the country under communist rule.",
    casualties: "Millions of Vietnamese military and civilian deaths", winner: "North Vietnamese victory",
  },
  "war-of-dagestan": {
    title: "War of Dagestan", years: [1999, 1999], center: [42.8, 46.8],
    origins: "Islamist fighters based in Chechnya entered Dagestan hoping to trigger an uprising and establish a broader Islamic state.",
    stakes: "The incursion challenged Russian federal authority and threatened to spread insurgency across the North Caucasus.",
    international: "Foreign fighters joined the militants, but the campaign remained primarily a Russian and Dagestani response.",
    human: "Mountain villages became battlefields, civilians fled, and subsequent violence contributed to a much wider renewed war in Chechnya.",
    outcome: "Russian forces and local Dagestani militias expelled the attackers. The crisis became the immediate prelude to the Second Chechen War.",
    casualties: "Hundreds killed", winner: "Russian and Dagestani victory",
  },
  "war-on-terrorism": {
    title: "War on Terror", years: [2001, 2026], center: [28, 45],
    origins: "The United States launched a global counterterrorism campaign after the September 11 attacks, targeting al-Qaeda and governments accused of supporting terrorism.",
    stakes: "The campaign sought to prevent attacks and dismantle armed networks, but expanded into wars, occupations, surveillance, and state-building efforts.",
    international: "NATO allies, regional partners, rival powers, and numerous local armed groups participated across multiple theaters.",
    human: "Civilian deaths, displacement, detention abuses, terrorism, and prolonged instability affected societies far beyond the original attack sites.",
    outcome: "Al-Qaeda's central leadership was weakened, but new groups emerged and several interventions produced long wars without stable political settlements.",
    casualties: "Hundreds of thousands directly killed and millions displaced", winner: "No single outcome; campaign remains contested",
  },
};

function makeEvent(id, year, title, sub, center, slides) {
  return {
    id,
    year,
    date: `${year}-01-01`,
    title,
    sub,
    view: { center, zoom: 3 },
    markers: [],
    regions: [],
    slides,
  };
}

function withImage(slide, image, cap) {
  return image ? { ...slide, img: image, cap } : slide;
}

function openingEvent(war, image) {
  return makeEvent(
    "origins-and-road-to-war",
    war.years[0],
    "Origins and Road to War",
    `How the ${war.title} began`,
    war.center,
    [
      withImage({
        title: `Before the ${war.title}`,
        body: war.origins,
        stats: [
          { val: `${war.years[0]}-${war.years[1]}`, lbl: "Conflict period" },
          { val: war.stakes, lbl: "What was at stake", full: true },
        ],
      }, image, `Opening context for the ${war.title}`),
      {
        title: "The Conflict Takes Shape",
        body: `${war.stakes} The opening phase established the political goals, alliances, and military problems that shaped every later campaign.`,
      },
    ]
  );
}

function widerWarEvent(war) {
  return makeEvent(
    "international-and-human-dimensions",
    Math.max(war.years[0], war.years[1] - 1),
    "International and Human Dimensions",
    `The wider impact of the ${war.title}`,
    war.center,
    [
      {
        title: "International Dimension",
        body: war.international,
      },
      {
        title: "The Human Cost",
        body: war.human,
        stats: [{ val: war.casualties, lbl: "Estimated human cost", full: true }],
      },
    ]
  );
}

function closingEvent(war, image) {
  return makeEvent(
    "outcome-and-legacy",
    war.years[1],
    "Outcome and Legacy",
    `How the ${war.title} ended and what followed`,
    war.center,
    [
      {
        title: `The End of the ${war.title}`,
        body: war.outcome,
      },
      withImage({
        title: `War Summary: ${war.title}`,
        body: `${war.outcome} ${war.human}`,
        stats: [
          { val: war.winner, lbl: "Outcome / winner" },
          { val: war.casualties, lbl: "Casualties / human cost" },
          { val: war.outcome, lbl: "Lasting legacy", full: true },
        ],
      }, image, `The outcome and legacy of the ${war.title}`),
    ]
  );
}

function enrichEvent(event, war, index, total) {
  const slides = Array.isArray(event.slides) ? event.slides : [];
  const firstSlide = slides[0] || { title: event.title };

  if (
    !firstSlide.body ||
    firstSlide.body.startsWith("Draft note for ") ||
    firstSlide.body.startsWith("Generated draft for ")
  ) {
    firstSlide.body = `${event.title} marked an important episode in the ${war.title}. It showed how the conflict's political goals were being translated into military action and placed new pressure on both the battlefield and surrounding communities.`;
  }

  const kept = slides.filter(
    (slide, slideIndex) =>
      slideIndex === 0 ||
      (!["Why This Moment Matters", "Consequences"].includes(slide.title) &&
        !slide.body?.startsWith("Generated draft.") &&
        !slide.title?.startsWith("War Summary:"))
  );

  kept.push({
    title: "Why This Moment Matters",
    body: `${event.title} was more than an isolated engagement. It ${
      index < total / 2
        ? "helped define the conflict's direction and exposed the strengths and weaknesses of the opposing sides"
        : "reflected the changing balance of power and pushed the conflict closer to its eventual outcome"
    }. ${war.stakes}`,
    stats: [
      { val: String(event.year), lbl: "Year" },
      { val: `${index + 1} of ${total}`, lbl: "Existing timeline event" },
    ],
  });

  kept.push({
    title: "Consequences",
    body: `The effects of ${event.title} extended beyond its immediate result. ${war.human} Its place in the wider campaign also influenced later military choices and political calculations.`,
  });

  return { ...event, slides: kept };
}

for (const [id, war] of Object.entries(wars)) {
  const path = join(DRAFT_DIR, `${id}.generated.json`);
  const original = JSON.parse((await readFile(path, "utf8")).replace(/^\uFEFF/, ""));
  const existing = original.filter(
    (event) =>
      !["origins-and-road-to-war", "international-and-human-dimensions", "outcome-and-legacy"].includes(event.id)
  ).sort((a, b) =>
    String(a.date || `${a.year}-01-01`).localeCompare(
      String(b.date || `${b.year}-01-01`)
    )
  );
  const images = existing.flatMap((event) =>
    (event.slides || []).map((slide) => slide.img).filter(Boolean)
  );
  const enriched = existing.map((event, index) =>
    enrichEvent(event, war, index, existing.length)
  );
  const result = [
    openingEvent(war, images[0]),
    ...enriched,
    widerWarEvent(war),
    closingEvent(war, images.at(-1)),
  ];

  await writeFile(path, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(`${id}: ${original.length} -> ${result.length} events`);
}
