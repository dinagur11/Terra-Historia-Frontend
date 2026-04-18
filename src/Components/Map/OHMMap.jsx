import React, { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import "./OHMMap.css";
import events2025 from "../assets/database-example-2025.json"
import events2000 from "../assets/database-example-2000.json"
import relationshipOverlays2026 from "../assets/relationship-overlays-2026.json";
import { createRoot } from "react-dom/client";
import Popup from "./Popup.jsx";

window.mapboxgl = maplibregl; // required by the OHM dates plugin

// helper to get the clicked area name

function getFeatureName(feature) {
  if (!feature || !feature.properties) return null;

  const props = feature.properties;

  return (
    props["name:en"] ||
    props.name_en ||
    props.name ||
    props["official_name:en"] ||
    props.official_name ||
    null
  );
}
// helper function to know what kind of area on map user hovers over with
function pickHoverFeature(features) {
  if (!features || features.length === 0) return null;

  for (const feature of features) {
    const name = getFeatureName(feature);
    if (!name) continue;

    const layerId = feature.layer?.id?.toLowerCase() || "";
    const sourceLayer = feature.sourceLayer?.toLowerCase() || "";
    const joinedText = `${layerId} ${sourceLayer}`;

    const isCountryLike =
      joinedText.includes("country") ||
      joinedText.includes("state") ||
      joinedText.includes("admin");

    const isClearlyNotCountry =
      joinedText.includes("city") ||
      joinedText.includes("town") ||
      joinedText.includes("village") ||
      joinedText.includes("hamlet") ||
      joinedText.includes("suburb") ||
      joinedText.includes("road") ||
      joinedText.includes("water") ||
      joinedText.includes("building") ||
      joinedText.includes("hillshade") ||
      joinedText.includes("landcover") ||
      joinedText.includes("landuse");

    if (isCountryLike && !isClearlyNotCountry) {
      return feature;
    }
  }

  return null;
}

//shows the markers and returns the data for the events
function getEvents(year, map, markersRef) {
  const y = Number(year);
  let events = null;
  const sideBarEvents = [];
  if (y === 2025) {
    events = events2025;
  } else if (y === 2000) {
    events = events2000;
  } else {
    return [];
  }

  if (!Array.isArray(events)) {
    console.error("Events JSON is not an array:", events);
    return [];
  }

  events.forEach(evnt => {
    if (!evnt.coordinates) return;
    const popupContainer = document.createElement("div");
    const popupRoot = createRoot(popupContainer);
    popupRoot.render(
      <Popup
        eventName={evnt.name}
        eventDate={evnt.date}
        eventDescription={evnt.summary}
        onClose={() => popup.remove()}
      />
    );
    const popup = new maplibregl.Popup({ offset: 24 })
      .setDOMContent(popupContainer);

    const { lat, lng } = evnt.coordinates;
    if (typeof lat !== "number" || typeof lng !== "number") {
      console.warn("Invalid coordinates for event:", evnt);
      return;
    }

    const el = document.createElement("div");
    el.className = "event-marker";
    el.title = evnt.name;
    const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map);

    sideBarEvents.push({
      name: evnt.name,
      date: evnt.date,
      summary: evnt.summary,
      lng, lat
    });
    markersRef.current.push(marker);
  });
  return sideBarEvents;
}


function clearMarkers(markersRef) {
  markersRef.current.forEach(marker => {
    marker.remove();
    marker.getPopup().remove();
  });
  markersRef.current = [];
}

function normalizeCountryName(value) {
  return value
    ?.toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findRelationshipOverlay(countryName, year) {
  if (Number(year) !== 2026 || !countryName) return null;

  const normalizedName = normalizeCountryName(countryName);
  return (
    relationshipOverlays2026.find((entry) =>
      entry.aliases.some((alias) => normalizeCountryName(alias) === normalizedName)
    ) || null
  );
}

function createRelationshipPopup(item, categoryLabel) {
  return new maplibregl.Popup({ offset: 18 }).setHTML(
    `<div class="relationship-popup"><strong>${item.name}</strong><div>${categoryLabel}</div></div>`
  );
}

function renderRelationshipMarkers(map, overlayData, relationshipMarkersRef) {
  clearMarkers(relationshipMarkersRef);
  if (!overlayData) return;

  const categories = [
    { key: "allies", colorClass: "ally", label: "Ally" },
    { key: "enemies", colorClass: "enemy", label: "Enemy" },
    { key: "tradePartners", colorClass: "trade", label: "Trade Partner" },
    { key: "pastColonies", colorClass: "colony", label: "Past Colony" },
  ];

  categories.forEach(({ key, colorClass, label }) => {
    overlayData[key]?.forEach((item) => {
      const el = document.createElement("div");
      el.className = `relationship-marker relationship-marker--${colorClass}`;
      el.title = `${label}: ${item.name}`;

      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([item.lng, item.lat])
        .setPopup(createRelationshipPopup(item, label))
        .addTo(map);

      relationshipMarkersRef.current.push(marker);
    });
  });
}


export default function OHMMap({
  yearProp = new Date().getFullYear(),
  onCountrySelect,
  selectedCountry,
}) {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const yearRef = useRef(yearProp);
  const markersRef = useRef([]);
  const relationshipMarkersRef = useRef([]);
  const hoveredCountryRef = useRef(null);
  const [eventsList, setEventsList] = useState([]);

  const applyDate = (map) => {
    map.filterByDate(`${yearRef.current}-01-01`);
    map.triggerRepaint();
  };

  useEffect(() => {
    yearRef.current = yearProp;
  }, [yearProp]);

  // init once
  useEffect(() => {
    let disposed = false;

    (async () => {
      await import("@openhistoricalmap/maplibre-gl-dates");
      if (disposed) return;

      const map = new maplibregl.Map({
        container: mapEl.current,
        style:
          "https://unpkg.com/@openhistoricalmap/map-styles@latest/dist/historical/historical.json",
        center: [10, 20],
        zoom: 2,
        minZoom: 1.2,
        attributionControl: {
          customAttribution:
            '<a href="https://www.openhistoricalmap.org/">OpenHistoricalMap</a>',
        },
      });
      mapRef.current = map;

      const forceEnglishLabels = () => {
        const style = map.getStyle?.();
        if (!style?.layers) return;

        for (const layer of style.layers) {
          if (layer.type !== "symbol") continue;

          const layerId = layer.id.toLowerCase();

          const isCountryLikeLayer =
            layerId.includes("country") ||
            layerId.includes("state") ||
            layerId.includes("admin");

          try {
            map.setLayoutProperty(layer.id, "text-field", [
              "coalesce",
              ["get", "name:en"],
              ["get", "name_en"],
              ["get", "name"],
            ]);

            if (isCountryLikeLayer) {
              map.setPaintProperty(layer.id, "text-color", [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                "#ffff00",
                "#ffffff"
              ]);

              map.setPaintProperty(layer.id, "text-halo-color", [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                "#000000",
                "#000000"
              ]);

              map.setPaintProperty(layer.id, "text-halo-width", [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                2,
                1
              ]);
            }
          } catch { }
        }
      };

      //called whenever new data is needed (zooming, moving)
      map.on("styledata", () => {
        applyDate(map);
        forceEnglishLabels();
        //getEvents(year, map);
      });
      map.on("mousemove", (e) => {
        const features = map.queryRenderedFeatures(e.point);
        const hoverFeature = pickHoverFeature(features);

        if (!hoverFeature) {
          if (hoveredCountryRef.current) {
            map.setFeatureState(
              {
                source: hoveredCountryRef.current.source,
                sourceLayer: hoveredCountryRef.current.sourceLayer,
                id: hoveredCountryRef.current.id,
              },
              { hover: false }
            );
          }

          hoveredCountryRef.current = null;
          map.getCanvas().style.cursor = "";
          return;
        }

        const name = getFeatureName(hoverFeature);
        if (!name) {
          if (hoveredCountryRef.current) {
            map.setFeatureState(
              {
                source: hoveredCountryRef.current.source,
                sourceLayer: hoveredCountryRef.current.sourceLayer,
                id: hoveredCountryRef.current.id,
              },
              { hover: false }
            );
          }

          hoveredCountryRef.current = null;
          map.getCanvas().style.cursor = "";
          return;
        }

        const featureId = hoverFeature.id;

        if (featureId == null) {
          if (hoveredCountryRef.current) {
            map.setFeatureState(
              {
                source: hoveredCountryRef.current.source,
                sourceLayer: hoveredCountryRef.current.sourceLayer,
                id: hoveredCountryRef.current.id,
              },
              { hover: false }
            );
          }

          hoveredCountryRef.current = null;
          map.getCanvas().style.cursor = "";
          return;
        }

        if (hoveredCountryRef.current?.id !== featureId) {
          if (hoveredCountryRef.current) {
            map.setFeatureState(
              {
                source: hoveredCountryRef.current.source,
                sourceLayer: hoveredCountryRef.current.sourceLayer,
                id: hoveredCountryRef.current.id,
              },
              { hover: false }
            );
          }

          map.setFeatureState(
            {
              source: hoverFeature.source,
              sourceLayer: hoverFeature.sourceLayer,
              id: featureId,
            },
            { hover: true }
          );

          hoveredCountryRef.current = {
            id: featureId,
            name,
            properties: hoverFeature.properties,
            layerId: hoverFeature.layer?.id || null,
            source: hoverFeature.source,
            sourceLayer: hoverFeature.sourceLayer,
          };
        }

        map.getCanvas().style.cursor = "pointer";
      });

      map.on("click", () => {
        if (!hoveredCountryRef.current) return;

        if (onCountrySelect) {
          onCountrySelect(hoveredCountryRef.current);
        }
      });

      map.on("mouseleave", () => {
        if (hoveredCountryRef.current) {
          map.setFeatureState(
            {
              source: hoveredCountryRef.current.source,
              sourceLayer: hoveredCountryRef.current.sourceLayer,
              id: hoveredCountryRef.current.id,
            },
            { hover: false }
          );
        }

        hoveredCountryRef.current = null;
        map.getCanvas().style.cursor = "";
      });

      //called once
      map.on("load", () => {
        forceEnglishLabels();
        applyDate(map);
        const list = getEvents(yearProp, map, markersRef);
        setEventsList(list);
      });
    })();

    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // on prop change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    applyDate(map);
    clearMarkers(markersRef);
    clearMarkers(relationshipMarkersRef);
    const list = getEvents(yearProp, mapRef.current, markersRef);
    setEventsList(list);
  }, [yearProp]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const overlayData = findRelationshipOverlay(selectedCountry?.name, yearProp);
    renderRelationshipMarkers(map, overlayData, relationshipMarkersRef);
  }, [selectedCountry, yearProp]);

  const relationshipOverlay = findRelationshipOverlay(selectedCountry?.name, yearProp);

  const handleEventClick = (index) => {
    const marker = markersRef.current[index];
    if (!marker || !mapRef.current) return;

    const { lng, lat } = marker.getLngLat();
    markersRef.current.forEach((m) => {
      const p = m.getPopup && m.getPopup();
      if (p) p.remove();
    });

    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: 4,
      speed: 0.7,
    });

    const popup = marker.getPopup && marker.getPopup();
    if (popup) {
      popup.setLngLat([lng, lat]).addTo(mapRef.current);
    }
  };

  return (
    <div className="ohm-wrapper">
      <div ref={mapEl} className="ohm-map" />

      <div className="events-overlay">
        <h3>Events in {yearProp}</h3>
        {eventsList.length === 0 ? (
          <p className="no-events">No events for this year...</p>
        ) : (
          <ul className="events-list">
            {eventsList.map((ev, index) => (
              <li
                key={index}
                className="event-item"
                onClick={() => handleEventClick(index)}
              >
                <p className="event-name">{ev.name}</p>
                <p className="event-date">{ev.date}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {relationshipOverlay ? (
        <div className="relationships-overlay">
          <h3>Relationships in 2026</h3>
          <p className="relationships-overlay__country">{selectedCountry?.name}</p>
          <div className="relationships-legend">
            <div className="relationships-legend__item">
              <span className="relationships-legend__swatch relationships-legend__swatch--ally" />
              Allies
            </div>
            <div className="relationships-legend__item">
              <span className="relationships-legend__swatch relationships-legend__swatch--enemy" />
              Enemies
            </div>
            <div className="relationships-legend__item">
              <span className="relationships-legend__swatch relationships-legend__swatch--trade" />
              Trade Partners
            </div>
            <div className="relationships-legend__item">
              <span className="relationships-legend__swatch relationships-legend__swatch--colony" />
              Past Colonies
            </div>
          </div>
        </div>
      ) : null}

      {/*
    OLD EVENTS SIDEBAR (temporarily disabled)
    
    <div className="map-with-sidebar">
      <div ref={mapEl} className="map-container" />

      <aside className="events-sidebar">
        <h3>Events in {yearProp}</h3>
        {eventsList.length === 0 ? (
          <p className="no-events">No events for this year...</p>
        ) : (
          <ul className="events-list">
            {eventsList.map((ev, index) => (
              <li
                key={index}
                className="event-item"
                onClick={() => handleEventClick(index)}
              >
                <p className="event-name">{ev.name}</p>
                <p className="event-date">{ev.date}</p>
              </li>
            ))}
          </ul>
        )}
        <Link to="/" className="home-button" title="Home">
          <Home size={22} />
        </Link>
      </aside>
    </div>
    */}
    </div>
  );
}
