import React, { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import "./OHMMap.css";

window.mapboxgl = maplibregl; // required by the OHM dates plugin

export default function OHMMap({ yearProp = new Date().getFullYear() }) {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const yearRef = useRef(yearProp);          // <- live year ref

  // keep the ref current so listeners always see latest year
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
        attributionControl: {
          customAttribution:
            '<a href="https://www.openhistoricalmap.org/">OpenHistoricalMap</a>',
        },
      });
      mapRef.current = map;

      const applyDate = () => {
        // always use the *current* year
        map.filterByDate(`${yearRef.current}-01-01`);
        map.triggerRepaint?.();
      };

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

      // When style data is ready (initial load or any style refresh),
      // re-apply both the labels and the current date.
      map.on("styledata", () => {
        applyDate();
        forceEnglishLabels();
      });

      map.on("load", () => {
        forceEnglishLabels();
        applyDate(); // also apply once here for safety
      });
    })();

    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // on prop change, apply immediately (if style is ready) or once after it is
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const applyDate = () => map.filterByDate(`${yearProp}-01-01`);

    if (map.isStyleLoaded?.() === false) {
      const once = () => {
        applyDate();
        map.off("styledata", once);
      };
      map.on("styledata", once);
      return;
    }
    applyDate();
  }, [yearProp]);

  return <div ref={mapEl} className="map-wrap" />;
}
