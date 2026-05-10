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

export default function DeepDivesInfoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLogged } = useAuth();

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const [events, setEvents] = useState([]);
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const activeEvent = events[activeEventIndex];
  const slides = activeEvent?.slides || [];
  const activeSlide = slides[activeSlideIndex];

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

  async function getAuthHeaders() {
    const session = await fetchAuthSession();
    const token = session.tokens?.accessToken?.toString();

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  useEffect(() => {
    async function loadDeepDive() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/deepdives/${id}`
        );

        if (!response.ok) {
          throw new Error("Could not load this deep dive.");
        }

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

        if (!response.ok) {
          throw new Error("Could not load bookmarks.");
        }

        const data = await response.json();
        setBookmarks(data.deepDiveBookmarks || []);
      } catch (err) {
        console.error(err);
      }
    }

    loadBookmarks();
  }, [isLogged]);

  useEffect(() => {
    if (!activeEvent || !mapContainerRef.current) return;

    const center = activeEvent.view?.center || [30, 20];
    const zoom = activeEvent.view?.zoom || 3;

    if (!mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style: "https://demotiles.maplibre.org/style.json",
        center: [center[1], center[0]],
        zoom,
      });

      mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");
    } else {
      mapRef.current.flyTo({
        center: [center[1], center[0]],
        zoom,
        essential: true,
      });
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    activeEvent.markers?.forEach((markerData) => {
      const el = document.createElement("div");
      el.className = `deepdive-map-marker deepdive-map-marker--${
        markerData.type || "minor"
      }`;

      const marker = new maplibregl.Marker(el)
        .setLngLat([markerData.latlng[1], markerData.latlng[0]])
        .setPopup(new maplibregl.Popup({ offset: 18 }).setText(markerData.label))
        .addTo(mapRef.current);

      markersRef.current.push(marker);
    });
  }, [activeEvent]);

  useEffect(() => {
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

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

    if (!response.ok) {
      throw new Error("Could not update bookmarks.");
    }

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
          {
            ...currentBookmark,
            savedAt: new Date().toISOString(),
          },
        ];

    setBookmarks(nextBookmarks);

    try {
      await saveBookmarks(nextBookmarks);
    } catch (err) {
      console.error(err);
      setBookmarks(bookmarks);
    }
  }

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

  return (
    <main className="deepdives-info-page">
      <Header />

      <section className="deepdive-layout">
        <div className="deepdive-topbar">
          <button
            className="deepdive-back-btn"
            type="button"
            onClick={() => navigate("/deepdives")}
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