import { useEffect, useMemo, useRef, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  ArrowLeft,
  Bookmark,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Header from "../Components/Header/Header";
import { isDeepDiveAvailable } from "../constants/deepDiveAvailability";
import {
  DIVISION_LINES_BY_TIMELINE,
  FALLBACK_MARKERS_BY_TIMELINE,
  HIDDEN_REGIONS_BY_TIMELINE,
  OVERRIDE_MARKERS_BY_TIMELINE,
  OVERRIDE_REGIONS_BY_TIMELINE,
  OVERRIDE_VIEWS_BY_TIMELINE,
} from "../constants/deepDiveMapMarkers";
import { useAuth } from "../Context/AuthContext";
import "./DeepDivesInfoPage.css";

window.maplibregl = maplibregl;

async function fetchDeepDive(id) {
  const baseUrl = `${import.meta.env.VITE_API_URL}/deepdives`;
  const response = await fetch(`${baseUrl}/${encodeURIComponent(id)}`);

  if (response.status !== 404) return response;

  return fetch(`${baseUrl}/${encodeURIComponent(`${id}.generated`)}`);
}

// ── Map helpers ───────────────────────────────────────────────────────────────

function forceEnglishLabels(map) {
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
      // Some style layers do not allow this layout change.
    }
  }
}

function getEventMarkers(timelineId, activeEvent) {
  const overrideMarkers =
    OVERRIDE_MARKERS_BY_TIMELINE[timelineId]?.[activeEvent.id];
  if (overrideMarkers) return overrideMarkers;

  const eventMarkers = Array.isArray(activeEvent.markers)
    ? activeEvent.markers
    : [];

  if (eventMarkers.length > 0) return eventMarkers;

  return FALLBACK_MARKERS_BY_TIMELINE[timelineId]?.[activeEvent.id] || [];
}

function getEventView(timelineId, activeEvent) {
  return (
    OVERRIDE_VIEWS_BY_TIMELINE[timelineId]?.[activeEvent.id] ||
    activeEvent.view || { center: [30, 20], zoom: 3 }
  );
}

function getMarkerLngLat(markerData) {
  const latlng =
    markerData.latlng || markerData.latLng || markerData.coordinates;
  if (!Array.isArray(latlng) || latlng.length < 2) return null;

  const lat = Number(latlng[0]);
  const lng = Number(latlng[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return [lng, lat];
}

function createMarkerPopup(markerData) {
  if (!markerData.image) {
    return new maplibregl.Popup({ offset: 18 }).setText(
      markerData.label || ""
    );
  }

  const content = document.createElement("div");
  content.className = "deepdive-map-photo-popup";

  const img = document.createElement("img");
  img.src = markerData.image.src;
  img.alt = markerData.image.alt || markerData.label || "";
  img.loading = "lazy";

  const title = document.createElement("strong");
  title.textContent = markerData.label || "";

  const caption = document.createElement("span");
  caption.textContent = markerData.image.caption || "";

  content.append(img, title, caption);

  return new maplibregl.Popup({
    offset: 22,
    closeButton: false,
    closeOnClick: false,
    className: "deepdive-map-popup--photo",
  }).setDOMContent(content);
}

function placeMarkers(map, timelineId, activeEvent, markersRef) {
  markersRef.current.forEach((m) => m.remove());
  markersRef.current = [];

  getEventMarkers(timelineId, activeEvent).forEach((markerData) => {
    const lngLat = getMarkerLngLat(markerData);
    if (!lngLat) return;

    const el = document.createElement("div");
    el.className = `deepdive-map-marker deepdive-map-marker--${
      markerData.type || "minor"
    }`;

    const popup = createMarkerPopup(markerData);
    const marker = new maplibregl.Marker({ element: el })
      .setLngLat(lngLat)
      .setPopup(popup)
      .addTo(map);

    if (markerData.image) {
      el.addEventListener("mouseenter", () => {
        popup.setLngLat(lngLat).addTo(map);
      });
      el.addEventListener("mouseleave", () => {
        popup.remove();
      });
    }

    markersRef.current.push(marker);
  });
}

function polygonCentroid(coordinates) {
  let x = 0, y = 0;
  const n = coordinates.length;
  for (const [lng, lat] of coordinates) {
    x += lng;
    y += lat;
  }
  return [x / n, y / n];
}

function getEventRegions(timelineId, activeEvent) {
  if (HIDDEN_REGIONS_BY_TIMELINE[timelineId]?.has(activeEvent.id)) return [];

  const overrideRegions =
    OVERRIDE_REGIONS_BY_TIMELINE[timelineId]?.[activeEvent.id];
  if (overrideRegions) return overrideRegions;

  return Array.isArray(activeEvent.regions) ? activeEvent.regions : [];
}

function getEventDivisionLines(timelineId, activeEvent) {
  return DIVISION_LINES_BY_TIMELINE[timelineId]?.[activeEvent.id] || [];
}

function placeOverlays(map, timelineId, activeEvent) {
  [
    "division-line-labels",
    "division-lines",
    "regions-labels",
    "regions-outline",
    "regions-fill",
  ].forEach((id) => {
    try {
      if (map.getLayer(id)) map.removeLayer(id);
    } catch {
      // The style may be mid-reload while old overlay layers are being cleared.
    }
  });
  [
    "division-line-labels",
    "division-lines",
    "regions-labels",
    "regions",
  ].forEach((id) => {
    try {
      if (map.getSource(id)) map.removeSource(id);
    } catch {
      // The style may be mid-reload while old overlay sources are being cleared.
    }
  });

  const regions = getEventRegions(timelineId, activeEvent);
  const divisionLines = getEventDivisionLines(timelineId, activeEvent);

  if (!regions.length && !divisionLines.length) return;

  try {
    if (regions.length) {
      map.addSource("regions", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: regions.map((r) => ({
            type: "Feature",
            properties: { color: r.color, opacity: r.opacity ?? 0.25 },
            geometry: { type: "Polygon", coordinates: [r.coordinates] },
          })),
        },
      });

      map.addLayer({
        id: "regions-fill",
        type: "fill",
        source: "regions",
        paint: {
          "fill-color": ["get", "color"],
          "fill-opacity": ["get", "opacity"],
        },
      });

      map.addLayer({
        id: "regions-outline",
        type: "line",
        source: "regions",
        paint: {
          "line-color": ["get", "color"],
          "line-width": 1.5,
          "line-opacity": 0.7,
        },
      });

      map.addSource("regions-labels", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: regions.map((r) => ({
            type: "Feature",
            properties: { label: r.label, color: r.color },
            geometry: {
              type: "Point",
              coordinates: polygonCentroid(r.coordinates),
            },
          })),
        },
      });

      map.addLayer({
        id: "regions-labels",
        type: "symbol",
        source: "regions-labels",
        layout: {
          "text-field": ["get", "label"],
          "text-size": 12,
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-anchor": "center",
          "text-max-width": 8,
          "text-allow-overlap": false,
          "text-ignore-placement": false,
        },
        paint: {
          "text-color": ["get", "color"],
          "text-halo-color": "rgba(0, 0, 0, 0.7)",
          "text-halo-width": 1.5,
        },
      });
    }

    if (divisionLines.length) {
      map.addSource("division-lines", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: divisionLines.map((line) => ({
            type: "Feature",
            properties: { color: line.color },
            geometry: { type: "LineString", coordinates: line.coordinates },
          })),
        },
      });

      map.addLayer({
        id: "division-lines",
        type: "line",
        source: "division-lines",
        paint: {
          "line-color": ["get", "color"],
          "line-width": 5,
          "line-dasharray": [1.2, 0.8],
          "line-opacity": 1,
        },
      });

      map.addSource("division-line-labels", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: divisionLines.map((line) => ({
            type: "Feature",
            properties: { label: line.label, color: line.color },
            geometry: {
              type: "Point",
              coordinates:
                line.coordinates[Math.floor(line.coordinates.length / 2)],
            },
          })),
        },
      });

      map.addLayer({
        id: "division-line-labels",
        type: "symbol",
        source: "division-line-labels",
        layout: {
          "text-field": ["get", "label"],
          "text-size": 12,
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-anchor": "left",
          "text-offset": [0.7, 0],
          "text-max-width": 8,
          "text-allow-overlap": true,
        },
        paint: {
          "text-color": ["get", "color"],
          "text-halo-color": "rgba(0, 0, 0, 0.78)",
          "text-halo-width": 1.6,
        },
      });
    }
  } catch (err) {
    console.warn("placeOverlays failed:", err);
  }
}

function applyEventYear(map, event) {
  const year = Number.parseInt(event?.year, 10);
  if (!Number.isFinite(year)) {
    console.warn("Could not apply OHM date filter for event:", event);
    return;
  }

  try {
    if (typeof map.filterByDate !== "function") {
      console.warn("OHM date filtering plugin is not available.");
      return;
    }

    map.filterByDate(String(year));
    map.triggerRepaint();
  } catch (err) {
    console.warn(`Could not filter OHM map to ${year}:`, err);
  }
}

function applyDateAndOverlays(map, timelineId, event) {
  applyEventYear(map, event);
  placeOverlays(map, timelineId, event);
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DeepDivesInfoPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isLogged } = useAuth();

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const [events, setEvents] = useState([]);
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [bookmarks, setBookmarks] = useState([]);
  const [completedTimelines, setCompletedTimelines] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const activeEvent = events[activeEventIndex];
  const slides = activeEvent?.slides || [];
  const activeSlide = slides[activeSlideIndex];
  const activeEventRef = useRef(null);
  activeEventRef.current = activeEvent ?? null;

  const isLastSlide =
    activeEventIndex === events.length - 1 &&
    activeSlideIndex === slides.length - 1;

  const currentBookmark = useMemo(() => {
    if (!id || !activeEvent || !activeSlide) return null;
    return {
      timelineId: id,
      eventId: activeEvent.id,
      eventTitle: activeEvent.title,
      slideIndex: activeSlideIndex,
      slideTitle: activeSlide.title,
    };
  }, [id, activeEvent, activeSlide, activeSlideIndex]);

  const isBookmarked = bookmarks.some(
    (bookmark) =>
      bookmark.timelineId === id &&
      bookmark.eventId === activeEvent?.id &&
      bookmark.slideIndex === activeSlideIndex
  );

  // ── Auth headers ───────────────────────────────────────────────────────────

  async function getAuthHeaders() {
    const session = await fetchAuthSession();
    const token = session.tokens?.accessToken?.toString();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  // ── Load deep dive ─────────────────────────────────────────────────────────

  useEffect(() => {
    async function loadDeepDive() {
      try {
        setIsLoading(true);
        setError("");

        if (!isDeepDiveAvailable(id)) {
          throw new Error("This deep dive is no longer available.");
        }

        const response = await fetchDeepDive(id);
        if (!response.ok) throw new Error("Could not load this deep dive.");

        const data = await response.json();
        const savedEventIndex = data.findIndex(
          (event) => event.id === location.state?.eventId
        );
        const nextEventIndex = savedEventIndex >= 0 ? savedEventIndex : 0;
        const savedSlideIndex = Number(location.state?.slideIndex);
        const nextSlides = data[nextEventIndex]?.slides || [];
        const nextSlideIndex =
          Number.isInteger(savedSlideIndex) &&
          savedSlideIndex >= 0 &&
          savedSlideIndex < nextSlides.length
            ? savedSlideIndex
            : 0;

        setEvents(data);
        setActiveEventIndex(nextEventIndex);
        setActiveSlideIndex(nextSlideIndex);
      } catch (err) {
        console.error(err);
        setError(err.message || "Could not load this deep dive.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDeepDive();
  }, [id, location.state?.eventId, location.state?.slideIndex]);

  // ── Load bookmarks ─────────────────────────────────────────────────────────

  useEffect(() => {
    async function loadBookmarks() {
      if (!isLogged) {
        setBookmarks([]);
        return;
      }

      try {
        const headers = await getAuthHeaders();
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/users/me/bookmarks`,
          { headers }
        );
        if (!response.ok) throw new Error("Could not load bookmarks.");

        const data = await response.json();
        setBookmarks(data.deepDiveBookmarks || []);
      } catch (err) {
        console.error(err);
      }
    }

    loadBookmarks();
  }, [isLogged]);

  // ── Load progress ──────────────────────────────────────────────────────────

  useEffect(() => {
    async function loadProgress() {
      if (!isLogged) return;

      try {
        const headers = await getAuthHeaders();
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/users/me/progress`,
          { headers }
        );
        if (!response.ok) return;

        const data = await response.json();
        const completed = Object.keys(data.timelineProgress || {}).filter(
          (k) => data.timelineProgress[k]
        );
        setCompletedTimelines(new Set(completed));
      } catch (err) {
        console.error(err);
      }
    }

    loadProgress();
  }, [isLogged]);

  // ── Map effect ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!activeEvent || !mapContainerRef.current) return;

    const view = getEventView(id, activeEvent);
    const center = view.center;
    const zoom = view.zoom;

    if (!mapRef.current) {
      let disposed = false;

      (async () => {
        await import("@openhistoricalmap/maplibre-gl-dates");
        if (disposed || !mapContainerRef.current) return;

        const map = new maplibregl.Map({
          container: mapContainerRef.current,
          style:
            "https://unpkg.com/@openhistoricalmap/map-styles@latest/dist/historical/historical.json",
          center: [center[1], center[0]],
          zoom,
        });

        mapRef.current = map;
        map.addControl(new maplibregl.NavigationControl(), "top-right");

        map.on("styledata", () => {
          const event = activeEventRef.current;
          if (!event) return;
          applyEventYear(map, event);
          forceEnglishLabels(map);
        });

        map.on("load", () => {
          if (disposed) return;
          const event = activeEventRef.current;
          if (event) {
            applyDateAndOverlays(map, id, event);
            placeMarkers(map, id, event, markersRef);
          }
          forceEnglishLabels(map);
        });
      })();

      return () => { disposed = true; };

    } else {
      mapRef.current.flyTo({
        center: [center[1], center[0]],
        zoom,
        essential: true,
      });

      placeMarkers(mapRef.current, id, activeEvent, markersRef);

      const applyUpdate = () => {
        if (!mapRef.current) return;
        forceEnglishLabels(mapRef.current);
        applyDateAndOverlays(mapRef.current, id, activeEvent);
      };

      if (mapRef.current.isStyleLoaded()) {
        applyUpdate();
      } else {
        mapRef.current.once("styledata", applyUpdate);
      }
    }
  }, [activeEvent, id]);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // ── Bookmarks ──────────────────────────────────────────────────────────────

  async function saveBookmarks(nextBookmarks) {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/users/me/bookmarks`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({ deepDiveBookmarks: nextBookmarks }),
      }
    );
    if (!response.ok) throw new Error("Could not update bookmarks.");

    const data = await response.json();
    setBookmarks(data.deepDiveBookmarks || nextBookmarks);
  }

  async function toggleBookmark() {
    if (!isLogged || !currentBookmark) return;

    const nextBookmarks = isBookmarked
      ? bookmarks.filter(
          (bookmark) =>
            !(
              bookmark.timelineId === id &&
              bookmark.eventId === activeEvent.id &&
              bookmark.slideIndex === activeSlideIndex
            )
        )
      : [
          ...bookmarks,
          { ...currentBookmark, savedAt: new Date().toISOString() },
        ];

    setBookmarks(nextBookmarks);

    try {
      await saveBookmarks(nextBookmarks);
    } catch (err) {
      console.error(err);
      setBookmarks(bookmarks);
    }
  }

  // ── Progress ───────────────────────────────────────────────────────────────

  async function markTimelineComplete() {
    try {
      const headers = await getAuthHeaders();
      await fetch(`${import.meta.env.VITE_API_URL}/users/me/progress`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ timelineId: id }),
      });
    } catch (err) {
      console.error("Could not save progress:", err);
    }
  }

  function handleFinish() {
    if (isLogged && !completedTimelines.has(id)) {
      markTimelineComplete();
      setCompletedTimelines((prev) => new Set([...prev, id]));
    }
    navigate("/deep-dives", { state: { justCompleted: id } });
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  function goToPreviousSlide() {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex((prev) => prev - 1);
      return;
    }
    if (activeEventIndex > 0) {
      const previousEvent = events[activeEventIndex - 1];
      setActiveEventIndex((prev) => prev - 1);
      setActiveSlideIndex((previousEvent.slides || []).length - 1);
    }
  }

  function goToNextSlide() {
    if (activeSlideIndex < slides.length - 1) {
      setActiveSlideIndex((prev) => prev + 1);
      return;
    }
    if (activeEventIndex < events.length - 1) {
      setActiveEventIndex((prev) => prev + 1);
      setActiveSlideIndex(0);
    }
  }

  // ── Guards ─────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <main className="deepdives-info-page">
        <Header />
        <p className="deepdives-info-status">Loading deep dive...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="deepdives-info-page">
        <Header />
        <p className="deepdives-info-status">{error}</p>
      </main>
    );
  }

  if (!activeEvent || !activeSlide) {
    return (
      <main className="deepdives-info-page">
        <Header />
        <p className="deepdives-info-status">No events found.</p>
      </main>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <main className="deepdives-info-page">
      <Header />

      <section className="deepdive-layout">
        <div className="deepdive-topbar">
          <button
            className="deepdive-back-btn"
            type="button"
            onClick={() => navigate("/deep-dives")}
          >
            <ArrowLeft size={18} />
            Back to deep dives
          </button>

          <div className="deepdive-topbar-actions">
            <span className="deepdive-counter">
              Event {activeEventIndex + 1}/{events.length} · Slide{" "}
              {activeSlideIndex + 1}/{slides.length}
            </span>

            {isLogged && (
              <button
                className={`deepdive-bookmark-btn deepdive-bookmark-btn--topbar ${
                  isBookmarked ? "is-bookmarked" : ""
                }`}
                type="button"
                onClick={toggleBookmark}
                aria-label={
                  isBookmarked ? "Remove bookmark" : "Bookmark this slide"
                }
                title={
                  isBookmarked ? "Remove bookmark" : "Bookmark this slide"
                }
              >
                <Bookmark
                  size={17}
                  fill={isBookmarked ? "currentColor" : "none"}
                />
                <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
              </button>
            )}
          </div>
        </div>

        <div className="deepdive-main">
          <section className="deepdive-map-panel">
            <div ref={mapContainerRef} className="deepdive-map" />
          </section>

          <section className="deepdive-content-panel">
            <div className="deepdive-event-meta">
              <span>{activeEvent.year}</span>
              <span>{activeEvent.date}</span>
            </div>

            <h1>{activeEvent.title}</h1>
            <p className="deepdive-subtitle">{activeEvent.sub}</p>

            <div className="deepdive-slide-card">
              {activeSlide.img && (
                <div className="deepdive-slide-image-wrap">
                  <img
                    src={activeSlide.img}
                    alt={activeSlide.cap || activeSlide.title}
                    className="deepdive-slide-image"
                  />
                </div>
              )}

              {activeSlide.cap && (
                <p className="deepdive-slide-caption">{activeSlide.cap}</p>
              )}

              <div className="deepdive-slide-header">
                <h2>{activeSlide.title}</h2>
              </div>

              <p className="deepdive-slide-body">{activeSlide.body}</p>

              {activeSlide.stats && (
                <div className="deepdive-stats">
                  {activeSlide.stats.map((stat, index) => (
                    <div
                      key={`${stat.lbl}-${index}`}
                      className={`deepdive-stat ${
                        stat.full ? "deepdive-stat--full" : ""
                      }`}
                    >
                      <strong>{stat.val}</strong>
                      <span>{stat.lbl}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="deepdive-controls">
              <button
                type="button"
                onClick={goToPreviousSlide}
                disabled={activeEventIndex === 0 && activeSlideIndex === 0}
              >
                <ChevronLeft size={20} />
                Previous
              </button>

              {isLastSlide ? (
                <button
                  type="button"
                  className="deepdive-controls__finish"
                  onClick={handleFinish}
                >
                  Finish
                  <ChevronRight size={20} />
                </button>
              ) : (
                <button type="button" onClick={goToNextSlide}>
                  Next
                  <ChevronRight size={20} />
                </button>
              )}
            </div>

            <div className="deepdive-event-tabs">
              {events.map((event, index) => (
                <button
                  key={event.id}
                  type="button"
                  className={index === activeEventIndex ? "active" : ""}
                  onClick={() => {
                    setActiveEventIndex(index);
                    setActiveSlideIndex(0);
                  }}
                >
                  {event.title}
                </button>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}