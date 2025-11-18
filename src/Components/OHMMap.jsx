import React, { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import "./OHMMap.css";
import events2025 from "../assets/database-example-2025.json"
import events2000 from "../assets/database-example-2000.json"

window.mapboxgl = maplibregl; // required by the OHM dates plugin


function getEvents(year, map,markersRef) {
  const y = Number(year);
  let events = null;

  if (y === 2025) {
    events = events2025;
  } else if (y === 2000) {
    events = events2000;
  } else {
    return;
  }

  if (!Array.isArray(events)) {
    console.error("Events JSON is not an array:", events);
    return;
  }

  events.forEach(evnt => {
    if (!evnt.coordinates) return;
    const { lat, lng } = evnt.coordinates;
    if (typeof lat !== "number" || typeof lng !== "number") {
      console.warn("Invalid coordinates for event:", evnt);
      return;
    }

    const el = document.createElement("div");
    el.className = "event-marker";
    el.title = evnt.name;
    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([lng, lat])
      .addTo(map);
    markersRef.current.push(marker);
  });
}


function clearMarkers(markersRef) {
  markersRef.current.forEach(marker => marker.remove());
  markersRef.current = [];
}


export default function OHMMap({ yearProp = new Date().getFullYear()}) {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const yearRef = useRef(yearProp);
  let MarkersRef = useRef([]);

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
        getEvents(yearRef.current, map, MarkersRef);
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
    clearMarkers(MarkersRef);
    getEvents(yearRef.current, map, MarkersRef);
  }, [yearProp]);

  return <div ref={mapEl} className="map-wrap" />;
}
