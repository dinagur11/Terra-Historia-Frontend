const DEEP_DIVE_IMAGE_OVERRIDES = {
  "russian-civil-war":
    "https://commons.wikimedia.org/wiki/Special:FilePath/The_Red_Army_before_being_sent_to_the_Civil_War.JPG",
  "spanish-civil-war":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Soldiers_on_their_way_to_the_front_during_the_spanish_civil_war_%286515607873%29.jpg",
  "winter-war":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Finnish_soldiers_marching.jpg",
  "continuation-war":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Continuation_War_1941.jpg",
};

export function getDeepDiveImage(item) {
  return DEEP_DIVE_IMAGE_OVERRIDES[item.id] || item.image;
}
