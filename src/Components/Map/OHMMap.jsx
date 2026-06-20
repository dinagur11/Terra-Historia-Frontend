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

const customBorders = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Latvia-Lithuania border', yearStart: 1918, yearEnd: 1919 },
      geometry: {
        type: 'LineString',
        coordinates: [
          [21.07, 56.07],
          [21.50, 56.20],
          [22.20, 56.32],
          [22.90, 56.40],
          [23.55, 56.37],
          [24.20, 56.40],
          [24.80, 56.38],
          [25.40, 56.27],
          [25.85, 56.10],
          [26.30, 55.95],
          [26.62, 55.78],
          [26.83, 55.67]   // tripoint with Belarus/Poland
        ]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Poland-Lithuania border', yearStart: 1918, yearEnd: 1919 },
      geometry: {
        type: 'LineString',
        coordinates: [
          [26.83, 55.67],  // tripoint with Latvia (matches above)
          [26.50, 55.40],
          [26.20, 55.10],
          [25.80, 54.85],
          [25.40, 54.70],
          [25.10, 54.50],
          [24.50, 54.30],
          [23.80, 54.20],
          [23.10, 54.30],
          [22.80, 54.40]   // meets East Prussia border (~Suwałki area)
        ]
      }
    },
  {
  type: 'Feature',
  properties: { name: 'WUPR-Poland border', yearStart: 1918, yearEnd: 1918 },
  geometry: {
    type: 'LineString',
    coordinates: [
      [22.2, 49.2],
      [22.4, 49.5],
      [22.6, 49.8],
      [22.8, 50.0],
      [23.0, 50.2],
      [23.2, 50.4]
    ]
  }
  },
  {
    type: 'Feature',
    properties: { name: 'WUPR-Romania border', yearStart: 1918, yearEnd: 1918 },
    geometry: {
      type: 'LineString',
      coordinates: [
        [24.6, 48.2],
        [24.9, 48.3],
        [25.2, 48.4],
        [25.5, 48.5],
        [25.8, 48.5],
        [26.2, 48.6]
      ]
    }
  }
  ]
};

const CUSTOM_LABELS = [
  {
    name: "Third Reich",
    yearStart: 1938,
    yearEnd: 1944,
    coordinates: [13.4050, 51.1657]
  },
  {
  name: "Kingdom of Yugoslavia",
  yearStart: 1939,
  yearEnd: 1940,
  coordinates: [20.4568, 44.0165]
  },
  {
    name: "Sultanate \nof Egypt",
    yearStart: 1867,
    yearEnd: 1914,
    coordinates: [29.8, 26.8]
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
    yearEnd: 1982,
    coordinates: [133.7751, -25.2744]
  },
  {
    name: "Dutch\nGuiana",
    yearStart: 1667,
    yearEnd: 1975,
    coordinates: [-56.0278, 3.9193]
  },
  {
    name: "French\nGuiana",
    yearStart: 1946,
    yearEnd: 9999,
    coordinates: [-53.1258, 3.9339]
  }, 
  {
    name: "Nazi\nOccupied\nUkraine",
    yearStart: 1941,
    yearEnd: 1944,
    coordinates: [24.8, 49.3]
  },
  {
    name: "Transnistria\n(Romania)",
    yearStart: 1941,
    yearEnd: 1943,
    coordinates: [30.2, 47.5],
    clickable: false
  },
  {
    name: "Nazi\nOccupied\nPoland",
    yearStart: 1941,
    yearEnd: 1944,
    coordinates: [23.5, 53.3]
  },
  {
    name: "Transcarpathia\n(Soviet-Union)",
    yearStart: 1945,
    yearEnd: 1951,
    coordinates: [23.5, 48.5],
    clickable: false,
  },
  {
    name: "United Arab\nRepublic",
    yearStart: 1958,
    yearEnd: 1961,
    coordinates: [38.5, 35.0]
  },
  {
    name: "Kars\nOblast",
    yearStart: 1914,
    yearEnd: 1919,
    coordinates: [42.5, 40.8]
  },
  {
    name: "Grand National\nAssembly of\nTurkey",
    yearStart: 1921,
    yearEnd: 1923,
    coordinates: [43.0, 40.0]
  },
  {
    name: "British\nMalaya",
    yearStart: 1941,
    yearEnd: 1941,
    coordinates: [102.5, 3.5]
  },
  {
    name: "Japanese\nKorea",
    yearStart: 1914,
    yearEnd: 1945,
    coordinates: [127.5, 37.5]
  },
  {
    name: "Siam",
    yearStart: 1932,
    yearEnd: 1938,
    coordinates: [100.5, 15.0]
  },
  {
    name: "Democratic\nFederal\nYugoslavia",
    yearStart: 1944,
    yearEnd: 1945,
    coordinates: [20.0, 44.0]
  },
  {
    name: "Governorate\nof\nMontenegro",
    yearStart: 1943,
    yearEnd: 1943,
    coordinates: [19.3, 42.7]
  },
  {
      name: "Republic\nof\nPoland",
      yearStart: 1918,
      yearEnd: 1918,
      coordinates: [19.1, 52.0]
  },
  {
      name: "Kingdom of\nSerbs, Croats \nand Slovenes",
      yearStart: 1918,
      yearEnd: 1919,
      coordinates: [15.5, 45.3]
  },
  {
    name: "Ober Ost",
    yearStart: 1918,
    yearEnd: 1918,
    coordinates: [25.0, 51.5]
  },
  {
    name: "Imamate of\nOman",
    yearStart: 1932,
    yearEnd: 1969,
    coordinates: [55.8, 20.5]
  },
  {
    name: "Kingdom of\nYemen",
    yearStart: 1932,
    yearEnd: 1962,
    coordinates: [44.5, 15.5]
  },
  {
    name: "Latvia",
    yearStart: 1918,
    yearEnd: 1919,
    coordinates: [24.5, 57.0]
},
{
    name: "Lithuania",
    yearStart: 1918,
    yearEnd: 1919,
    coordinates: [24.0, 55.3]
},
{
    name: "Mongolian\nPeople's Republic",
    yearStart: 1924,
    yearEnd: 1991,  
    coordinates: [104.0, 46.0] 
},
{
    name: "French Madagascar",
    yearStart: 1924,
    yearEnd: 1959,
    coordinates: [47.0, -19.0]
},
{
    name: "Emirate of\nTrarza",
    yearStart: 1903,
    yearEnd: 1960,
    coordinates: [-15.6, 17.4]
}, 
{
  name: "Bačka",
  yearStart: 1941,
  yearEnd: 1941,
  coordinates: [19.5, 45.6]
},
{
  name: "Bačka",
  yearStart: 1943,
  yearEnd: 1944,
  coordinates: [19.5, 45.6],
  clickable: false
},
{
  name: "Operational\nZone of the\nAdriatic Littoral",
  yearStart: 1943,
  yearEnd: 1944,
  coordinates: [14.0, 45.7],
  clickable: false
},
{
  name: "Kosovo\n(German Occupied\nAlbania)",
  yearStart: 1943,
  yearEnd: 1943,
  coordinates: [20.7, 42.45],
  clickable: false
},
{
  name: "Bulgarian-\nannexed\nSerbia",
  yearStart: 1943,
  yearEnd: 1943,
  coordinates: [22.0, 42.0],
  clickable: false
}
]

  const unwantedLabels = ['Akrotiri and Dhekelia', 'Palestine', 'Goseria', 'Pulerid', 'Kongroneria', 'Inuit Nunangat', 'Guernsey', 'Jersey', 'Wallis and Futuna', 'Pitcairn Islands', 'Levant States', 'Gibraltar', 'Democratic Federal Yugoslavia', 'Portuguese Goa', 'U.S. Naval Base Subic Bay']; 



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

async function getEvents(year, map, markersRef, isLogged, isCancelled) {
  const events = await fetchEvents(year)
  if (isCancelled?.()) return []
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
    const yearFilter = [
      "all",
      ["<=", ["get", "yearStart"], yearRef.current],
      [">=", ["get", "yearEnd"], yearRef.current]
    ];

    if (map.getLayer("custom-labels")) {
      map.setFilter("custom-labels", yearFilter);
    }
    if (map.getLayer("custom-borders-line")) {
      map.setFilter("custom-borders-line", yearFilter);
    }
    //map.triggerRepaint();
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
      let hasForcedEnglishLabels = false;
      const forceEnglishLabels = () => {
        if (hasForcedEnglishLabels) return;
        const style = map.getStyle?.();
        if (!style?.layers) return;
        const labelExpression = [
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
        ];
        const visibleLabelExpression = [
          "case",
          ["in", labelExpression, ["literal", unwantedLabels]],
          "",
          labelExpression,
        ];
        for (const layer of style.layers) {
          if (layer.type !== "symbol") continue;
          try {
            map.setLayoutProperty(layer.id, "text-field", visibleLabelExpression);
          } catch {
            // Some style layers do not allow changing this layout property.
          }
        }
        hasForcedEnglishLabels = true;
      };

      const removeUnwantedLabels = () => {
        COUNTRY_LABEL_LAYERS.forEach(layerId => {
          if (!map.getLayer(layerId)) return;
          map.setPaintProperty(layerId, 'text-opacity', [
            'case',
            ['in', ['coalesce', ['get', 'name:en'], ['get', 'name_en'], ['get', 'name'], ''], 
              ['literal', unwantedLabels]],
            0,
            1
          ]);
        });
      };

      map.on("styledata", () => {
        if (!map.getSource("custom-borders")) {
          map.addSource("custom-borders", {
            type: "geojson",
            data: customBorders
          });
          map.addLayer({
            id: "custom-borders-line",
            type: "line",
            source: "custom-borders",
            paint: {
              "line-color": "#555",
              "line-width": 0.8,
              "line-opacity": 0.7
            }
          });
        }
        applyDate(map);
        forceEnglishLabels();
        removeUnwantedLabels();
      });
      map.on("click", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["country_points_labels", "country_points_labels_cen"]
        });

        const feature = features[0];
        if (!feature) return;
        const name = getFeatureName(feature);
        if (!name) return;
        if (onCountrySelect) onCountrySelect({ name, properties: feature.properties });
      });

      map.on("click", "custom-labels", (e) => {
        const name = e.features[0]?.properties?.name;
        if (!props || props.clickable === false) return;
        if (!name) return;
        if (onCountrySelect) onCountrySelect({ name, properties: props }); 
      });
      

      map.on("load", async () => {
        forceEnglishLabels();
        applyDate(map);
        removeUnwantedLabels();
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
                yearEnd: label.yearEnd,
                clickable: label.clickable !== false
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
            "text-font": [
              "case",
              ["==", ["get", "clickable"], false],
              ["literal", ["Open Sans Regular"]],
              ["literal", ["Open Sans Bold"]]
            ],
            "text-anchor": "center",
            "text-letter-spacing": 0.05
          },
          paint: {
            "text-color": [
              "case",
              ["==", ["get", "clickable"], false],
              "#9b9488",
              "#6E786E"
            ],
            "text-halo-color": [
              "case",
              ["==", ["get", "clickable"], false],
              "rgba(245, 242, 235, 0.7)",
              "rgba(34, 33, 33, 0.6)"
            ],
            "text-halo-width": [
              "case",
              ["==", ["get", "clickable"], false],
              1,
              0.2
            ]
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
    let cancelled = false;
    if (!map || !mapReady) return;
    applyDate(map);
    const publishCountryOptions = () => {
      onCountryOptionsChange?.(getOhmCountryOptions(map, effectiveYear));
    };
    publishCountryOptions();
    map.once("idle", publishCountryOptions);
    clearMarkers(markersRef);
    const load = async () => {
      const list = await getEvents(effectiveYear, mapRef.current, markersRef, isLogged, () => cancelled)
       if (cancelled) return;
        setEventsList(list);
     }
    load()
    return () => { cancelled = true; };
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
