import fs from "fs";
import path from "path";

const backendRoot = process.argv[2] || "C:/Users/alons/Terra-Historia-Backend";
const draftsDir = path.join(backendRoot, "deepdives-drafts");

const files = [
  "first-intifada.generated.json",
  "2006-lebanon-war.generated.json",
  "gaza-war-2008-2009.generated.json",
  "2012-gaza-war.generated.json",
  "2014-gaza-war.generated.json",
];

const boilerplate =
  /From an Israeli security perspective,[\s\S]*?This security context does not erase Palestinian, Lebanese, Iranian, or other civilian suffering; it explains why Israeli leaders and much of the Israeli public regarded inaction as an unacceptable choice\./g;
const repeatedSentence =
  /This security context does not erase Palestinian, Lebanese, Iranian, or other civilian suffering; it explains why Israeli leaders and much of the Israeli public regarded inaction as an unacceptable choice\./g;

const images = {
  "first-intifada:Strikes and Civil Disobedience":
    "https://www.aljazeera.com/wp-content/uploads/2010/08/2010831155918742734_20.jpeg?resize=1200%2C675",
  "first-intifada:Rise of Hamas":
    "https://www.idf.il/media/qgpdywjx/hamas-3.jpg?width=908&height=586",
  "first-intifada:Palestinian Declaration of Independence":
    "https://mppm-palestina.org/sites/default/files/field/image/yasser_arfat_declara_independencia_da_palestina_0.jpg",
  "first-intifada:Madrid Peace Conference":
    "https://images.jpost.com/image/upload/f_auto,fl_lossy/q_auto/c_fill,g_faces:center,h_720,w_1280/485963",
  "first-intifada:Conflict Summary: First Intifada":
    "https://www.arabnews.jp/en/wp-content/uploads/sites/2/2020/07/intifada.jpg",

  "2006-lebanon-war:From South Lebanon Conflict to 2006 Lebanon War":
    "https://upload.wikimedia.org/wikipedia/commons/7/72/Tyre_air_strike.jpg",
  "2006-lebanon-war:Hezbollah Cross-Border Raid":
    "https://static-cdn.toi-media.com/www/uploads/2016/07/hezbollahraid-e1469821109554.jpg",
  "2006-lebanon-war:Rocket War on Northern Israel":
    "https://static.dw.com/image/17300399_902.jpg",
  "2006-lebanon-war:Air and Naval Campaign":
    "https://www.marcodilauro.com/wp-content/uploads/2015/09/MDL_LEBANON002.jpg",
  "2006-lebanon-war:Battle of Bint Jbeil":
    "https://static-cdn.toi-media.com/www/uploads/2014/11/second-lebanon-war-1024x640.jpg",
  "2006-lebanon-war:Final Push Toward the Litani":
    "https://static01.nyt.com/images/2006/08/12/world/13mideast.xlarge1.jpg?quality=75&auto=webp&disable=upscale",
  "2006-lebanon-war:Ceasefire and Resolution 1701":
    "https://static.srpcdigital.com/styles/1037xauto/public/2024-11/866562.jpeg.webp",
  "2006-lebanon-war:Conflict Summary: 2006 Lebanon War":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/2006_Lebanon_War._LXXXI.jpg/250px-2006_Lebanon_War._LXXXI.jpg",

  "gaza-war-2008-2009:From Second Intifada to Gaza War (2008-2009)":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Operation_Cast_Lead%2C_2009.jpg/500px-Operation_Cast_Lead%2C_2009.jpg",
  "gaza-war-2008-2009:Opening Airstrikes":
    "https://www.economist.com/cdn-cgi/image/width=1424,quality=80,format=auto/sites/default/files/images/articles/migrated/AirStrike_Top.jpg",
  "gaza-war-2008-2009:Rockets Reach Deeper into Israel":
    "https://i.guim.co.uk/img/media/0eab0df5ecb7ae925a86bcd5b66718472d807508/0_285_6466_3879/master/6466.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=d5eab3d928ec676b3c719bfaff25c83a",
  "gaza-war-2008-2009:Ground Operation Begins":
    "https://ichef.bbci.co.uk/news/480/cpsprodpb/63f3/live/cf3d90f0-994f-11f0-928c-71dbb8619e94.jpg.webp",
  "gaza-war-2008-2009:Urban Fighting and Humanitarian Crisis":
    "https://www.allworldwars.com/image/057/Gaza002.jpg",
  "gaza-war-2008-2009:Unilateral Ceasefire":
    "https://www.crisisgroup.org/sites/default/files/2023-11/Gaza%20360%20Hero.jpg",
  "gaza-war-2008-2009:Conflict Summary: Gaza War (2008-2009)":
    "https://www.allworldwars.com/image/057/Gaza002.jpg",

  "2012-gaza-war:Strike on Ahmed Jabari":
    "https://media.wired.com/photos/593283baedfced5820d111ce/master/pass/A7r0aq1CEAAsgkH.jpg-large.jpg",
  "2012-gaza-war:Rockets Target Tel Aviv and Jerusalem":
    "https://media.npr.org/assets/img/2012/11/16/rocket_gaza_wide-32fb6e6d22cc7570a2f250100ab6220ac9489c1f.jpg",
  "2012-gaza-war:Iron Dome Proves Its Value":
    "https://static-cdn.toi-media.com/www/uploads/2013/02/F121117AB01-640x400.jpg",
  "2012-gaza-war:Egyptian-Mediated Ceasefire":
    "https://www.aljazeera.com/wp-content/uploads/2014/07/201472081652800580_20.jpeg?resize=570%2C380&quality=80",
  "2012-gaza-war:Conflict Summary: 2012 Gaza War":
    "https://images.dailynewsegypt.com/2024/05/Claims-that-Egypt-altered-Gaza-ceasefire-terms-are-diversionary-tactics-High-Level-Source.jpeg",

  "2014-gaza-war:Operation Protective Edge Begins":
    "https://images.globes.co.il/Images/NewGlobes/big_image/2014/c02_zahal2-575.jpg",
  "2014-gaza-war:Zikim Sea Infiltration":
    "https://i.ytimg.com/vi/hKC7Sws0Rbg/maxresdefault.jpg",
  "2014-gaza-war:Ground Operation Against Tunnels":
    "https://graphics.thomsonreuters.com/testfiles/2023/Hq7MvimjhG3l/cdn/images/soldier3.jpg",
  "2014-gaza-war:Battle of Shuja'iyya":
    "https://www.palquest.org/download.php?file=media/Number_66_main_image29941_on89gQK52c.jpg",
  "2014-gaza-war:Rafah Attack and Hadar Goldin":
    "https://www.idf.il/media/lfvnfu5g/hadar-goldin-1.jpg?rmode=max&width=500&height=281",
  "2014-gaza-war:Open-Ended Ceasefire":
    "https://www.crisisgroup.org/sites/default/files/2025-04/gaza_hero.jpg",
  "2014-gaza-war:Conflict Summary: 2014 Gaza War":
    "https://www.crisisgroup.org/sites/default/files/2025-01/Gaza%20ceasefire-QA_Hero_Jan25.jpg",
};

const contextByFile = {
  "first-intifada.generated.json":
    "For Israel, the uprising became a layered security challenge: mass unrest, organized cells, knives, firebombs, road attacks, and later a more lethal terrorist campaign. Israeli policy had to protect civilians and soldiers while trying to prevent the violence from destroying every path to diplomacy.",
  "2006-lebanon-war.generated.json":
    "The Israeli strategic problem was that Hezbollah had used the years after the 2000 withdrawal to build a fortified rocket army on the border. The war was fought to recover kidnapped soldiers, stop rocket fire on civilians, and restore deterrence against an Iranian-backed force embedded in Lebanese villages.",
  "gaza-war-2008-2009.generated.json":
    "Israel's central calculation was shaped by the post-disengagement reality: after Israel left Gaza in 2005, Hamas and other armed groups expanded rocket fire, smuggling, tunnel networks, and attacks around the border. The campaign aimed to restore deterrence and reduce fire on Israeli towns.",
  "2012-gaza-war.generated.json":
    "The operation came after recurring rocket fire, border attacks, and Hamas military buildup. Israel used intelligence, airpower, and Iron Dome to hit command networks while limiting the need for a ground invasion.",
  "2014-gaza-war.generated.json":
    "The 2014 campaign centered on two threats Israeli leaders could not ignore: long-range rocket fire and cross-border attack tunnels built to reach Israeli communities. The operation combined airstrikes, Iron Dome, and ground action against tunnel infrastructure.",
};

const rewrites = {
  "first-intifada:From Six-Day War to First Intifada":
    "The First Intifada grew out of years of Israeli rule in Gaza, Judea, and Samaria, but it also followed a sharp rise in attacks and militant organization during 1987. Israeli accounts emphasized that the months before the outbreak included murders, stabbing attacks, and a general deterioration in security.\n\nThe uprising began with civil unrest, strikes, stone throwing, firebombs, and road attacks, then shifted toward more organized violence and terrorism. For Israel, the challenge was not simply protest; it was the emergence of a sustained campaign that threatened soldiers, civilians, roads, and the possibility of negotiated order.",
  "first-intifada:Uprising Begins in Jabalia":
    "The Jabalia outbreak followed a traffic accident that rumors quickly turned into a claim of deliberate Israeli revenge. Local anger spread fast, but the escalation also rested on a prior security breakdown: armed factions, released prisoners, and radical organizers had already helped create a combustible environment.\n\nFrom Israel's perspective, the first days showed how quickly rumor, incitement, and organized confrontation could turn into a wider campaign. The issue was not a population peacefully asking for coexistence; it was a movement in which mass protest, intimidation, and violent attacks soon mixed together and made normal civilian security impossible.",
  "first-intifada:Strikes and Civil Disobedience":
    "Strikes, boycotts, and neighborhood committees gave the uprising a broad civilian surface, but they also operated alongside coercion, stone attacks, firebombs, and punishment of Palestinians suspected of cooperating with Israel. That combination made the conflict hard to treat as ordinary civil protest.\n\nIsraeli forces faced daily friction in crowded streets and refugee camps while trying to keep roads, settlements, army positions, and Israeli civilians secure. The episode matters because it shows the dual character of the uprising: political mobilization on one side, and a growing security campaign on the other.",
  "first-intifada:Rise of Hamas":
    "Hamas emerged from the Muslim Brotherhood's Gaza networks and quickly became the most important Islamist alternative to the PLO. Its charter and early activity rejected Israel's legitimacy and pushed the conflict away from compromise toward religiously framed armed struggle.\n\nFor Israel, Hamas changed the meaning of the uprising. What began as unrest and local organization increasingly included a movement that openly sanctified violence, challenged any negotiated settlement, and built the infrastructure that would later drive suicide bombings and rocket wars.",
  "first-intifada:Palestinian Declaration of Independence":
    "The 1988 declaration gave the PLO a diplomatic platform and helped move parts of the conflict into international forums. Yet for Israelis, declarations were judged against conduct on the ground: violence continued, rejectionist factions gained strength, and many Israelis doubted whether Palestinian leadership would truly end the armed struggle.\n\nThe importance of the declaration is that it opened a diplomatic path without resolving the basic security question. Israel still had to ask whether political language would be matched by control over attacks and recognition of Israel as a permanent state.",
  "first-intifada:Madrid Peace Conference":
    "The Madrid Conference brought Israel and Arab representatives into a public diplomatic process after the Gulf War. For Israel, it was a test of whether regional pressure and Palestinian representation could be translated into negotiations rather than continued confrontation.\n\nMadrid did not end violence, but it showed that Israeli security concerns and Palestinian political demands could be placed at the same table. The conference set the stage for later talks while leaving Israelis skeptical that diplomacy alone could restrain armed factions.",
  "first-intifada:Oslo Accords":
    "The Oslo Accords formally ended the First Intifada's main political phase and created a new framework of Israeli-Palestinian self-government and mutual commitments. Israeli supporters hoped it would convert confrontation into security cooperation and negotiations.\n\nThe weakness was visible from the beginning: rejectionist groups kept attacking, and many Israelis feared that concessions would be interpreted as proof that violence worked. Oslo therefore became both a diplomatic breakthrough and a security gamble.",
  "first-intifada:Conflict Summary: First Intifada":
    "The First Intifada forced Israel to confront a prolonged mixture of civil unrest, militant organization, and terrorism in Gaza, Judea, and Samaria. It produced a diplomatic track, but it also strengthened Islamist rejectionism and normalized the idea that violence could extract political gains.\n\nIts legacy is double-edged. The uprising helped lead to Madrid and Oslo, yet the continued attacks after Oslo showed why many Israelis concluded that peace required more than declarations: it required enforceable security, real recognition, and leadership willing to stop armed groups rather than excuse them.",

  "gaza-war-2008-2009:From Second Intifada to Gaza War (2008-2009)":
    "Israel withdrew from the Gaza Strip in 2005, removing settlements and soldiers in the hope that disengagement might reduce friction. Instead, Hamas and other armed groups expanded rocket fire toward Israeli towns, built smuggling routes and tunnels, and in 2006 kidnapped Israeli soldier Gilad Shalit in a cross-border attack.\n\nAfter Hamas seized Gaza in 2007, southern Israel faced a hostile armed enclave rather than a quiet border. The road to Operation Cast Lead was shaped by years of rockets on Sderot and nearby communities, failed ceasefires, and the sense that withdrawal had been answered by escalation.",
  "gaza-war-2008-2009:Opening Airstrikes":
    "Israel opened Operation Cast Lead with coordinated airstrikes against Hamas security compounds, command sites, weapons stores, and rocket infrastructure. The aim was to shock Hamas's military system and reduce its ability to fire on Israeli civilians.\n\nThe opening phase reflected a hard Israeli lesson from the post-2005 years: restraint and limited responses had not stopped the rockets. Israeli leaders chose a major strike because southern communities had spent years living under alarms, school closures, and repeated attacks.",
  "gaza-war-2008-2009:Rockets Reach Deeper into Israel":
    "Hamas and other groups continued launching rockets during the campaign, reaching beyond the border towns into larger Israeli cities. The expanding range demonstrated why Israel viewed the problem as strategic rather than local.\n\nFor Israeli civilians, the war was measured in sirens, shelters, interrupted school days, and the fear that every new rocket generation would place more of the country under threat. That reality shaped public support for a stronger military response.",
  "gaza-war-2008-2009:Ground Operation Begins":
    "Israel sent ground forces into Gaza to attack launch areas, tunnel routes, and Hamas defensive positions that airstrikes alone could not neutralize. The ground phase put soldiers into dense terrain where Hamas prepared ambushes, explosives, and firing positions.\n\nThe operation was meant to push the threat away from the border and force Hamas to pay a military price for rocket fire. It also showed the difficulty of fighting an armed organization that operated from crowded civilian surroundings.",
  "gaza-war-2008-2009:Urban Fighting and Humanitarian Crisis":
    "Urban fighting in Gaza produced heavy destruction and civilian suffering, while Israel argued that Hamas's placement of weapons, fighters, and command infrastructure inside populated areas made clean separation nearly impossible. The humanitarian crisis became a central part of the international debate.\n\nFor Israel, the operational dilemma was severe: stop rockets and degrade Hamas without allowing the group to gain immunity by embedding itself in civilian neighborhoods. The event should be read through that military problem, not as a simple story of force used without cause.",
  "gaza-war-2008-2009:Unilateral Ceasefire":
    "Israel announced a unilateral ceasefire after degrading parts of Hamas's rocket and command infrastructure. Hamas also halted fire shortly afterward, but the underlying question remained whether deterrence would hold or simply pause the next round.\n\nThe ceasefire reflected Israel's preference to end the operation once the immediate military goals had been met. It did not solve Gaza's deeper problem: an armed Hamas government that continued to treat Israeli towns as legitimate pressure points.",
  "gaza-war-2008-2009:Conflict Summary: Gaza War (2008-2009)":
    "The Gaza War of 2008-2009 was Israel's first major campaign after the disengagement era proved that withdrawal alone would not produce quiet. Hamas rocket fire, the Gilad Shalit kidnapping, tunnels, and smuggling turned Gaza into a recurring military front.\n\nOperation Cast Lead restored a measure of deterrence but did not remove Hamas from power. Its legacy is the pattern that followed: Israel would repeatedly face the same strategic choice between absorbing rocket fire and conducting limited campaigns to restore deterrence.",
};

const markerData = {
  "first-intifada.generated.json": {
    "origins-and-background": [
      marker("Gaza Strip", 31.45, 34.39, "major", "Gaza became one of the uprising's first and most intense centers."),
      marker("Judea and Samaria", 31.9, 35.2, "target", "Road attacks, unrest, and militant organization spread across the West Bank."),
    ],
    "jabalia-outbreak": [
      marker("Jabalia", 31.53, 34.48, "major", "The initial riots in Jabalia spread after rumor and anger transformed a traffic accident into a wider confrontation."),
    ],
    "civil-disobedience": [
      marker("Gaza City", 31.5, 34.47, "target", "Strikes and committees gave the uprising a civilian structure while violence and intimidation grew around it."),
      marker("Nablus", 32.22, 35.26, "minor", "West Bank cities became centers of unrest, roadblocks, and clashes with Israeli forces."),
    ],
    "hamas-formed": [
      marker("Gaza", 31.5, 34.47, "major", "Hamas emerged from Gaza's Islamist networks and rejected Israel's legitimacy from the start."),
    ],
    "palestinian-declaration": [
      marker("Algiers", 36.75, 3.06, "major", "The PLO declaration in exile gave the uprising a diplomatic frame but did not stop violence on the ground."),
    ],
    "madrid-conference": [
      marker("Madrid", 40.4168, -3.7038, "major", "Madrid moved the conflict into formal diplomacy after years of unrest and regional war."),
    ],
    "oslo-accords": [
      marker("Oslo", 59.9139, 10.7522, "major", "Secret talks created the framework that ended the uprising's main political phase."),
      marker("Jerusalem", 31.778, 35.235, "target", "Israeli leaders judged Oslo by whether it could produce real security and recognition."),
    ],
    "conflict-summary": [
      marker("Gaza and West Bank", 31.75, 35.0, "major", "The uprising reshaped Israeli thinking about security, negotiations, and Palestinian leadership."),
    ],
  },
  "2006-lebanon-war.generated.json": {
    "origins-and-background": [
      marker("Tyre", 33.2708, 35.2033, "target", "Southern Lebanon remained a Hezbollah launch and staging area after Israel's 2000 withdrawal."),
      marker("Northern Israel", 33.05, 35.3, "major", "Israeli border towns were the civilian front line of Hezbollah's rocket strategy."),
    ],
    "cross-border-raid": [
      marker("Zarit border area", 33.09, 35.24, "major", "Hezbollah crossed the border, killed Israeli soldiers, and kidnapped Ehud Goldwasser and Eldad Regev."),
    ],
    "rocket-war": [
      marker("Haifa", 32.794, 34.9896, "major", "Hezbollah rocket fire reached major cities, forcing civilians into shelters across the north."),
      marker("Kiryat Shmona", 33.207, 35.57, "target", "Border communities absorbed repeated rocket attacks throughout the war."),
    ],
    "air-and-naval-campaign": [
      marker("Beirut", 33.8938, 35.5018, "target", "Israeli strikes targeted Hezbollah infrastructure, command links, and supply routes."),
      marker("Lebanese coast", 33.65, 35.3, "minor", "The naval campaign tried to restrict arms movement and pressure Hezbollah's support system."),
    ],
    "bint-jbeil": [
      marker("Bint Jbeil", 33.12, 35.43, "major", "The battle exposed Hezbollah's fortified village defenses and the cost of ground combat."),
    ],
    "litani-offensive": [
      marker("Litani River", 33.33, 35.33, "major", "Israel pushed toward the Litani to reduce rocket fire and change the ceasefire map."),
    ],
    "resolution-1701": [
      marker("UNIFIL sector", 33.25, 35.38, "major", "Resolution 1701 expanded UNIFIL and called for southern Lebanon to be free of armed groups outside state control."),
    ],
    "conflict-summary": [
      marker("Israel-Lebanon border", 33.11, 35.55, "major", "The war ended with deterrence partially restored but Hezbollah still armed in Lebanon."),
    ],
  },
  "gaza-war-2008-2009.generated.json": {
    "origins-and-background": [
      marker("Gaza Strip", 31.45, 34.39, "major", "After Israel's 2005 withdrawal, Hamas and other factions expanded rockets, smuggling, and tunnel networks."),
      marker("Kerem Shalom", 31.228, 34.284, "target", "Gilad Shalit was kidnapped in a 2006 cross-border attack near this area."),
      marker("Sderot", 31.525, 34.596, "target", "Sderot became the symbol of Israeli civilian life under rocket fire."),
    ],
    "opening-airstrikes": [
      marker("Gaza City", 31.5, 34.47, "major", "Israeli airstrikes hit Hamas security and command infrastructure at the start of the campaign."),
    ],
    "rocket-fire": [
      marker("Ashkelon", 31.6688, 34.5743, "major", "Rocket range expanded beyond the immediate border area into larger Israeli cities."),
      marker("Beersheba", 31.252, 34.791, "target", "Longer-range rockets brought deeper Israeli population centers under threat."),
    ],
    "ground-operation": [
      marker("Northern Gaza", 31.55, 34.48, "major", "Ground forces entered to attack launch areas, tunnels, and Hamas defensive positions."),
    ],
    "humanitarian-controversies": [
      marker("Gaza City neighborhoods", 31.51, 34.45, "major", "Dense urban terrain made the war's civilian cost and Hamas's use of populated areas central issues."),
    ],
    "unilateral-ceasefire": [
      marker("Gaza-Israel border", 31.4, 34.47, "major", "The ceasefire paused the fighting but left Hamas in control of Gaza."),
    ],
    "conflict-summary": [
      marker("Southern Israel", 31.5, 34.7, "major", "The campaign was driven by the need to reduce rocket fire after years of attacks following disengagement."),
    ],
  },
  "2012-gaza-war.generated.json": {
    "origins-and-background": [
      marker("Gaza Strip", 31.45, 34.39, "major", "Rocket fire and border attacks continued after Cast Lead, setting the stage for another round."),
    ],
    "killing-ahmed-jabari": [
      marker("Gaza City", 31.5, 34.47, "major", "Israel struck Hamas military chief Ahmed Jabari to disrupt command and deterrence after escalating fire."),
    ],
    "rockets-tel-aviv-jerusalem": [
      marker("Tel Aviv", 32.0853, 34.7818, "major", "Rockets toward Tel Aviv changed Israeli perceptions of the threat's national reach."),
      marker("Jerusalem", 31.778, 35.235, "target", "Rocket alerts near Jerusalem showed Hamas's attempt to expand psychological pressure."),
    ],
    "iron-dome": [
      marker("Southern Israel battery area", 31.75, 34.65, "major", "Iron Dome intercepted rockets headed for populated areas and changed Israel's defensive options."),
    ],
    ceasefire: [
      marker("Cairo", 30.0444, 31.2357, "major", "Egypt mediated the ceasefire after Israel restored deterrence without a ground invasion."),
    ],
    "conflict-summary": [
      marker("Gaza-Israel front", 31.45, 34.5, "major", "The operation showed how intelligence and missile defense could blunt Hamas escalation."),
    ],
  },
  "2014-gaza-war.generated.json": {
    "origins-and-background": [
      marker("Gaza Strip", 31.45, 34.39, "major", "After 2012, Hamas rebuilt rockets and attack tunnels while Israeli communities remained exposed."),
    ],
    "operation-protective-edge": [
      marker("Gaza City", 31.5, 34.47, "major", "Israel began air operations after escalating rocket fire from Gaza."),
    ],
    "zikkim-infiltration": [
      marker("Zikim", 31.61, 34.52, "major", "Hamas naval commandos attempted to infiltrate near an Israeli coastal community."),
    ],
    "ground-invasion-tunnels": [
      marker("Gaza border tunnels", 31.42, 34.47, "major", "The ground operation focused on destroying attack tunnels reaching toward Israel."),
    ],
    "shuja-iyya": [
      marker("Shuja'iyya", 31.5, 34.49, "major", "The battle took place in dense terrain used for rocket fire, tunnels, and ambushes."),
    ],
    "hadar-goldin": [
      marker("Rafah", 31.296, 34.243, "major", "The Rafah attack and capture of Hadar Goldin's body shaped Israeli views of ceasefire risk."),
    ],
    ceasefire: [
      marker("Cairo", 30.0444, 31.2357, "major", "Egyptian mediation produced the open-ended ceasefire after weeks of fighting."),
    ],
    "conflict-summary": [
      marker("Gaza perimeter", 31.45, 34.5, "major", "The war centered on rockets and tunnels aimed at Israeli civilians and border communities."),
    ],
  },
};

const viewOverrides = {
  "first-intifada.generated.json": {
    "origins-and-background": [31.75, 35.0, 7],
    "jabalia-outbreak": [31.53, 34.48, 10],
    "civil-disobedience": [31.86, 34.86, 7],
    "hamas-formed": [31.5, 34.47, 9],
    "palestinian-declaration": [36.75, 3.06, 9],
    "madrid-conference": [40.4168, -3.7038, 10],
    "oslo-accords": [45.1, 23.0, 3],
    "conflict-summary": [31.75, 35.0, 7],
  },
  "2006-lebanon-war.generated.json": {
    "origins-and-background": [33.05, 35.3, 7],
    "cross-border-raid": [33.09, 35.24, 10],
    "rocket-war": [33.0, 35.25, 7],
    "air-and-naval-campaign": [33.75, 35.42, 7],
    "bint-jbeil": [33.12, 35.43, 10],
    "litani-offensive": [33.33, 35.33, 9],
    "resolution-1701": [33.25, 35.38, 8],
    "conflict-summary": [33.11, 35.55, 8],
  },
  "gaza-war-2008-2009.generated.json": {
    "origins-and-background": [31.45, 34.5, 8],
    "opening-airstrikes": [31.5, 34.47, 10],
    "rocket-fire": [31.55, 34.72, 7],
    "ground-operation": [31.55, 34.48, 9],
    "humanitarian-controversies": [31.51, 34.45, 10],
    "unilateral-ceasefire": [31.4, 34.47, 9],
    "conflict-summary": [31.5, 34.7, 8],
  },
  "2012-gaza-war.generated.json": {
    "origins-and-background": [31.45, 34.5, 8],
    "killing-ahmed-jabari": [31.5, 34.47, 10],
    "rockets-tel-aviv-jerusalem": [31.9, 34.95, 7],
    "iron-dome": [31.75, 34.65, 8],
    ceasefire: [30.0444, 31.2357, 10],
    "conflict-summary": [31.45, 34.5, 8],
  },
  "2014-gaza-war.generated.json": {
    "origins-and-background": [31.45, 34.5, 8],
    "operation-protective-edge": [31.5, 34.47, 10],
    "zikkim-infiltration": [31.61, 34.52, 10],
    "ground-invasion-tunnels": [31.42, 34.47, 9],
    "shuja-iyya": [31.5, 34.49, 10],
    "hadar-goldin": [31.296, 34.243, 10],
    ceasefire: [30.0444, 31.2357, 10],
    "conflict-summary": [31.45, 34.5, 8],
  },
};

function marker(label, lat, lng, type, description) {
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

  if (Array.isArray(event.slides)) {
    event.slides.forEach((slide) => updateSlide(file, event, slide));
  }
}

for (const file of files) {
  const data = readJson(file);
  data.forEach((event) => updateEvent(file, event));
  writeJson(file, data);
}

console.log(`Updated ${files.length} deep-dive drafts in ${draftsDir}`);
