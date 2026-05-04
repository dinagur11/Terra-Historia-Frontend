import React, { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import "./OHMMap.css";
import { createRoot } from "react-dom/client";
import Popup from "./Popup.jsx";
import countriesTopology from "world-atlas/countries-110m.json";

window.mapboxgl = maplibregl;

const COUNTRY_LABEL_LAYERS = ["country_points_labels", "country_points_labels_cen"];

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

const COUNTRY_SEARCH_ALIASES = {
  "United States of America": ["United States", "USA", "U.S.A.", "US", "U.S."],
  "United Kingdom": ["UK", "U.K.", "Great Britain", "Britain"],
  "Czechia": ["Czech Republic"],
  "Dem. Rep. Congo": ["Democratic Republic of the Congo", "DR Congo", "DRC"],
  "Congo": ["Republic of the Congo"],
  "Dominican Rep.": ["Dominican Republic"],
  "Central African Rep.": ["Central African Republic"],
  "Eq. Guinea": ["Equatorial Guinea"],
  "Bosnia and Herz.": ["Bosnia and Herzegovina"],
  "S. Sudan": ["South Sudan"],
  "W. Sahara": ["Western Sahara"],
  "eSwatini": ["Eswatini", "Swaziland"],
  "Cote d'Ivoire": ["Ivory Coast"],
  "Côte d'Ivoire": ["Ivory Coast", "Cote d'Ivoire"],
  "Fr. S. Antarctic Lands": ["French Southern and Antarctic Lands"],
  "N. Cyprus": ["Northern Cyprus"],
  "Falkland Is.": ["Falkland Islands"],
  "Solomon Is.": ["Solomon Islands"],
};

let countrySearchIndex = null;

function normalizeCountrySearch(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/^the\s+/, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function decodeArc(topology, arcIndex) {
  const arc = topology.arcs[arcIndex < 0 ? ~arcIndex : arcIndex];
  const points = [];
  const { scale, translate } = topology.transform;
  let x = 0;
  let y = 0;

  for (const point of arc) {
    x += point[0];
    y += point[1];
    points.push([
      x * scale[0] + translate[0],
      y * scale[1] + translate[1],
    ]);
  }

  return arcIndex < 0 ? points.reverse() : points;
}

function decodeRing(topology, ring) {
  return ring.flatMap((arcIndex, index) => {
    const points = decodeArc(topology, arcIndex);
    return index === 0 ? points : points.slice(1);
  });
}

function getGeometryRings(topology, geometry) {
  if (geometry.type === "Polygon") {
    return geometry.arcs.map(ring => decodeRing(topology, ring));
  }

  if (geometry.type === "MultiPolygon") {
    return geometry.arcs.flatMap(polygon => polygon.map(ring => decodeRing(topology, ring)));
  }

  return [];
}

function getRingArea(ring) {
  let area = 0;
  for (let i = 0; i < ring.length; i += 1) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area / 2);
}

function getRingCenter(ring) {
  const bounds = getRingBounds(ring);

  return [
    (bounds.minLng + bounds.maxLng) / 2,
    (bounds.minLat + bounds.maxLat) / 2,
  ];
}

function getRingBounds(ring) {
  return ring.reduce(
    (acc, [lng, lat]) => ({
      minLng: Math.min(acc.minLng, lng),
      maxLng: Math.max(acc.maxLng, lng),
      minLat: Math.min(acc.minLat, lat),
      maxLat: Math.max(acc.maxLat, lat),
    }),
    { minLng: Infinity, maxLng: -Infinity, minLat: Infinity, maxLat: -Infinity }
  );
}

function buildCountrySearchIndex() {
  if (countrySearchIndex) return countrySearchIndex;

  const index = new Map();
  const geometries = countriesTopology.objects.countries.geometries;

  for (const geometry of geometries) {
    const name = geometry.properties?.name;
    if (!name) continue;

    const rings = getGeometryRings(countriesTopology, geometry);
    const largestRing = rings.reduce((largest, ring) => {
      if (!largest) return ring;
      return getRingArea(ring) > getRingArea(largest) ? ring : largest;
    }, null);

    if (!largestRing?.length) continue;

    const country = {
      name,
      center: getRingCenter(largestRing),
      bounds: getRingBounds(largestRing),
    };

    [name, ...(COUNTRY_SEARCH_ALIASES[name] || [])].forEach(alias => {
      index.set(normalizeCountrySearch(alias), country);
    });
  }

  countrySearchIndex = index;
  return countrySearchIndex;
}

function resolveCountrySearch(query) {
  return buildCountrySearchIndex().get(normalizeCountrySearch(query)) || null;
}

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
  countrySearch,
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

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !countrySearch?.query) return;

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

    map.fitBounds(
      [
        [country.bounds.minLng, country.bounds.minLat],
        [country.bounds.maxLng, country.bounds.maxLat],
      ],
      { padding: 80, maxZoom: 5, duration: 1200 }
    );
    if (onCountrySelect) {
      onCountrySelect({ name: country.name, properties: { name: country.name } });
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
