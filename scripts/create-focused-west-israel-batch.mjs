import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = "C:\\Users\\alons\\Terra-Historia-Backend";
const DIR = join(ROOT, "deepdives-drafts");
const INDEX = join(ROOT, "deepdives-index.json");
const images = {
  afghan: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/U.S._Soldiers_of_the_10th_Mountain_Division_during_Operation_Enduring_Freedom.jpg/3840px-U.S._Soldiers_of_the_10th_Mountain_Division_during_Operation_Enduring_Freedom.jpg",
  yugoslav: "https://upload.wikimedia.org/wikipedia/commons/8/83/Vukovar-watertower-after-war.jpg",
  libya: "https://upload.wikimedia.org/wikipedia/commons/8/82/Tschad_GUNT.jpg",
  lebanon: "https://upload.wikimedia.org/wikipedia/commons/3/3f/USS_New_Jersey_firing_in_Beirut%2C_1984.jpg",
  israel: "https://upload.wikimedia.org/wikipedia/commons/9/9f/PikiWiki_Israel_20804_The_Palmach.jpg",
  gaza: "https://commons.wikimedia.org/wiki/Special:FilePath/IDF_Iron_Dome_2021.jpg",
  hezbollah: "https://commons.wikimedia.org/wiki/Special:FilePath/2006_Lebanon_War._CLII.jpg",
  syria: "https://upload.wikimedia.org/wikipedia/commons/5/59/War_in_Abkhazia_1992.PNG",
};
const stat = (val, lbl, full = false) => ({ val, lbl, ...(full ? { full: true } : {}) });
const event = (id, date, title, body, fact, image, center) => ({ id, year: +date.slice(0, 4), date, title, sub: "", view: { center, zoom: 4 }, markers: [], regions: [], slides: [{ title, img: image, cap: `Historical overview: ${title}`, body, stats: [stat(fact, "Key detail")] }] });
const dive = ({ title, previous, start, end, period, connection, stakes, image, center, events, summary, outcome, cost }) => {
  const first = event("origins-and-background", start, `From ${previous} to ${title}`, `${connection}\n\n${stakes}`, period, image, center);
  first.sub = `Connection and background to ${title}`;
  first.slides[0].stats.push(stat(stakes, "What was at stake", true));
  for (const e of events) e.sub = `Part of ${title}`;
  const last = event("conflict-summary", end, `Conflict Summary: ${title}`, summary, outcome, image, center);
  last.sub = `Final summary of ${title}`;
  last.slides[0].stats.push(stat(cost, "Human cost"), stat(summary, "Final assessment", true));
  return [first, ...events, last];
};
const E = (id, date, title, body, fact, image, center) => event(id, date, title, body, fact, image, center);
const entries = [
  {
    id: "soviet-afghan-war", title: "Soviet-Afghan War", image: images.afghan, description: "Follow the Soviet intervention, Afghan resistance, Western support, and withdrawal that reshaped the late Cold War.",
    data: dive({ title: "Soviet-Afghan War", previous: "Cold War Proxy Conflicts", start: "1979-12-24", end: "1989-02-15", period: "1979-1989", image: images.afghan, center: [34, 66],
      connection: "A communist coup in 1978 triggered revolt across Afghanistan. As the new government fractured and repression widened resistance, the Soviet Union intervened to preserve an allied regime on its southern frontier.",
      stakes: "Afghans resisted foreign occupation and communist rule, while the United States, Pakistan, Saudi Arabia, and others backed the mujahideen to impose costs on Soviet expansion.",
      events: [
        E("soviet-invasion", "1979-12-24", "Soviet Invasion", "Soviet forces entered Afghanistan, seized key facilities, killed leader Hafizullah Amin, and installed Babrak Karmal. Moscow expected a limited intervention but became trapped in a nationwide insurgency.", "December 1979", images.afghan, [34.5, 69.2]),
        E("mujahideen-resistance", "1980-01-01", "Mujahideen Resistance Expands", "Decentralized Afghan resistance groups used mountain sanctuaries and support routed through Pakistan. Soviet firepower controlled cities and roads but could not reliably pacify the countryside.", "Insurgency spreads nationwide", images.afghan, [34, 66]),
        E("panjshir-offensives", "1982-04-01", "Panjshir Offensives", "Repeated Soviet offensives failed to eliminate Ahmad Shah Massoud's forces in the Panjshir Valley. Temporary truces and withdrawals showed the limits of Soviet control.", "1980-1985", images.afghan, [35.3, 69.7]),
        E("stinger-missiles", "1986-09-01", "Stinger Missiles Reach the Resistance", "US-supplied Stinger missiles improved the mujahideen's ability to challenge Soviet aircraft. They mattered tactically, although wider political, military, and economic pressures drove Moscow's decision to leave.", "Introduced in 1986", images.afghan, [34, 66]),
        E("operation-magistral", "1987-11-19", "Operation Magistral", "Soviet and Afghan government forces reopened the road to besieged Khost in one of the war's largest late operations, demonstrating continued battlefield capability without resolving the insurgency.", "Nov 1987-Jan 1988", images.afghan, [33.3, 69.9]),
        E("geneva-accords", "1988-04-14", "Geneva Accords", "Afghanistan and Pakistan signed agreements backed by the Soviet Union and United States. The accords established a timetable for Soviet withdrawal but did not settle Afghanistan's civil war.", "14 April 1988", images.afghan, [46.2, 6.1]),
        E("soviet-withdrawal", "1989-02-15", "Final Soviet Withdrawal", "The last Soviet troops crossed the Friendship Bridge under General Boris Gromov. The communist Afghan government survived until 1992, while civil war and militant networks endured.", "15 February 1989", images.afghan, [37.2, 67.4]),
      ], summary: "The Soviet Union withdrew without defeating the Afghan resistance. Western and regional support helped deny Moscow victory, but Afghanistan was left devastated and armed factions later fought one another, creating conditions exploited by the Taliban and transnational jihadists.", outcome: "Soviet withdrawal; mujahideen strategic victory", cost: "Roughly one million Afghans killed and millions displaced" }),
  },
  {
    id: "yugoslav-wars", title: "Yugoslav Wars", image: images.yugoslav, description: "Trace Yugoslavia's violent breakup, ethnic cleansing, Western intervention, and the creation of successor states.",
    data: dive({ title: "Yugoslav Wars", previous: "Postwar Yugoslavia", start: "1991-06-27", end: "2001-08-13", period: "1991-2001", image: images.yugoslav, center: [44, 19],
      connection: "After Tito's death, economic crisis, weakening federal institutions, and competing nationalisms destabilized socialist Yugoslavia. Serbian leader Slobodan Milosevic's centralizing project intensified fears in other republics.",
      stakes: "The wars determined whether republics could leave Yugoslavia and whether borders would be changed by force, while civilians faced ethnic cleansing, siege warfare, and mass atrocities.",
      events: [
        E("ten-day-war", "1991-06-27", "Ten-Day War in Slovenia", "The Yugoslav People's Army attempted to reverse Slovenia's declaration of independence but withdrew after brief fighting and European mediation.", "27 June-7 July 1991", images.yugoslav, [46.1, 14.8]),
        E("croatian-war", "1991-08-25", "War in Croatia", "Serb forces backed by the Yugoslav army seized territory as Croatia fought for independence. The siege and destruction of Vukovar became a symbol of the war's brutality.", "Vukovar fell in November 1991", images.yugoslav, [45.35, 19]),
        E("bosnian-war", "1992-04-06", "Bosnian War Begins", "Bosnia's independence brought war among Bosniak, Serb, and Croat forces. Bosnian Serb campaigns created detention camps, expelled populations, and subjected Sarajevo to a prolonged siege.", "1992-1995", images.yugoslav, [44, 18]),
        E("nato-bosnia", "1995-08-30", "NATO Intervenes in Bosnia", "After years of failed diplomacy and atrocities including the Srebrenica genocide, NATO's Operation Deliberate Force struck Bosnian Serb positions and helped create conditions for the Dayton peace agreement.", "Operation Deliberate Force", images.yugoslav, [44, 18]),
        E("kosovo-war", "1998-02-28", "Kosovo War", "Conflict between Serbian forces and the Kosovo Liberation Army escalated into widespread displacement and abuses. After diplomacy failed, NATO launched an air campaign in March 1999.", "1998-1999", images.yugoslav, [42.6, 21]),
        E("milosevic-falls", "2000-10-05", "Milosevic Falls", "Mass protests forced Milosevic to concede electoral defeat. His removal opened Serbia toward democratic transition and cooperation with international war-crimes proceedings.", "5 October 2000", images.yugoslav, [44.8, 20.5]),
        E("ohrid-agreement", "2001-08-13", "Ohrid Framework Agreement", "Western mediation helped end fighting between Macedonian forces and ethnic Albanian insurgents, closing the last major armed phase of Yugoslavia's dissolution.", "13 August 2001", images.yugoslav, [41.1, 20.8]),
      ], summary: "Yugoslavia broke into successor states after wars marked by ethnic cleansing and grave crimes. NATO intervention helped end the Bosnia and Kosovo conflicts, though its methods remain debated. Western-backed settlements stopped large-scale war and anchored much of the region toward Euro-Atlantic institutions.", outcome: "Yugoslavia dissolved; successor states established", cost: "About 130,000 killed and millions displaced" }),
  },
  {
    id: "first-libyan-civil-war", title: "First Libyan Civil War", image: images.libya, description: "Explore Libya's 2011 uprising, NATO's civilian-protection mission, Gaddafi's fall, and the unstable aftermath.",
    data: dive({ title: "First Libyan Civil War", previous: "Arab Spring", start: "2011-02-15", end: "2011-10-31", period: "2011", image: images.libya, center: [28, 17],
      connection: "Arab Spring uprisings challenged entrenched authoritarian governments across the region. In Libya, protests against Muammar Gaddafi's four-decade dictatorship were met with violence and rapidly became an armed revolt.",
      stakes: "The opposition sought to end dictatorship. Western governments argued intervention was necessary to protect civilians, especially in Benghazi, while accepting a mission whose practical effect was to help defeat Gaddafi.",
      events: [
        E("uprising", "2011-02-15", "Uprising Begins", "Protests in Benghazi spread after security forces arrested activists and fired on demonstrators. Defections and captured weapons transformed the uprising into civil war.", "February 2011", images.libya, [32.1, 20.1]),
        E("gaddafi-counteroffensive", "2011-03-06", "Gaddafi Counteroffensive", "Regime forces retook towns and advanced toward Benghazi. Gaddafi's threats and the risk of a violent assault drove demands for international action.", "Advance toward Benghazi", images.libya, [31, 18]),
        E("resolution-1973", "2011-03-17", "UN Security Council Resolution 1973", "The Security Council authorized all necessary measures to protect civilians and established a no-fly zone, while excluding a foreign occupation force.", "17 March 2011", images.libya, [40.7, -74]),
        E("nato-intervention", "2011-03-19", "Western and NATO Intervention", "US, British, and French forces struck Libyan air defenses and regime units threatening Benghazi. NATO assumed command on March 31 and sustained the air campaign.", "NATO flew over 26,000 sorties", images.libya, [32, 19]),
        E("fall-of-tripoli", "2011-08-20", "Fall of Tripoli", "Rebel forces entered Tripoli as regime control collapsed. NATO air power and intelligence materially assisted the advance while Libyans conducted the ground campaign.", "August 2011", images.libya, [32.9, 13.2]),
        E("gaddafi-killed", "2011-10-20", "Gaddafi Killed at Sirte", "Opposition fighters captured and killed Gaddafi after his convoy was struck while fleeing Sirte. His death ended organized regime resistance but not Libya's political fragmentation.", "20 October 2011", images.libya, [31.2, 16.6]),
        E("nato-mission-ends", "2011-10-31", "NATO Mission Ends", "NATO ended Operation Unified Protector after seven months. The intervention prevented the assault on Benghazi and helped overthrow a dictatorship, but international and Libyan leaders failed to build durable postwar security institutions.", "31 October 2011", images.libya, [28, 17]),
      ], summary: "The uprising and NATO intervention ended Gaddafi's dictatorship and protected opposition-held cities from regime attack. Yet the coalition had no adequate plan for disarming militias or building institutions, and Libya descended into renewed civil war. The case shows both the value and limits of intervention without a credible aftermath strategy.", outcome: "Gaddafi overthrown; unstable postwar transition", cost: "Thousands killed and hundreds of thousands displaced" }),
  },
  {
    id: "lebanese-civil-war", title: "Lebanese Civil War", image: images.lebanon, description: "Follow Lebanon's civil war, foreign interventions, the PLO's armed presence, and Hezbollah's emergence.",
    data: dive({ title: "Lebanese Civil War", previous: "Yom Kippur War", start: "1975-04-13", end: "1990-10-13", period: "1975-1990", image: images.lebanon, center: [33.9, 35.8],
      connection: "Regional conflict shifted toward Lebanon as the PLO established an armed state-within-a-state after expulsion from Jordan. Lebanon's fragile sectarian system, inequality, and competing foreign patrons made confrontation increasingly likely.",
      stakes: "Lebanese factions fought over political power and survival. Israel sought to stop cross-border attacks, while Syria, the PLO, Iran, and later Hezbollah pursued competing regional goals.",
      events: [
        E("bus-massacre", "1975-04-13", "Bus Massacre and Civil War", "A shooting and retaliatory attack on a bus carrying Palestinians helped ignite sustained fighting between Christian militias and a coalition of Palestinian and Lebanese leftist forces.", "13 April 1975", images.lebanon, [33.9, 35.6]),
        E("syrian-intervention", "1976-06-01", "Syrian Intervention", "Syria sent forces into Lebanon, initially restraining Palestinian-leftist gains while seeking lasting control over Lebanese politics.", "1976", images.lebanon, [34.2, 36]),
        E("operation-litani", "1978-03-14", "Operation Litani", "After the Coastal Road massacre, Israel invaded southern Lebanon to push PLO forces away from its border. UNIFIL was created, but the security problem remained unresolved.", "March 1978", images.lebanon, [33.3, 35.4]),
        E("israel-invasion", "1982-06-06", "1982 Lebanon War", "Israel invaded after repeated conflict with the PLO and drove its leadership from Beirut. The campaign weakened the PLO in Lebanon but expanded Israel's entanglement in the civil war.", "June 1982", images.lebanon, [33.9, 35.5]),
        E("barracks-bombing", "1983-10-23", "Beirut Barracks Bombings", "Suicide bombers killed 241 US and 58 French service members serving in the multinational force. The attacks accelerated the Western withdrawal.", "299 service members killed", images.lebanon, [33.9, 35.5]),
        E("hezbollah-emerges", "1985-02-16", "Hezbollah Emerges", "Backed by Iran, Hezbollah consolidated as a powerful Shiite militia committed to armed resistance against Israel and to an Islamist political project in Lebanon.", "1985 manifesto", images.lebanon, [33.5, 35.4]),
        E("taif-and-end", "1990-10-13", "Taif Settlement and War's End", "The Taif Agreement rebalanced political power and Syrian-backed forces defeated the last major holdout. Militias largely disarmed, but Hezbollah retained its weapons.", "13 October 1990", images.lebanon, [33.9, 35.8]),
      ], summary: "The civil war devastated Lebanon and entrenched Syrian and Iranian influence. Israeli operations disrupted PLO attacks but did not create a durable political settlement, while Hezbollah emerged as a stronger long-term threat. Taif ended general warfare without fully restoring state control over armed force.", outcome: "Taif settlement; Syrian dominance and Hezbollah retained arms", cost: "About 150,000 killed and roughly one million displaced" }),
  },
  {
    id: "palestinian-fedayeen-insurgency", title: "Palestinian Fedayeen Insurgency", image: images.israel, description: "Trace the border raids, Israeli reprisals, and regional escalation that preceded the Suez Crisis.",
    data: dive({ title: "Palestinian Fedayeen Insurgency", previous: "1948 Arab-Israeli War", start: "1949-07-20", end: "1956-10-29", period: "1949-1956", image: images.israel, center: [31.5, 34.8],
      connection: "The 1948 war left armistice lines rather than peace, a large Palestinian refugee population, and neighboring Arab states unwilling to recognize Israel. Early border crossings had mixed motives, but organized armed raids increasingly targeted Israelis.",
      stakes: "Israel sought to protect border communities and establish deterrence. Palestinian infiltrators and later Egyptian-sponsored fedayeen sought return, revenge, or armed struggle against Israel.",
      events: [
        E("border-infiltration", "1949-07-20", "Border Infiltration Grows", "Thousands crossed armistice lines for varied reasons, including recovering property and smuggling; some carried out theft and attacks. Israeli patrols and restrictive border policies sometimes killed unarmed infiltrators.", "Early 1950s", images.israel, [31.5, 34.8]),
        E("unit-101", "1953-08-05", "Unit 101 Formed", "Israel created Unit 101 under Ariel Sharon to conduct retaliatory raids intended to deter attacks. The unit improved offensive capability but its methods also caused serious civilian harm.", "August 1953", images.israel, [31.8, 35]),
        E("qibya", "1953-10-14", "Qibya Raid", "After an Israeli mother and two children were murdered, Israeli forces attacked Qibya in Jordanian-controlled territory. Sixty-nine villagers were killed, most civilians, prompting international condemnation.", "69 villagers killed", images.israel, [31.98, 35]),
        E("gaza-raid", "1955-02-28", "Gaza Raid", "An Israeli raid on Egyptian military positions in Gaza killed dozens of Egyptian soldiers. The clash encouraged Egypt to expand fedayeen operations and seek Soviet-bloc weapons.", "28 February 1955", images.israel, [31.5, 34.45]),
        E("egypt-sponsored-raids", "1955-08-31", "Egypt-Sponsored Fedayeen Raids", "Egypt organized and deployed Palestinian fedayeen for attacks from Gaza, increasing Israeli civilian insecurity and escalating the confrontation between Israel and Egypt.", "1955-1956", images.israel, [31.4, 34.4]),
        E("sinai-campaign", "1956-10-29", "Sinai Campaign Begins", "Israel invaded Sinai in coordination with Britain and France after growing border attacks, Egypt's blockade, and the Suez Canal crisis. The fedayeen conflict became part of a wider interstate war.", "29 October 1956", images.israel, [30.5, 33.8]),
      ], summary: "Fedayeen attacks and Israeli reprisals created a cycle of escalating violence along borders that were not accepted as permanent. Israel faced genuine security threats, while several reprisals inflicted unacceptable civilian casualties. The conflict helped lead directly to the 1956 Sinai and Suez war.", outcome: "Escalation into the Suez Crisis", cost: "Hundreds of Israelis, Palestinians, Egyptians, and Jordanians killed" }),
  },
  {
    id: "operation-litani", title: "Operation Litani", image: images.lebanon, description: "Examine Israel's 1978 campaign against PLO bases in southern Lebanon and the creation of UNIFIL.",
    data: dive({ title: "Operation Litani", previous: "Lebanese Civil War", start: "1978-03-11", end: "1978-06-13", period: "March-June 1978", image: images.lebanon, center: [33.3, 35.4],
      connection: "During Lebanon's civil war, the PLO used southern Lebanon to launch attacks against Israel. The Coastal Road massacre, in which Palestinian militants killed 38 Israeli civilians including 13 children, triggered a large Israeli response.",
      stakes: "Israel sought to push armed groups away from its northern communities. Lebanon and the UN sought restoration of Lebanese sovereignty, while the PLO aimed to preserve its southern bases.",
      events: [
        E("coastal-road-massacre", "1978-03-11", "Coastal Road Massacre", "Fatah militants landed on Israel's coast, hijacked vehicles, and attacked civilians. Thirty-eight Israelis were killed, including thirteen children, making it one of Israel's deadliest terrorist attacks.", "38 Israelis killed", images.lebanon, [32.4, 34.9]),
        E("invasion", "1978-03-14", "Israel Launches Operation Litani", "Israeli forces entered southern Lebanon to destroy PLO infrastructure and establish distance from the border. They advanced to the Litani River except around Tyre.", "14 March 1978", images.lebanon, [33.3, 35.4]),
        E("plo-withdraws-north", "1978-03-18", "PLO Forces Withdraw North", "Israeli pressure forced much of the PLO's organized presence north of the Litani, but fighters and weapons remained embedded in Lebanon's broader civil war.", "March 1978", images.lebanon, [33.5, 35.4]),
        E("resolution-425", "1978-03-19", "Resolution 425 Creates UNIFIL", "The UN Security Council called for Israeli withdrawal and created UNIFIL to confirm it, restore peace, and assist the Lebanese government in regaining authority.", "19 March 1978", images.lebanon, [33.3, 35.4]),
        E("israeli-withdrawal", "1978-06-13", "Israeli Withdrawal", "Israel withdrew while transferring positions to the allied South Lebanon Army rather than effective Lebanese state control. PLO attacks later resumed, leaving the core threat unresolved.", "June 1978", images.lebanon, [33.2, 35.3]),
      ], summary: "Operation Litani was a tactical Israeli success against PLO positions and followed a devastating terrorist attack, but it did not create durable border security. UNIFIL lacked the power to restore Lebanese sovereignty or prevent armed groups from rebuilding.", outcome: "Israeli withdrawal and UNIFIL deployment", cost: "Hundreds killed, including many Lebanese and Palestinian civilians" }),
  },
  {
    id: "gaza-conflicts-2018-2023", title: "Gaza Conflicts, 2018-2023", image: images.gaza, description: "Follow the recurring Gaza escalations between the 2014 war and Hamas's October 7 attack.",
    data: dive({ title: "Gaza Conflicts, 2018-2023", previous: "2014 Gaza War", start: "2018-03-30", end: "2023-05-13", period: "2018-2023", image: images.gaza, center: [31.4, 34.4],
      connection: "After the 2014 war, Hamas and Israel entered an unstable pattern of deterrence, blockade, limited economic relief, rocket fire, and periodic strikes. Israel tried to contain the threat without reoccupying Gaza.",
      stakes: "Israel sought security for civilians near Gaza while avoiding a larger war. Hamas and Palestinian Islamic Jihad used protests, rockets, tunnels, and armed pressure while Gaza's civilians bore severe costs.",
      events: [
        E("great-march", "2018-03-30", "Great March of Return", "Mass protests began along Gaza's border. Many participants were civilians, while armed groups used the unrest for attacks and attempts to breach the fence; Israeli live fire killed large numbers and drew criticism.", "March 2018 onward", images.gaza, [31.4, 34.4]),
        E("november-escalation", "2018-11-11", "November 2018 Escalation", "A covert Israeli operation was exposed, leading to fighting and hundreds of rockets fired toward Israel. Egyptian mediation restored a fragile ceasefire.", "November 2018", images.gaza, [31.4, 34.4]),
        E("black-belt", "2019-11-12", "Operation Black Belt", "Israel killed Palestinian Islamic Jihad commander Baha Abu al-Ata, whom it accused of directing imminent attacks. Islamic Jihad responded with rockets before a ceasefire.", "November 2019", images.gaza, [31.5, 34.45]),
        E("breaking-dawn", "2022-08-05", "Operation Breaking Dawn", "Israel struck Islamic Jihad commanders after days of tension and an assessed threat near Gaza. Islamic Jihad fired roughly a thousand rockets; Hamas stayed out of the fighting.", "5-7 August 2022", images.gaza, [31.4, 34.4]),
        E("shield-and-arrow", "2023-05-09", "Operation Shield and Arrow", "Israel targeted senior Islamic Jihad leaders after renewed rocket fire. Strikes also killed civilians, while Islamic Jihad launched rockets toward Israeli population centers.", "9-13 May 2023", images.gaza, [31.4, 34.4]),
      ], summary: "Israel repeatedly degraded militant capabilities and protected most civilians with Iron Dome, but the strategy of managing rather than resolving the Hamas threat failed catastrophically on October 7, 2023. Gaza's civilians also endured recurring death, injury, and economic hardship.", outcome: "Temporary deterrence; strategic failure exposed on October 7", cost: "Hundreds of Palestinians and several Israelis killed across repeated escalations" }),
  },
  {
    id: "israel-hezbollah-war-2023-2024", title: "Israel-Hezbollah War, 2023-2024", image: images.hezbollah, description: "Trace Hezbollah's post-October 7 attacks, Israel's campaign, and the fragile 2024 ceasefire.",
    data: dive({ title: "Israel-Hezbollah War, 2023-2024", previous: "2006 Lebanon War", start: "2023-10-08", end: "2024-11-27", period: "2023-2024", image: images.hezbollah, center: [33.4, 35.5],
      connection: "Resolution 1701 ended the 2006 war but was never fully enforced, allowing Hezbollah to rebuild a vast Iranian-backed arsenal near Israel's border. On October 8, 2023, Hezbollah opened fire in support of Hamas.",
      stakes: "Israel sought to return tens of thousands of displaced northern residents and reduce Hezbollah's capacity. Hezbollah sought to pressure Israel while preserving its armed power in Lebanon.",
      events: [
        E("hezbollah-opens-front", "2023-10-08", "Hezbollah Opens the Northern Front", "Hezbollah began firing rockets and anti-tank missiles into Israel one day after Hamas's attack. Israel responded with strikes, and border communities on both sides were evacuated.", "8 October 2023", images.hezbollah, [33.2, 35.5]),
        E("northern-evacuation", "2023-10-16", "Northern Israel Evacuated", "Israel evacuated communities near Lebanon as daily attacks made normal life unsafe. Hezbollah fire killed soldiers and civilians and imposed a prolonged internal displacement crisis.", "Tens of thousands displaced", images.hezbollah, [33.1, 35.6]),
        E("majdal-shams", "2024-07-27", "Majdal Shams Rocket Strike", "A rocket struck a football field in the Druze town of Majdal Shams, killing twelve children and teenagers. Israel and the United States attributed the strike to Hezbollah, which denied responsibility.", "12 young people killed", images.hezbollah, [33.27, 35.77]),
        E("pager-attacks", "2024-09-17", "Pager and Radio Explosions", "Explosive devices used by Hezbollah detonated across Lebanon, badly disrupting its communications and injuring thousands. The operation demonstrated deep intelligence penetration but also harmed civilians.", "17-18 September 2024", images.hezbollah, [33.9, 35.5]),
        E("nasrallah-killed", "2024-09-27", "Nasrallah Killed", "An Israeli airstrike killed Hezbollah secretary-general Hassan Nasrallah and senior commanders in Beirut. The strike removed the group's longtime leader and disrupted its command structure.", "27 September 2024", images.hezbollah, [33.85, 35.5]),
        E("ground-operation", "2024-10-01", "Israeli Ground Operation", "Israel sent forces into southern Lebanon to destroy tunnels, weapons, and positions near the border. Hezbollah continued rocket and drone attacks as fighting and displacement intensified.", "1 October 2024", images.hezbollah, [33.2, 35.4]),
        E("ceasefire", "2024-11-27", "US-Backed Ceasefire", "A ceasefire required Hezbollah forces to move north of the Litani and Israel to withdraw while Lebanon's army deployed. Fighting fell sharply, but Hezbollah was weakened rather than disarmed.", "27 November 2024", images.hezbollah, [33.4, 35.5]),
      ], summary: "Israel severely damaged Hezbollah's leadership and border infrastructure and created conditions for residents to return, but civilian harm and destruction in Lebanon were extensive. The ceasefire did not permanently disarm Hezbollah, leaving the conflict vulnerable to renewal.", outcome: "Hezbollah weakened; fragile ceasefire", cost: "Thousands killed in Lebanon and dozens of Israeli soldiers and civilians killed" }),
  },
  {
    id: "israeli-operation-in-syria-2024-present", title: "Israeli Operation in Syria, 2024-Present", image: images.syria, description: "Examine Israel's security operations in Syria after Assad's fall and the contested struggle over the border.",
    data: dive({ title: "Israeli Operation in Syria, 2024-Present", previous: "Syrian Civil War", start: "2024-12-08", end: "2026-06-14", period: "2024-present", image: images.syria, center: [33.2, 36],
      connection: "Assad's collapse in December 2024 removed a hostile regime but also dissolved military control near Israel and left strategic weapons vulnerable. Israel moved to prevent advanced arms from reaching jihadists or Hezbollah.",
      stakes: "Israel argues it must prevent hostile forces from establishing themselves near the Golan Heights and protect vulnerable Druze communities. Syria's new authorities and many international actors view Israeli territorial moves and strikes as violations of sovereignty.",
      events: [
        E("buffer-zone", "2024-12-08", "Israel Enters the Buffer Zone", "Israeli forces moved into the UN-monitored separation zone and positions on Mount Hermon after Syrian troops withdrew. Israel described the deployment as temporary and defensive.", "8 December 2024", images.syria, [33.3, 35.8]),
        E("arrow-of-bashan", "2024-12-09", "Operation Arrow of Bashan", "Israel struck Syrian aircraft, naval vessels, air defenses, missiles, and weapons sites to prevent strategic systems from falling to hostile armed groups.", "Hundreds of targets struck", images.syria, [34.5, 37]),
        E("demilitarized-south", "2025-02-23", "Demand for a Demilitarized South", "Israel called for southern Syria to remain free of forces affiliated with the new government. The demand reflected security concerns but sharpened disputes over Syrian sovereignty.", "February 2025", images.syria, [32.8, 36]),
        E("druze-protection-strikes", "2025-05-02", "Strikes Linked to Druze Protection", "Israel struck targets near Damascus amid violence involving Druze communities, presenting itself as a protector. Critics warned that intervention could deepen Syrian fragmentation.", "May 2025", images.syria, [33.5, 36.3]),
        E("continued-operations", "2026-06-14", "Operations Continue", "As of June 14, 2026, Israel continues raids and maintains forward positions to prevent hostile military buildup. The security rationale is clear, but the operation remains internationally contested and risks prolonged entanglement.", "Ongoing as of 14 June 2026", images.syria, [33.2, 36]),
      ], summary: "Israel exploited the post-Assad vacuum to remove dangerous strategic weapons and create greater distance from potential threats. Those actions improved immediate security but extended Israeli control beyond the previous line and generated serious legal, diplomatic, and escalation risks.", outcome: "Ongoing security operation as of June 14, 2026", cost: "Casualty totals remain disputed and continue to change" }),
  },
];
for (const item of entries) await writeFile(join(DIR, `${item.id}.generated.json`), `${JSON.stringify(item.data, null, 2)}\n`, "utf8");
const index = JSON.parse(await readFile(INDEX, "utf8"));
for (const item of entries) {
  const record = { id: item.id, title: item.title, description: item.description, image: item.image };
  const at = index.findIndex((x) => x.id === item.id);
  if (at >= 0) index[at] = record; else index.push(record);
}
await writeFile(INDEX, `${JSON.stringify(index, null, 2)}\n`, "utf8");
console.log(`Created ${entries.length} focused Western and Israeli conflict deep dives.`);
