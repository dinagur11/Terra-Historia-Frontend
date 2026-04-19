import { useEffect, useState } from "react";
import "./SidePanel.css";
import ancientKingdoms from "../../assets/ancient-kingdoms.json";
import notableLeaders from "../../assets/notable-leaders.json";
import deepDives from "../../assets/deep-dives.json";

const leaderPortraitCache = new Map();
const deepDiveImageCache = new Map();

const PANEL_TABS = [
  { id: "general", label: "General Information" },
  { id: "leaders", label: "Notable Leaders" },
  { id: "deepDive", label: "Historical Deep Dive" },
];

function getPanelText(activeTab, countryName, yearProp) {
  switch (activeTab) {
    case "leaders":
      return `Notable leaders connected to ${countryName} in ${yearProp} will appear here.`;
    case "deepDive":
      return `A deeper historical explanation for ${countryName} in ${yearProp} will appear here.`;
    default:
      return "";
  }
}

function DetailRow({ label, value }) {
  return (
    <div className="country-panel__detail-row">
      <span className="country-panel__detail-label">{label}</span>
      <span>{value || "Unknown"}</span>
    </div>
  );
}

function formatPopulation(population) {
  if (typeof population !== "number") return "Unknown";
  return new Intl.NumberFormat("en-US").format(population);
}

function formatHistoricalYear(year) {
  if (typeof year !== "number") return "Unknown";
  if (year < 0) return `${Math.abs(year)} BCE`;
  if (year === 0) return "0";
  return `${year} CE`;
}

function formatTextList(values) {
  if (!Array.isArray(values) || values.length === 0) return "Unknown";
  return values.join(", ");
}

function normalizeLookupName(value) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findAncientKingdomRecord(countryName, yearProp) {
  const normalizedName = normalizeLookupName(countryName);

  const matches = ancientKingdoms.filter((record) =>
    record.aliases.some((alias) => normalizeLookupName(alias) === normalizedName)
  );

  if (matches.length === 0) return null;
  if (typeof yearProp !== "number") return matches[0];

  return (
    matches.find(
      (record) => yearProp >= record.yearFounded && yearProp <= record.yearEnded
    ) || matches[0]
  );
}

function findLeadersRecord(countryName, yearProp) {
  const normalizedName = normalizeLookupName(countryName);

  const matches = notableLeaders.filter((record) =>
    record.aliases.some((alias) => normalizeLookupName(alias) === normalizedName)
  );

  if (matches.length === 0) return null;
  if (typeof yearProp !== "number") return matches[0];

  return (
    matches.find((record) => {
      if (
        typeof record.yearFounded === "number" &&
        typeof record.yearEnded === "number"
      ) {
        return yearProp >= record.yearFounded && yearProp <= record.yearEnded;
      }

      return true;
    }) || matches[0]
  );
}

function findDeepDiveRecord(countryName) {
  const normalizedName = normalizeLookupName(countryName);

  return (
    deepDives.find((record) =>
      record.aliases.some((alias) => normalizeLookupName(alias) === normalizedName)
    ) || null
  );
}

function getClaimValues(entity, propertyId) {
  return entity?.claims?.[propertyId] ?? [];
}

function getWikidataEntityIdFromClaim(claim) {
  return claim?.mainsnak?.datavalue?.value?.id ?? null;
}

function getReadableDataValue(value) {
  if (value == null) return null;
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object") {
    if (typeof value.text === "string") return value.text;
    if (typeof value.id === "string") return value.id;
    if (typeof value.amount === "string") return value.amount;
  }
  return null;
}

function getStringClaimValue(entity, propertyId) {
  const claim = getClaimValues(entity, propertyId)[0];
  return getReadableDataValue(claim?.mainsnak?.datavalue?.value);
}

function getTimeClaimValue(entity, propertyId) {
  const claim = getClaimValues(entity, propertyId)[0];
  const timeValue = claim?.mainsnak?.datavalue?.value?.time;
  if (!timeValue) return null;

  const cleaned = timeValue.replace(/^\+/, "");
  const year = cleaned.slice(0, 5).replace(/^0+/, "") || "0";

  if (year.startsWith("-")) {
    return `${year.slice(1)} BCE`;
  }

  return `${year} CE`;
}

function pickBestWikidataSearchResult(results, countryName) {
  if (!Array.isArray(results) || results.length === 0) return null;

  const normalizedName = countryName.trim().toLowerCase();

  const scored = results.map((item) => {
    const label = item.label?.toLowerCase() || "";
    const description = item.description?.toLowerCase() || "";

    let score = 0;

    if (label === normalizedName) score += 100;
    if (label.includes(normalizedName)) score += 40;
    if (description.includes("historical country")) score += 35;
    if (description.includes("former country")) score += 30;
    if (description.includes("empire")) score += 25;
    if (description.includes("kingdom")) score += 20;
    if (description.includes("ancient")) score += 15;
    if (description.includes("sovereign state")) score += 10;

    return { ...item, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0] ?? null;
}

function normalizeRestCountriesCountry(country) {
  return {
    source: "REST Countries",
    officialName: country.name?.official || "Unknown",
    capital: formatTextList(country.capital),
    population: formatPopulation(country.population),
    currencies: !country.currencies || typeof country.currencies !== "object"
      ? "Unknown"
      : Object.entries(country.currencies)
          .map(([code, currency]) => {
            const name = currency?.name || code;
            const symbol = currency?.symbol ? ` (${currency.symbol})` : "";
            return `${name}${symbol}`;
          })
          .join(", "),
    region: country.region || "Unknown",
    subregion: country.subregion || "Unknown",
    languages: !country.languages || typeof country.languages !== "object"
      ? "Unknown"
      : Object.values(country.languages).join(", "),
    inception: "Unknown",
    dissolution: "Unknown",
    description: "Modern country data loaded from REST Countries.",
  };
}

function normalizeWikidataEntity(entity, labelsById, fallbackTitle) {
  const officialName = getStringClaimValue(entity, "P1448");
  const capitalIds = getClaimValues(entity, "P36")
    .map(getWikidataEntityIdFromClaim)
    .filter(Boolean);
  const languageIds = getClaimValues(entity, "P37")
    .map(getWikidataEntityIdFromClaim)
    .filter(Boolean);
  const currencyIds = getClaimValues(entity, "P38")
    .map(getWikidataEntityIdFromClaim)
    .filter(Boolean);
  const regionIds = getClaimValues(entity, "P30")
    .map(getWikidataEntityIdFromClaim)
    .filter(Boolean);

  return {
    source: "Wikidata",
    officialName: officialName || entity.labels?.en?.value || fallbackTitle || "Unknown",
    capital: formatTextList(capitalIds.map((id) => labelsById[id]).filter(Boolean)),
    population: formatPopulation(
      getClaimValues(entity, "P1082")[0]?.mainsnak?.datavalue?.value?.amount
        ? Number(
            getClaimValues(entity, "P1082")[0].mainsnak.datavalue.value.amount
          )
        : null
    ),
    currencies: formatTextList(currencyIds.map((id) => labelsById[id]).filter(Boolean)),
    region: formatTextList(regionIds.map((id) => labelsById[id]).filter(Boolean)),
    subregion: "Unknown",
    languages: formatTextList(languageIds.map((id) => labelsById[id]).filter(Boolean)),
    inception: getTimeClaimValue(entity, "P571") || getTimeClaimValue(entity, "P580") || "Unknown",
    dissolution: getTimeClaimValue(entity, "P576") || getTimeClaimValue(entity, "P582") || "Unknown",
    description: entity.descriptions?.en?.value || "Historical entity data loaded from Wikidata.",
  };
}

function mergeAncientKingdomInfo(record, wikidataInfo) {
  return {
    source: "Ancient Kingdoms Database",
    officialName:
      wikidataInfo?.officialName || record.name || "Unknown",
    capital: wikidataInfo?.capital || "Unknown",
    population: record.peakPopulation || "Unknown",
    currencies: wikidataInfo?.currencies || "Unknown",
    region: wikidataInfo?.region || "Unknown",
    subregion: wikidataInfo?.subregion || "Unknown",
    languages: record.language || wikidataInfo?.languages || "Unknown",
    inception: formatHistoricalYear(record.yearFounded),
    dissolution: formatHistoricalYear(record.yearEnded),
    peakTerritoryYear: formatHistoricalYear(record.peakTerritoryYear),
    description:
      wikidataInfo?.description ||
      "Historical information curated from Wikipedia and Wikidata.",
    sources: record.sources,
  };
}

async function fetchRestCountriesInfo(countryName, signal) {
  const fields =
    "name,capital,population,currencies,region,subregion,languages,flags";
  const exactUrl = `https://restcountries.com/v3.1/name/${encodeURIComponent(
    countryName
  )}?fullText=true&fields=${fields}`;

  const exactResponse = await fetch(exactUrl, { signal });

  if (exactResponse.ok) {
    const exactData = await exactResponse.json();
    return exactData?.[0] ? normalizeRestCountriesCountry(exactData[0]) : null;
  }

  const fallbackUrl = `https://restcountries.com/v3.1/name/${encodeURIComponent(
    countryName
  )}?fields=${fields}`;
  const fallbackResponse = await fetch(fallbackUrl, { signal });

  if (!fallbackResponse.ok) {
    return null;
  }

  const fallbackData = await fallbackResponse.json();
  return fallbackData?.[0] ? normalizeRestCountriesCountry(fallbackData[0]) : null;
}

async function fetchWikidataLabels(entityIds, signal) {
  if (entityIds.length === 0) return {};

  const response = await fetch(
    `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityIds.join(
      "|"
    )}&format=json&languages=en&props=labels&origin=*`,
    { signal }
  );

  if (!response.ok) {
    return {};
  }

  const data = await response.json();
  const labelsById = {};

  Object.entries(data.entities || {}).forEach(([id, entity]) => {
    labelsById[id] = entity.labels?.en?.value || id;
  });

  return labelsById;
}

async function fetchWikidataInfo(countryName, signal) {
  const searchResponse = await fetch(
    `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(
      countryName
    )}&language=en&format=json&limit=10&origin=*`,
    { signal }
  );

  if (!searchResponse.ok) {
    return null;
  }

  const searchData = await searchResponse.json();
  const bestMatch = pickBestWikidataSearchResult(searchData.search, countryName);

  if (!bestMatch?.id) {
    return null;
  }

  const entityResponse = await fetch(
    `https://www.wikidata.org/wiki/Special:EntityData/${bestMatch.id}.json`,
    { signal }
  );

  if (!entityResponse.ok) {
    return null;
  }

  const entityData = await entityResponse.json();
  const entity = entityData.entities?.[bestMatch.id];

  if (!entity) {
    return null;
  }

  const linkedEntityIds = [
    ...getClaimValues(entity, "P36").map(getWikidataEntityIdFromClaim),
    ...getClaimValues(entity, "P37").map(getWikidataEntityIdFromClaim),
    ...getClaimValues(entity, "P38").map(getWikidataEntityIdFromClaim),
    ...getClaimValues(entity, "P30").map(getWikidataEntityIdFromClaim),
  ].filter(Boolean);

  const labelsById = await fetchWikidataLabels(linkedEntityIds, signal);
  return normalizeWikidataEntity(entity, labelsById, countryName);
}

async function fetchCountryGeneralInfo(countryName, yearProp, signal) {
  const ancientKingdomRecord = findAncientKingdomRecord(countryName, yearProp);

  if (ancientKingdomRecord) {
    const wikidataInfo = await fetchWikidataInfo(
      ancientKingdomRecord.wikidataLookupName || countryName,
      signal
    );

    return mergeAncientKingdomInfo(ancientKingdomRecord, wikidataInfo);
  }

  const modernCountry = await fetchRestCountriesInfo(countryName, signal);
  if (modernCountry) {
    return modernCountry;
  }

  const historicalCountry = await fetchWikidataInfo(countryName, signal);
  if (historicalCountry) {
    return historicalCountry;
  }

  throw new Error("Country information could not be loaded.");
}

function getWikipediaPageTitle(url) {
  if (!url) return null;

  const segments = url.split("/wiki/");
  if (segments.length < 2) return null;

  return decodeURIComponent(segments[1]).replace(/_/g, " ");
}

async function searchWikipediaPage(query, signal) {
  const response = await fetch(
    `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(
      query
    )}&limit=1`,
    { signal }
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.pages?.[0] ?? null;
}

async function fetchWikipediaPageImage(pageTitle, signal) {
  if (!pageTitle) return null;

  const response = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      pageTitle
    )}`,
    { signal }
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  return (
    data.originalimage?.source ||
    data.originalimage?.uri ||
    data.thumbnail?.source ||
    data.thumbnail?.uri ||
    null
  );
}

async function fetchLeaderPortrait(leader, signal) {
  const wikipediaTitle = getWikipediaPageTitle(leader?.sources?.wikipedia);
  if (!wikipediaTitle) return null;

  if (leaderPortraitCache.has(wikipediaTitle)) {
    return leaderPortraitCache.get(wikipediaTitle);
  }

  const image = await fetchWikipediaPageImage(wikipediaTitle, signal);
  leaderPortraitCache.set(wikipediaTitle, image);
  return image;
}

async function fetchDeepDiveSlideImage(slide, signal) {
  const cacheKey = slide?.imagePageTitle || slide?.imageQuery;
  if (!cacheKey) return null;

  if (deepDiveImageCache.has(cacheKey)) {
    return deepDiveImageCache.get(cacheKey);
  }

  const pageTitle = slide?.imagePageTitle;

  if (pageTitle) {
    const image = await fetchWikipediaPageImage(pageTitle, signal);
    deepDiveImageCache.set(cacheKey, image);
    return image;
  }

  const page = await searchWikipediaPage(slide.imageQuery, signal);
  const resolvedPageTitle = page?.title;

  if (!resolvedPageTitle) {
    return null;
  }

  const image = await fetchWikipediaPageImage(resolvedPageTitle, signal);
  deepDiveImageCache.set(cacheKey, image);
  return image;
}

export default function SidePanel({ yearProp, selectedCountry }) {
  const [activeTab, setActiveTab] = useState("general");
  const [generalInfo, setGeneralInfo] = useState(null);
  const [isLoadingGeneralInfo, setIsLoadingGeneralInfo] = useState(false);
  const [generalInfoError, setGeneralInfoError] = useState("");
  const [leadersRecord, setLeadersRecord] = useState(null);
  const [leaderPortraits, setLeaderPortraits] = useState({});
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);
  const [deepDiveSlideIndex, setDeepDiveSlideIndex] = useState(0);
  const [deepDiveRecord, setDeepDiveRecord] = useState(null);
  const [deepDiveImages, setDeepDiveImages] = useState({});
  const countryName = selectedCountry?.name;

  useEffect(() => {
    if (!countryName || activeTab !== "general") return;

    const controller = new AbortController();

    setIsLoadingGeneralInfo(true);
    setGeneralInfoError("");

    fetchCountryGeneralInfo(countryName, yearProp, controller.signal)
      .then((data) => {
        setGeneralInfo(data);
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setGeneralInfo(null);
        setGeneralInfoError("No general information was found for this country.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingGeneralInfo(false);
        }
      });

    return () => controller.abort();
  }, [activeTab, countryName, yearProp]);

  useEffect(() => {
    setGeneralInfo(null);
    setGeneralInfoError("");
  }, [countryName]);

  useEffect(() => {
    setIsDeepDiveOpen(false);
    setDeepDiveSlideIndex(0);
  }, [countryName]);

  useEffect(() => {
    if (!countryName) {
      setLeadersRecord(null);
      return;
    }

    setLeadersRecord(findLeadersRecord(countryName, yearProp));
  }, [countryName, yearProp]);

  useEffect(() => {
    if (!countryName) {
      setDeepDiveRecord(null);
      return;
    }

    setDeepDiveRecord(findDeepDiveRecord(countryName));
  }, [countryName]);

  useEffect(() => {
    if (activeTab !== "leaders" || !leadersRecord?.leaders?.length) {
      setLeaderPortraits({});
      return;
    }

    const controller = new AbortController();

    Promise.all(
      leadersRecord.leaders.map(async (leader) => [
        leader.name,
        await fetchLeaderPortrait(leader, controller.signal),
      ])
    )
      .then((entries) => {
        if (!controller.signal.aborted) {
          setLeaderPortraits(Object.fromEntries(entries));
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setLeaderPortraits({});
        }
      });

    return () => controller.abort();
  }, [activeTab, leadersRecord]);

  useEffect(() => {
    if (
      activeTab !== "deepDive" ||
      !isDeepDiveOpen ||
      !deepDiveRecord?.slides?.length
    ) {
      setDeepDiveImages({});
      return;
    }

    const controller = new AbortController();
    const slidesToPrefetch = deepDiveRecord.slides.filter((_, index) =>
      Math.abs(index - deepDiveSlideIndex) <= 1
    );

    Promise.all(
      slidesToPrefetch.map(async (slide) => [
        slide.title,
        await fetchDeepDiveSlideImage(slide, controller.signal),
      ])
    )
      .then((entries) => {
        if (!controller.signal.aborted) {
          setDeepDiveImages((current) => ({
            ...current,
            ...Object.fromEntries(entries),
          }));
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setDeepDiveImages((current) => current);
        }
      });

    return () => controller.abort();
  }, [activeTab, isDeepDiveOpen, deepDiveRecord, deepDiveSlideIndex]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);

    if (tabId === "deepDive") {
      setDeepDiveSlideIndex(0);
      setIsDeepDiveOpen(true);
    }
  };

  const handleCloseDeepDive = () => {
    setIsDeepDiveOpen(false);
    setDeepDiveSlideIndex(0);
    setActiveTab("general");
  };

  const currentDeepDiveSlides = deepDiveRecord?.slides?.length
    ? deepDiveRecord.slides
    : [
        {
          title: "Deep Dive Coming Soon",
          text: "This country's deep-dive story has not been written yet. The pop-up framework is ready, and slide content can be added from the deep-dive database whenever you want.",
        },
      ];
  const currentDeepDiveSlide = currentDeepDiveSlides[deepDiveSlideIndex];
  const currentDeepDiveImageLayout =
    currentDeepDiveSlide.imageLayout || "hero";

  return (
    <div className="country-panel">
      <div className="country-panel__header">
        <p className="country-panel__eyebrow">Country Details</p>
        <h2 className="country-panel__title">
          {countryName || "Select a country"}
        </h2>
        <p className="country-panel__year">Year: {yearProp}</p>
      </div>

      {countryName ? (
        <>
          <div className="country-panel__tabs">
            {PANEL_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`country-panel__tab${activeTab === tab.id ? " is-active" : ""}`}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="country-panel__content">
            <h3 className="country-panel__section-title">
              {PANEL_TABS.find((tab) => tab.id === activeTab)?.label}
            </h3>
            {activeTab === "general" ? (
              isLoadingGeneralInfo ? (
                <p>Loading country information...</p>
              ) : generalInfoError ? (
                <p>{generalInfoError}</p>
              ) : generalInfo ? (
                <div className="country-panel__details">
                  {generalInfo.source === "REST Countries" ? (
                    <>
                      <DetailRow label="Official Name" value={generalInfo.officialName} />
                      <DetailRow label="Capital" value={generalInfo.capital} />
                      <DetailRow label="Population" value={generalInfo.population} />
                      <DetailRow label="Currencies" value={generalInfo.currencies} />
                      <DetailRow label="Region" value={generalInfo.region} />
                      <DetailRow label="Subregion" value={generalInfo.subregion} />
                      <DetailRow label="Languages" value={generalInfo.languages} />
                    </>
                  ) : (
                    <>
                      <DetailRow label="Official Name" value={generalInfo.officialName} />
                      <DetailRow label="Capital" value={generalInfo.capital} />
                      <DetailRow label="Peak Population" value={generalInfo.population} />
                      <DetailRow label="Peak Territory Year" value={generalInfo.peakTerritoryYear} />
                      <DetailRow label="Region" value={generalInfo.region} />
                      <DetailRow label="Languages" value={generalInfo.languages} />
                      <DetailRow label="Founded" value={generalInfo.inception} />
                      <DetailRow label="Ended" value={generalInfo.dissolution} />
                      <DetailRow label="Summary" value={generalInfo.description} />
                    </>
                  )}
                </div>
              ) : (
                <p>Select a country to load its general information.</p>
              )
            ) : activeTab === "leaders" ? (
              leadersRecord?.leaders?.length ? (
                <div className="country-panel__leaders">
                  {leadersRecord.leaders.map((leader) => (
                    <div key={leader.name} className="country-panel__leader-card">
                      <div className="country-panel__leader-header">
                        {leaderPortraits[leader.name] ? (
                          <img
                            className="country-panel__leader-portrait"
                            src={leaderPortraits[leader.name]}
                            alt={`Portrait of ${leader.name}`}
                          />
                        ) : (
                          <div className="country-panel__leader-fallback">
                            {leader.name.charAt(0)}
                          </div>
                        )}
                        <h4 className="country-panel__leader-name">{leader.name}</h4>
                      </div>
                      <DetailRow label="Born" value={leader.born} />
                      <DetailRow label="Died" value={leader.died} />
                      <DetailRow label="Cause of Death" value={leader.causeOfDeath} />
                      <DetailRow label="Main Accomplishments" value={leader.summary} />
                    </div>
                  ))}
                </div>
              ) : (
                <p>No notable leaders database entry exists for this country yet.</p>
              )
            ) : activeTab === "deepDive" ? (
              <p>Open the deep dive window to begin exploring this country's story.</p>
            ) : (
              <p>{getPanelText(activeTab, countryName, yearProp)}</p>
            )}
          </div>

          {isDeepDiveOpen ? (
            <div className="deep-dive-modal__backdrop" role="presentation">
              <div
                className="deep-dive-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="deep-dive-title"
              >
                <button
                  type="button"
                  className="deep-dive-modal__exit"
                  onClick={handleCloseDeepDive}
                >
                  Exit
                </button>

                <div className="deep-dive-modal__frame">
                  <p className="deep-dive-modal__eyebrow">
                    Historical Deep Dive
                  </p>
                  <h2 id="deep-dive-title" className="deep-dive-modal__title">
                    {countryName}
                  </h2>
                  <p className="deep-dive-modal__subtitle">
                    Slide {deepDiveSlideIndex + 1} of {currentDeepDiveSlides.length}
                  </p>

                  <div className="deep-dive-modal__slide">
                    <div
                      className={`deep-dive-modal__slide-layout deep-dive-modal__slide-layout--${currentDeepDiveImageLayout}`}
                    >
                      {deepDiveImages[currentDeepDiveSlide.title] ? (
                        <div
                          className={`deep-dive-modal__image-wrap deep-dive-modal__image-wrap--${currentDeepDiveImageLayout}`}
                        >
                          <img
                            className={`deep-dive-modal__image deep-dive-modal__image--${currentDeepDiveImageLayout}`}
                            src={deepDiveImages[currentDeepDiveSlide.title]}
                            alt={currentDeepDiveSlide.title}
                          />
                        </div>
                      ) : null}
                      <div className="deep-dive-modal__copy">
                        <h3 className="deep-dive-modal__slide-title">
                          {currentDeepDiveSlide.title}
                        </h3>
                        <p className="deep-dive-modal__slide-text">
                          {currentDeepDiveSlide.text}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="deep-dive-modal__controls">
                    <button
                      type="button"
                      className="deep-dive-modal__button"
                      onClick={() =>
                        setDeepDiveSlideIndex((index) => Math.max(index - 1, 0))
                      }
                      disabled={deepDiveSlideIndex === 0}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className="deep-dive-modal__button"
                      onClick={() =>
                        setDeepDiveSlideIndex((index) =>
                          Math.min(index + 1, currentDeepDiveSlides.length - 1)
                        )
                      }
                      disabled={deepDiveSlideIndex === currentDeepDiveSlides.length - 1}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <div className="country-panel__empty">
          Click a country on the map to open its information panel.
        </div>
      )}
    </div>
  );
}
