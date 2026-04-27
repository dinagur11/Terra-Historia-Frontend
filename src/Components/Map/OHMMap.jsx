import React, { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import "./OHMMap.css";
import { createRoot } from "react-dom/client";
import Popup from "./Popup.jsx";

window.mapboxgl = maplibregl;

const CUSTOM_LABELS = [
  {
    name: "Third Reich",
    yearStart: 1939,
    yearEnd: 1945,
    coordinates: [13.4050, 51.1657]
  },
  {
    name: "Khedivate \nof Egypt",
    yearStart: 1867,
    yearEnd: 1914,
    coordinates: [29.8, 26.8]
  }
]

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
    props.name ||
    props["official_name:en"] ||
    props.official_name ||
    null
  );
}

async function getEvents(year, map, markersRef) {
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

export default function OHMMap({
  yearProp = new Date().getFullYear(),
  onCountrySelect,
}) {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const yearRef = useRef(yearProp);
  const markersRef = useRef([]);
  const [eventsList, setEventsList] = useState([]);

  const applyDate = (map) => {
    map.filterByDate(`${yearRef.current}-01-01`);
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
    yearRef.current = yearProp;
  }, [yearProp]);

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
              ["get", "name"],
            ]);
          } catch { }
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
        const list = await getEvents(yearProp, map, markersRef)
        setEventsList(list)
      });
    })();

    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    applyDate(map);
    clearMarkers(markersRef);
    const load = async () => {
      const list = await getEvents(yearProp, mapRef.current, markersRef)
      setEventsList(list)
    }
    load()
  }, [yearProp]);

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
        <h3>Events in {yearProp}</h3>
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