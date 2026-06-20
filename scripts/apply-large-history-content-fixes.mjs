import { readFile, writeFile, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const backend = process.argv[2] ?? "C:\\Users\\alons\\Terra-Historia-Backend";
const front = process.cwd();
const drafts = join(backend, "deepdives-drafts");
const eventsDir = join(backend, "events");

const event = (id, name, date, location, lat, lng, summary) => ({
  id, name, date, location, coordinates: { lat, lng }, summary,
});

const mainTimeline = {
  1915: [
    event("constantinople-agreement-1915-1", "Constantinople Agreement", "March 18 1915", "Istanbul", 41.0082, 28.9784, "WWI: Britain, France, and the Russian Empire secretly agree that Russia would receive Constantinople and the Straits if the Entente defeated the Ottoman Empire. The agreement showed how wartime diplomacy tied military victory to postwar territorial promises."),
    event("second-battle-of-ypres-1915-2", "Second Battle of Ypres", "April 22 1915", "Ypres", 50.851, 2.885, "WWI: Germany uses poison gas on a large scale near Ypres, opening a new and terrifying chapter in trench warfare. Canadian, British, French, and colonial troops hold the line despite heavy casualties."),
    event("armenian-intellectuals-deported-1915-3", "Deportation of Armenian Intellectuals", "April 24 1915", "Istanbul", 41.0136, 28.955, "WWI / Armenian Genocide: Ottoman authorities arrest and deport Armenian community leaders in Constantinople. The arrests are widely treated as the beginning of the Armenian genocide."),
    event("gallipoli-campaign-1915-4", "Gallipoli Campaign Begins", "April 25 1915", "Gallipoli Peninsula", 40.2375, 26.2775, "WWI: Allied troops land at Gallipoli to try to force the Dardanelles, knock the Ottoman Empire out of the war, and reopen a route to Russia. The campaign becomes a costly stalemate."),
    event("lusitania-sunk-1915-5", "Sinking of RMS Lusitania", "May 7 1915", "Off the coast of Ireland", 51.4167, -8.55, "WWI: German submarine U-20 sinks RMS Lusitania off Ireland, killing 1,199 people. The attack shocks world opinion and pushes the United States closer to confrontation with Germany."),
    event("gorlice-tarnow-offensive-1915-6", "Gorlice-Tarnow Offensive", "May 2 1915", "Gorlice", 49.655, 21.16, "WWI: German and Austro-Hungarian forces break through Russian lines in Galicia. The offensive begins the Great Retreat and inflicts a major defeat on the Russian Empire."),
    event("italy-enters-wwi-1915-7", "Italy Enters World War I", "May 23 1915", "Rome", 41.9028, 12.4964, "WWI: Italy declares war on Austria-Hungary after joining the Entente through the Treaty of London. A brutal mountain front opens along the Alps and Isonzo River."),
    event("great-retreat-1915-8", "Russian Great Retreat", "July 1915", "Warsaw", 52.2297, 21.0122, "WWI: Russian armies abandon Poland and much of the western empire under Central Powers pressure. The retreat damages Russian morale and deepens the empire's political crisis."),
    event("battle-of-loos-1915-9", "Battle of Loos", "September 25 1915", "Loos-en-Gohelle", 50.4583, 2.7942, "WWI: British forces attack at Loos and use poison gas for the first time. Initial gains cannot be exploited, and casualties are severe."),
    event("gallipoli-evacuation-1915-10", "Gallipoli Evacuation Begins", "December 1915", "Gallipoli Peninsula", 40.2375, 26.2775, "WWI: Allied commanders begin evacuating Gallipoli after months of failed attacks, disease, and supply problems. The withdrawal is one of the campaign's few well-executed operations."),
  ],
  1916: [
    event("verdun-1916-1", "Battle of Verdun Begins", "February 21 1916", "Verdun", 49.2081, 5.4219, "WWI: Germany attacks Verdun, hoping to bleed France white. The battle becomes one of the war's longest and most symbolic struggles."),
    event("battle-of-columbus-1916-2", "Battle of Columbus", "March 9 1916", "Columbus, New Mexico", 31.8308, -107.6417, "Pancho Villa raids Columbus, New Mexico, prompting the United States to launch the Punitive Expedition into Mexico while Europe remains consumed by World War I."),
    event("easter-rising-1916-3", "Easter Rising", "April 24 1916", "Dublin", 53.3498, -6.2603, "Irish republicans seize key buildings in Dublin and proclaim an Irish Republic. The rising is suppressed, but the executions of its leaders transform Irish politics during the wider wartime crisis."),
    event("jutland-1916-4", "Battle of Jutland", "May 31 1916", "North Sea", 56.7, 5.9, "WWI: The British Grand Fleet and German High Seas Fleet clash in the largest naval battle of the war. Germany inflicts heavy losses but fails to break Britain's naval blockade."),
    event("brusilov-offensive-1916-5", "Brusilov Offensive", "June 4 1916", "Lutsk", 50.7472, 25.3254, "WWI: Russia launches the Brusilov Offensive against Austria-Hungary, achieving one of the Entente's greatest battlefield successes and forcing Germany to divert troops east."),
    event("arab-revolt-1916-6", "Arab Revolt Begins", "June 10 1916", "Mecca", 21.4225, 39.8262, "WWI: Sharif Hussein of Mecca launches the Arab Revolt against Ottoman rule, supported by British promises and wartime strategy in the Middle East."),
    event("battle-of-the-somme-1916-7", "Battle of the Somme", "July 1 1916", "Somme", 50.0156, 2.6975, "WWI: The Somme opens with the bloodiest day in British military history. The offensive becomes a grinding battle of artillery, infantry, aircraft, and early tanks."),
    event("romania-enters-war-1916-8", "Romania Enters World War I", "August 27 1916", "Bucharest", 44.4268, 26.1025, "WWI: Romania joins the Entente, hoping to gain Transylvania. Central Powers counterattacks soon overrun much of the country."),
    event("flers-courcelette-1916-9", "Battle of Flers-Courcelette", "September 15 1916", "Flers-Courcelette", 50.05, 2.8, "WWI: Tanks are used in battle for the first time during the Somme campaign. The new weapon is unreliable but points toward future armored warfare."),
    event("verdun-french-counteroffensive-1916-10", "French Counteroffensive at Verdun", "October-December 1916", "Verdun", 49.2081, 5.4219, "WWI: French forces retake key Verdun forts, including Douaumont and Vaux. The battle ends with little territorial change and enormous casualties."),
  ],
  1917: [
    event("zimmermann-telegram-1917-1", "Zimmermann Telegram", "January 1917", "Washington, D.C.", 38.9072, -77.0369, "WWI: Britain reveals Germany's proposal for Mexico to join a war against the United States. The telegram helps shift American opinion toward intervention."),
    event("unrestricted-submarine-warfare-1917-2", "Germany Resumes Unrestricted Submarine Warfare", "February 1 1917", "North Atlantic", 45, -30, "WWI: Germany resumes unrestricted submarine warfare, gambling it can starve Britain before the United States can mobilize."),
    event("february-revolution-1917-3", "February Revolution", "March 1917", "Petrograd", 59.9343, 30.3351, "WWI / Russia: Food shortages, war exhaustion, and mutiny in Petrograd force Tsar Nicholas II to abdicate, creating a revolutionary power vacuum."),
    event("us-enters-wwi-1917-4", "United States Enters World War I", "April 6 1917", "Washington, D.C.", 38.9072, -77.0369, "WWI: The United States declares war on Germany, bringing vast future manpower and industrial power to the Entente."),
    event("arras-1917-5", "Battle of Arras", "April 9 1917", "Arras", 50.291, 2.777, "WWI: British and Canadian forces attack near Arras; Canadian troops capture Vimy Ridge, while the wider offensive stalls."),
    event("nivelle-offensive-1917-6", "Nivelle Offensive", "April 16 1917", "Chemin des Dames", 49.44, 3.72, "WWI: France's Nivelle Offensive fails at enormous cost, triggering mutinies in the French Army and forcing a change in command."),
    event("passchendaele-1917-7", "Battle of Passchendaele", "July 31 1917", "Passchendaele", 50.9008, 3.021, "WWI: British and Commonwealth troops fight through mud and shellfire in the Third Battle of Ypres, gaining little ground for heavy losses."),
    event("caporetto-1917-8", "Battle of Caporetto", "October 24 1917", "Kobarid", 46.248, 13.579, "WWI: German and Austro-Hungarian forces break through Italian lines at Caporetto, forcing a massive Italian retreat to the Piave."),
    event("october-revolution-1917-9", "October Revolution", "November 7 1917", "Petrograd", 59.9343, 30.3351, "WWI / Russia: Bolsheviks overthrow the Provisional Government, promising peace, land, and bread. Russia moves toward civil war and withdrawal from WWI."),
    event("balfour-declaration-1917-10", "Balfour Declaration", "November 2 1917", "London", 51.5074, -0.1278, "WWI diplomacy: Britain declares support for a national home for the Jewish people in Palestine, while saying civil and religious rights of existing non-Jewish communities should not be prejudiced."),
  ],
  1918: [
    event("wilson-fourteen-points-1918-1", "Wilson's Fourteen Points", "January 8 1918", "Washington, D.C.", 38.9072, -77.0369, "WWI: President Woodrow Wilson outlines principles for peace, including self-determination and a League of Nations."),
    event("brest-litovsk-1918-2", "Treaty of Brest-Litovsk", "March 3 1918", "Brest", 52.0976, 23.7341, "WWI: Bolshevik Russia signs a harsh peace with the Central Powers, leaving the war and surrendering vast territories."),
    event("operation-michael-1918-3", "Operation Michael", "March 21 1918", "Somme", 49.9, 2.7, "WWI: Germany launches its Spring Offensive, using stormtrooper tactics to break through before American strength becomes decisive."),
    event("second-battle-of-the-marne-1918-4", "Second Battle of the Marne", "July 15 1918", "Marne", 49.05, 3.95, "WWI: The final German offensive is stopped on the Marne, and Allied counterattacks begin pushing Germany back."),
    event("battle-of-amiens-1918-5", "Battle of Amiens", "August 8 1918", "Amiens", 49.894, 2.295, "WWI: Allied forces launch a surprise combined-arms attack. Ludendorff calls it the black day of the German Army."),
    event("hundred-days-offensive-1918-6", "Hundred Days Offensive", "August-November 1918", "Western Front", 50.0, 3.0, "WWI: Allied armies repeatedly break German positions, forcing a sustained retreat across the Western Front."),
    event("armistice-of-salonica-1918-7", "Armistice of Salonica", "September 29 1918", "Thessaloniki", 40.6401, 22.9444, "WWI: Bulgaria signs an armistice after Allied advances in the Balkans, beginning the collapse of the Central Powers."),
    event("armistice-of-mudros-1918-8", "Armistice of Mudros", "October 30 1918", "Mudros", 39.874, 25.063, "WWI: The Ottoman Empire signs the Armistice of Mudros, ending its war against the Allies."),
    event("german-revolution-1918-9", "German Revolution", "November 1918", "Berlin", 52.52, 13.405, "WWI: Mutiny, strikes, and political revolt bring down the German monarchy as military defeat becomes unavoidable."),
    event("armistice-1918-10", "Armistice of 11 November 1918", "November 11 1918", "Compiegne", 49.417, 2.826, "WWI: Germany signs the armistice at Compiegne, ending fighting on the Western Front after more than four years of war."),
  ],
  1939: [
    event("occupation-of-czechoslovakia-1939-1", "Germany Occupies Bohemia and Moravia", "March 15 1939", "Prague", 50.0755, 14.4378, "WWII prelude: German troops occupy the Czech lands, proving Hitler's ambitions go beyond revising Versailles."),
    event("italy-invades-albania-1939-2", "Italy Invades Albania", "April 7 1939", "Tirana", 41.3275, 19.8189, "WWII prelude: Fascist Italy invades and occupies Albania, expanding Axis control in the Balkans."),
    event("pact-of-steel-1939-3", "Pact of Steel", "May 22 1939", "Berlin", 52.52, 13.405, "WWII prelude: Germany and Italy sign a military alliance, tightening the Axis partnership before the European war."),
    event("molotov-ribbentrop-pact-1939-4", "Molotov-Ribbentrop Pact", "August 23 1939", "Moscow", 55.7558, 37.6173, "WWII: Nazi Germany and the Soviet Union sign a non-aggression pact with secret protocols dividing Eastern Europe into spheres of influence."),
    event("invasion-of-poland-1939-5", "Germany Invades Poland", "September 1 1939", "Westerplatte", 54.406, 18.671, "WWII: Germany invades Poland, using airpower, armor, and rapid encirclement to begin the war in Europe."),
    event("britain-france-declare-war-1939-6", "Britain and France Declare War", "September 3 1939", "London", 51.5074, -0.1278, "WWII: Britain and France declare war on Germany after the invasion of Poland."),
    event("soviet-invasion-poland-1939-7", "Soviet Invasion of Poland", "September 17 1939", "Eastern Poland", 52.1, 23.7, "WWII: The Soviet Union invades eastern Poland under the secret terms of the Molotov-Ribbentrop Pact."),
    event("warsaw-surrenders-1939-8", "Warsaw Surrenders", "September 27 1939", "Warsaw", 52.2297, 21.0122, "WWII: Warsaw surrenders after siege and bombing, marking the collapse of organized Polish resistance in the capital."),
    event("winter-war-begins-1939-9", "Winter War Begins", "November 30 1939", "Karelian Isthmus", 60.5, 30.0, "WWII: The Soviet Union invades Finland after failed territorial negotiations, opening the Winter War."),
    event("ussr-expelled-league-1939-10", "USSR Expelled from League of Nations", "December 14 1939", "Geneva", 46.2044, 6.1432, "WWII / Winter War: The League of Nations expels the Soviet Union for attacking Finland."),
  ],
  1940: [
    event("winter-war-ends-1940-1", "Moscow Peace Treaty Ends the Winter War", "March 13 1940", "Moscow", 55.7558, 37.6173, "WWII: Finland cedes territory to the Soviet Union but preserves independence after fierce resistance."),
    event("weserubung-1940-2", "Germany Invades Denmark and Norway", "April 9 1940", "Oslo", 59.9139, 10.7522, "WWII: Germany launches Operation Weserubung to secure Scandinavia and protect iron ore routes."),
    event("invasion-low-countries-1940-3", "Germany Invades the Low Countries", "May 10 1940", "Brussels", 50.8503, 4.3517, "WWII: German forces invade Belgium, the Netherlands, and Luxembourg as part of the campaign in the West."),
    event("dunkirk-1940-4", "Dunkirk Evacuation", "May 26 1940", "Dunkirk", 51.034, 2.376, "WWII: British, French, and other Allied troops are evacuated from Dunkirk under German pressure."),
    event("italy-enters-wwii-1940-5", "Italy Enters World War II", "June 10 1940", "Rome", 41.9028, 12.4964, "WWII: Mussolini declares war on Britain and France as France nears defeat."),
    event("paris-falls-1940-6", "Paris Falls", "June 14 1940", "Paris", 48.8566, 2.3522, "WWII: German troops enter Paris during the Fall of France."),
    event("french-armistice-1940-7", "French Armistice with Germany", "June 22 1940", "Compiegne", 49.4275, 2.9061, "WWII: France signs an armistice with Germany, dividing the country between occupation and the Vichy regime."),
    event("battle-of-britain-1940-8", "Battle of Britain Begins", "July 10 1940", "London", 51.5074, -0.1278, "WWII: The Luftwaffe begins a major air campaign against Britain, seeking air superiority before any invasion."),
    event("the-blitz-1940-9", "The Blitz", "September 7 1940", "London", 51.5074, -0.1278, "WWII: Germany begins sustained bombing of London and other British cities."),
    event("tripartite-pact-1940-10", "Tripartite Pact", "September 27 1940", "Berlin", 52.52, 13.405, "WWII: Germany, Italy, and Japan sign the Tripartite Pact, formalizing the Axis alliance."),
  ],
  1941: [
    event("lend-lease-1941-1", "Lend-Lease Act", "March 11 1941", "Washington, D.C.", 38.9072, -77.0369, "WWII: The United States authorizes massive material aid to countries fighting the Axis."),
    event("germany-invades-yugoslavia-greece-1941-2", "Germany Invades Yugoslavia and Greece", "April 6 1941", "Belgrade", 44.7866, 20.4489, "WWII: Germany attacks the Balkans to secure its southern flank before invading the Soviet Union."),
    event("crete-1941-3", "Battle of Crete", "May 20 1941", "Crete", 35.2401, 24.8093, "WWII: German airborne forces capture Crete after heavy losses."),
    event("barbarossa-1941-4", "Operation Barbarossa", "June 22 1941", "Eastern Front", 52.0, 28.0, "WWII: Germany invades the Soviet Union, opening the largest and deadliest land theater of the war."),
    event("continuation-war-1941-5", "Continuation War Begins", "June 25 1941", "Finland", 61.0, 26.0, "WWII: Finland enters war against the Soviet Union alongside Germany, seeking to recover territory lost in the Winter War."),
    event("atlantic-charter-1941-6", "Atlantic Charter", "August 14 1941", "Placentia Bay", 47.7, -53.9, "WWII: Roosevelt and Churchill issue principles for the postwar world and Allied cooperation."),
    event("siege-leningrad-1941-7", "Siege of Leningrad Begins", "September 8 1941", "Leningrad", 59.9343, 30.3351, "WWII: German and Finnish forces isolate Leningrad, beginning a devastating siege."),
    event("battle-of-moscow-1941-8", "Battle of Moscow", "October 1941", "Moscow", 55.7558, 37.6173, "WWII: German forces advance toward Moscow but are halted by Soviet resistance and winter conditions."),
    event("pearl-harbor-1941-9", "Attack on Pearl Harbor", "December 7 1941", "Pearl Harbor", 21.344, -157.975, "WWII: Japan attacks the U.S. Pacific Fleet at Pearl Harbor, bringing the United States fully into the war."),
    event("germany-declares-war-us-1941-10", "Germany Declares War on the United States", "December 11 1941", "Berlin", 52.52, 13.405, "WWII: Nazi Germany declares war on the United States, making the conflict fully global."),
  ],
  1942: [
    event("wannsee-1942-1", "Wannsee Conference", "January 20 1942", "Berlin", 52.433, 13.165, "WWII / Holocaust: Nazi officials coordinate the implementation of the Final Solution."),
    event("fall-of-singapore-1942-2", "Fall of Singapore", "February 15 1942", "Singapore", 1.3521, 103.8198, "WWII: Japan captures Singapore, one of Britain's greatest military defeats."),
    event("bataan-1942-3", "Bataan Death March", "April 1942", "Bataan", 14.6417, 120.4818, "WWII: Japanese forces force American and Filipino prisoners on a brutal march after the fall of Bataan."),
    event("coral-sea-1942-4", "Battle of the Coral Sea", "May 4 1942", "Coral Sea", -15, 155, "WWII: Allied naval forces halt Japan's move toward Port Moresby in the first carrier battle fought beyond visual range."),
    event("midway-1942-5", "Battle of Midway", "June 4 1942", "Midway Atoll", 28.2072, -177.3735, "WWII: The U.S. Navy defeats a major Japanese carrier force, shifting the balance in the Pacific."),
    event("first-el-alamein-1942-6", "First Battle of El Alamein", "July 1 1942", "El Alamein", 30.8333, 28.95, "WWII: British forces stop Axis advance toward Egypt and the Suez Canal."),
    event("guadalcanal-1942-7", "Guadalcanal Campaign Begins", "August 7 1942", "Guadalcanal", -9.577, 160.145, "WWII: U.S. Marines land on Guadalcanal, beginning a decisive campaign in the Solomon Islands."),
    event("stalingrad-1942-8", "Battle of Stalingrad Begins", "August 23 1942", "Stalingrad", 48.708, 44.514, "WWII: German forces attack Stalingrad, beginning a brutal urban battle on the Volga."),
    event("second-el-alamein-1942-9", "Second Battle of El Alamein", "October 23 1942", "El Alamein", 30.8333, 28.95, "WWII: Montgomery's Eighth Army defeats Rommel's forces, turning the North African campaign."),
    event("operation-torch-1942-10", "Operation Torch", "November 8 1942", "Casablanca", 33.5731, -7.5898, "WWII: Allied forces land in French North Africa, opening a new front against Axis forces."),
  ],
  1943: [
    event("stalingrad-surrender-1943-1", "German Surrender at Stalingrad", "February 2 1943", "Stalingrad", 48.708, 44.514, "WWII: German Sixth Army surrenders at Stalingrad, marking a major turning point on the Eastern Front."),
    event("warsaw-ghetto-uprising-1943-2", "Warsaw Ghetto Uprising", "April 19 1943", "Warsaw", 52.2297, 21.0122, "WWII / Holocaust: Jewish resistance fighters rise against German deportation efforts in the Warsaw Ghetto."),
    event("tunisia-surrender-1943-3", "Axis Surrender in Tunisia", "May 13 1943", "Tunis", 36.8065, 10.1815, "WWII: Axis forces surrender in North Africa, opening the way for Allied invasion of Italy."),
    event("kursk-1943-4", "Battle of Kursk", "July 5 1943", "Kursk", 51.7304, 36.1926, "WWII: Germany launches its last major eastern offensive. Soviet defenses absorb the attack, and the Red Army begins the long strategic advance west."),
    event("sicily-1943-5", "Allied Invasion of Sicily", "July 10 1943", "Sicily", 37.6, 14.0, "WWII: Allied forces invade Sicily, opening the Italian campaign."),
    event("mussolini-falls-1943-6", "Fall of Mussolini", "July 25 1943", "Rome", 41.9028, 12.4964, "WWII: Mussolini is dismissed and arrested after Italy's military disasters."),
    event("italian-armistice-1943-7", "Armistice of Cassibile", "September 3 1943", "Cassibile", 36.98, 15.2, "WWII: Italy signs an armistice with the Allies, but Germany occupies much of the country."),
    event("salerno-1943-8", "Allied Landings at Salerno", "September 9 1943", "Salerno", 40.682, 14.768, "WWII: Allied forces land on mainland Italy and face fierce German counterattacks."),
    event("tehran-conference-1943-9", "Tehran Conference", "November 28 1943", "Tehran", 35.6892, 51.389, "WWII: Roosevelt, Churchill, and Stalin meet to coordinate strategy, including the future invasion of France."),
    event("soviet-advance-1943-10", "Soviet Advance After Kursk", "August-December 1943", "Kyiv", 50.4501, 30.5234, "WWII: After Kursk, Soviet forces retake major territory, including Kyiv, and seize the strategic initiative from Germany."),
  ],
  1944: [
    event("anzio-1944-1", "Anzio Landings", "January 22 1944", "Anzio", 41.448, 12.629, "WWII: Allied forces land behind German lines in Italy but become pinned down near Anzio."),
    event("monte-cassino-1944-2", "Battle of Monte Cassino", "January-May 1944", "Monte Cassino", 41.49, 13.814, "WWII: Allied forces fight through German defenses blocking the road to Rome."),
    event("rome-liberated-1944-3", "Liberation of Rome", "June 4 1944", "Rome", 41.9028, 12.4964, "WWII: Allied troops enter Rome, the first Axis capital liberated."),
    event("d-day-1944-4", "D-Day Landings", "June 6 1944", "Normandy", 49.339, -0.621, "WWII: Allied forces land in Normandy, opening the long-awaited western front in France."),
    event("operation-bagration-1944-5", "Operation Bagration", "June 22 1944", "Belarus", 53.9, 27.56, "WWII: The Soviet Union destroys much of Germany's Army Group Centre and drives west across Belarus."),
    event("warsaw-uprising-1944-6", "Warsaw Uprising", "August 1 1944", "Warsaw", 52.2297, 21.0122, "WWII: The Polish Home Army rises against German occupation as Soviet forces approach the city."),
    event("liberation-paris-1944-7", "Liberation of Paris", "August 25 1944", "Paris", 48.8566, 2.3522, "WWII: Allied and Free French forces liberate Paris."),
    event("operation-market-garden-1944-8", "Operation Market Garden", "September 17 1944", "Arnhem", 51.985, 5.898, "WWII: Allied airborne and ground forces attempt to seize bridges in the Netherlands but fail to cross the Rhine."),
    event("battle-of-the-bulge-1944-9", "Battle of the Bulge", "December 16 1944", "Ardennes", 50.25, 5.67, "WWII: Germany launches its last major offensive in the West, surprising Allied forces in the Ardennes."),
    event("race-to-berlin-1944-10", "Race Toward Berlin Begins", "Late 1944", "Eastern Europe", 52.0, 20.0, "WWII: Soviet and Western Allied advances make the defeat of Nazi Germany certain and begin the final race toward Berlin."),
  ],
  1945: [
    event("auschwitz-liberated-1945-1", "Liberation of Auschwitz", "January 27 1945", "Auschwitz", 50.0358, 19.1783, "WWII / Holocaust: Soviet troops liberate Auschwitz-Birkenau, exposing the scale of Nazi mass murder."),
    event("yalta-1945-2", "Yalta Conference", "February 4 1945", "Yalta", 44.495, 34.166, "WWII: Allied leaders meet to plan final victory and the postwar order."),
    event("dresden-1945-3", "Bombing of Dresden", "February 13 1945", "Dresden", 51.0504, 13.7373, "WWII: Allied bombing devastates Dresden, remaining one of the war's most controversial air raids."),
    event("iwo-jima-1945-4", "Battle of Iwo Jima", "February 19 1945", "Iwo Jima", 24.754, 141.29, "WWII: U.S. Marines capture Iwo Jima after fierce fighting, providing airfields for the campaign against Japan."),
    event("okinawa-1945-5", "Battle of Okinawa", "April 1 1945", "Okinawa", 26.3344, 127.8056, "WWII: The largest battle of the Pacific War begins, with massive military and civilian losses."),
    event("berlin-offensive-1945-6", "Battle of Berlin", "April 16 1945", "Berlin", 52.52, 13.405, "WWII: Soviet forces launch the final assault on Berlin as Nazi Germany collapses."),
    event("hitler-death-1945-7", "Death of Adolf Hitler", "April 30 1945", "Berlin", 52.52, 13.405, "WWII: Hitler commits suicide in Berlin as Soviet forces close in."),
    event("ve-day-1945-8", "Victory in Europe Day", "May 8 1945", "Berlin", 52.52, 13.405, "WWII: Germany surrenders unconditionally, ending the war in Europe."),
    event("hiroshima-nagasaki-1945-9", "Atomic Bombings of Hiroshima and Nagasaki", "August 6-9 1945", "Hiroshima", 34.3853, 132.4553, "WWII: The United States drops atomic bombs on Hiroshima and Nagasaki, killing vast numbers of civilians and accelerating Japan's surrender."),
    event("japan-surrenders-1945-10", "Japan Surrenders", "September 2 1945", "Tokyo Bay", 35.35, 139.76, "WWII: Japan formally surrenders aboard USS Missouri, ending World War II."),
  ],
};

for (const [year, events] of Object.entries(mainTimeline)) {
  await writeFile(join(eventsDir, `${year}.json`), `${JSON.stringify(events, null, 2)}\n`);
}

function setImages(event, image) {
  for (const slide of event.slides ?? []) slide.img = image;
}

function addMarkerDescriptions(markers, descriptions) {
  return (markers ?? []).map((marker) => ({
    ...marker,
    description: descriptions[marker.label] || marker.description || `${marker.label} is marked because it was a key location in this event.`,
  }));
}

async function loadDraft(file) {
  return JSON.parse(await readFile(join(drafts, file), "utf8"));
}
async function saveDraft(file, data) {
  await writeFile(join(drafts, file), `${JSON.stringify(data, null, 2)}\n`);
}

const wwii = await loadDraft("wwii-events.json");
{
  const france = wwii.find((e) => e.id === "france");
  france.regions = [
    {
      id: "occupied-france",
      label: "German occupation zone",
      color: "#c0392b",
      opacity: 0.16,
      coordinates: [[-4.8, 48.6], [2.5, 51.1], [7.7, 48.3], [7.3, 46.0], [4.9, 45.2], [2.0, 45.0], [-1.0, 45.8], [-4.5, 47.8], [-4.8, 48.6]],
    },
    {
      id: "vichy-france",
      label: "French State / Vichy zone",
      color: "#f1c40f",
      opacity: 0.13,
      coordinates: [[-1.3, 45.7], [2.0, 45.0], [4.9, 45.2], [7.3, 46.0], [7.7, 43.7], [5.0, 43.2], [1.7, 42.5], [-1.8, 43.4], [-1.3, 45.7]],
    },
  ];
  france.markers = addMarkerDescriptions(france.markers, {
    Dunkirk: "Dunkirk marks the evacuation point for trapped Allied armies during the fall of France.",
  });

  const barbarossa = wwii.find((e) => e.id === "barbarossa");
  barbarossa.regions = [];
  delete barbarossa.arrows;
  barbarossa.markers = [
    { latlng: [52.52, 13.405], label: "Germany / Berlin", type: "minor", description: "Germany is marked as the launching power for Operation Barbarossa." },
    { latlng: [52.2297, 21.0122], label: "Warsaw", type: "minor", description: "Warsaw marks the occupied Polish corridor through which German forces moved east." },
    { latlng: [53.9, 27.56], label: "Minsk", type: "minor", description: "Minsk was an early major encirclement and gateway into Soviet territory." },
    { latlng: [50.45, 30.52], label: "Kyiv", type: "minor", description: "Kyiv marks the southern axis and one of the largest encirclements of 1941." },
    { latlng: [54.78, 32.05], label: "Smolensk", type: "minor", description: "Smolensk was a key stage on the central route toward Moscow." },
    { latlng: [59.93, 30.34], label: "Leningrad", type: "minor", description: "Leningrad marks the northern objective and the beginning of the long siege." },
    { latlng: [55.7558, 37.6173], label: "Moscow", type: "target", description: "Moscow was the central objective where the German advance stalled in winter 1941." },
  ];

  const stalingradIndex = wwii.findIndex((e) => e.id === "stalingrad");
  if (!wwii.some((e) => e.id === "kursk")) {
    wwii.splice(stalingradIndex + 1, 0, {
      id: "kursk",
      year: 1943,
      date: "5 July - 23 August 1943",
      title: "Battle of Kursk",
      sub: "The Last German Offensive in the East",
      view: { center: [51.73, 36.19], zoom: 5 },
      markers: [
        { latlng: [51.73, 36.19], label: "Kursk", type: "target", description: "Kursk marks the salient Germany tried to pinch off in July 1943." },
        { latlng: [51.03, 36.73], label: "Prokhorovka", type: "minor", description: "Prokhorovka marks one of the most famous armored clashes of the battle." },
        { latlng: [50.45, 30.52], label: "Kyiv", type: "minor", description: "After Kursk, the Red Army advanced west and retook Kyiv later in 1943." },
      ],
      regions: [],
      slides: [{
        title: "Kursk and the Soviet Advance",
        img: "https://www.nationalww2museum.org/sites/default/files/2018-08/kursk%201%20sized.jpg",
        cap: "Soviet armor during the Battle of Kursk",
        body: "At Kursk, Germany tried to regain the initiative with a massive armored offensive against a Soviet salient. The Red Army had prepared deep defensive belts, mines, anti-tank guns, reserves, and intelligence on German plans. After absorbing the attack, Soviet forces counterattacked and began a sustained advance west.\n\nKursk marked the end of Germany's ability to launch major strategic offensives in the East. From this point, the Red Army increasingly dictated the tempo, retaking Ukraine, destroying Army Group Centre in Operation Bagration, and joining the final race to Berlin.",
        stats: [
          { val: "July-August 1943", lbl: "Battle period" },
          { val: "Last German eastern offensive", lbl: "Strategic result" },
          { val: "Soviet advance west", lbl: "Road toward Berlin", full: true },
        ],
      }],
    });
  }
}
await saveDraft("wwii-events.json", wwii);

const russian = await loadDraft("russian-civil-war.json");
{
  const brest = russian.find((e) => e.id === "brest-litovsk");
  brest.regions = [];
  for (const event of russian) {
    event.markers = addMarkerDescriptions(event.markers, {});
  }
}
await saveDraft("russian-civil-war.json", russian);

const spanish = await loadDraft("spanish-civil-war.json");
{
  const imageMap = {
    "army-of-africa": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Moroccan_troops_boarding_Ju-52.jpg/330px-Moroccan_troops_boarding_Ju-52.jpg",
    "battle-for-madrid": "https://ichef.bbci.co.uk/images/ic/1200x675/p09l3y92.jpg",
    "international-brigades": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Lincoln_Battalion.jpg",
    "malaga-jarama-guadalajara": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Bundesarchiv_Bild_183-2006-1204-500%2C_Spanien%2C_Schlacht_um_Guadalajara.jpg",
    "guernica-north": "https://open-images.acast.com/shows/619566332eacc3a360702518/619566ac07e9e10013cf1ee5.jpg?height=750",
    "brunete-teruel": "https://upload.wikimedia.org/wikipedia/commons/2/26/Closing_in_on_trapped_Rebels_at_Teruel_-_Google_Art_Project.jpg",
    "aragon-mediterranean": "https://historydraft.com/files/ab4e9c28-8af2-4696-81da-f6cf0ae49e85",
    ebro: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Gottwaldova_d%C4%9Blost%C5%99eleck%C3%A1_baterie.jpg",
    "fall-of-catalonia": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Barcelona_from_Tibidabo.jpg",
    "fall-of-madrid": "https://i.guim.co.uk/img/media/48500273f08bd3c33d51d394e3fcb235d77760fc/0_304_2326_1395/master/2326.jpg?width=1200&quality=85&auto=format&fit=max&s=a6b5e228fdaafdd745bda4996ec8b585",
  };
  for (const [id, image] of Object.entries(imageMap)) setImages(spanish.find((e) => e.id === id), image);
  for (const id of ["popular-front-coup", "international-brigades", "malaga-jarama-guadalajara", "guernica-north", "brunete-teruel", "fall-of-catalonia", "fall-of-madrid"]) {
    spanish.find((e) => e.id === id).regions = [];
  }
  const markerDescriptions = {
    Madrid: "Madrid is marked because control of the capital became the central military and symbolic objective.",
    "Spanish Morocco / Ceuta": "Ceuta marks the Army of Africa's base before Franco's forces crossed to mainland Spain.",
    Seville: "Seville marks the Nationalist foothold that received troops airlifted from Morocco.",
    Ceuta: "Ceuta marks where the Army of Africa assembled before the airlift.",
    "Gibraltar Strait": "The strait was the barrier that German and Italian air transport helped Franco overcome.",
    "University City": "University City marks the western Madrid battlefield where fighting became urban and positional.",
    "Jarama sector": "Jarama marks the Republican supply-road battles southeast of Madrid.",
    "Albacete training base": "Albacete was the main training and organization center for the International Brigades.",
    Malaga: "Malaga marks the Nationalist capture and civilian flight along the coast.",
    Jarama: "Jarama marks the battle for the Madrid-Valencia road.",
    Guadalajara: "Guadalajara marks the failed Italian-led Nationalist offensive.",
    Guernica: "Guernica marks the bombing that became an international symbol of air war against civilians.",
    Bilbao: "Bilbao marks the industrial Basque center lost during the northern campaign.",
    Santander: "Santander marks the continuing collapse of the Republican north after Bilbao.",
    Brunete: "Brunete marks the Republican offensive intended to relieve pressure on Madrid.",
    Teruel: "Teruel marks the winter battle where Republicans briefly captured the city before losing it again.",
    Zaragoza: "Zaragoza marks the Aragon front and Republican objective before the Nationalist breakthrough.",
    Vinaros: "Vinaros marks where Nationalists reached the Mediterranean and split Republican Spain.",
    Barcelona: "Barcelona marks the Republican industrial capital and later the fall of Catalonia.",
    "Ebro River": "The Ebro marks the Republic's final major offensive crossing.",
    Gandesa: "Gandesa marks the key inland objective that Republican forces failed to take.",
    "Mora d'Ebre": "Mora d'Ebre marks one of the crossing and supply areas on the Ebro.",
    Figueres: "Figueres marks the Republican retreat route toward France.",
    "French border": "The French border marks La Retirada, the mass Republican refugee flight.",
    Valencia: "Valencia marks the former Republican capital after the government left Madrid.",
    Alicante: "Alicante marks one of the final escape points for defeated Republicans.",
  };
  for (const event of spanish) event.markers = addMarkerDescriptions(event.markers, markerDescriptions);
  const mg = spanish.find((e) => e.id === "malaga-jarama-guadalajara");
  mg.markers = addMarkerDescriptions([
    { latlng: [36.7213, -4.4214], label: "Malaga", type: "minor" },
    { latlng: [40.08, -3.48], label: "Jarama", type: "target" },
    { latlng: [40.6333, -3.1667], label: "Guadalajara", type: "minor" },
  ], markerDescriptions);
  const bt = spanish.find((e) => e.id === "brunete-teruel");
  bt.markers = addMarkerDescriptions([
    { latlng: [40.405, -3.999], label: "Brunete", type: "target" },
    { latlng: [40.4168, -3.7038], label: "Madrid", type: "minor" },
    { latlng: [40.3456, -1.1065], label: "Teruel", type: "target" },
  ], markerDescriptions);
}
await saveDraft("spanish-civil-war.json", spanish);

function fixHumanCostStats(event) {
  for (const slide of event.slides ?? []) {
    for (const stat of slide.stats ?? []) {
      if (/estimated human cost/i.test(stat.lbl || "")) {
        const data = stat.val;
        stat.val = "Estimated human cost";
        stat.lbl = data;
      }
    }
  }
}

const firstChechen = await loadDraft("first-chechen-war.generated.json");
{
  const images = {
    "samashki-massacre": "https://nsarchive.gwu.edu/sites/default/files/styles/wide/public/thumbnails/image/voyna_grozniy_21.jpg?itok=vg596u48",
    "budyonnovsk-hospital-hostage-crisis": "https://c8.alamy.com/comp/B93JK7/hostages-who-were-held-by-a-group-of-chechen-militants-in-the-budyonnovsk-B93JK7.jpg",
    "kizlyar-pervomayskoye-hostage-crisis": "https://i.redd.it/38x7h4i1e7i81.jpg",
    "august-1996-battle-of-grozny": "https://www.canada.ca/content/dam/dnd-mdn/army/lineofsight/articleimages/2022/02/russias-1994-96-campaign-730x370-en.jpg",
    "khasavyurt-accord": "https://gdb.rferl.org/5B118770-0C67-45AF-8F88-71A10DAE5DD9_mw800_mh600.jpg",
    "international-and-human-dimensions": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Evstafiev-helicopter-shot-down.jpg",
    "outcome-and-legacy": "https://gdb.rferl.org/d9f86938-d2fc-4d8a-8848-b3dd07d62d85_w1071_s_d3.jpg",
  };
  for (const [id, image] of Object.entries(images)) setImages(firstChechen.find((e) => e.id === id), image);
  fixHumanCostStats(firstChechen.find((e) => e.id === "international-and-human-dimensions"));
}
await saveDraft("first-chechen-war.generated.json", firstChechen);

const dagestan = await loadDraft("war-of-dagestan.generated.json");
{
  const images = {
    "battle-of-karamakhi": "https://meduza.io/impro/MX6zQa90872GNC1YG6aMwHUBvyiED1E_HjOXTTz68tk/resizing_type:fit/width:0/height:0/enlarge:1/quality:80/aHR0cHM6Ly9tZWR1/emEuaW8vaW1hZ2Uv/YXR0YWNobWVudHMv/aW1hZ2VzLzAwNi8w/NDUvOTE3L2xhcmdl/L1NubDBSN2k3YkZz/OFExRnVXMHFqWGcu/anBn.webp",
    "tsumadinsky-botlikhsky-campaign": "https://alchetron.com/cdn/war-of-dagestan-4a3b17aa-f3e6-4450-abe2-57a10cdf278-resize-750.jpeg",
    "battle-for-donkey-s-ear-height": "https://www.warhistoryonline.com/wp-content/uploads/sites/64/2018/07/yxy2s8ue.jpg",
    "wahhabi-capture-of-height-715-3": "https://peakvisor.com/photo/Dagestan-Russian-Bazarduzu.jpg",
    "tukhchar-massacre": "https://pt.pube.tk/lazy-static/previews/8dc78107-839a-4320-917e-9e7cdcdfc792.jpg",
    "wahhabi-capture-of-novolakskoye": "https://www.aberfoylesecurity.com/wp-content/uploads/2020/11/CISS-Dagestan-Khattab-and-Basayev.jpg",
    "disaster-of-the-armavir-spetsnaz": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGrHIGTSGoouNc_51XOpWJ6D0cNHWPy8TyuQ&s",
    "international-and-human-dimensions": "https://www.hrw.org/sites/default/files/styles/16x9_large/public/multimedia_images_2015/agachaul_february2014.jpg?itok=jkteLy2g",
    "outcome-and-legacy": "https://www.hrw.org/sites/default/files/styles/16x9_large/public/multimedia_images_2015/agachaul_february2014.jpg?itok=jkteLy2g",
  };
  for (const [id, image] of Object.entries(images)) setImages(dagestan.find((e) => e.id === id), image);
  const karamakhi = dagestan.find((e) => e.id === "battle-of-karamakhi");
  for (const slide of karamakhi.slides ?? []) {
    slide.body += "\n\nKaramakhi and nearby Chabanmakhi had become fortified centers for Islamist militants who rejected Dagestan's secular authorities. Federal forces used artillery, armor, and house-to-house fighting to retake the area. The battle mattered because it showed Moscow that the Dagestan incursion was not only a border raid from Chechnya, but also had local strongpoints that had to be reduced village by village.";
  }
  const markerMap = {
    "battle-of-karamakhi": [[42.97, 47.4], "Karamakhi", "Karamakhi was one of the fortified militant villages retaken by federal forces."],
    "tsumadinsky-botlikhsky-campaign": [[42.65, 46.22], "Botlikh", "Botlikh marks the district attacked by militants entering Dagestan from Chechnya."],
    "battle-for-donkey-s-ear-height": [[42.7, 46.1], "Donkey's Ear Height", "This height dominated local routes and became a costly tactical fight."],
    "wahhabi-capture-of-height-715-3": [[42.76, 46.18], "Height 715.3", "Height 715.3 is marked because militants captured it before federal counterattacks."],
    "tukhchar-massacre": [[43.221667, 46.4125], "Tukhchar", "Tukhchar marks the massacre site where captured Russian soldiers were executed."],
    "wahhabi-capture-of-novolakskoye": [[43.18, 46.49], "Novolakskoye", "Novolakskoye was seized by militants before federal forces restored control."],
    "disaster-of-the-armavir-spetsnaz": [[42.76, 46.18], "Height 715.3", "The Armavir Spetsnaz disaster occurred in fighting around the same tactical height."],
  };
  for (const [id, [latlng, label, description]] of Object.entries(markerMap)) {
    dagestan.find((e) => e.id === id).markers = [{ latlng, label, type: "target", description }];
  }
  fixHumanCostStats(dagestan.find((e) => e.id === "international-and-human-dimensions"));
  fixHumanCostStats(dagestan.find((e) => e.id === "outcome-and-legacy"));
}
await saveDraft("war-of-dagestan.generated.json", dagestan);

const secondChechen = await loadDraft("second-chechen-war.generated.json");
{
  const images = {
    "1999-russian-apartment-bombings": "https://upload.wikimedia.org/wikipedia/en/d/d8/Apartment_bombing.jpg",
    "novye-aldi-massacre": "https://upload.wikimedia.org/wikipedia/commons/d/d1/Dnipro_after_Russian_missile_attack%2C_2023-01-14_%2802-01%29.jpg",
    "pankisi-gorge-crisis": "https://theintercept.com/wp-content/uploads/2015/07/2142230545.jpg",
    "2005-nalchik-raid": "https://upload.wikimedia.org/wikipedia/en/4/4c/Nalchik2005_1.jpg",
    "international-and-human-dimensions": "https://i0.wp.com/georgetownsecuritystudiesreview.org/wp-content/uploads/2020/03/chechen-war.jpg?fit=399%2C249&ssl=1",
    "outcome-and-legacy": "https://media.npr.org/assets/img/2022/03/10/chechnya-3-3-11-22-ap_00020414160_custom-77580b12a46ca9e94e266dfac7fd3433d2ddadd0.jpg",
  };
  for (const [id, image] of Object.entries(images)) setImages(secondChechen.find((e) => e.id === id), image);
  fixHumanCostStats(secondChechen.find((e) => e.id === "international-and-human-dimensions"));
  fixHumanCostStats(secondChechen.find((e) => e.id === "outcome-and-legacy"));
}
await saveDraft("second-chechen-war.generated.json", secondChechen);

async function updateJson(path, mutate) {
  const data = JSON.parse(await readFile(path, "utf8"));
  mutate(data);
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`);
}

await updateJson(join(backend, "deepdives-index.json"), (data) => {
  const idx = data.findIndex((item) => item.id === "eastern-front");
  if (idx >= 0) data.splice(idx, 1);
});
await updateJson(join(backend, "deepdive-relationships.json"), (data) => {
  delete data.nodes["eastern-front"];
  data.relationships = data.relationships.filter((rel) => rel.from !== "eastern-front" && rel.to !== "eastern-front");
});
await updateJson(join(front, "src/constants/deepDiveRelationships.json"), (data) => {
  delete data.nodes["eastern-front"];
  data.relationships = data.relationships.filter((rel) => rel.from !== "eastern-front" && rel.to !== "eastern-front");
});

const easternPath = join(drafts, "eastern-front.generated.json");
if (existsSync(easternPath)) await unlink(easternPath);

console.log("Applied main timeline, WWII/Eastern Front, Spanish Civil War, Chechen, and Dagestan fixes.");
