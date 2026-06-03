import { useEffect, useMemo, useRef, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { useNavigate, useParams } from "react-router-dom";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  ArrowLeft,
  Bookmark,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Header from "../Components/Header/Header";
import { useAuth } from "../Context/AuthContext";
import "./DeepDivesInfoPage.css";

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
    } catch (_) {}
  }
}

function placeMarkers(map, activeEvent, markersRef) {
  markersRef.current.forEach((m) => m.remove());
  markersRef.current = [];

  activeEvent.markers?.forEach((markerData) => {
    const el = document.createElement("div");
    el.className = `deepdive-map-marker deepdive-map-marker--${
      markerData.type || "minor"
    }`;

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([markerData.latlng[1], markerData.latlng[0]])
      .setPopup(
        new maplibregl.Popup({ offset: 18 }).setText(markerData.label)
      )
      .addTo(map);

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

function placeOverlays(map, activeEvent) {
  ["regions-labels", "regions-outline", "regions-fill"].forEach((id) => {
    try { if (map.getLayer(id)) map.removeLayer(id); } catch (_) {}
  });
  ["regions-labels", "regions"].forEach((id) => {
    try { if (map.getSource(id)) map.removeSource(id); } catch (_) {}
  });

  if (!activeEvent.regions?.length) return;

  try {
    map.addSource("regions", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: activeEvent.regions.map((r) => ({
          type: "Feature",
          properties: {
            color: r.color,
            opacity: r.opacity ?? 0.25,
          },
          geometry: {
            type: "Polygon",
            coordinates: [r.coordinates],
          },
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
        features: activeEvent.regions.map((r) => ({
          type: "Feature",
          properties: {
            label: r.label,
            color: r.color,
          },
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
  } catch (err) {
    console.warn("placeOverlays failed:", err);
  }
}

function applyDateAndOverlays(map, event) {
  try {
    if (map.filterByDate) {
      map.filterByDate(`${event.year}-01-01`);
      map.triggerRepaint();
    }
  } catch (_) {}
  placeOverlays(map, event);
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DeepDivesInfoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLogged } = useAuth();

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const yearRef = useRef(null);

  const [events, setEvents] = useState([]);
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const activeEvent = events[activeEventIndex];
  const slides = activeEvent?.slides || [];
  const activeSlide = slides[activeSlideIndex];
  // at the top of the component, restore this ref:
  const activeEventRef = useRef(null);
  activeEventRef.current = activeEvent ?? null;

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

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/deepdives/${id}`
        );

        if (!response.ok) throw new Error("Could not load this deep dive.");

        const data = await response.json();
        setEvents(data);
        setActiveEventIndex(0);
        setActiveSlideIndex(0);
      } catch (err) {
        console.error(err);
        setError(err.message || "Could not load this deep dive.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDeepDive();
  }, [id]);

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

  // ── Map effect ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!activeEvent || !mapContainerRef.current) return;

    const center = activeEvent.view?.center || [30, 20];
    const zoom = activeEvent.view?.zoom || 3;

    if (!mapRef.current) {
      // ── First load ──────────────────────────────────────────────────────
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

        // Force English labels on every style reload
        map.on("styledata", () => {
          const event = activeEventRef.current;
          if (!event || !map.isStyleLoaded()) return;
          forceEnglishLabels(map);
          applyDateAndOverlays(map, event);
        });

        map.on("load", () => {
          if (disposed) return;
          const event = activeEventRef.current;
          forceEnglishLabels(map);
          if (event) {
            applyDateAndOverlays(map, event);
            placeMarkers(map, event, markersRef);
          }
        });
      })();

      return () => { disposed = true; };

    } else {
      // ── Subsequent events ───────────────────────────────────────────────
      mapRef.current.flyTo({
        center: [center[1], center[0]],
        zoom,
        essential: true,
      });

      placeMarkers(mapRef.current, activeEvent, markersRef);

      // flyTo doesn't trigger styledata, so apply explicitly
      const applyUpdate = () => {
        if (!mapRef.current) return;
        forceEnglishLabels(mapRef.current);
        applyDateAndOverlays(mapRef.current, activeEvent);
      };

      if (mapRef.current.isStyleLoaded()) {
        applyUpdate();
      } else {
        mapRef.current.once("styledata", applyUpdate);
      }
    }
  }, [activeEvent]);

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

          <span className="deepdive-counter">
            Event {activeEventIndex + 1}/{events.length} · Slide{" "}
            {activeSlideIndex + 1}/{slides.length}
          </span>
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

                {isLogged && (
                  <button
                    className={`deepdive-bookmark-btn ${
                      isBookmarked ? "is-bookmarked" : ""
                    }`}
                    type="button"
                    onClick={toggleBookmark}
                    title={
                      isBookmarked ? "Remove bookmark" : "Bookmark this slide"
                    }
                  >
                    <Bookmark
                      size={20}
                      fill={isBookmarked ? "currentColor" : "none"}
                    />
                  </button>
                )}
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

              <button
                type="button"
                onClick={goToNextSlide}
                disabled={
                  activeEventIndex === events.length - 1 &&
                  activeSlideIndex === slides.length - 1
                }
              >
                Next
                <ChevronRight size={20} />
              </button>
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
