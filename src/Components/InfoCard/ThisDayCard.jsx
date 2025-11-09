import React, { useEffect, useState } from "react";
import "./ThisDayCard.css";

export default function ThisDayCard({ language = "en", limit = 3 }) {
  const [events, setEvents] = useState([]);
  const [dateLabel, setDateLabel] = useState("");

  useEffect(() => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    setDateLabel(today.toLocaleDateString(undefined, { month: "long", day: "numeric" }));

    async function fetchEvents() {
      try {
        const res = await fetch(
          `https://api.wikimedia.org/feed/v1/wikipedia/${language}/onthisday/all/${month}/${day}`
        );
        if (!res.ok) throw new Error("Network error");
        const data = await res.json();

        // Merge and trim to first few events
        const all = [...(data.events || [])].slice(0, limit);
        setEvents(all);
      } catch (e) {
        console.error(e);
      }
    }

    fetchEvents();
  }, [language, limit]);

  return (
    <div className="on-this-day-card">
      <h3>On This Day: {dateLabel}</h3>
      {events.length ? (
        <ul className="event-list">
          {events.map((ev, i) => (
            <li key={i} className="event-item">
              <strong>{ev.year}</strong> — {ev.text}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading events...</p>
      )}
    </div>
  );
}
