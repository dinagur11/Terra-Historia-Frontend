import React, { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import "./OHMMap.css";
import events2025 from "../assets/database-example-2025.json"
import events2000 from "../assets/database-example-2000.json"
import { createRoot } from "react-dom/client";
import Popup from "./Popup.jsx";   

window.mapboxgl = maplibregl; // required by the OHM dates plugin

//shows the markers and returns the data for the events
function getEvents(year, map,markersRef) {
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
    const marker = new maplibregl.Marker({ element: el, anchor: "bottom"})
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


export default function OHMMap({ yearProp = new Date().getFullYear()}) {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const yearRef = useRef(yearProp);
  let markersRef = useRef([]);
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
          try {
            map.setLayoutProperty(layer.id, "text-field", [
              "coalesce",
              ["get", "name:en"],
              ["get", "name_en"],
              ["get", "name"],
            ]);
          } catch {}
        }
      };

      //called whenever new data is needed (zooming, moving)
      map.on("styledata", () => {
        applyDate(map);
        forceEnglishLabels();
        //getEvents(year, map);
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
    const list = getEvents(yearProp, mapRef.current, markersRef);
    setEventsList(list);
  }, [yearProp]);

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

  return (<div className="map-with-sidebar">
      <div ref={mapEl} className="map-container" />
      <aside className="events-sidebar">
        <h3>Events in {yearProp}</h3>
        {eventsList.length === 0 ? (
          <p className="no-events">Loading...</p>
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
      </aside>
    </div>);
}
