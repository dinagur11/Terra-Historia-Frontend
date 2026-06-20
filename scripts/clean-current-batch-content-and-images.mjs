import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DRAFT_DIR = "C:\\Users\\alons\\Terra-Historia-Backend\\deepdives-drafts";

const imageUpdates = {
  "indochina-wars": {
    "origins-and-road-to-war": "https://static.dw.com/image/70018878_902.webp",
    "french-coup-in-saigon": "https://cdn2.picryl.com/photo/1945/12/31/the-allied-reoccupation-of-french-indo-china-1945-se5175-01868b-640.jpg",
    "siege-and-gateforce": "https://battlefieldtravels.com/wp-content/uploads/2025/12/img217-1.webp",
    "british-withdrawal": "https://c8.alamy.com/zooms/9/fc0493e86c4d448cae46972d2751bedc/2b00mww.jpg",
    "third-indochina-war": "https://i.redd.it/pictures-of-the-third-indochina-war-v0-9cwgn4wajkyb1.jpg?width=1000&format=pjpg&auto=webp&s=a2b8369a5403dea0bd5d8906decc56f803f612e8",
    "international-and-human-dimensions": "https://content.magnumphotos.com/wp-content/uploads/2016/12/cortex/par295396-teaser-story-big.jpg",
    "outcome-and-legacy": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Dien_Bien_Phu_1954_French_prisoners.jpg/1280px-Dien_Bien_Phu_1954_French_prisoners.jpg",
  },
  "polish-soviet-war": {
    "origins-and-background": "https://upload.wikimedia.org/wikipedia/commons/4/47/19190501-lenin_speech_red_square.jpg",
    "first-clashes": "https://upload.wikimedia.org/wikipedia/commons/e/e9/Haller_and_blue_army.jpg",
    "kiev-offensive": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Wej%C5%9Bcie_wojsk_polskich_do_Kijowa.jpg/1920px-Wej%C5%9Bcie_wojsk_polskich_do_Kijowa.jpg",
    "soviet-counteroffensive": "https://realtimehistory.net/cdn/shop/articles/1920_15_bg.jpg?v=1611230841",
    "battle-of-warsaw": "https://warsawinstitute.org/wp-content/uploads/2020/08/Poland-Battle-of-Warsaw-war-Soviets-1920.jpg",
    "battle-of-niemen": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Battle_of_Niemen.jpg/250px-Battle_of_Niemen.jpg",
    "conflict-summary": "https://upload.wikimedia.org/wikipedia/commons/7/78/Powazki_1920.JPG",
  },
  "algerian-war": {
    "origins-and-background": "https://media.jacobin.com/images/2021/4/863884122787.jpg",
    "toussaint-rouge": "https://barteredhistory.wordpress.com/wp-content/uploads/2016/03/judaicalgeria-bloody-all-saints-day.jpg",
    "philippeville": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/National_Liberation_Army_Soldiers_%287%29.jpg/1920px-National_Liberation_Army_Soldiers_%287%29.jpg",
    "battle-of-algiers": "https://bamlive.s3.amazonaws.com/styles/program_slide/s3/1200_Pontecorvo_Battle-of-Algiers_017.jpg?itok=58Phx4LG",
    "1958-crisis": "https://historydraft.com/files/9419655d-f16a-40fd-a7f6-c1a9db3da1eb",
    "self-determination": "https://cdn.theatlantic.com/thumbor/Z3C9ngpjxYOZU_uanEIl5v-Mq-4=/144x27:1778x1252/1200x900/media/img/2015/11/charles_de_gaulle/original.jpg",
    "evian-accords": "https://www.actuailes.fr/kcfinder/upload/images/france%20evian.jpeg",
    "conflict-summary": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Politieke_moeilijkheden_in_Parijs%2C_Bestanddeelnr_909-5929.jpg/1280px-Politieke_moeilijkheden_in_Parijs%2C_Bestanddeelnr_909-5929.jpg",
  },
  "irish-war-of-independence": {
    "soloheadbeg": "https://www.theirishstory.com/wp-content/uploads/2014/05/Dan-Breen.jpg",
    "guerrilla-campaign": "https://upload.wikimedia.org/wikipedia/commons/6/60/West_Connemara_Flying_Column_1922.jpg",
    "black-and-tans": "https://www.theirishwar.com/wp-content/uploads/2012/03/black-Tans1.jpg",
    "bloody-sunday": "https://c.files.bbci.co.uk/12511/production/_115552057_gettyimages-82143779.jpg",
    "truce-and-treaty": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Prayer_vigil_outside_the_Anglo-Irish_Treaty_negotiations%2C_July_1921.jpg/1920px-Prayer_vigil_outside_the_Anglo-Irish_Treaty_negotiations%2C_July_1921.jpg",
    "conflict-summary": "https://upload.wikimedia.org/wikipedia/commons/8/8d/Crowd_at_Mansion_House_Dublin_ahead_of_War_of_Independence_truce_July_8_1921.jpg",
  },
  "greek-civil-war": {
    "origins-and-background": "https://www.nationalww2museum.org/sites/default/files/2020-05/GW5%20-%20Edward%20Lengel.jpg",
    "democratic-army": "https://alchetron.com/cdn/democratic-army-of-greece-db21a7fd-63ec-4404-85e2-44cd01ebe6c-resize-750.jpg",
    "truman-doctrine": "https://providencemag.com/wp-content/uploads/Partizani_na_DAG.jpg",
    "konitsa": "https://c8.alamy.com/comp/DB7E8R/greek-civil-war-1946-1949-government-troops-on-the-way-to-the-front-DB7E8R.jpg",
    "grammos-vitsi": "https://stratistoria.wordpress.com/wp-content/uploads/2017/10/1946-1949.jpg",
    "war-ends": "https://www.nationalww2museum.org/sites/default/files/2020-05/GW2%20-%20Edward%20Lengel_1.jpg",
    "conflict-summary": "https://origins.osu.edu/sites/default/files/styles/twitter_card_format/public/2022-11/Greek-Civil-War-lg.jpg?itok=5hwtPm0z",
  },
};

const bodyUpdates = {
  "polish-soviet-war": {
    "origins-and-background": "The collapse of the Russian, German, and Austro-Hungarian empires left no accepted frontier between the restored Polish state and revolutionary Russia. Polish leaders sought security farther east and, under Piłsudski, imagined a federation with independent Lithuania, Belarus, and Ukraine. Bolshevik leaders aimed to recover former imperial territory and hoped a westward advance might connect the Russian Revolution with unrest in Germany. As German troops withdrew, both new armies moved into the same political vacuum.",
    "first-clashes": "Polish and Soviet units first clashed as German occupation forces withdrew from the former imperial borderlands. Neither side initially possessed a continuous front, so control grew outward from railways, towns, and improvised local commands. The fighting near Mosty and Bereza Kartuska turned two competing advances into an undeclared interstate war over Belarus, Lithuania, and Ukraine.",
    "kiev-offensive": "Poland and the Ukrainian People's Republic launched the Kiev Offensive to establish an allied independent Ukraine between Poland and Soviet Russia. They entered Kyiv on 7 May 1920, but the Red Army withdrew without being destroyed and Polish supply lines stretched deep into Ukraine. The apparent success encouraged Soviet mobilization and exposed the offensive as a strategic gamble rather than a decisive victory.",
    "soviet-counteroffensive": "The Red Army counterattacked in Ukraine and Belarus, forcing Polish-led forces into a rapid retreat. Semyon Budyonny's cavalry threatened communications in the south while Mikhail Tukhachevsky's Western Front drove toward Warsaw. Soviet leaders began to see military victory as a possible route for revolution into Central Europe, while Poland suddenly faced a war for national survival.",
    "battle-of-warsaw": "Polish forces stopped the Soviet advance outside Warsaw in August 1920. Defensive fighting around Radzymin held the approaches while Polish radio intelligence tracked Soviet communications and Piłsudski's strike group attacked from the Wieprz River into the exposed Soviet flank. The resulting retreat saved the capital, broke the Western Front's momentum, and ended the immediate prospect of carrying revolution west by force.",
    "battle-of-niemen": "At the Niemen River, Polish forces combined frontal pressure with maneuver through Lithuanian-held territory to threaten Soviet positions around Grodno and Lida. The victory prevented the Red Army from rebuilding a stable front after Warsaw and forced another eastward retreat. Poland entered peace negotiations from a position of military strength rather than emergency.",
    "treaty-of-riga": "The Treaty of Riga ended the war between Poland, Soviet Russia, and Soviet Ukraine. It established a frontier far east of the later Curzon Line but divided Belarusian and Ukrainian communities between states. Poland secured territory and temporary security, while its Ukrainian ally was excluded from the settlement and Soviet rule survived east of the border.",
  },
  "algerian-war": {
    "origins-and-background": "France had conquered Algeria in the nineteenth century and treated it legally as part of France, but political rights, landholding, education, and economic power remained deeply unequal. Algerian service in two world wars raised expectations that sacrifice would bring reform. Instead, the suppression of nationalist demonstrations around Sétif and Guelma in May 1945 killed thousands and convinced a new generation that peaceful integration had failed. By 1954, the FLN was preparing armed revolt against a colonial system defended by the French state and roughly one million European settlers.",
    "toussaint-rouge": "Toussaint Rouge means 'Red All Saints' or 'Bloody All Saints,' referring to the attacks launched on 1 November 1954, the Catholic feast of All Saints' Day. The newly formed FLN struck police posts, military sites, communications, and settler targets across Algeria while issuing a declaration for national independence. The operation was militarily limited, but it announced a unified revolutionary organization and the beginning of an eight-year war.",
    "philippeville": "The FLN offensive around Philippeville attacked military targets, settler communities, and Muslims accused of cooperation. French forces, police, settlers, and local auxiliaries answered with reprisals that killed far more people than the initial attacks. The cycle destroyed remaining space for political moderation, expanded Muslim support for the rebellion, and pushed France toward a much larger counterinsurgency war.",
    "battle-of-algiers": "The FLN brought the war into Algiers through assassinations, strikes, and bombs placed in civilian venues. French paratroopers dismantled much of the urban network through checkpoints, intelligence penetration, mass detention, disappearances, and systematic torture. France won the immediate security contest, but evidence of torture and extrajudicial violence damaged its legitimacy at home and abroad.",
    "1958-crisis": "French settlers, sympathetic officers, and army units in Algiers created a Committee of Public Safety and demanded a government committed to keeping Algeria French. The threat of military intervention in metropolitan France helped collapse the Fourth Republic and return Charles de Gaulle to power. A colonial war had become a constitutional crisis inside France itself.",
    "self-determination": "De Gaulle's September 1959 acceptance of Algerian self-determination marked a strategic break with the settler demand for permanent French Algeria. He concluded that military superiority could not produce a sustainable political settlement. The shift opened a path to negotiations but also provoked mutiny, coup attempts, and OAS terrorism from hardliners who believed France was abandoning them.",
    "evian-accords": "French and Algerian representatives signed the Évian Accords on 18 March 1962 after difficult negotiations over sovereignty, oil, military bases, minority guarantees, and the ceasefire. Formal fighting ended the next day, but OAS terrorism, FLN reprisals, the killing and abandonment of Harkis, and the mass departure of European settlers continued. Independence arrived through agreement, but not through an orderly or bloodless transition.",
  },
  "irish-war-of-independence": {
    "origins-and-background": "Ireland entered World War I with Home Rule approved but suspended. The Easter Rising of 1916 initially lacked broad support, yet Britain's execution of its leaders, mass arrests, and the later conscription crisis transformed public opinion. Sinn Féin won the 1918 election across most of the island, refused to sit at Westminster, and prepared a separate parliament in Dublin. The coming conflict therefore joined two contests: whether an Irish republic could function as a government, and whether the IRA could make British administration impossible to sustain.",
    "soloheadbeg": "At Soloheadbeg, IRA volunteers including Dan Breen and Seán Treacy ambushed a gelignite escort and killed two Royal Irish Constabulary officers. On the same day, elected Sinn Féin representatives assembled at Dublin's Mansion House as the First Dáil and declared an Irish republic. The coincidence joined an armed challenge in rural Tipperary to a rival claim of national government in Dublin.",
    "guerrilla-campaign": "The IRA avoided a conventional front and built a decentralized war around ambushes, raids on barracks, attacks on intelligence networks, and mobile flying columns. County brigades exploited local knowledge and civilian support, while Michael Collins's Dublin network penetrated British security operations. The campaign did not defeat Britain in open battle; it made policing, administration, and intelligence increasingly costly and unreliable.",
    "black-and-tans": "Britain reinforced the Royal Irish Constabulary with the Black and Tans and the Auxiliary Division. These forces increased mobility and firepower, but reprisals, arson, beatings, and killings punished communities suspected of supporting the IRA. Destruction at Balbriggan, Trim, Cork, and elsewhere weakened Britain's moral position and helped the republican movement portray the conflict as a struggle against uncontrolled coercion.",
    "bloody-sunday": "On the morning of 21 November 1920, Michael Collins's intelligence organization attacked British intelligence officers at addresses across Dublin. That afternoon, Crown forces opened fire at a Gaelic football match in Croke Park, killing fourteen civilians; later, three republican prisoners died in Dublin Castle. The day exposed the centrality of intelligence and demonstrated how quickly covert warfare could produce public massacre.",
    "custom-house": "The IRA attacked and burned Dublin's Custom House, a highly visible center of British administration. The fire produced dramatic publicity and demonstrated that republican forces could strike in the capital, but British troops surrounded the area and arrested more than one hundred participants and suspects. The operation damaged a symbol of government while costing the Dublin Brigade many experienced volunteers.",
    "truce-and-treaty": "The truce of 11 July 1921 stopped active operations after neither side found a politically acceptable military solution. Negotiations in London produced the Anglo-Irish Treaty, granting dominion status to the Irish Free State while retaining the Crown, treaty ports, and the option for Northern Ireland to remain in the United Kingdom. The agreement ended the war with Britain but divided the republican movement and led directly to civil war.",
  },
  "greek-civil-war": {
    "origins-and-background": "Axis occupation devastated Greece and produced rival resistance movements with incompatible visions for the postwar state. The communist-led EAM-ELAS became the largest resistance force, while the monarchy and conservative government retained British support. Armed conflict in Athens during the Dekemvriana of December 1944 ended with the Varkiza Agreement, but disarmament, right-wing violence, political exclusion, and mutual fear prevented reconciliation. When war resumed in 1946, Greece became both a domestic struggle over power and an early test of the emerging Cold War.",
    "litochoro-attack": "Communist guerrillas attacked the gendarmerie station at Litochoro on the eve of the March 1946 election. The operation killed members of the security forces and is commonly treated as the opening of the civil war's final phase. It showed that the failed post-occupation settlement had moved from political exclusion and scattered violence toward organized insurgency.",
    "democratic-army": "The Communist Party of Greece organized the Democratic Army of Greece as a structured guerrilla force with regional commands, mountain bases, and eventually conventional formations. It drew on veterans of the wartime resistance and relied on access through Albania, Yugoslavia, and Bulgaria. Creating the DSE turned local armed bands into a rival army capable of challenging state control across northern Greece.",
    "truman-doctrine": "Britain informed the United States that its financial crisis made continued support for Greece and Turkey unsustainable. On 12 March 1947, President Harry Truman asked Congress for $400 million in aid and framed the Greek conflict as a test of resistance to armed pressure and communist expansion. American equipment, money, advisers, and the US military mission reorganized and sustained the Greek government army. The doctrine made Greece an early proving ground for containment and transferred leadership of the Western response from Britain to the United States.",
    "konitsa": "The Democratic Army attacked Konitsa in an effort to capture a substantial town near Albania and establish it as the seat of a provisional government. Government defenders held until reinforcements arrived, and the guerrillas withdrew after costly fighting. The failure revealed the DSE's difficulty in converting mountain mobility into permanent control of defended urban centers.",
    "grammos-vitsi": "Government forces launched their final offensives against the DSE strongholds in the Grammos and Vitsi mountains. US-supplied aircraft, artillery, improved command, and numerical superiority compressed the guerrilla positions, while Yugoslavia's closure of its border after the Tito-Stalin split removed a crucial sanctuary. The collapse of both mountain fronts destroyed the DSE's capacity to continue organized war inside Greece.",
    "war-ends": "After defeat at Grammos and Vitsi, surviving Democratic Army formations crossed into Albania and other communist states. The Communist Party announced a temporary cessation of hostilities on 16 October 1949, language that avoided formally abandoning its political claims. In practice, the organized civil war had ended, leaving prisoners, exiles, child refugees, and a deeply restricted postwar political order.",
  },
};

function burningOfCorkEvent() {
  return {
    id: "burning-of-cork",
    year: 1920,
    date: "1920-12-11",
    title: "Burning of Cork",
    sub: "Crown-force reprisals devastate the commercial center",
    view: { center: [51.899, -8.475], zoom: 11 },
    markers: [
      { label: "St Patrick's Street", latlng: [51.8986, -8.4729], type: "target", description: "Fires destroyed major shops and commercial premises along Cork's principal street." },
      { label: "Dillon's Cross", latlng: [51.913, -8.459], type: "major", description: "An IRA ambush on an Auxiliary patrol here preceded the reprisals later that night." },
      { label: "Cork City Hall", latlng: [51.897, -8.465], type: "major", description: "City Hall and the adjoining Carnegie Free Library were among the public buildings destroyed." },
    ],
    regions: [],
    slides: [
      {
        title: "Burning of Cork",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/The_Burning_of_Cork_%289713428703%29.jpg/1920px-The_Burning_of_Cork_%289713428703%29.jpg",
        cap: "Cork's commercial center after Crown-force reprisals in December 1920.",
        body: "On the night of 11-12 December 1920, members of the Auxiliary Division and other Crown forces looted and burned buildings across central Cork after an IRA ambush at Dillon's Cross. Large sections of St Patrick's Street, City Hall, and the Carnegie Free Library were destroyed while firefighters struggled to contain the flames. The reprisal caused enormous economic damage and became international evidence that British counterinsurgency was punishing entire communities rather than isolating the IRA.",
        stats: [
          { val: "11-12 Dec 1920", lbl: "Night of the burning" },
          { val: "Crown-force reprisal", lbl: "Cause and character" },
          { val: "Why it matters", lbl: "The destruction strengthened republican propaganda, intensified criticism in Britain, and demonstrated the political cost of collective punishment.", full: true },
        ],
      },
    ],
  };
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8").replace(/^\uFEFF/, ""));
}

function writeJson(path, data) {
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function setImage(event, image) {
  for (const slide of event.slides || []) {
    slide.img = image;
    slide.cap = `Visual reference for ${event.title}.`;
  }
}

for (const [id, images] of Object.entries(imageUpdates)) {
  const path = join(DRAFT_DIR, `${id}.generated.json`);
  const events = readJson(path);

  for (const event of events) {
    if (images[event.id]) setImage(event, images[event.id]);
    if (bodyUpdates[id]?.[event.id] && event.slides?.[0]) {
      event.slides[0].body = bodyUpdates[id][event.id];
    }
  }

  if (id === "algerian-war") {
    const evian = events.find((event) => event.id === "evian-accords");
    if (evian) evian.view = { center: [46.401, 6.59], zoom: 10 };
  }

  if (id === "irish-war-of-independence") {
    const treaty = events.find((event) => event.id === "truce-and-treaty");
    if (treaty) {
      for (const slide of treaty.slides || []) {
        slide.cap = "Crowds holding a prayer vigil outside Whitehall, while negotiations are underway inside.";
      }
    }

    const burning = burningOfCorkEvent();
    const existingIndex = events.findIndex((event) => event.id === burning.id);
    if (existingIndex >= 0) events[existingIndex] = burning;
    else {
      const customHouseIndex = events.findIndex((event) => event.id === "custom-house");
      events.splice(customHouseIndex >= 0 ? customHouseIndex : events.length, 0, burning);
    }
  }

  if (id === "greek-civil-war") {
    const origins = events.find((event) => event.id === "origins-and-background");
    if (origins) origins.view = { center: [39.1419, 22.6138], zoom: 6 };
  }

  writeJson(path, events);
  console.log(`Cleaned content and images for ${id}`);
}
