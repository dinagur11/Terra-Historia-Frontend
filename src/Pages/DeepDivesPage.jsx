import { useEffect, useMemo, useRef, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { ArrowLeft, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import EventMapScene from "../Components/DeepDives/EventMapScene";
import Header from "../Components/Header/Header";
import { useAuth } from "../Context/AuthContext";
import { DEEP_DIVES } from "../data/deepDives.js";
import "./DeepDivesPage.css";

function getProgressDots(count, color) {
  return Array.from({ length: 5 }, (_, index) => (
    <span key={index} className="deep-dives__dot" style={{ backgroundColor: index < Math.min(count, 5) ? color : "rgba(122,112,96,0.35)" }} />
  ));
}

export default function DeepDivesPage() {
  const location = useLocation();
  const [selectedDiveId, setSelectedDiveId] = useState(location.state?.deepDiveId || null);
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [savedDiveIds, setSavedDiveIds] = useState([]);
  const [bookmarkError, setBookmarkError] = useState("");
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const pageRef = useRef(null);
  const eventCopyRef = useRef(null);
  const { isLogged } = useAuth();
  const selectedDive = useMemo(
    () => DEEP_DIVES.find((dive) => dive.id === selectedDiveId) || null,
    [selectedDiveId]
  );
  const activeEvent = selectedDive?.events[activeEventIndex];
  const isSelectedDiveSaved = selectedDive ? savedDiveIds.includes(selectedDive.id) : false;

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
    setActiveEventIndex(0);
  };

  const moveEvent = (amount) => {
    if (!selectedDive) return;
    setActiveEventIndex((current) => {
      const next = current + amount;
      if (next < 0) return 0;
      if (next >= selectedDive.events.length) return selectedDive.events.length - 1;
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
        {!selectedDive ? (
          <>
            <section className="deep-dives__intro">
              <h1>Deep Dives</h1>
              <p>Choose a historical arc to explore in full, event by event, cause by cause.</p>
            </section>

            <section className="deep-dives__grid">
              {DEEP_DIVES.map((dive) => (
                <button
                  key={dive.id}
                  type="button"
                  className="deep-dives__card"
                  onClick={() => openDive(dive.id)}
                >
                  <span className="deep-dives__years">{dive.years}</span>
                  <strong>
                    {dive.title}
                    <span>{dive.subtitle}</span>
                  </strong>
                  <p>{dive.summary}</p>
                  <span className="deep-dives__meta">
                    <span className="deep-dives__small-dot" style={{ backgroundColor: dive.color }} />
                    {dive.eventCount} key events
                    <span className="deep-dives__dots">{getProgressDots(dive.events.length, dive.color)}</span>
                  </span>
                </button>
              ))}
            </section>
          </>
        ) : (
          <section className="deep-dive-reader">
            <div className="deep-dive-reader__header">
              <button type="button" className="deep-dive-reader__back" onClick={() => setSelectedDiveId(null)}>
                <ArrowLeft size={17} />
                Deep Dives
              </button>
              <div>
                <span>{selectedDive.years}</span>
                <h1>{selectedDive.title}: {selectedDive.subtitle}</h1>
              </div>
              <button
                type="button"
                className={`deep-dive-reader__bookmark${isSelectedDiveSaved ? " deep-dive-reader__bookmark--saved" : ""}`}
                onClick={toggleBookmark}
                disabled={!isLogged || isBookmarkLoading}
                title={isLogged ? "Save this deep dive" : "Log in to bookmark deep dives"}
              >
                <Bookmark size={17} fill={isSelectedDiveSaved ? "currentColor" : "none"} />
                {isBookmarkLoading ? "Saving..." : isSelectedDiveSaved ? "Bookmarked" : "Bookmark"}
              </button>
            </div>
            {bookmarkError && <p className="deep-dive-reader__bookmark-error">{bookmarkError}</p>}

            <div className="deep-dive-reader__layout">
              <aside className="deep-dive-reader__rail">
                {selectedDive.events.map((event, index) => (
                  <button
                    key={event.title}
                    type="button"
                    className={`deep-dive-reader__step${index === activeEventIndex ? " deep-dive-reader__step--active" : ""}`}
                    onClick={() => setActiveEventIndex(index)}
                  >
                    <span>{index + 1}</span>
                    <strong>{event.title}</strong>
                    <small>{event.date}</small>
                  </button>
                ))}
              </aside>

              <article className="deep-dive-reader__event">
                <EventMapScene event={activeEvent} color={selectedDive.color} />

                <div className="deep-dive-reader__event-body">
                  <div className="deep-dive-reader__event-copy" ref={eventCopyRef}>
                    <span className="deep-dive-reader__date">{activeEvent.date}</span>
                    <h2>{activeEvent.title}</h2>
                    <p>{activeEvent.text}</p>
                    {activeEvent.details?.length ? (
                      <div className="deep-dive-reader__details">
                        {activeEvent.details.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    ) : null}
                    <div className="deep-dive-reader__consequence">
                      <span>Why it matters</span>
                      <p>{activeEvent.consequence}</p>
                    </div>
                  </div>
                  <div className={`deep-dive-reader__image-slot${activeEvent.image?.layout ? ` deep-dive-reader__image-slot--${activeEvent.image.layout}` : ""}`}>
                    {activeEvent.image ? (
                      <>
                        <img src={activeEvent.image.src} alt={activeEvent.image.alt} />
                        <span>{activeEvent.image.caption}</span>
                      </>
                    ) : (
                      <span>PNG image slot</span>
                    )}
                  </div>
                </div>

                <div className="deep-dive-reader__controls">
                  <button type="button" onClick={() => moveEvent(-1)} disabled={activeEventIndex === 0}>
                    <ChevronLeft size={18} />
                    Previous
                  </button>
                  <span>{activeEventIndex + 1} / {selectedDive.events.length}</span>
                  <button type="button" onClick={() => moveEvent(1)} disabled={activeEventIndex === selectedDive.events.length - 1}>
                    Next
                    <ChevronRight size={18} />
                  </button>
                </div>
              </article>
            </div>
          </section>
        )}
      </main>
    </div>
  );
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
  const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me/bookmarks`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Could not load bookmarks");
  }

  const data = await response.json();
  return data.deepDiveBookmarks || [];
}

async function saveUserBookmarks(deepDiveBookmarks) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me/bookmarks`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ deepDiveBookmarks }),
  });

  if (!response.ok) {
    throw new Error("Could not save bookmarks");
  }

  const data = await response.json();
  return data.deepDiveBookmarks || [];
}
