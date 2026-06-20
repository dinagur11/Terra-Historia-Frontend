import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = "C:\\Users\\alons\\Terra-Historia-Backend";
const DIR = join(ROOT, "deepdives-drafts");
const INDEX = join(ROOT, "deepdives-index.json");

const img = {
  poland: "https://commons.wikimedia.org/wiki/Special:FilePath/The_Red_Army_before_being_sent_to_the_Civil_War.JPG",
  ireland: "https://commons.wikimedia.org/wiki/Special:FilePath/Cheshire_Regiment_trench_Somme_1916.jpg",
  greece: "https://commons.wikimedia.org/wiki/Special:FilePath/Into_the_Jaws_of_Death_23-0455M_edit.jpg",
  algeria: "https://upload.wikimedia.org/wikipedia/commons/4/40/Sand_War.jpg",
  intifada: "https://commons.wikimedia.org/wiki/Special:FilePath/Gaza_Strip_map2.svg",
  bosnia: "https://upload.wikimedia.org/wikipedia/commons/8/83/Vukovar-watertower-after-war.jpg",
  iraq: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Flickr_-_Government_Press_Office_%28GPO%29_-_Patriot_missiles_being_launched_to_intercept_an_Iraqi_Scud_missile.jpg",
  georgia: "https://upload.wikimedia.org/wikipedia/commons/5/59/War_in_Abkhazia_1992.PNG",
  ukraine: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Bender_1992.jpg/3840px-Bender_1992.jpg",
  syria: "https://upload.wikimedia.org/wikipedia/commons/3/3f/USS_New_Jersey_firing_in_Beirut%2C_1984.jpg",
};

const stat = (val, lbl, full = false) => ({ val, lbl, ...(full ? { full: true } : {}) });
const ev = (id, date, title, body, stats, image, center) => ({
  id,
  year: Number(date.slice(0, 4)),
  date,
  title,
  sub: "",
  view: { center, zoom: 4 },
  markers: [],
  regions: [],
  slides: [{ title, img: image, cap: `Historical overview: ${title}`, body, stats }],
});

function dive({ title, previous, start, end, period, connection, stakes, image, center, events, summary, outcome, cost }) {
  const first = ev("origins-and-background", start, `From ${previous} to ${title}`, `${connection}\n\n${stakes}`, [
    stat(previous, "Previous conflict in this path"),
    stat(period, "Conflict period"),
    stat(stakes, "What was at stake", true),
  ], image, center);
  first.sub = `Connection and background to ${title}`;
  for (const item of events) item.sub = `Part of ${title}`;
  const last = ev("conflict-summary", end, `Conflict Summary: ${title}`, summary, [
    stat(outcome, "Outcome / present status"),
    stat(cost, "Human cost"),
    stat(summary, "Final assessment", true),
  ], image, center);
  last.sub = `Final summary of ${title}`;
  return [first, ...events, last];
}

const entries = [
  {
    id: "polish-soviet-war", title: "Polish-Soviet War", image: img.poland,
    description: "Follow the struggle that decided Poland's eastern frontier and halted the Soviet advance toward central Europe.",
    data: dive({ title: "Polish-Soviet War", previous: "Russian Civil War", start: "1919-02-14", end: "1921-03-18", period: "1919-1921", image: img.poland, center: [52, 24],
      connection: "The collapse of the Russian and German empires created an independent Poland and a revolutionary Soviet state with overlapping territorial ambitions. Their forces met while advancing into the political vacuum across Belarus, Lithuania, and Ukraine.",
      stakes: "Poland fought to secure defensible eastern borders and support an independent Ukraine, while Soviet leaders sought to recover former imperial territory and hoped revolution might spread west.",
      events: [
        ev("first-clashes", "1919-02-14", "First Polish-Soviet Clashes", "Polish and Soviet forces clashed near Mosty and Bereza Kartuska as German troops withdrew. Local fighting expanded into a war over the borderlands of the former Russian Empire.", [stat("14 Feb 1919", "Commonly cited opening date")], img.poland, [53, 25]),
        ev("kiev-offensive", "1920-04-25", "Kiev Offensive", "Poland and the Ukrainian People's Republic launched an offensive intended to establish an allied independent Ukraine. They captured Kyiv on May 7, but Soviet armies withdrew without being destroyed.", [stat("7 May 1920", "Polish-Ukrainian forces enter Kyiv")], img.poland, [50.45, 30.52]),
        ev("soviet-counteroffensive", "1920-06-05", "Soviet Counteroffensive", "The Red Army forced Polish-led forces out of Ukraine and advanced rapidly through Belarus toward Warsaw. Soviet success threatened the survival of the newly restored Polish state.", [stat("Summer 1920", "Red Army advances toward Poland")], img.poland, [52.5, 27]),
        ev("battle-of-warsaw", "1920-08-12", "Battle of Warsaw", "Polish forces stopped the Soviet advance and struck its exposed flank, winning the decisive battle near Warsaw. The victory ended the immediate threat to the capital and reversed the war's momentum.", [stat("12-25 Aug 1920", "Decisive Polish victory")], img.poland, [52.23, 21.01]),
        ev("battle-of-niemen", "1920-09-20", "Battle of the Niemen River", "Poland defeated Soviet forces again near the Niemen River, strengthening its negotiating position and ending realistic Soviet hopes of renewing the advance.", [stat("20-26 Sep 1920", "Final major Polish offensive")], img.poland, [53.7, 23.8]),
        ev("treaty-of-riga", "1921-03-18", "Treaty of Riga", "Poland, Soviet Russia, and Soviet Ukraine signed the Treaty of Riga, establishing a frontier that divided Belarusian and Ukrainian lands between Poland and the Soviet republics.", [stat("18 Mar 1921", "Peace treaty signed")], img.poland, [56.95, 24.1]),
      ], summary: "Poland preserved its independence and secured extensive eastern territory, while Soviet expansion westward was halted. The settlement abandoned Poland's Ukrainian ally and created borders and minority disputes later overturned during World War II.", outcome: "Polish victory and Treaty of Riga", cost: "About 100,000 killed; many more wounded, captured, or displaced" }),
  },
  {
    id: "irish-war-of-independence", title: "Irish War of Independence", image: img.ireland,
    description: "Trace the guerrilla war, British counterinsurgency, and negotiations that created the Irish Free State.",
    data: dive({ title: "Irish War of Independence", previous: "World War I", start: "1919-01-21", end: "1921-12-06", period: "1919-1921", image: img.ireland, center: [53.3, -8],
      connection: "World War I delayed but radicalized Ireland's constitutional crisis. The 1916 Easter Rising, executions of its leaders, and Sinn Fein's 1918 election victory shifted nationalist support toward independence.",
      stakes: "Irish republicans sought an independent republic; Britain sought to preserve the union while confronting a decentralized guerrilla campaign and a collapsing political mandate.",
      events: [
        ev("soloheadbeg", "1919-01-21", "Soloheadbeg Ambush and the First Dail", "IRA volunteers killed two Royal Irish Constabulary officers at Soloheadbeg on the same day elected Sinn Fein representatives assembled in Dublin and declared an Irish republic.", [stat("21 Jan 1919", "Symbolic beginning of the war")], img.ireland, [52.48, -8.16]),
        ev("guerrilla-campaign", "1919-09-01", "IRA Guerrilla Campaign", "Flying columns attacked police barracks, patrols, and intelligence networks. The Royal Irish Constabulary weakened as resignations and attacks reduced British authority in many rural districts.", [stat("Flying columns", "Mobile IRA units")], img.ireland, [52.5, -8]),
        ev("black-and-tans", "1920-03-25", "Black and Tans and Auxiliaries", "Britain reinforced the police with the Black and Tans and Auxiliary Division. Reprisals, arson, and killings increased civilian suffering and damaged Britain's political position.", [stat("1920", "Counterinsurgency intensifies")], img.ireland, [53.3, -8]),
        ev("bloody-sunday", "1920-11-21", "Bloody Sunday", "Michael Collins's intelligence organization killed British intelligence personnel in Dublin. Later that day, Crown forces fired on a crowd at Croke Park, killing fourteen civilians.", [stat("21 Nov 1920", "Escalatory turning point")], img.ireland, [53.36, -6.25]),
        ev("custom-house", "1921-05-25", "Burning of the Custom House", "The IRA burned Dublin's Custom House, a major symbol of British administration. The action gained publicity but led to the capture of many experienced IRA members.", [stat("25 May 1921", "Major Dublin operation")], img.ireland, [53.35, -6.25]),
        ev("truce-and-treaty", "1921-12-06", "Truce and Anglo-Irish Treaty", "A truce began on July 11, 1921. The Anglo-Irish Treaty created the self-governing Irish Free State while Northern Ireland remained in the United Kingdom, dividing the independence movement.", [stat("6 Dec 1921", "Treaty signed")], img.ireland, [51.5, -0.12]),
      ], summary: "The war made continued British rule over most of Ireland politically and militarily unsustainable. The treaty created the Irish Free State but accepted partition and an oath to the Crown, disagreements that led directly to the Irish Civil War.", outcome: "Anglo-Irish Treaty and creation of Irish Free State", cost: "Roughly 2,300 killed, including combatants and civilians" }),
  },
  {
    id: "greek-civil-war", title: "Greek Civil War", image: img.greece,
    description: "Explore the first major Cold War civil conflict, from wartime resistance divisions to the communist defeat in 1949.",
    data: dive({ title: "Greek Civil War", previous: "World War II", start: "1946-03-30", end: "1949-10-16", period: "1946-1949", image: img.greece, center: [39, 22],
      connection: "Axis occupation created competing Greek resistance movements and left the country devastated. Fighting between communist-led forces and the British-backed government began before World War II had fully ended and resumed after an unstable peace.",
      stakes: "The conflict determined whether Greece would join the Western postwar order or undergo a communist revolution, making it an early test of containment.",
      events: [
        ev("litochoro-attack", "1946-03-30", "Attack on Litochoro", "A communist guerrilla attack on the police station at Litochoro is commonly treated as the opening of the final civil-war phase.", [stat("30 Mar 1946", "Final phase begins")], img.greece, [40.1, 22.5]),
        ev("democratic-army", "1946-10-28", "Formation of the Democratic Army", "The Communist Party organized the Democratic Army of Greece, expanding guerrilla warfare in mountainous northern Greece.", [stat("DSE", "Communist-led guerrilla army")], img.greece, [40.5, 21.2]),
        ev("truman-doctrine", "1947-03-12", "Truman Doctrine", "The United States committed aid to Greece and Turkey after Britain said it could no longer bear the cost. American funding, equipment, and advisers became decisive for the Greek government.", [stat("12 Mar 1947", "US containment policy announced")], img.greece, [38, 23.7]),
        ev("konitsa", "1947-12-25", "Battle of Konitsa", "The Democratic Army failed to capture Konitsa and establish a provisional capital. The defeat exposed the difficulty of taking and holding major towns.", [stat("Dec 1947-Jan 1948", "Major guerrilla defeat")], img.greece, [40.05, 20.75]),
        ev("grammos-vitsi", "1949-08-10", "Operations Grammos and Vitsi", "Government forces used superior numbers, artillery, and air power to break the Democratic Army's final mountain strongholds near the Albanian border.", [stat("Aug 1949", "Decisive government offensive")], img.greece, [40.5, 20.8]),
        ev("war-ends", "1949-10-16", "Communist Ceasefire", "The Communist Party announced a temporary cessation of hostilities after its forces retreated into Albania. Organized civil-war fighting ended.", [stat("16 Oct 1949", "War ends")], img.greece, [40, 21]),
      ], summary: "The US-backed Greek government defeated the communist insurgency, securing Greece within the Western bloc. The war killed tens of thousands, displaced communities, and left political divisions that shaped Greece for decades.", outcome: "Greek government victory", cost: "More than 100,000 killed and hundreds of thousands displaced" }),
  },
  {
    id: "algerian-war", title: "Algerian War", image: img.algeria,
    description: "Follow Algeria's war of independence and the political crisis that transformed France.",
    data: dive({ title: "Algerian War", previous: "World War II", start: "1954-11-01", end: "1962-07-05", period: "1954-1962", image: img.algeria, center: [28, 2],
      connection: "Algerian soldiers served France during World War II, but colonial inequality and the violent suppression of nationalist demonstrations in 1945 deepened demands for independence.",
      stakes: "The FLN fought to end French colonial rule; France initially fought to retain Algeria, which it legally treated as part of France and where about one million European settlers lived.",
      events: [
        ev("toussaint-rouge", "1954-11-01", "Toussaint Rouge", "The National Liberation Front launched coordinated attacks across Algeria and declared its goal of national independence.", [stat("1 Nov 1954", "War begins")], img.algeria, [36.7, 3.0]),
        ev("philippeville", "1955-08-20", "Philippeville Offensive and Reprisals", "FLN attacks around Philippeville killed European settlers and Muslim civilians. French reprisals killed far larger numbers and drove the conflict toward mass violence.", [stat("20 Aug 1955", "Escalation into broader war")], img.algeria, [36.9, 6.9]),
        ev("battle-of-algiers", "1956-09-30", "Battle of Algiers", "FLN bombings and assassinations in Algiers prompted a French counterterrorism campaign using mass arrests and torture. France dismantled the urban network but suffered lasting political damage.", [stat("1956-1957", "Urban counterinsurgency campaign")], img.algeria, [36.75, 3.06]),
        ev("1958-crisis", "1958-05-13", "May 1958 Crisis", "Settlers and army officers in Algiers demanded a government committed to French Algeria. The crisis brought Charles de Gaulle back to power and ended the Fourth Republic.", [stat("13 May 1958", "French political crisis")], img.algeria, [36.75, 3.06]),
        ev("self-determination", "1959-09-16", "De Gaulle Accepts Self-Determination", "De Gaulle publicly accepted Algerian self-determination, shifting French policy toward negotiations despite resistance from hardline settlers and officers.", [stat("16 Sep 1959", "Strategic policy reversal")], img.algeria, [48.85, 2.35]),
        ev("evian-accords", "1962-03-18", "Evian Accords", "France and the provisional Algerian government signed the Evian Accords. A ceasefire began on March 19, followed by a referendum and Algerian independence in July.", [stat("18 Mar 1962", "Accords signed"), stat("5 Jul 1962", "Algerian independence")], img.algeria, [46.4, 6.6]),
      ], summary: "Algeria achieved independence after a brutal war that included terrorism, torture, reprisals, and internal violence. The conflict ended France's colonial rule, brought down the Fourth Republic, and caused the flight of most European settlers and many Harkis.", outcome: "Algerian independence and FLN victory", cost: "Hundreds of thousands killed; casualty estimates remain disputed" }),
  },
  {
    id: "first-intifada", title: "First Intifada", image: img.intifada,
    description: "Trace the Palestinian uprising that transformed Israeli-Palestinian politics and helped lead to the Oslo Accords.",
    data: dive({ title: "First Intifada", previous: "Six-Day War", start: "1987-12-09", end: "1993-09-13", period: "1987-1993", image: img.intifada, center: [31.7, 35.1],
      connection: "Israel's victory in 1967 brought the West Bank and Gaza Strip under Israeli control. After two decades without a political settlement, Palestinian frustration over occupation, settlement growth, economic conditions, and daily military rule erupted into a sustained uprising.",
      stakes: "Israel sought to restore security and suppress attacks while facing growing political pressure; Palestinians sought to end occupation and establish an independent political future.",
      events: [
        ev("jabalia-outbreak", "1987-12-09", "Uprising Begins in Jabalia", "Protests erupted after an Israeli vehicle collision killed four Palestinian workers in Gaza. Demonstrations and clashes rapidly spread through Gaza and the West Bank.", [stat("9 Dec 1987", "Uprising begins")], img.intifada, [31.53, 34.5]),
        ev("civil-disobedience", "1988-01-01", "Strikes and Civil Disobedience", "Palestinian committees organized strikes, boycotts, tax resistance, demonstrations, and local services alongside stone-throwing, Molotov cocktails, and armed attacks.", [stat("Grassroots committees", "Core organizing network")], img.intifada, [31.8, 35.2]),
        ev("hamas-formed", "1988-08-18", "Rise of Hamas", "Hamas emerged during the uprising and published its charter in 1988, challenging the PLO with an Islamist political and armed movement.", [stat("1988", "Hamas charter published")], img.intifada, [31.5, 34.47]),
        ev("palestinian-declaration", "1988-11-15", "Palestinian Declaration of Independence", "The Palestine National Council declared independence and accepted a diplomatic program based on UN resolutions, helping open dialogue with the United States.", [stat("15 Nov 1988", "Declaration adopted")], img.intifada, [36.75, 3.06]),
        ev("madrid-conference", "1991-10-30", "Madrid Peace Conference", "Israel, Arab states, and a joint Jordanian-Palestinian delegation entered direct negotiations under US and Soviet sponsorship.", [stat("30 Oct 1991", "Direct negotiations begin")], img.intifada, [40.4, -3.7]),
        ev("oslo-accords", "1993-09-13", "Oslo Accords", "Israel and the PLO exchanged mutual recognition and signed the Declaration of Principles, creating a framework for limited Palestinian self-government.", [stat("13 Sep 1993", "Oslo I signed")], img.intifada, [38.9, -77.0]),
      ], summary: "Israel suppressed the uprising militarily but could not restore the previous political status quo. The Intifada strengthened Palestinian national mobilization and contributed to negotiations, while violence and mistrust persisted into the Oslo period.", outcome: "Uprising suppressed; Oslo process begins", cost: "About 200 Israelis and roughly 2,000 Palestinians killed" }),
  },
  {
    id: "bosnian-war", title: "Bosnian War", image: img.bosnia,
    description: "Explore the siege, ethnic cleansing, international intervention, and diplomacy that defined the Bosnian War.",
    data: dive({ title: "Bosnian War", previous: "Croatian War of Independence", start: "1992-04-06", end: "1995-12-14", period: "1992-1995", image: img.bosnia, center: [44, 18],
      connection: "Yugoslavia's breakup spread from Slovenia and Croatia into ethnically mixed Bosnia and Herzegovina. A referendum for independence was followed by war among Bosniak, Bosnian Serb, and Bosnian Croat forces.",
      stakes: "The war determined Bosnia's survival and borders while competing nationalist projects sought territory through siege warfare, expulsions, detention camps, and ethnic cleansing.",
      events: [
        ev("siege-of-sarajevo", "1992-04-06", "Siege of Sarajevo", "Bosnian Serb forces encircled Sarajevo and subjected the city to shelling and sniper fire for nearly four years, creating the longest siege of a capital in modern warfare.", [stat("1992-1996", "Siege duration")], img.bosnia, [43.86, 18.41]),
        ev("ethnic-cleansing", "1992-05-01", "Ethnic Cleansing and Detention Camps", "Forces across the war expelled civilians, but Bosnian Serb campaigns were the largest and most systematic. Killings, sexual violence, detention, and forced displacement transformed the country's population.", [stat("Millions displaced", "War-wide consequence")], img.bosnia, [44.5, 18]),
        ev("croat-bosniak-war", "1993-01-01", "Croat-Bosniak War", "The alliance against Bosnian Serb forces fractured into fighting between Croat and Bosniak forces. The Washington Agreement ended that conflict in March 1994 and created a renewed federation.", [stat("Mar 1994", "Washington Agreement")], img.bosnia, [43.5, 17.8]),
        ev("srebrenica", "1995-07-11", "Srebrenica Genocide", "Bosnian Serb forces captured the UN-declared safe area of Srebrenica and murdered more than 8,000 Bosniak men and boys. International courts ruled the killings constituted genocide.", [stat("More than 8,000 murdered", "Genocide victims")], img.bosnia, [44.1, 19.3]),
        ev("operation-deliberate-force", "1995-08-30", "Operation Deliberate Force", "NATO launched sustained airstrikes against Bosnian Serb military targets after continued attacks on safe areas and the second Markale massacre.", [stat("30 Aug-20 Sep 1995", "NATO air campaign")], img.bosnia, [44, 18]),
        ev("dayton-accords", "1995-12-14", "Dayton Peace Accords", "The agreement preserved Bosnia and Herzegovina as one state divided into two principal entities and deployed a NATO-led implementation force.", [stat("14 Dec 1995", "Peace signed in Paris")], img.bosnia, [48.85, 2.35]),
      ], summary: "The Dayton Accords ended the fighting and preserved Bosnia and Herzegovina, but institutionalized a complex ethnic power-sharing system. Approximately 100,000 people were killed and more than two million displaced.", outcome: "Negotiated settlement under Dayton Accords", cost: "Approximately 100,000 killed and more than two million displaced" }),
  },
  {
    id: "iraq-war", title: "Iraq War", image: img.iraq,
    description: "Follow the US-led invasion, occupation, insurgency, sectarian war, surge, and withdrawal from Iraq.",
    data: dive({ title: "Iraq War", previous: "Gulf War", start: "2003-03-20", end: "2011-12-18", period: "2003-2011", image: img.iraq, center: [33, 44],
      connection: "The Gulf War left Saddam Hussein in power under sanctions, weapons inspections, and repeated confrontation with the United States. After September 11, the US government argued Iraq possessed weapons of mass destruction and posed an unacceptable threat; no active WMD stockpiles were found.",
      stakes: "The US-led coalition sought to remove Saddam Hussein and reshape Iraq, while the occupation struggled to build a stable government amid insurgency, sectarian conflict, and regional interference.",
      events: [
        ev("invasion", "2003-03-20", "US-Led Invasion", "The United States, United Kingdom, and coalition partners invaded Iraq. Coalition forces rapidly defeated organized Iraqi resistance and advanced toward Baghdad.", [stat("20 Mar 2003", "Invasion begins")], img.iraq, [30, 47]),
        ev("fall-of-baghdad", "2003-04-09", "Fall of Baghdad", "US forces captured Baghdad and Saddam Hussein's government collapsed. Decisions to dissolve the army and pursue broad de-Baathification contributed to instability.", [stat("9 Apr 2003", "Regime collapses")], img.iraq, [33.31, 44.36]),
        ev("insurgency", "2003-08-19", "Insurgency Expands", "Baathist networks, nationalist insurgents, and jihadist groups attacked coalition forces, Iraqi institutions, and civilians. The UN headquarters bombing demonstrated the widening danger.", [stat("2003 onward", "Insurgency grows")], img.iraq, [33, 44]),
        ev("fallujah", "2004-11-07", "Second Battle of Fallujah", "US and Iraqi forces assaulted Fallujah, a major insurgent stronghold. The battle became one of the war's largest urban engagements.", [stat("Nov-Dec 2004", "Major urban battle")], img.iraq, [33.35, 43.78]),
        ev("samarra-sectarian-war", "2006-02-22", "Samarra Bombing and Sectarian War", "The bombing of the al-Askari shrine accelerated killings between Sunni and Shia armed groups, pushing Iraq toward civil war.", [stat("22 Feb 2006", "Sectarian violence escalates")], img.iraq, [34.2, 43.87]),
        ev("surge", "2007-01-10", "The Surge and Sunni Awakening", "The United States deployed additional troops while Sunni tribal movements turned against al-Qaeda in Iraq. Violence fell sharply, though political reconciliation remained incomplete.", [stat("2007-2008", "Violence declines")], img.iraq, [33, 44]),
        ev("us-withdrawal", "2011-12-18", "US Withdrawal", "The final US troops left Iraq under the existing status-of-forces agreement. Iraq remained politically fragile, and the later rise of ISIS reopened large-scale war.", [stat("18 Dec 2011", "Withdrawal completed")], img.iraq, [30.5, 47.8]),
      ], summary: "The invasion removed Saddam Hussein but the WMD justification proved false. Occupation decisions, insurgency, and sectarian war caused enormous human costs and destabilized the region; the Iraqi state survived but later faced the rise of ISIS.", outcome: "Saddam removed; inconclusive and destabilizing aftermath", cost: "Hundreds of thousands of Iraqis killed; 4,000+ US military deaths" }),
  },
  {
    id: "russo-georgian-war", title: "Russo-Georgian War", image: img.georgia,
    description: "Trace the five-day war over South Ossetia and Abkhazia that reshaped post-Soviet security.",
    data: dive({ title: "Russo-Georgian War", previous: "War in Abkhazia", start: "2008-08-07", end: "2008-08-26", period: "7-26 August 2008", image: img.georgia, center: [42, 44],
      connection: "The wars of the early 1990s left Abkhazia and South Ossetia outside Georgian control under Russian protection. Tensions rose as Georgia pursued NATO integration and both sides reinforced the disputed regions.",
      stakes: "Georgia sought to restore territorial control, while Russia claimed to protect South Ossetians and used the war to demonstrate its determination to dominate security in its near abroad.",
      events: [
        ev("tskhinvali", "2008-08-07", "Battle for Tskhinvali", "After escalating exchanges, Georgian forces attacked Tskhinvali. Russian forces entered through the Roki Tunnel and fought Georgian units in and around the city.", [stat("7-10 Aug 2008", "Central battle")], img.georgia, [42.23, 43.97]),
        ev("russian-intervention", "2008-08-08", "Russian Intervention", "Russia deployed ground, air, and naval forces, opening fronts from South Ossetia and Abkhazia and striking targets across Georgia.", [stat("8 Aug 2008", "Large-scale Russian intervention")], img.georgia, [42.2, 43.9]),
        ev("gori-and-poti", "2008-08-11", "Advance Toward Gori and Poti", "Russian forces moved beyond the separatist territories, occupying Gori and operating around the port of Poti after Georgian forces withdrew.", [stat("Beyond disputed regions", "Russian operational reach")], img.georgia, [41.98, 44.1]),
        ev("ceasefire", "2008-08-12", "Six-Point Ceasefire", "French President Nicolas Sarkozy brokered a six-point ceasefire. Fighting and Russian movements continued for several days before partial withdrawal.", [stat("12 Aug 2008", "Ceasefire agreed")], img.georgia, [42, 44]),
        ev("recognition", "2008-08-26", "Russia Recognizes Abkhazia and South Ossetia", "Russia recognized the two separatist territories as independent states and maintained military bases there. Most of the world continued to recognize them as part of Georgia.", [stat("26 Aug 2008", "Russian recognition")], img.georgia, [42.5, 43]),
      ], summary: "Russia defeated Georgia's forces and consolidated control over Abkhazia and South Ossetia. The war exposed Georgia's vulnerability, damaged Russia-West relations, and foreshadowed later Russian military actions in Ukraine.", outcome: "Russian and separatist victory", cost: "Hundreds killed and roughly 190,000 temporarily displaced" }),
  },
  {
    id: "russo-ukrainian-war", title: "Russo-Ukrainian War", image: img.ukraine,
    description: "Follow Russia's war against Ukraine from Crimea and Donbas in 2014 through the ongoing full-scale invasion.",
    data: dive({ title: "Russo-Ukrainian War", previous: "Russo-Georgian War", start: "2014-02-20", end: "2026-06-14", period: "2014-present", image: img.ukraine, center: [49, 32],
      connection: "Russia's victory in Georgia demonstrated its willingness to use force against neighboring states seeking closer Western ties. After Ukraine's Revolution of Dignity removed President Viktor Yanukovych, Russia seized Crimea and supported armed separatism in Donbas.",
      stakes: "Ukraine fights for sovereignty and territorial integrity; Russia seeks control and political leverage over Ukraine while challenging the post-Cold War European security order.",
      events: [
        ev("annexation-of-crimea", "2014-02-20", "Seizure and Annexation of Crimea", "Russian troops without insignia seized strategic sites in Crimea. Russia annexed the peninsula after a referendum held under occupation that was widely rejected internationally.", [stat("March 2014", "Russia annexes Crimea")], img.ukraine, [45.3, 34]),
        ev("war-in-donbas", "2014-04-12", "War in Donbas Begins", "Russian-backed armed groups seized towns in eastern Ukraine. Ukraine launched an operation to restore control, while Russian personnel and equipment supported the separatist forces.", [stat("April 2014", "Donbas war begins")], img.ukraine, [48, 38]),
        ev("minsk-agreements", "2015-02-12", "Minsk II Agreement", "Ukraine, Russia, France, and Germany negotiated a framework intended to stop fighting and resolve the Donbas conflict. The ceasefire reduced but never ended combat.", [stat("12 Feb 2015", "Minsk II signed")], img.ukraine, [53.9, 27.56]),
        ev("full-scale-invasion", "2022-02-24", "Full-Scale Russian Invasion", "Russia attacked Ukraine from multiple directions, including from Belarus, Russia, occupied Crimea, and Donbas. Ukraine resisted and prevented the rapid capture of Kyiv.", [stat("24 Feb 2022", "Full-scale invasion begins")], img.ukraine, [50.45, 30.52]),
        ev("siege-of-mariupol", "2022-03-01", "Siege of Mariupol", "Russian forces encircled and devastated Mariupol before its remaining defenders surrendered in May. The siege secured a land corridor between Russia and occupied Crimea.", [stat("Spring 2022", "City captured after destructive siege")], img.ukraine, [47.1, 37.55]),
        ev("ukrainian-counteroffensives", "2022-09-06", "Kharkiv and Kherson Counteroffensives", "Ukraine rapidly recaptured territory in Kharkiv Oblast and later liberated Kherson city, demonstrating that Russian occupation could be reversed.", [stat("11 Nov 2022", "Kherson liberated")], img.ukraine, [49.5, 34]),
        ev("attritional-war", "2023-06-01", "Attritional War and Western Support", "The war settled into prolonged fighting shaped by trenches, drones, artillery, missile attacks, mobilization, and extensive Western military aid to Ukraine.", [stat("Ongoing", "War of attrition")], img.ukraine, [48.5, 36]),
      ], summary: "As of June 14, 2026, the war remains unresolved. Ukraine preserved its state and defeated Russia's initial plan for rapid conquest, while Russia occupies substantial Ukrainian territory. The conflict has caused massive military casualties, civilian deaths, destruction, and Europe's largest refugee crisis since World War II.", outcome: "Ongoing as of June 14, 2026", cost: "Hundreds of thousands of military casualties; tens of thousands of civilians killed and millions displaced" }),
  },
  {
    id: "syrian-civil-war", title: "Syrian Civil War", image: img.syria,
    description: "Trace Syria's uprising, civil war, foreign interventions, fight against ISIS, and the fall of Assad.",
    data: dive({ title: "Syrian Civil War", previous: "Iraq War", start: "2011-03-15", end: "2024-12-08", period: "2011-2024", image: img.syria, center: [35, 38],
      connection: "The Iraq War destabilized the region and strengthened jihadist networks, while the Arab Spring inspired protests against authoritarian governments. Syria's security forces violently suppressed demonstrations against Bashar al-Assad, turning an uprising into civil war.",
      stakes: "Syrians fought over dictatorship, revolution, territory, communal survival, and the country's political future, while Russia, Iran, Turkey, the United States, Israel, and armed groups pursued competing interests.",
      events: [
        ev("daraa-protests", "2011-03-15", "Daraa Protests and Crackdown", "Protests spread after the arrest and abuse of schoolchildren in Daraa. Security forces used lethal force, fueling nationwide demonstrations and armed resistance.", [stat("March 2011", "Uprising begins")], img.syria, [32.62, 36.1]),
        ev("battle-of-aleppo", "2012-07-19", "Battle of Aleppo", "Rebel forces entered Aleppo, beginning years of urban warfare. Government forces, backed by Russia and Iran-aligned forces, recaptured the eastern districts in December 2016.", [stat("2012-2016", "Major urban battle")], img.syria, [36.2, 37.16]),
        ev("ghouta-chemical-attack", "2013-08-21", "Ghouta Chemical Attack", "Rockets carrying sarin struck opposition-held areas near Damascus, killing large numbers of civilians. Syria later agreed to surrender its declared chemical arsenal under an international deal.", [stat("21 Aug 2013", "Major chemical attack")], img.syria, [33.52, 36.4]),
        ev("rise-of-isis", "2014-06-29", "Rise of ISIS", "ISIS proclaimed a caliphate across parts of Syria and Iraq. A US-led coalition began airstrikes and supported local partners, especially the Kurdish-led Syrian Democratic Forces.", [stat("2014", "ISIS controls extensive territory")], img.syria, [35.95, 39]),
        ev("russian-intervention", "2015-09-30", "Russian Military Intervention", "Russia intervened directly with air power in support of Assad, helping reverse rebel gains and preserve the government.", [stat("30 Sep 2015", "Russian intervention begins")], img.syria, [35, 38]),
        ev("fall-of-baghuz", "2019-03-23", "Fall of Baghuz", "The Syrian Democratic Forces captured ISIS's last major territorial enclave at Baghuz, ending the group's territorial caliphate while its insurgency continued.", [stat("23 Mar 2019", "ISIS territorial caliphate defeated")], img.syria, [34.45, 40.95]),
        ev("fall-of-assad", "2024-12-08", "Fall of Assad", "A rapid opposition offensive captured Aleppo, Hama, Homs, and Damascus. Bashar al-Assad fled to Russia, ending his family's rule and the principal civil-war phase.", [stat("8 Dec 2024", "Assad regime collapses")], img.syria, [33.51, 36.29]),
      ], summary: "Opposition forces overthrew Assad in December 2024 after nearly fourteen years of war. Syria remained fractured and violent during the transition, with foreign troops, ISIS cells, communal tensions, and unresolved Kurdish and regional disputes continuing beyond the civil war's principal phase.", outcome: "Assad regime overthrown; unstable transition", cost: "More than 500,000 killed and millions displaced" }),
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
console.log(`Created ${entries.length} major-conflict deep dives.`);
