import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const BACKEND_ROOT = "C:\\Users\\alons\\Terra-Historia-Backend";
const DRAFT_DIR = join(BACKEND_ROOT, "deepdives-drafts");

const updates = {
  "polish-lithuanian-war": {
    "polish-capture-of-vilnius-1919":
      "https://preview.redd.it/polish-chief-of-state-j%C3%B3zef-pi%C5%82sudski-with-soldiers-of-the-v0-1ki0cdbkn61c1.jpg?width=640&crop=smart&auto=webp&s=58a5d5e64038b0107b24d397924c3f0af47e35b9",
  },
  "lithuanian-soviet-war": {
    "battle-of-kedainiai":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Soviet_POWs_in_Lithuania.jpg/330px-Soviet_POWs_in_Lithuania.jpg",
  },
  "transnistria-war": {
    "origins-and-road-to-war": "https://upload.wikimedia.org/wikipedia/commons/9/96/Bender_1992.jpg",
    "dubasari-clashes": "https://storage.moldova1.md/images/d5f01bbe-f37c-42ac-8e53-ec450398312c.jpg",
    "pmr-state-building-and-14th-army": "https://www.historic-uk.com/wp-content/uploads/2025/08/14th-soldiers.jpg",
    "cocieri-and-dubasari-fighting": "https://www.veridica.ro/storage/3430/conversions/media-libraryQ2nTBZ-image.webp",
    "battle-of-bender": "https://balkaninsight.com/wp-content/uploads/2022/07/Russian-peacekeepers-entering-Bender.jpg",
    "lebeds-intervention-and-ceasefire": "https://balkaninsight.com/wp-content/uploads/2022/07/Igor-Smirnov-addresses-the-Transnistrian-people-with-Alexander-Lebed-behind-him.jpg",
    "international-and-human-dimensions": "https://ichef.bbci.co.uk/images/ic/480x270/p0c6lctw.jpg.webp",
  },
  "war-in-abkhazia": {
    "origins-and-road-to-war": "https://gdb.rferl.org/fd1e430a-0a3a-4948-8e67-a63e3997eafe_w1071_s_d3.jpg",
    "georgian-entry-into-sukhumi": "https://gdb.rferl.org/01000000-0aff-0242-0e51-08dbbf33fdf8_w1071_r0_s_d3.jpeg",
    "battle-of-gagra": "https://abkhazworld.com/aw/images/img/Volunteers_from_the_North_Caucasus.jpg#joomlaImage://local-images/img/Volunteers_from_the_North_Caucasus.jpg?width=659&height=383",
    "battle-of-ochamchire": "https://upload.wikimedia.org/wikipedia/commons/5/59/War_in_Abkhazia_1992.PNG",
    "fall-of-sukhumi": "https://georgiatoday.ge/wp-content/uploads/2025/08/georgian_soldiers_in_abkhazia-350x250.jpg",
    "ethnic-cleansing-of-georgians": "https://static01.nyt.com/images/2008/08/19/world/20refugee_600.jpg?quality=75&auto=webp&disable=upscale",
    "outcome-and-legacy": "https://gdb.rferl.org/1195c964-9848-40e0-8eb1-26e08a45545c_w1071_s_d3.jpg",
  },
  "tajikistani-civil-war": {
    "origins-and-road-to-war": "https://thediplomat.com/wp-content/uploads/2017/05/sizes/td-story-s-2/thediplomat.com-31_cvrs_1.jpg",
    "dushanbe-demonstrations-and-armed-clashes": "https://upload.wikimedia.org/wikipedia/commons/1/17/RIAN_archive_466496_Rally_on_Shakhidon_square.jpg",
    "southern-front-and-kulob-popular-front": "https://upload.wikimedia.org/wikipedia/commons/a/a0/Spetsnaz_troopers_during_the_1992_Tajik_war.jpg",
    "operation-hisar": "https://gdb.rferl.org/890dc8aa-703c-4226-8a05-f5d74c164cba_w1071_s_d3.jpg",
    "afghan-border-and-refugee-crisis": "https://gdb.rferl.org/a2c94b84-3638-4bb0-9b13-8a84b391b8e7_w408_r1_s.jpg",
    "battle-at-the-12th-outpost": "https://c8.alamy.com/comp/2J09T0W/tajikistan-civil-war-1992-97-september-1992-young-russian-soldiers-riding-in-the-back-of-a-military-vehicle-as-part-of-a-russian-convoy-from-dushanbe-tajikistan-capital-to-the-southern-khatlon-region-on-the-afghanistan-border-2J09T0W.jpg",
    "un-mediation-and-inter-tajik-talks": "https://rc-services-assets.s3.eu-west-1.amazonaws.com/s3fs-public/Screen%20Shot%202015-07-30%20at%2013.08.57.png",
    "general-agreement-on-peace": "https://rc-services-assets.s3.eu-west-1.amazonaws.com/s3fs-public/Screen%20Shot%202015-07-30%20at%2013.08.57.png",
    "outcome-and-legacy": "https://static.wikia.nocookie.net/totalwar-ar/images/4/4d/UTO_elderly_fighter.jpg/revision/latest?cb=20150507205651",
  },
  "russo-georgian-war": {
    "august-escalation": "https://media.cnn.com/api/v1/images/stellar/prod/140106165256-georgia-conflict-2008.jpg?q=w_3000,h_1996,x_0,y_0,c_fill",
    "battle-for-tskhinvali": "https://jamestown.org/wp-content/uploads/2010/01/georgia_war04.jpg",
    "advance-toward-gori-and-poti": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Anatoly_Lebed_12.jpg/250px-Anatoly_Lebed_12.jpg",
    "ceasefire": "https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2008/08/15/riceingeorgia460.jpg?width=1200&height=630&quality=85&auto=format&fit=crop&precrop=40:21,offset-x50,offset-y0&overlay-align=bottom%2Cleft&overlay-width=100p&overlay-base64=L2ltZy9zdGF0aWMvb3ZlcmxheXMvdGctYWdlLTIwMDgucG5n&s=8cfd76a4281c745dcf8805022b6b6bbc",
    "recognition-of-abkhazia-and-south-ossetia": "https://cdn-media.tass.ru/width/1020_b9261fa1/tass/m2/en/uploads/i/20230825/1399947.jpg",
    "outcome-and-legacy": "https://www.americanprogress.org/wp-content/uploads/sites/2/2008/08/russian_tank.jpg?w=610",
  },
};

const transnistriaHumanNote =
  "The war is usually described as killing roughly 1,000 people, with thousands more wounded or displaced. Bender concentrated much of that civilian trauma, while the postwar security zone turned the human cost into a long-term frozen-conflict reality.";

async function readJson(path) {
  return JSON.parse((await readFile(path, "utf8")).replace(/^\uFEFF/, ""));
}

async function writeJson(path, data) {
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

for (const [id, eventUpdates] of Object.entries(updates)) {
  const path = join(DRAFT_DIR, `${id}.generated.json`);
  const events = await readJson(path);

  for (const event of events) {
    const image = eventUpdates[event.id];
    const slide = event.slides?.[0];
    if (!slide) continue;

    if (image) {
      slide.img = image;
      slide.cap = `Visual reference for ${event.title}.`;
    }

    if (id === "transnistria-war" && event.id === "international-and-human-dimensions") {
      slide.body = transnistriaHumanNote;
      const fullNote = (slide.stats || []).find((stat) => stat.full);
      if (fullNote) {
        fullNote.val = "Human cost";
        fullNote.lbl = transnistriaHumanNote;
      } else {
        slide.stats = [
          ...(slide.stats || []),
          { val: "Human cost", lbl: transnistriaHumanNote, full: true },
        ];
      }
    }
  }

  await writeJson(path, events);
  console.log(`Updated requested images in ${id}`);
}
