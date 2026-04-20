import { useEffect, useRef, useState } from "react";
import "./SidePanel.css";

const PANEL_TABS = [
  { id: "general", label: "General Info" },
  { id: "rulers", label: "Notable Rulers" },
  { id: "history", label: "Timeline" },
];

function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="country-panel__detail-row">
      <span className="country-panel__detail-label">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function formatYear(year) {
  if (year === null || year === undefined) return null;
  if (year < 0) return `${Math.abs(year)} BCE`;
  if (year === 9999) return "present";
  return `${year} CE`;
}

function normalizeClickedName(name) {
  return name
    .replace(/\(.*?\)/g, "")  // remove (1960-1991) etc.
    .toLowerCase()
    .trim();
}

function resolveDisplayName(countryData, yearProp) {
  if (!countryData?.names?.length) return countryData?.name;
  const match = countryData.names.find(
    n => yearProp >= n.yearStart && yearProp <= n.yearEnd
  );
  return match?.name || countryData.name;
}

let countryIndexCache = null;

async function getCountryIndex() {
  if (countryIndexCache) return countryIndexCache;
  const res = await fetch(`${import.meta.env.VITE_API_URL}/countries/index`);
  if (!res.ok) throw new Error("Could not load country index");
  countryIndexCache = await res.json();
  return countryIndexCache;
}

async function resolveFileName(clickedName) {
  const normalized = normalizeClickedName(clickedName)
  const directFileName = normalized.replace(/\s+/g, "-")
  
  console.log("normalized:", normalized)
  console.log("trying direct:", directFileName)

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/countries/${directFileName}`)
    console.log("direct fetch status:", res.status)
    if (res.ok) return directFileName
  } catch (e) {
    console.log("direct fetch error:", e)
  }

  console.log("falling back to index")
  try {
    const index = await getCountryIndex()
    const exactMatch = Object.entries(index).find(([, aliases]) =>
      aliases.some(alias => alias === normalized)
    )
    console.log("exact match:", exactMatch)
    if (exactMatch) return exactMatch[0]

    const includesMatch = Object.entries(index).find(([, aliases]) =>
      aliases.some(alias => normalized.includes(alias))
    )
    console.log("includes match:", includesMatch)
    if (includesMatch) return includesMatch[0]
  } catch (e) {
    console.log("index error:", e)
  }

  return null
}

async function resolveFileForYear(startFileName, yearProp, signal) {
  let fileName = startFileName
  let data = null

  // keep following successor/predecessor chain until we find the right entity
  while (fileName) {
    data = await fetchCountryFile(fileName, signal)

    // found the right entity for this year
    if (yearProp >= data.yearStart && yearProp <= data.yearEnd) {
      return data
    }

    // year is after this entity — follow successor
    if (yearProp > data.yearEnd) {
      if (data.successor) {
        fileName = data.successor
      } else {
        return null // entity no longer exists, no successor
      }
    }

    // year is before this entity — follow predecessor
    if (yearProp < data.yearStart) {
      if (data.predecessor) {
        fileName = data.predecessor
      } else {
        return null // no predecessor
      }
    }
  }

  return null
}

function resolveCapital(capital, yearProp) {
  if (!capital) return null
  if (typeof capital === "string") return capital
  if (Array.isArray(capital)) {
    const match = capital.find(c => yearProp >= c.yearStart && yearProp <= c.yearEnd)
    return match?.name || capital[0].name
  }
  return null
}

async function fetchCountryFile(fileName, signal) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/countries/${fileName}`,
    { signal }
  );
  if (!res.ok) throw new Error("Country not found");
  return await res.json();
}

export default function SidePanel({ yearProp, selectedCountry, onCountryClose }) {
  const [activeTab, setActiveTab] = useState("general");
  const [countryData, setCountryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const currentFileName = useRef(null);

  const countryName = selectedCountry?.name;

  // load country when clicked
  useEffect(() => {
    if (!countryName) return;
    const controller = new AbortController();

    setIsLoading(true);
    setError("");
    setCountryData(null);
    setActiveTab("general");
    currentFileName.current = null;

    resolveFileName(countryName)
      .then(fileName => {
        if (!fileName) throw new Error("Country not found");
        currentFileName.current = fileName;
        return fetchCountryFile(fileName, controller.signal);
      })
      .then(setCountryData)
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError("No data found for this country yet.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [countryName]);

  // handle year changes
  useEffect(() => {
  if (!countryData || !countryName) return;
  if (!countryData.switchable) return;

  // still within range, nothing to do
  if (yearProp >= countryData.yearStart && yearProp <= countryData.yearEnd) return;

  const controller = new AbortController();
  setIsLoading(true);

  resolveFileForYear(currentFileName.current, yearProp, controller.signal)
    .then(data => {
      if (!data) {
        onCountryClose();
      } else {
        currentFileName.current = data.file;
        setCountryData(data);
      }
    })
    .catch(err => { if (err.name !== "AbortError") setError("No data found.") })
    .finally(() => { if (!controller.signal.aborted) setIsLoading(false) });

  return () => controller.abort();
}, [yearProp]);

  if (!selectedCountry) {
    return (
      <div className="country-panel">
        <div className="country-panel__header">
          <p className="country-panel__eyebrow">Country Details</p>
          <h2 className="country-panel__title">Terra Historia</h2>
        </div>
        <div className="country-panel__empty">
          Click a country on the map to explore its history.
        </div>
      </div>
    );
  }

  const displayName = resolveDisplayName(countryData, yearProp);

  return (
    <div className="country-panel">
      <div className="country-panel__header">
        <button
          type="button"
          className="country-panel__back-btn"
          onClick={onCountryClose}
        >
          ← Back
        </button>

        {countryData?.countryCode && (
          <img
            className="country-panel__flag"
            src={`https://flagcdn.com/w320/${countryData.countryCode}.png`}
            alt={`Flag of ${displayName}`}
          />
        )}

        <p className="country-panel__eyebrow">Country Details</p>
        <h2 className="country-panel__title">{displayName || countryName}</h2>
        <p className="country-panel__year">Year: {yearProp}</p>
      </div>

      {isLoading ? (
        <p className="country-panel__loading">Loading...</p>
      ) : error ? (
        <p className="country-panel__error">{error}</p>
      ) : countryData ? (
        <>
          <div className="country-panel__tabs">
            {PANEL_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`country-panel__tab${activeTab === tab.id ? " is-active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="country-panel__content">
            {activeTab === "general" && countryData.generalInfo && (
              <div className="country-panel__details">
                <DetailRow
                  label="Capital"
                  value={resolveCapital(countryData.generalInfo.capital, yearProp)}
                />
                {Object.entries(countryData.generalInfo)
                  .filter(([key, value]) =>
                    key !== "capital" &&
                    value !== null && value !== undefined && value !== ""
                  )
                  .map(([key, value]) => (
                    <DetailRow key={key} label={formatLabel(key)} value={value} />
                  ))}
              </div>
            )}

            {activeTab === "rulers" && (
              countryData.notableRulers?.filter(r => r.reignStart <= yearProp).length ? (
                <div className="country-panel__rulers">
                  {countryData.notableRulers
                    .filter(r => r.reignStart <= yearProp)
                    .map((ruler) => (
                      <div key={ruler.name} className="country-panel__ruler-card">
                        <h4 className="country-panel__ruler-name">{ruler.name}</h4>
                        <span className="country-panel__history-year">
                          {formatYear(ruler.reignStart)} — {formatYear(ruler.reignEnd)}
                        </span>
                        {Object.entries(ruler)
                          .filter(([key, value]) =>
                            !["name", "reignStart", "reignEnd"].includes(key) &&
                            value !== null && value !== undefined && value !== ""
                          )
                          .map(([key, value]) => (
                            <DetailRow key={key} label={formatLabel(key)} value={value} />
                          ))}
                      </div>
                    ))}
                </div>
              ) : (
                <p className="country-panel__empty">No recorded rulers before {yearProp}.</p>
              )
            )}

            {activeTab === "history" && (
              countryData.history?.filter(e => e.year <= yearProp).length ? (
                <div className="country-panel__history-list">
                  {countryData.history
                    .filter(e => e.year <= yearProp)
                    .map((event) => (
                      <div key={event.year} className="country-panel__history-card">
                        <span className="country-panel__history-year">
                          {formatYear(event.year)}
                        </span>
                        <h4 className="country-panel__history-title">{event.title}</h4>
                        <p className="country-panel__history-description">{event.description}</p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="country-panel__empty">No recorded history before {yearProp}.</p>
              )
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}