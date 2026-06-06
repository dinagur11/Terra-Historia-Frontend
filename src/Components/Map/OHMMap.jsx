import React, { useEffect, useRef, useState } from "react";
import "./OHMMap.css";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import { createRoot } from "react-dom/client";
import Popup from "./Popup.jsx";
import { useAuth } from '../../Context/AuthContext';
import { normalizeCountrySearch, resolveCountrySearch } from "../../utils/countrySearch.js";
import { MIN_MAP_YEAR } from "../../constants/mapYears";

window.mapboxgl = maplibregl;

const COUNTRY_LABEL_LAYERS = ["country_points_labels", "country_points_labels_cen"];
const COUNTRY_SOURCE_LAYERS = [
  { sourceLayer: "land_ohm_centroids", matches: props => props.type === "administrative" && Number(props.admin_level) === 2 },
  { sourceLayer: "place_points_centroids", matches: props => props.type === "country" },
];

const CUSTOM_LABELS = [
  {
    name: "Third Reich",
    yearStart: 1938,
    yearEnd: 1945,
    coordinates: [13.4050, 51.1657]
  },
  {
  name: "Kingdom of Yugoslavia",
  yearStart: 1939,
  yearEnd: 1940,
  coordinates: [20.4568, 44.0165]
  },
  {
    name: "Khedivate \nof Egypt",
    yearStart: 1867,
    yearEnd: 1914,
    coordinates: [29.8, 26.8]
  },
  {
    name: "Yugoslavia",
    yearStart: 1992,
    yearEnd: 1992,
    coordinates: [20.5, 43.9]
  },
  {
    name: "Occupied France",
    yearStart: 1944,
    yearEnd: 1944,
    coordinates: [2.3522, 46.8566]
  },
  {
    name: "Occupied Belgium",
    yearStart: 1944,
    yearEnd: 1944,
    coordinates: [4.4699, 50.5039]
  },
  {
    name: "Australia",
    yearStart: 1934,
    yearEnd: 9999,
    coordinates: [133.7751, -25.2744]
  }
]


function getCoordinateBounds(coordinates, bounds = {
  minLng: Infinity,
  maxLng: -Infinity,
  minLat: Infinity,
  maxLat: -Infinity,
}) {
  if (!Array.isArray(coordinates)) return bounds;

  if (typeof coordinates[0] === "number" && typeof coordinates[1] === "number") {
    const [lng, lat] = coordinates;
    bounds.minLng = Math.min(bounds.minLng, lng);
    bounds.maxLng = Math.max(bounds.maxLng, lng);
    bounds.minLat = Math.min(bounds.minLat, lat);
    bounds.maxLat = Math.max(bounds.maxLat, lat);
    return bounds;
  }

  coordinates.forEach(item => getCoordinateBounds(item, bounds));
  return bounds;
}

function getFeatureCenter(feature) {
  const bounds = getCoordinateBounds(feature?.geometry?.coordinates);
  if (!Number.isFinite(bounds.minLng)) return null;

  return [
    (bounds.minLng + bounds.maxLng) / 2,
    (bounds.minLat + bounds.maxLat) / 2,
  ];
}

function getAvailableLayerIds(map, layerIds) {
  return layerIds.filter(layerId => Boolean(map.getLayer(layerId)));
}

function findVisibleMapCountry(map, query) {
  const layerIds = getAvailableLayerIds(map, [...COUNTRY_LABEL_LAYERS, "custom-labels"]);
  if (!layerIds.length) return null;

  const normalizedQuery = normalizeCountrySearch(query);
  const features = map.queryRenderedFeatures(undefined, { layers: layerIds });

  return features.find(feature => {
    const name = getFeatureName(feature);
    return name && normalizeCountrySearch(name) === normalizedQuery;
  }) || null;
}

function getFeatureYear(properties, key) {
  const decimal = Number(properties[`${key}_decdate`]);
  if (Number.isFinite(decimal)) return decimal;

  const match = String(properties[`${key}_date`] || "").match(/^-?\d{1,4}/);
  return match ? Number(match[0]) : null;
}

function isFeatureActiveInYear(feature, year) {
  const start = getFeatureYear(feature.properties || {}, "start");
  const end = getFeatureYear(feature.properties || {}, "end");
  const selectedDate = year + 0.945;
  return (start === null || start <= selectedDate) && (end === null || end >= selectedDate);
}

function getOhmCountryOptions(map, year) {
  const options = new Map();

  for (const source of COUNTRY_SOURCE_LAYERS) {
    let features = [];
    try {
      features = map.querySourceFeatures("ohm", {
        sourceLayer: source.sourceLayer,
      });
    } catch {
      continue;
    }

    for (const feature of features) {
      if (!source.matches(feature.properties || {})) continue;
      if (!isFeatureActiveInYear(feature, year)) continue;

      const name = getFeatureName(feature);
      const center = getFeatureCenter(feature);
      if (!name || !center) continue;

      const key = normalizeCountrySearch(name);
      if (!options.has(key)) {
        options.set(key, {
          name,
          center,
          properties: feature.properties,
        });
      }
    }
  }

  for (const label of CUSTOM_LABELS) {
    if (year < label.yearStart || year > label.yearEnd) continue;
    options.set(normalizeCountrySearch(label.name), {
      name: label.name.replace(/\n/g, " "),
      center: label.coordinates,
      properties: {
        name: label.name,
        yearStart: label.yearStart,
        yearEnd: label.yearEnd,
      },
    });
  }

  return [...options.values()].sort((a, b) => a.name.localeCompare(b.name));
}

const fetchEvents = async (year) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/events/${year}`)
  if (!res.ok) return []
  return await res.json()
}

function getFeatureName(feature) {
  if (!feature || !feature.properties) return null;
  const props = feature.properties;
  return (
    props["name:en"] ||
    props.name_en ||
    props["official_name:en"] ||
    props.official_name_en ||
    props["short_name:en"] ||
    props.short_name_en ||
    props.int_name ||
    props["name:latin"] ||
    props.name ||
    props.official_name ||
    null
  );
}

async function getEvents(year, map, markersRef, isLogged) {
  const events = await fetchEvents(year)
  if (!Array.isArray(events)) {
    console.error("Events JSON is not an array:", events)
    return []
  }

  const sideBarEvents = []

  events.forEach(evnt => {
    if (!evnt.coordinates) return

    const { lat, lng } = evnt.coordinates
    if (typeof lat !== "number" || typeof lng !== "number") {
      console.warn("Invalid coordinates for event:", evnt)
      return
    }

    const popupContainer = document.createElement("div")
    const popupRoot = createRoot(popupContainer)
    const popup = new maplibregl.Popup({ offset: 24 }).setDOMContent(popupContainer)

    popupRoot.render(
      <Popup
        eventName={evnt.name}
        eventDate={evnt.date}
        eventDescription={evnt.summary}
        isLogged={isLogged}
        onClose={() => popup.remove()}
      />
    )

    const el = document.createElement("div")
    el.className = "event-marker"
    el.title = evnt.name

    const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map)

    sideBarEvents.push({ name: evnt.name, date: evnt.date, summary: evnt.summary, lng, lat })
    markersRef.current.push(marker)
  })

  return sideBarEvents
}

function clearMarkers(markersRef) {
  markersRef.current.forEach(marker => {
    marker.remove();
    marker.getPopup()?.remove();
  });
  markersRef.current = [];
}

export default function OHMMap({yearProp = 2026, onCountrySelect, countrySearch,
  onCountryOptionsChange,
}) {
  const effectiveYear = Math.max(Number(yearProp) || MIN_MAP_YEAR, MIN_MAP_YEAR);
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const yearRef = useRef(effectiveYear);
  const markersRef = useRef([]);
  const [eventsList, setEventsList] = useState([]);
  const [mapReady, setMapReady] = useState(false);
  const {isLogged} = useAuth();

  const applyDate = (map) => {
    map.filterByDate(`${yearRef.current}-12-12`);
    if (map.getLayer("custom-labels")) {
      map.setFilter("custom-labels", [
        "all",
        ["<=", ["get", "yearStart"], yearRef.current],
        [">=", ["get", "yearEnd"], yearRef.current]
      ])
    }
    map.triggerRepaint();
  };

  useEffect(() => {
    yearRef.current = effectiveYear;
  }, [effectiveYear]);

  useEffect(() => {
    let disposed = false;

    (async () => {
      await import("@openhistoricalmap/maplibre-gl-dates");
      if (disposed) return;

      const map = new maplibregl.Map({
        container: mapEl.current,
        style: "https://unpkg.com/@openhistoricalmap/map-styles@latest/dist/historical/historical.json",
        center: [10, 20],
        zoom: 2,
        minZoom: 1.2,
        attributionControl: {
          customAttribution: '<a href="https://www.openhistoricalmap.org/">OpenHistoricalMap</a>',
        },
      });
      mapRef.current = map;

      const forceEnglishLabels = () => {
        const style = map.getStyle?.();
        if (!style?.layers) return;
        for (const layer of style.layers) {
          if (layer.type !== "symbol") continue;
          try {
            map.setLayoutProperty(layer.id, "text-field", [
              "coalesce",
              ["get", "name:en"],
              ["get", "name_en"],
              ["get", "official_name:en"],
              ["get", "official_name_en"],
              ["get", "short_name:en"],
              ["get", "short_name_en"],
              ["get", "int_name"],
              ["get", "name:latin"],
              ["get", "name"],
            ]);
          } catch {
            // Some style layers do not allow changing this layout property.
          }
        }
      };

      map.on("styledata", () => {
        applyDate(map);
        forceEnglishLabels();
      });

      map.on("click", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["country_points_labels", "country_points_labels_cen"]
        });

      map.on("click", "custom-labels", (e) => {
        const name = e.features[0]?.properties?.name;
        if (!name) return;
        if (onCountrySelect) onCountrySelect({ name, properties: e.features[0].properties });
      });

        const feature = features[0];
        if (!feature) return;
        const name = getFeatureName(feature);
        if (!name) return;
        if (onCountrySelect) onCountrySelect({ name, properties: feature.properties });
      });
      

      map.on("load", async () => {
        forceEnglishLabels();
        applyDate(map);
        setMapReady(true);

          map.addSource("custom-labels", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: CUSTOM_LABELS.map(label => ({
              type: "Feature",
              properties: {
                name: label.name,
                yearStart: label.yearStart,
                yearEnd: label.yearEnd
              },
              geometry: {
                type: "Point",
                coordinates: label.coordinates
              }
            }))
          }
        })
        //adds missing labels
        map.addLayer({
          id: "custom-labels",
          type: "symbol",
          source: "custom-labels",
          layout: {
            "text-field": ["get", "name"],
            "text-size": 12,
            "text-font": ["Open Sans Bold"],
            "text-anchor": "center",
            "text-letter-spacing": 0.05

          },
          paint: {
            "text-color": "#6E786E",
            "text-halo-color": "rgba(34, 33, 33, 0.6)",
            "text-halo-width": 0.2
          }
        })
      });
    })();

    return () => {
      disposed = true;
      setMapReady(false);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [onCountrySelect]);

  //add markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    applyDate(map);
    const publishCountryOptions = () => {
      onCountryOptionsChange?.(getOhmCountryOptions(map, effectiveYear));
    };
    publishCountryOptions();
    map.once("idle", publishCountryOptions);
    clearMarkers(markersRef);
    const load = async () => {
      const list = await getEvents(effectiveYear, mapRef.current, markersRef, isLogged)
      setEventsList(list)
    }
    load()
  }, [effectiveYear, isLogged, mapReady, onCountryOptionsChange]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !countrySearch?.query) return;

    if (countrySearch.option?.center) {
      map.flyTo({
        center: countrySearch.option.center,
        zoom: Math.max(map.getZoom(), 4),
        speed: 0.7,
      });
      onCountrySelect?.({
        name: countrySearch.option.name,
        properties: countrySearch.option.properties,
      });
      return;
    }

    const visibleFeature = findVisibleMapCountry(map, countrySearch.query);
    if (visibleFeature) {
      const name = getFeatureName(visibleFeature);
      const center = getFeatureCenter(visibleFeature);
      if (!name || !center) return;

      map.flyTo({ center, zoom: Math.max(map.getZoom(), 4), speed: 0.7 });
      if (onCountrySelect) {
        onCountrySelect({ name, properties: visibleFeature.properties });
      }
      return;
    }

    const country = resolveCountrySearch(countrySearch.query);
    if (!country) return;
    if (
      country.type === "historical" &&
      (yearRef.current < country.yearStart || yearRef.current > country.yearEnd)
    ) {
      return;
    }

    map.fitBounds(
      [
        [country.bounds.minLng, country.bounds.minLat],
        [country.bounds.maxLng, country.bounds.maxLat],
      ],
      { padding: 80, maxZoom: 5, duration: 1200 }
    );
    if (onCountrySelect) {
      onCountrySelect({
        name: country.name,
        properties: {
          name: country.name,
          yearStart: country.yearStart,
          yearEnd: country.yearEnd,
          searchType: country.type,
        },
      });
    }
  }, [countrySearch, onCountrySelect]);

  const handleEventClick = (index) => {
    const marker = markersRef.current[index];
    if (!marker || !mapRef.current) return;
    const { lng, lat } = marker.getLngLat();
    markersRef.current.forEach(m => m.getPopup?.()?.remove());
    mapRef.current.flyTo({ center: [lng, lat], zoom: 4, speed: 0.7 });
    marker.getPopup?.()?.setLngLat([lng, lat]).addTo(mapRef.current);
  };

  return (
    <div className="ohm-wrapper">
      <div ref={mapEl} className="ohm-map" />
      <div className="events-overlay">
        <h3>Events in {effectiveYear}</h3>
        {eventsList.length === 0 ? (
          <p className="no-events">No events for this year...</p>
        ) : (
          <ul className="events-list">
            {eventsList.map((ev, index) => (
              <li key={index} className="event-item" onClick={() => handleEventClick(index)}>
                <p className="event-name">{ev.name}</p>
                <p className="event-date">{ev.date}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
