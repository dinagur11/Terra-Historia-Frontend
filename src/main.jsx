import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./amplify-config";
import { AuthProvider } from './Context/AuthContext';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

/*
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { ArrowLeft, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import EventMapScene from "../Components/DeepDives/EventMapScene";
import Header from "../Components/Header/Header";
import { useAuth } from "../Context/AuthContext";
import WWIIDeepDive from "../Components/DeepDives/WWIIDeepDive";
import "./DeepDivesPage.css";

const DEFAULT_DIVE_COLOR = "#c9a227";

const DEEP_DIVE_COMPONENTS = {
  "wwii-events": WWIIDeepDive,
  "wwi-events": null, // Placeholder for future deep dive component
};

function getProgressDots(count, color) {
  return Array.from({ length: 5 }, (_, index) => (
    <span
      key={index}
      className="deep-dives__dot"
      style={{
        backgroundColor:
          index < Math.min(count, 5) ? color : "rgba(122,112,96,0.35)",
      }}
    />
  ));
}

export default function DeepDivesPage() {
  const location = useLocation();

  const [deepDiveIndex, setDeepDiveIndex] = useState([]);
  const [selectedDiveId, setSelectedDiveId] = useState(
    location.state?.deepDiveId || null
  );
  const [selectedDive, setSelectedDive] = useState(null);
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  const [isIndexLoading, setIsIndexLoading] = useState(true);
  const [isDiveLoading, setIsDiveLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [savedDiveIds, setSavedDiveIds] = useState([]);
  const [bookmarkError, setBookmarkError] = useState("");
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  const pageRef = useRef(null);
  const eventCopyRef = useRef(null);

  const { isLogged } = useAuth();

  const activeEvent = selectedDive?.events?.[activeEventIndex] || null;

  const selectedDiveColor = useMemo(
    () => getDiveColor(selectedDive?.id || selectedDiveId),
    [selectedDive?.id, selectedDiveId]
  );

  const isSelectedDiveSaved = selectedDive
    ? savedDiveIds.includes(selectedDive.id)
    : false;

  useEffect(() => {
    async function loadDeepDiveIndex() {
      setLoadError("");
      setIsIndexLoading(true);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/deepdives`
        );

        if (!response.ok) {
          throw new Error("Could not load deep dives.");
        }

        const data = await response.json();
        setDeepDiveIndex(data);
      } catch (err) {
        console.error(err);
        setLoadError("Deep dives could not be loaded.");
      } finally {
        setIsIndexLoading(false);
      }
    }

    loadDeepDiveIndex();
  }, []);

  useEffect(() => {
    if (!selectedDiveId) {
      setSelectedDive(null);
      return;
    }

    async function loadSelectedDive() {
      setLoadError("");
      setIsDiveLoading(true);
      setActiveEventIndex(0);

      try {
        const response = await `fetch(
          `${import.meta.env.VITE_API_URL}/deepdives/${selectedDiveId}``
        );

        if (!response.ok) {
          throw new Error("Could not load selected deep dive.");
        }

        const data = await response.json();
        const normalizedDive = Array.isArray(data)
          ? {
              id: selectedDiveId,
              title: formatDiveTitle(selectedDiveId),
              years: "1939 – 1945",
              events: data.map((event) => {
                const firstSlide = event.slides?.[0];

                return {
                  ...event,
                  text: firstSlide?.body || "",
                  details: event.slides?.slice(1).map((slide) => slide.body) || [],
                  consequence: event.sub || "",
                  image: firstSlide?.img
                    ? {
                        src: firstSlide.img,
                        alt: firstSlide.title || event.title,
                        caption: firstSlide.cap || "",
                      }
                    : null,
                };
              }),
            }
          : data;

        setSelectedDive(normalizedDive);
      } catch (err) {
        console.error(err);
        setLoadError("Selected deep dive could not be loaded.");
        setSelectedDive(null);
      } finally {
        setIsDiveLoading(false);
      }
    }

    loadSelectedDive();
  }, [selectedDiveId]);

  useEffect(() => {
    pageRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    eventCopyRef.current?.scrollTo({ top: 0 });
  }, [selectedDiveId, activeEventIndex]);

  useEffect(() => {
    if (!isLogged) {
      setSavedDiveIds([]);
      return;
    }

    fetchUserBookmarks()
      .then(setSavedDiveIds)
      .catch(() => {
        setBookmarkError("Bookmarks could not be loaded.");
        setSavedDiveIds([]);
      });
  }, [isLogged]);

  const openDive = (id) => {
    setSelectedDiveId(id);
  };

  const closeDive = () => {
    setSelectedDiveId(null);
    setSelectedDive(null);
    setActiveEventIndex(0);
    setLoadError("");
  };

  const moveEvent = (amount) => {
    if (!selectedDive?.events?.length) return;

    setActiveEventIndex((current) => {
      const next = current + amount;

      if (next < 0) return 0;
      if (next >= selectedDive.events.length) {
        return selectedDive.events.length - 1;
      }

      return next;
    });
  };

  const toggleBookmark = async () => {
    if (!isLogged || !selectedDive || isBookmarkLoading) return;

    setBookmarkError("");
    setIsBookmarkLoading(true);

    const nextBookmarks = savedDiveIds.includes(selectedDive.id)
      ? savedDiveIds.filter((id) => id !== selectedDive.id)
      : [...savedDiveIds, selectedDive.id];

    try {
      const savedBookmarks = await saveUserBookmarks(nextBookmarks);
      setSavedDiveIds(savedBookmarks);
    } catch {
      setBookmarkError("Bookmark could not be saved.");
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  return (
  <div className="deep-dives-page" ref={pageRef}>
    <Header isMapActive={false} />

    <main className="deep-dives">
      {!selectedDiveId ? (
        <>
          <section className="deep-dives__intro">
            <h1>Deep Dives</h1>
            <p>
              Choose a historical arc to explore in full, event by event,
              cause by cause.
            </p>
          </section>

          {isIndexLoading ? (
            <p className="deep-dives__status">Loading deep dives...</p>
          ) : loadError ? (
            <p className="deep-dives__error">{loadError}</p>
          ) : (
            <section className="deep-dives__grid">
              {deepDiveIndex.map((dive) => {
                const color = getDiveColor(dive.id);

                return (
                  <button
                    key={dive.id}
                    type="button"
                    className="deep-dives__card"
                    onClick={() => openDive(dive.id)}
                  >
                    <span className="deep-dives__years">
                      {dive.years || "Deep Dive"}
                    </span>

                    <strong>
                      {dive.title || formatDiveTitle(dive.id)}
                      {dive.subtitle && <span>{dive.subtitle}</span>}
                    </strong>

                    {dive.summary && <p>{dive.summary}</p>}

                    <span className="deep-dives__meta">
                      <span
                        className="deep-dives__small-dot"
                        style={{ backgroundColor: color }}
                      />

                      {dive.eventCount
                        ? `${dive.eventCount} key events`
                        : "Open deep dive"}

                      {dive.eventCount ? (
                        <span className="deep-dives__dots">
                          {getProgressDots(dive.eventCount, color)}
                        </span>
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </section>
          )}
        </>
      ) : (
        <section className="deep-dives__selected">
          {(() => {
            const DiveComponent = DEEP_DIVE_COMPONENTS[selectedDiveId];

            if (!DiveComponent) {
              return (
                <p className="deep-dives__error">
                  Deep dive component not found.
                </p>
              );
            }

            return (
              <DiveComponent
                deepDiveId={selectedDiveId}
                onBack={closeDive}
              />
            );
          })()}
        </section>
      )}
    </main>
  </div>
);}

function formatDiveTitle(id) {
  return id
    .split("-")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

async function getAuthHeaders() {
  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken?.toString();

  if (!token) {
    throw new Error("Missing auth token");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function fetchUserBookmarks() {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/users/me/bookmarks`,
    {
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Could not load bookmarks");
  }

  const data = await response.json();
  return data.deepDiveBookmarks || [];
}

async function saveUserBookmarks(deepDiveBookmarks) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/users/me/bookmarks`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({ deepDiveBookmarks }),
    }
  );

  if (!response.ok) {
    throw new Error("Could not save bookmarks");
  }

  const data = await response.json();
  return data.deepDiveBookmarks || [];
}
*/