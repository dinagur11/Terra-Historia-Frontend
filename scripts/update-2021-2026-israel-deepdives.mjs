import fs from "fs";
import path from "path";

const backendRoot = process.argv[2] || "C:/Users/alons/Terra-Historia-Backend";
const frontendRoot = process.argv[3] || process.cwd();
const draftsDir = path.join(backendRoot, "deepdives-drafts");

const removedId = "gaza-conflicts-2018-2023";
const files = [
  "2021-israel-palestine-crisis.generated.json",
  "israel-hamas-war.generated.json",
  "twelve-day-war.generated.json",
  "2026-iran-war.generated.json",
  "israel-hezbollah-war-2023-2024.generated.json",
];

const boilerplate =
  /From an Israeli security perspective,[\s\S]*?This security context does not erase Palestinian, Lebanese, Iranian, or other civilian suffering; it explains why Israeli leaders and much of the Israeli public regarded inaction as an unacceptable choice\./g;
const repeatedSentence =
  /This security context does not erase Palestinian, Lebanese, Iranian, or other civilian suffering; it explains why Israeli leaders and much of the Israeli public regarded inaction as an unacceptable choice\./g;

const images = {
  "2021-israel-palestine-crisis:Hamas Rockets Toward Jerusalem":
    "https://static.politico.com/46/00/82e09a23401e801531a7176b4e3a/210510-hamas-rockets-ap-773.jpg",
  "2021-israel-palestine-crisis:Mass Rocket Barrages":
    "https://www.aljazeera.com/wp-content/uploads/2021/07/000_99X76P.jpg?resize=770%2C513&quality=80",
  "2021-israel-palestine-crisis:Communal Violence Inside Israel":
    "https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/QAD6OCFT3UI6XK2DX265YWQPMU.jpg&w=1800&h=1800",
  "2021-israel-palestine-crisis:Strikes on the Hamas 'Metro'":
    "https://www.brookings.edu/wp-content/uploads/2021/05/Gaza_001.jpg?quality=50&w=1500",
  "2021-israel-palestine-crisis:Ceasefire":
    "https://www.aljazeera.com/wp-content/uploads/2021/05/000_9AF7KF.jpg?resize=770%2C513&quality=80",
  "2021-israel-palestine-crisis:Conflict Summary: 2021 Israel-Palestine Crisis":
    "https://minorityrights.org/app/uploads/2024/02/gaza.jpg",

  "israel-hamas-war:From 2021 Israel-Palestine Crisis to Israel-Hamas War":
    "https://www.economist.com/cdn-cgi/image/width=1424,quality=80,format=auto/sites/default/files/images/print-edition/20210522_FBP001_0.jpg",
  "israel-hamas-war:October 7 Attacks":
    "https://www.economist.com/cdn-cgi/image/width=1424,quality=80,format=auto/content-assets/images/20231209_FNP003.jpg",
  "israel-hamas-war:Air Campaign and Mobilization":
    "https://www.irregularwarfare.org/content/images/size/w840/2026/06/Israeli-airstrike-on-Gaza-Strip-during-Gaza-War.png",
  "israel-hamas-war:Ground Invasion of Gaza":
    "https://npr.brightspotcdn.com/dims3/default/strip/false/crop/5088x2862+0+265/resize/5088x2862!/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2Fe1%2Fca%2F2c142f8548beacd2c5613bdf6089%2F01799ee7-1abc-485b-8921-3fd3b6a10793.jpg",
  "israel-hamas-war:First Hostage Deal":
    "https://cdn.abcotvs.com/dip/images/14100675_112423-n1-Hostage-Deal-Latest-Fri-PKG5-vid.jpg?w=1600",
  "israel-hamas-war:Rafah and the Philadelphi Corridor":
    "https://th-i.thgim.com/public/news/national/1c28q/article68231215.ece/alternates/LANDSCAPE_1200/rafah.jpg",
  "israel-hamas-war:Operation Arnon":
    "https://www.idf.il/media/120nkcqh/helicopter-hostage-1.jpeg",
  "israel-hamas-war:Fragile Ceasefire and Unresolved Endgame":
    "https://www.globalr2p.org/wp-content/uploads/2025/01/AA-424-FI-IOPT.png",
  "israel-hamas-war:Conflict Summary: Israel-Hamas War":
    "https://ctc.westpoint.edu/wp-content/uploads/2026/01/25360586314287.jpg",

  "israel-hezbollah-war-2023-2024:Hezbollah Opens the Northern Front":
    "https://upload.wikimedia.org/wikipedia/commons/7/7b/2023_Hezbollah_drill_in_Aaramta_03.jpg",
  "israel-hezbollah-war-2023-2024:Northern Israel Evacuated":
    "https://img.haarets.co.il/bs/0000018d-97da-d9cc-a5cd-f7fabdcf0000/e5/37/a445fe454218a25afc45caa0b3ec/22031.jpg",
  "israel-hezbollah-war-2023-2024:Majdal Shams Rocket Strike":
    "https://static01.nyt.com/images/2024/07/28/multimedia/28israel-scene-01a-czbv/28israel-scene-01a-czbv-articleLarge.jpg?quality=75&auto=webp&disable=upscale",
  "israel-hezbollah-war-2023-2024:Pager and Radio Explosions":
    "https://dims.apnews.com/dims4/default/7bcc82b/2147483647/strip/true/crop/2067x1442+0+0/resize/599x418!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F01%2F6b%2F409dad5f4915966f7ad092ade54c%2Fap24262643146608.jpg",
  "israel-hezbollah-war-2023-2024:Nasrallah Killed":
    "https://media.cnn.com/api/v1/images/stellar/prod/2024-09-19t140342z-435689375-rc2q3aah8i19-rtrmadp-3-israel-palestinians-hezbollah-nasrallah.JPG?c=original",
  "israel-hezbollah-war-2023-2024:Israeli Ground Operation":
    "https://npr.brightspotcdn.com/dims3/default/strip/false/crop/5774x3248+0+301/resize/1400/quality/85/format/jpeg/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2F16%2Fef%2F652fc4b34c5a85e998b426969c0d%2Fnpr-north-edit-1.jpg",
  "israel-hezbollah-war-2023-2024:US-Backed Ceasefire":
    "https://static.cryptobriefing.com/wp-content/uploads/2026/04/24095813/will-trump-endorse-an-israeli-ceasefire-in-lebanon-by-april-30-g8N1GvD6s0Qk-62-686x457.jpg",
  "israel-hezbollah-war-2023-2024:Conflict Summary: Israel-Hezbollah War, 2023-2024":
    "https://www.aljazeera.com/wp-content/uploads/2023/10/33ZL8CR-highres-1698753169.jpg?resize=770%2C513&quality=80",

  "twelve-day-war:Operation Rising Lion":
    "https://www.gov.il/BlobFolder/news/operation-rising-lion-update/en/English_Swords_of_Iron_Operation-Rising-Lion-Logo.jpg",
  "twelve-day-war:Iranian Missile Retaliation":
    "https://d3i6fh83elv35t.cloudfront.net/static/2025/06/2025-06-13T185611Z_1352841734_RC2T1FA0M0MK_RTRMADP_3_IRAN-NUCLEAR-ISRAEL-1024x683.jpg",
  "twelve-day-war:Israeli Air Superiority Over Iran":
    "https://cdn-ilelhjd.nitrocdn.com/sIjAVWUHBRvPrlJXCHdtYIrbbBOnQsGe/assets/images/optimized/rev-2f31f5b/www.longwarjournal.org/wp-content/uploads/2026/03/IDF-F-16s-1000-1024x681.jpg",
  "twelve-day-war:United States Strikes Nuclear Sites":
    "https://i.ytimg.com/vi/AYlvHXIxZuk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBWJL5lSmTYfNShlKKHPDRi8IAFzQ",
  "twelve-day-war:Ceasefire":
    "https://infinitygalaxy.org/wp-content/uploads/2025/06/iran-israel-ceasefire-impact-on-oil-and-bitumen-markets.png",

  "2026-iran-war:From Twelve-Day War to 2026 Iran War":
    "https://cdn.britannica.com/48/273848-050-DBBAECA3/tel-aviv-israel-missile-strike-iran-june-13-2025.jpg",
  "2026-iran-war:Iranian Regional Retaliation":
    "https://www.thecable.ng/wp-content/uploads/2026/02/fe24a48e-d6a2-4e74-be60-e9045d8148f8.jpeg",
  "2026-iran-war:Fragile April Ceasefire":
    "https://i.guim.co.uk/img/media/7cde4a66207fd4d8c625b447df29716f6e1a7235/0_0_5499_3666/master/5499.jpg?width=465&dpr=1&s=none&crop=none",
  "2026-iran-war:June Peace Negotiations Under Pressure":
    "https://www.aljazeera.com/wp-content/uploads/2026/06/afp_6a33bc2eb069-1781775406-e1781775521871.jpg?resize=770%2C513&quality=80",
  "2026-iran-war:Conflict Summary: 2026 Iran War":
    "https://sites.uab.edu/humanrights/files/2026/04/AdobeStock_1889551481.jpeg",
};

const contextByFile = {
  "2021-israel-palestine-crisis.generated.json":
    "Israeli decision-makers understood the crisis as another test of whether Hamas could use Jerusalem tension as a trigger for rocket war. The military response focused on rocket launchers, command systems, and the underground tunnel network that let Hamas hide military infrastructure inside Gaza's civilian space.",
  "israel-hamas-war.generated.json":
    "The war began with a mass-casualty invasion of Israeli communities, murders, hostage-taking, and documented sexual violence. Israel's campaign was framed around dismantling Hamas rule, returning hostages, and preventing Gaza from remaining a base for repeated October 7-style attacks.",
  "twelve-day-war.generated.json":
    "The direct Iran-Israel war centered on missile salvos, nuclear infrastructure, command networks, and air superiority. Israel's priority was to reduce the Iranian regime's ability to threaten Israeli cities or rebuild a nuclear breakout path under cover of regional proxies.",
  "2026-iran-war.generated.json":
    "The 2026 conflict extended the unfinished deterrence problem after the Twelve-Day War. Israel and its partners sought to prevent Iran from rebuilding strike, proxy, and nuclear capabilities while avoiding a regional collapse that would leave Tehran's networks free to rearm.",
  "israel-hezbollah-war-2023-2024.generated.json":
    "The northern war followed Hezbollah's decision to open a front after October 7, forcing tens of thousands of Israelis from their homes. Israel's campaign aimed to restore security to the north, degrade Hezbollah's command system, and enforce the logic of Resolution 1701.",
};

const rewrites = {
  "2021-israel-palestine-crisis:From 2014 Gaza War to 2021 Israel-Palestine Crisis":
    "After 2014, Hamas rebuilt rockets, tunnels, and command networks while Israel tried to contain Gaza without returning to permanent control. Tension in Jerusalem gave Hamas an opening to present itself as defender of the city, but the decisive escalation came when it launched rockets toward Jerusalem and Israeli civilians.\n\nFor Israel, the crisis proved again that Hamas used political flashpoints to initiate military pressure. Operation Guardian of the Walls targeted rocket fire, command centers, and the underground tunnel system built to protect Hamas fighters while Israeli and Gazan civilians bore the danger.",
  "2021-israel-palestine-crisis:Hamas Rockets Toward Jerusalem":
    "Hamas issued an ultimatum over Jerusalem and then fired rockets toward the capital. That choice transformed unrest and street clashes into a war initiated by a terrorist organization firing at Israeli population centers.\n\nIsrael treated the attack on Jerusalem as a strategic red line. The response was not only about one rocket salvo; it was about denying Hamas the ability to decide when Israeli cities would be dragged into war.",
  "2021-israel-palestine-crisis:Mass Rocket Barrages":
    "Hamas and Palestinian Islamic Jihad launched mass barrages at southern and central Israel, forcing civilians into shelters and testing Iron Dome under heavy pressure. The scale of fire showed years of rearmament since the previous Gaza war.\n\nIsrael's air campaign sought to reduce launch capacity, hit commanders, and restore deterrence. The civilian geography of Gaza made every strike politically costly, but allowing rocket fire to become routine would have exposed millions of Israelis to coercion from Gaza.",
  "2021-israel-palestine-crisis:Communal Violence Inside Israel":
    "Violence inside mixed Israeli cities shocked the country because it threatened the basic civic fabric between Jewish and Arab citizens. Riots, arson, assaults, and mob attacks created a second internal front while rockets were falling from Gaza.\n\nThe episode mattered because it showed how Hamas's escalation could inflame tensions far beyond the battlefield. Israeli police and local leaders had to restore order while protecting civilians and preventing local violence from turning into a broader civil rupture.",
  "2021-israel-palestine-crisis:Strikes on the Hamas 'Metro'":
    "Israel struck the underground tunnel network known as the Hamas 'Metro,' a system designed to move fighters, weapons, and command elements beneath dense civilian areas. The network represented years of Hamas investment in war infrastructure rather than civilian recovery.\n\nThe strikes were meant to make the tunnel system unsafe and reduce Hamas's ability to hide command nodes from the air. For Israel, the Metro was proof that Hamas had prepared the next war while leaving Gaza's civilians above the battlefield.",
  "2021-israel-palestine-crisis:Ceasefire":
    "The ceasefire ended the immediate round after Israel degraded parts of Hamas's rocket and tunnel infrastructure. Hamas claimed survival as victory, while Israel judged the outcome by restored deterrence and the time gained before another escalation.\n\nThe ceasefire did not answer the core question: whether Hamas would use quiet to rebuild. That unresolved problem shaped Israeli thinking before October 7.",
  "2021-israel-palestine-crisis:Conflict Summary: 2021 Israel-Palestine Crisis":
    "The 2021 crisis showed Hamas's model clearly: use Jerusalem as a political trigger, fire rockets at Israeli cities, then rely on Gaza's civilian environment to limit Israel's response. Israel's campaign reduced parts of Hamas's infrastructure but did not remove its rule.\n\nThe conflict became a warning that deterrence alone was fragile. Hamas survived, rebuilt, and two years later launched a far more devastating attack on Israel.",

  "israel-hamas-war:From 2021 Israel-Palestine Crisis to Israel-Hamas War":
    "After 2021, Hamas continued to study Israeli deterrence, border defenses, and internal politics while preserving the appearance of intermittent calm. Israel allowed work permits and economic relief in the hope that stability could reduce Hamas's incentive for war.\n\nOctober 7 exposed that assumption as catastrophic. Hamas had used the years after Guardian of the Walls not to moderate, but to prepare a cross-border assault against Israeli communities.",
  "israel-hamas-war:October 7 Attacks":
    "On October 7, Hamas-led forces invaded southern Israel, murdered civilians, attacked soldiers, burned homes, massacred festival-goers, and kidnapped hostages into Gaza. Reports and investigations also documented sexual violence and rape during the attacks, making the assault not only a military shock but an atrocity against civilian life.\n\nFor Israel, October 7 ended the policy of containing Hamas. The central war aims became destroying Hamas's governing and military capacity, returning the hostages, and ensuring that Gaza could never again serve as a launchpad for such an attack.",
  "israel-hamas-war:Air Campaign and Mobilization":
    "Israel mobilized reserves and launched an air campaign against Hamas command sites, rocket launchers, tunnel shafts, and weapons infrastructure. The scale reflected the understanding that Hamas had built an underground military system embedded inside civilian Gaza.\n\nThe campaign prepared the ground for a wider operation. Israeli leaders argued that after October 7, temporary deterrence was no longer enough; Hamas's ability to rule and rebuild had to be broken.",
  "israel-hamas-war:Ground Invasion of Gaza":
    "Israeli ground forces entered Gaza to dismantle Hamas battalions, seize tunnel areas, and reach command infrastructure that airstrikes alone could not destroy. The operation moved through dense urban terrain prepared with booby traps, ambush positions, and tunnel routes.\n\nThe ground campaign carried high costs for Israeli soldiers and Gaza civilians, but Israel judged that leaving Hamas's underground army intact would invite another massacre. The strategic test became whether military pressure could also help recover hostages.",
  "israel-hamas-war:First Hostage Deal":
    "The first hostage deal paused fighting and brought home Israeli women and children as well as foreign captives. In exchange, Israel released Palestinian prisoners, including women and minors, among them people convicted or accused in security and terrorism-related cases.\n\nFor Israelis, the deal was emotionally necessary but strategically painful. Hamas had turned kidnapped civilians into bargaining chips, proving why hostage recovery and the destruction of Hamas's coercive power could not be separated.",
  "israel-hamas-war:Rafah and the Philadelphi Corridor":
    "Rafah and the Philadelphi Corridor became central because the Gaza-Egypt border had long been associated with smuggling, tunnels, and Hamas rearmament. Israeli control or monitoring of the corridor was presented as essential to preventing Hamas from rebuilding after the war.\n\nThe fighting around Rafah was therefore about more than one city. It was about whether Hamas could retain an escape route, supply route, and symbol of surviving sovereignty at Gaza's southern edge.",
  "israel-hamas-war:Operation Arnon":
    "Operation Arnon rescued Noa Argamani, Almog Meir Jan, Andrey Kozlov, and Shlomi Ziv from Hamas captivity in Nuseirat. The mission combined intelligence, special forces, air support, and rapid evacuation under fire, and was named after Yamam commander Arnon Zamora, who was killed in the operation.\n\nFor Israel, the rescue proved that hostages could still be reached by force when intelligence and timing aligned. It also showed the cruelty of Hamas's hostage system: civilians were held inside Gaza's urban fabric, turning neighborhoods into shields for captivity.",
  "israel-hamas-war:Fragile Ceasefire and Unresolved Endgame":
    "Ceasefire diplomacy repeatedly ran into the same problem: Hamas wanted survival and leverage, while Israel wanted hostages back and a security reality that would prevent another October 7. The gap between those goals made every pause fragile.\n\nThe unresolved endgame centered on who would control Gaza, how Hamas would be prevented from rearming, and whether international pressure would preserve or undermine Israel's military gains.",
  "israel-hamas-war:Conflict Summary: Israel-Hamas War":
    "The Israel-Hamas War began with the October 7 massacre, in which roughly 1,200 people in Israel were killed and hostages were taken into Gaza. Since then, hundreds of additional Israeli soldiers have been killed in the campaign to dismantle Hamas and recover hostages.\n\nCasualty figures from Gaza have been central to the information war. Israel disputes Hamas-run reporting because it does not reliably separate civilians from fighters, depends on institutions controlled by Hamas, and has been used to shape international pressure. The war's core Israeli lesson is that Hamas rule in Gaza created an unacceptable permanent threat.",

  "israel-hezbollah-war-2023-2024:From 2006 Lebanon War to Israel-Hezbollah War, 2023-2024":
    "After 2006, Hezbollah rebuilt far beyond the limits envisioned by Resolution 1701, embedding rockets, anti-tank teams, drones, and command networks in southern Lebanon. Israel prepared for a future war while hoping deterrence would keep the border quiet.\n\nOn October 8, 2023, Hezbollah opened a northern front in support of Hamas. That decision displaced northern Israeli communities and made the return of civilians to their homes a war aim.",
  "israel-hezbollah-war-2023-2024:Hezbollah Opens the Northern Front":
    "Hezbollah began firing at Israeli positions and communities one day after Hamas's October 7 attack. The strikes were framed as support for Gaza but functioned as a second front against Israel's north.\n\nFor Israel, the problem was immediate: Hezbollah could not be allowed to make the border unlivable. The opening phase forced Israel to fight defensively while preparing for a larger campaign if diplomacy failed.",
  "israel-hezbollah-war-2023-2024:Northern Israel Evacuated":
    "Tens of thousands of Israelis left northern communities because Hezbollah fire made normal life impossible. Evacuation turned the war from a border exchange into a national obligation to restore sovereignty and civilian security.\n\nThe empty towns near Lebanon became evidence that deterrence had failed. Israel's later escalation was driven by the need to return citizens home, not by a desire to hold Lebanese territory.",
  "israel-hezbollah-war-2023-2024:Majdal Shams Rocket Strike":
    "A rocket hit a soccer field in Majdal Shams, killing 12 children and teenagers. Israel and the United States blamed Hezbollah, while Hezbollah denied responsibility.\n\nThe strike shattered the idea that the northern front could be managed indefinitely at low intensity. For Israel, it strengthened the case for direct action against Hezbollah's commanders and launch networks.",
  "israel-hezbollah-war-2023-2024:Pager and Radio Explosions":
    "The pager and radio explosions were an extraordinary intelligence operation against Hezbollah's communications ecosystem. By striking devices used across the organization, Israel demonstrated deep penetration of Hezbollah logistics, procurement, and operational security.\n\nMilitarily, the operation was devastating because it injured operatives, disrupted command routines, and created paranoia inside Hezbollah without requiring a conventional invasion. It was a rare example of intelligence producing battlefield effects at national scale.",
  "israel-hezbollah-war-2023-2024:Nasrallah Killed":
    "Israel killed Hassan Nasrallah in a strike on Hezbollah's underground headquarters in Beirut's Dahieh area. The attack removed the figure most associated with Hezbollah's long war against Israel and with Iran's forward strategy in Lebanon.\n\nFor Israel, Nasrallah's death was strategic, not symbolic alone. It attacked Hezbollah's command continuity at the moment Israel was trying to break the northern threat and force a new security reality.",
  "israel-hezbollah-war-2023-2024:Israeli Ground Operation":
    "Israeli ground forces crossed into southern Lebanon to destroy Hezbollah infrastructure near the border, including launch sites, tunnels, observation posts, and Radwan force positions. The goal was to remove the immediate invasion and anti-tank threat from northern communities.\n\nThe operation was limited compared with 1982 but aimed at a clearer objective: push Hezbollah away from the border and make civilian return possible under enforceable security conditions.",
  "israel-hezbollah-war-2023-2024:US-Backed Ceasefire":
    "The US-backed ceasefire sought to halt the fighting and move Hezbollah away from the border under the framework of Resolution 1701. For Israel, the test was whether enforcement would be real or whether Hezbollah would again use quiet to rearm.\n\nThe ceasefire reduced open combat, but the northern question remained unresolved until residents could return safely and Hezbollah's border infrastructure was kept dismantled.",
  "israel-hezbollah-war-2023-2024:Conflict Summary: Israel-Hezbollah War, 2023-2024":
    "The 2023-2024 Israel-Hezbollah War began because Hezbollah chose to attack Israel after October 7, turning the north into a second front and displacing Israeli civilians. Israel's escalation targeted Hezbollah's commanders, communications, rockets, and border infrastructure.\n\nThe war restored some deterrence and damaged Hezbollah severely, but it also left a familiar question: whether Lebanon, UNIFIL, and international guarantees could actually keep Hezbollah away from the border.",

  "twelve-day-war:Operation Rising Lion":
    "Operation Rising Lion opened with Israeli strikes against Iranian nuclear, missile, and command targets. The operation reflected Israel's view that Iran's direct missile attacks and nuclear progress had crossed a threshold that could not be managed by proxy containment alone.\n\nThe campaign aimed to compress years of threat reduction into days: hit the systems that could threaten Israeli cities, disrupt command, and demonstrate that distance would not protect Iran's strategic infrastructure.",
  "twelve-day-war:Iranian Missile Retaliation":
    "Iran answered with direct missile salvos against Israel, testing air defenses and civilian resilience. The attack confirmed that the conflict had moved beyond shadow war into open state-to-state confrontation.\n\nFor Israel, the retaliation justified the original logic of the campaign: Iran was not only sponsoring proxies, it was willing to fire directly at Israeli territory. Defensive success mattered, but so did preventing future salvos from becoming routine.",
  "twelve-day-war:Israeli Air Superiority Over Iran":
    "Israel's air campaign demonstrated the reach of its intelligence and air force over Iranian territory. Strikes against air defense, missile, and command targets reduced Iran's freedom of action and showed that Tehran could not rely on geography as a shield.\n\nAir superiority was important because it let Israel keep pressure on strategic targets while limiting the need for a wider ground or regional war. It also signaled to Iran's proxies that their patron was vulnerable at home.",
  "twelve-day-war:United States Strikes Nuclear Sites":
    "US strikes against nuclear sites widened the campaign and emphasized that Iran's nuclear infrastructure was an international security concern, not only an Israeli one. The strikes added American weight to the effort to delay or damage Iran's nuclear path.\n\nFor Israel, US participation strengthened deterrence and reduced the chance that Iran could simply absorb Israeli attacks and rebuild quickly. It also made the ceasefire diplomacy that followed more credible.",
  "twelve-day-war:Ceasefire":
    "The ceasefire paused direct fighting after both sides absorbed major blows. Israel had demonstrated reach and damaged key Iranian systems, while Iran had shown it could still impose missile risk on Israeli civilians.\n\nThe truce was therefore tactical rather than final. The question became whether Iran would rebuild its missile and nuclear programs or accept a more constrained position.",

  "2026-iran-war:From Twelve-Day War to 2026 Iran War":
    "The 2026 Iran War grew from the unresolved aftermath of the Twelve-Day War. Iran worked to recover missile capacity, repair strategic networks, and preserve regional proxy pressure, while Israel watched for signs that Tehran was rebuilding the same threat.\n\nFor Israel, the issue was prevention. Waiting until Iran restored its full strike capacity would have meant accepting a larger future war under worse conditions.",
  "2026-iran-war:Operations Roaring Lion and Epic Fury":
    "Operations Roaring Lion and Epic Fury struck Iranian leadership, command, and military infrastructure at the opening of the war. The death of Iran's leader during the campaign shook the regime's command structure and became the war's defining political shock.\n\nIsrael's objective was to break the regime's ability to coordinate missile fire, proxy retaliation, and nuclear recovery at the same time. The strikes aimed to create confusion at the top before Iran could impose a coordinated regional response.",
  "2026-iran-war:Iranian Regional Retaliation":
    "Iran answered through missiles, regional assets, and proxy pressure intended to stretch Israel and its partners across multiple fronts. The retaliation showed that even after leadership losses, Tehran's network could still produce danger through redundancy and ideology.\n\nIsrael treated the response as proof that Iran's regional system had to be degraded, not merely deterred. The war became a contest over whether Iran could keep exporting pressure while under attack at home.",
  "2026-iran-war:Closure of the Strait of Hormuz":
    "The attempted closure of the Strait of Hormuz turned the war into a global economic crisis. Iran used maritime pressure to raise the cost of the campaign and force outside powers to push for a ceasefire.\n\nFor Israel and its partners, Hormuz showed why Iran's military power could not be separated from international security. A regime able to threaten both Israeli cities and global energy routes could not be treated as a local problem.",
  "2026-iran-war:Iranian Leadership and Military Struck":
    "Follow-on strikes targeted surviving leadership nodes, military headquarters, and missile infrastructure. Israel sought to prevent Iran from replacing commanders quickly enough to sustain pressure.\n\nThe campaign was designed to keep Iran off balance. The more Tehran struggled to command its forces, the harder it became to coordinate proxy attacks, missile salvos, and nuclear recovery.",
  "2026-iran-war:Fragile April Ceasefire":
    "The April ceasefire reduced open fire but did not settle the strategic dispute. Iran still wanted to recover deterrence and preserve its regional network, while Israel insisted that rebuilding the prewar threat would restart the conflict.\n\nThe ceasefire was fragile because it depended on verification and restraint from a regime that had already used proxies and missile pressure as policy tools. Israeli planners treated it as a pause to watch closely, not an end.",
  "2026-iran-war:June Peace Negotiations Under Pressure":
    "June negotiations took place under military and economic pressure, with Iran seeking relief and Israel seeking enforceable limits. The talks were shaped by the memory of previous pauses that allowed rearmament.\n\nFor Israel, any deal had to answer practical questions: who verifies nuclear limits, who stops missile rebuilding, and what happens if Iran shifts the burden back to Hezbollah, militias, or the Houthis.",
  "2026-iran-war:Conflict Summary: 2026 Iran War":
    "The 2026 Iran War was a continuation of the fight to prevent Iran from restoring the strategic threat damaged in 2025. Israel's campaign focused on leadership, missiles, proxies, and nuclear recovery, while Iran tried to answer through regional escalation and economic pressure.\n\nThe war's outcome remains tied to enforcement. If Iran can rebuild behind diplomacy, the conflict will return; if the limits hold, Israel gains time and a safer regional balance.",
};

const markerData = {
  "2021-israel-palestine-crisis.generated.json": {
    "origins-and-background": [m("Gaza Strip", 31.45, 34.39, "major", "Hamas rebuilt rockets and tunnels in Gaza after 2014."), m("Jerusalem", 31.778, 35.235, "target", "Hamas used Jerusalem tension as the trigger for rocket war.")],
    "jerusalem-ultimatum": [m("Jerusalem", 31.778, 35.235, "major", "Hamas fired toward Jerusalem after issuing an ultimatum.")],
    "mass-rocket-barrages": [m("Ashkelon", 31.6688, 34.5743, "major", "Israeli civilians faced heavy rocket fire from Gaza."), m("Tel Aviv", 32.0853, 34.7818, "target", "Rocket alarms reached central Israel.")],
    "communal-violence": [m("Lod", 31.951, 34.895, "major", "Mixed Israeli cities saw riots, arson, and mob violence."), m("Acre", 32.928, 35.082, "minor", "Communal violence spread beyond the Gaza front.")],
    "attack-on-the-metro": [m("Gaza City", 31.5, 34.47, "major", "Israel struck Hamas's underground tunnel network.")],
    ceasefire: [m("Gaza-Israel front", 31.45, 34.5, "major", "The ceasefire paused rocket fire without removing Hamas rule.")],
    "conflict-summary": [m("Gaza and central Israel", 31.75, 34.7, "major", "The crisis exposed the limits of deterrence before October 7.")],
  },
  "israel-hamas-war.generated.json": {
    "origins-and-background": [m("Gaza border communities", 31.4, 34.55, "major", "The communities near Gaza became the target of Hamas's prepared invasion.")],
    "october-7-attacks": [m("Nova festival area", 31.397, 34.47, "major", "Festival-goers were massacred and kidnapped."), m("Kibbutz Be'eri", 31.424, 34.492, "target", "Israeli civilians were murdered and abducted from their homes.")],
    "air-campaign-and-mobilization": [m("Gaza City", 31.5, 34.47, "major", "Israel targeted Hamas command, rockets, and tunnel infrastructure.")],
    "ground-invasion": [m("Northern Gaza", 31.55, 34.48, "major", "Ground forces moved into dense terrain prepared by Hamas.")],
    "first-hostage-deal": [m("Gaza", 31.45, 34.39, "major", "Hostages were released in exchange for Palestinian prisoners and a pause in fighting.")],
    "rafah-and-philadelphi": [m("Rafah", 31.296, 34.243, "major", "Rafah controlled access to the southern edge of Gaza."), m("Philadelphi Corridor", 31.25, 34.25, "target", "The corridor was central to preventing smuggling and Hamas rearmament.")],
    "hostage-rescue": [m("Nuseirat", 31.45, 34.39, "major", "Operation Arnon rescued four hostages from Hamas captivity.")],
    "fragile-ceasefire": [m("Gaza Strip", 31.45, 34.39, "major", "Ceasefire diplomacy centered on hostages, Hamas survival, and postwar security.")],
    "conflict-summary": [m("Southern Israel and Gaza", 31.45, 34.55, "major", "The war began with October 7 and continued through the campaign to dismantle Hamas.")],
  },
  "israel-hezbollah-war-2023-2024.generated.json": {
    "origins-and-background": [m("Israel-Lebanon border", 33.11, 35.55, "major", "Hezbollah rebuilt along the border after 2006.")],
    "hezbollah-opens-front": [m("Mount Dov / Shebaa Farms", 33.31, 35.73, "major", "Hezbollah opened fire one day after October 7.")],
    "northern-evacuation": [m("Kiryat Shmona", 33.207, 35.57, "major", "Northern communities were evacuated under Hezbollah fire.")],
    "majdal-shams": [m("Majdal Shams", 33.2708, 35.772, "major", "A rocket killed 12 children and teenagers on a soccer field.")],
    "pager-attacks": [m("Southern Lebanon", 33.25, 35.38, "major", "The device explosions disrupted Hezbollah communications across its operating area.")],
    "nasrallah-killed": [m("Dahieh, Beirut", 33.85, 35.5, "major", "Israel killed Hassan Nasrallah in Hezbollah's underground headquarters area.")],
    "ground-operation": [m("Southern Lebanon border villages", 33.17, 35.48, "major", "Israeli forces targeted Hezbollah infrastructure close to the border.")],
    ceasefire: [m("Blue Line", 33.12, 35.52, "major", "The ceasefire's test was whether Hezbollah would be kept away from the border.")],
    "conflict-summary": [m("Northern Israel", 33.1, 35.45, "major", "The war was fought to make civilian return possible after Hezbollah opened the front.")],
  },
  "twelve-day-war.generated.json": {
    "origins-and-background": [m("Israel", 31.9, 34.9, "major", "Israel faced direct Iranian missile threats after years of proxy warfare.")],
    "operation-rising-lion": [m("Tehran", 35.6892, 51.389, "major", "Israeli strikes targeted Iranian command and strategic infrastructure.")],
    "iranian-missile-retaliation": [m("Tel Aviv", 32.0853, 34.7818, "major", "Iranian missiles targeted Israeli population centers.")],
    "air-superiority": [m("Western Iran", 34.8, 48.5, "major", "Israel's air campaign reduced Iran's freedom of action over its own territory.")],
    "us-nuclear-strikes": [m("Fordow / nuclear sites", 34.884, 50.995, "major", "US strikes added pressure on Iran's nuclear infrastructure.")],
    ceasefire: [m("Regional ceasefire track", 32.0, 44.0, "major", "The ceasefire paused direct state-to-state fighting.")],
    "conflict-summary": [m("Iran-Israel theater", 33.8, 43.0, "major", "The war moved the shadow conflict into direct confrontation.")],
  },
  "2026-iran-war.generated.json": {
    "origins-and-background": [m("Tel Aviv", 32.0853, 34.7818, "major", "The 2025 missile war shaped Israeli prevention planning for 2026.")],
    "opening-strikes": [m("Tehran leadership zone", 35.6892, 51.389, "major", "Opening strikes hit leadership and command systems.")],
    "iranian-regional-retaliation": [m("Regional missile arc", 32.5, 44.5, "major", "Iran retaliated through missiles and regional pressure.")],
    "hormuz-closure": [m("Strait of Hormuz", 26.566, 56.25, "major", "Iran used maritime pressure to globalize the crisis.")],
    "iranian-leadership-and-military-struck": [m("Iranian military command", 35.7, 51.4, "major", "Follow-on strikes sought to prevent quick regime recovery.")],
    "april-ceasefire": [m("Gulf ceasefire track", 26.5, 51.0, "major", "The April ceasefire depended on whether Iran would rebuild.")],
    "june-peace-negotiations": [m("Negotiation pressure track", 25.3, 51.5, "major", "Talks focused on limits, verification, and sanctions relief.")],
    "conflict-summary": [m("Iran-Israel regional theater", 32.0, 44.0, "major", "The war tested whether Iran's strike network could be kept degraded.")],
  },
};

const viewOverrides = {
  "2021-israel-palestine-crisis.generated.json": {
    "origins-and-background": [31.65, 34.8, 7],
    "jerusalem-ultimatum": [31.778, 35.235, 10],
    "mass-rocket-barrages": [31.9, 34.8, 7],
    "communal-violence": [32.0, 34.95, 8],
    "attack-on-the-metro": [31.5, 34.47, 10],
    ceasefire: [31.45, 34.5, 8],
    "conflict-summary": [31.75, 34.7, 7],
  },
  "israel-hamas-war.generated.json": {
    "origins-and-background": [31.4, 34.55, 9],
    "october-7-attacks": [31.41, 34.5, 10],
    "air-campaign-and-mobilization": [31.5, 34.47, 10],
    "ground-invasion": [31.55, 34.48, 9],
    "first-hostage-deal": [31.45, 34.39, 8],
    "rafah-and-philadelphi": [31.25, 34.25, 10],
    "hostage-rescue": [31.45, 34.39, 10],
    "fragile-ceasefire": [31.45, 34.39, 8],
    "conflict-summary": [31.45, 34.55, 8],
  },
  "israel-hezbollah-war-2023-2024.generated.json": {
    "origins-and-background": [33.11, 35.55, 8],
    "hezbollah-opens-front": [33.31, 35.73, 10],
    "northern-evacuation": [33.207, 35.57, 10],
    "majdal-shams": [33.2708, 35.772, 10],
    "pager-attacks": [33.25, 35.38, 8],
    "nasrallah-killed": [33.85, 35.5, 10],
    "ground-operation": [33.17, 35.48, 9],
    ceasefire: [33.12, 35.52, 8],
    "conflict-summary": [33.1, 35.45, 8],
  },
  "twelve-day-war.generated.json": {
    "origins-and-background": [31.9, 34.9, 7],
    "operation-rising-lion": [35.6892, 51.389, 8],
    "iranian-missile-retaliation": [32.0853, 34.7818, 9],
    "air-superiority": [34.8, 48.5, 6],
    "us-nuclear-strikes": [34.884, 50.995, 9],
    ceasefire: [32.0, 44.0, 5],
    "conflict-summary": [33.8, 43.0, 5],
  },
  "2026-iran-war.generated.json": {
    "origins-and-background": [32.0853, 34.7818, 9],
    "opening-strikes": [35.6892, 51.389, 8],
    "iranian-regional-retaliation": [32.5, 44.5, 5],
    "hormuz-closure": [26.566, 56.25, 8],
    "iranian-leadership-and-military-struck": [35.7, 51.4, 8],
    "april-ceasefire": [26.5, 51.0, 5],
    "june-peace-negotiations": [25.3, 51.5, 6],
    "conflict-summary": [32.0, 44.0, 5],
  },
};

const overlays = {};

function m(label, lat, lng, type, description) {
  return { label, latlng: [lat, lng], type, description };
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(draftsDir, file), "utf8"));
}

function writeJson(file, data) {
  fs.writeFileSync(path.join(draftsDir, file), `${JSON.stringify(data, null, 2)}\n`);
}

function firstParagraph(body = "") {
  return body.split(/\n\n/)[0] || body;
}

function cleanStats(slide) {
  if (!Array.isArray(slide.stats)) return;
  slide.stats = slide.stats.map((stat) => {
    if (
      stat.full &&
      typeof stat.val === "string" &&
      typeof stat.lbl === "string" &&
      stat.val.length > 70 &&
      stat.lbl.length < 45
    ) {
      return { ...stat, val: stat.lbl, lbl: stat.val };
    }
    return stat;
  });
}

function updateSlide(file, event, slide) {
  const timelineId = file.replace(".generated.json", "");
  const key = `${timelineId}:${slide.title}`;
  if (images[key]) slide.img = images[key];

  if (rewrites[key]) {
    slide.body = rewrites[key];
  } else if (typeof slide.body === "string") {
    const cleaned = slide.body.replace(boilerplate, "").replace(repeatedSentence, "").trim();
    slide.body = cleaned.includes("\n\n")
      ? cleaned
      : `${firstParagraph(cleaned)}\n\n${contextByFile[file]}`;
  }
  cleanStats(slide);
}

function updateEvent(file, event) {
  const markers = markerData[file]?.[event.id];
  if (markers) event.markers = markers;
  const view = viewOverrides[file]?.[event.id];
  if (view) event.view = { center: [view[0], view[1]], zoom: view[2] };
  const overlay = overlays[file]?.[event.id];
  if (overlay?.divisionLines) event.divisionLines = overlay.divisionLines;
  if (overlay?.regions) event.regions = overlay.regions;
  if (Array.isArray(event.slides)) event.slides.forEach((slide) => updateSlide(file, event, slide));
}

function removeGazaConflicts() {
  const indexPath = path.join(backendRoot, "deepdives-index.json");
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  fs.writeFileSync(
    indexPath,
    `${JSON.stringify(index.filter((item) => item.id !== removedId), null, 2)}\n`
  );

  const draftPath = path.join(draftsDir, `${removedId}.generated.json`);
  if (fs.existsSync(draftPath)) fs.unlinkSync(draftPath);

  const relationshipsPath = path.join(frontendRoot, "src/constants/deepDiveRelationships.json");
  const relationships = JSON.parse(fs.readFileSync(relationshipsPath, "utf8"));
  delete relationships.nodes[removedId];
  relationships.relationships = relationships.relationships.filter(
    (rel) => rel.from !== removedId && rel.to !== removedId
  );
  fs.writeFileSync(relationshipsPath, `${JSON.stringify(relationships, null, 2)}\n`);
}

removeGazaConflicts();

for (const file of files) {
  const data = readJson(file);
  data.forEach((event) => updateEvent(file, event));
  writeJson(file, data);
}

console.log(`Removed ${removedId} and updated ${files.length} deep-dive drafts.`);
