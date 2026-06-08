import { useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Navigate } from "react-router-dom";

import Header from "../Components/Header/Header";
import { useAuth } from "../Context/AuthContext";
import "./SuggestionPage.css";

const EMPTY_FORM = {
  title: "",
  date: "",
  message: "",
  link: "",
};

export default function SuggestionPage() {
  const { isLogged, isAuthReady } = useAuth();
  const [selection, setSelection] = useState("event");
  const [form, setForm] = useState(EMPTY_FORM);
  const [suggestions, setSuggestions] = useState([]);
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLogged) return;

    loadSuggestions()
      .then((data) => {
        setSuggestions(data.suggestions || []);
        setIsDeveloper(Boolean(data.isDeveloper));
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [isLogged]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const suggestion = await createSuggestion({
        type: selection,
        ...form,
      });
      setSuggestions((current) => [suggestion, ...current]);
      setForm(EMPTY_FORM);
      setMessage("Suggestion submitted successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (userId, suggestionId, status) => {
    try {
      await updateSuggestionStatus(userId, suggestionId, status);
      setSuggestions((current) =>
        current.map((s) =>
          s.suggestionId === suggestionId ? { ...s, status } : s
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  async function updateSuggestionStatus(userId, suggestionId, status) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/suggestions/${userId}/${suggestionId}/status`,
      {
        method: "PATCH",
        headers: await getAuthHeaders(),
        body: JSON.stringify({ status }),
      }
    );
    if (!response.ok) throw new Error("Could not update suggestion status.");
    return response.json();
  }

  if (!isAuthReady) return null;
  if (!isLogged) return <Navigate to="/login" replace />;

  return (
    <div className="suggestion-page">
      <Header isMapActive={false} />

      <main className="suggestion-page__body">
        <form className="suggestion-page__card" onSubmit={handleSubmit}>
          <p className="suggestion-page__eyebrow">Community feedback</p>
          <h1 className="suggestion-page__title">Send a suggestion</h1>
          <p className="suggestion-page__subtitle">
            Report a mistake, suggest a missing event, or share an idea. You
            can track your submitted requests below.
          </p>
          <div className="suggestion-page__divider" />

          <Select
            value={selection}
            onChange={(event) => setSelection(event.target.value)}
            size="small"
            fullWidth
            sx={{
              fontFamily: "Raleway, sans-serif",
              fontSize: "0.8rem",
              color: "#e8e0d0",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.12)",
              },
              "& .MuiSvgIcon-root": { color: "#c9a227" },
            }}
          >
            <MenuItem value="event">Suggest a missing event</MenuItem>
            <MenuItem value="mistake">Correct a mistake</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>

          <div className="suggestion-form">
            {selection === "event" && (
              <>
                <SuggestionField label="Event name">
                  <input
                    className="suggestion-form__input"
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    placeholder="e.g. Battle of Hastings"
                    required
                  />
                </SuggestionField>
                <SuggestionField label="Event date">
                  <input
                    className="suggestion-form__input"
                    value={form.date}
                    onChange={(event) => updateField("date", event.target.value)}
                    placeholder="e.g. 1066"
                  />
                </SuggestionField>
              </>
            )}

            {selection === "mistake" && (
              <SuggestionField label="Relevant link">
                <input
                  className="suggestion-form__input"
                  type="url"
                  value={form.link}
                  onChange={(event) => updateField("link", event.target.value)}
                  placeholder="https://..."
                />
              </SuggestionField>
            )}

            <SuggestionField
              label={
                selection === "event"
                  ? "Event description"
                  : selection === "mistake"
                    ? "What should be corrected?"
                    : "Tell us more"
              }
            >
              <textarea
                className="suggestion-form__textarea suggestion-form__textarea--tall"
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                placeholder="Describe your suggestion..."
                required
              />
            </SuggestionField>
          </div>

          <button
            className="suggestion-page__submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit suggestion"}
          </button>

          {message && <p className="suggestion-page__message">{message}</p>}
          {error && (
            <p className="suggestion-page__message suggestion-page__message--error">
              {error}
            </p>
          )}
        </form>

        <section className="suggestion-history">
          <p className="suggestion-page__eyebrow">
            {isDeveloper ? "Developer inbox" : "My requests"}
          </p>
          <h2>{isDeveloper ? "All suggestions" : "Submitted suggestions"}</h2>

          {isLoading ? (
            <p className="suggestion-history__empty">Loading suggestions...</p>
          ) : suggestions.length ? (
            <div className="suggestion-history__list">
              {suggestions.map((suggestion) => (
                <article
                  className="suggestion-history__item"
                  key={suggestion.suggestionId}
                >
                  <div className="suggestion-history__meta">
                    <span>{suggestion.type}</span>
                    <span className={`status status--${suggestion.status}`}>
                      {suggestion.status}
                    </span>
                  </div>
                  <h3>{suggestion.title || suggestion.type}</h3>
                  <p>{suggestion.message}</p>
                  {suggestion.link && (
                    <a href={suggestion.link} target="_blank" rel="noreferrer">
                      View related link
                    </a>
                  )}
                  <small>
                    {isDeveloper
                      ? `${suggestion.userName || suggestion.userEmail || "Unknown user"} · `
                      : ""}
                    {new Date(suggestion.createdAt).toLocaleString()}
                  </small>

                  {isDeveloper && suggestion.status === "pending" && (
                    <div className="suggestion-history__actions">
                      <button
                        className="suggestion-page__submit suggestion-page__submit--accept"
                        onClick={() => handleStatusUpdate(suggestion.userId, suggestion.suggestionId, "accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="suggestion-page__submit suggestion-page__submit--decline"
                        onClick={() => handleStatusUpdate(suggestion.userId, suggestion.suggestionId, "declined")}
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="suggestion-history__empty">
              No suggestions submitted yet.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

function SuggestionField({ label, children }) {
  return (
    <label className="suggestion-form__field">
      <span className="suggestion-form__label">{label}</span>
      {children}
    </label>
  );
}

async function getAuthHeaders() {
  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken?.toString();
  if (!token) throw new Error("Missing authentication token.");

  return {
    Authorization: `Bearer ${token}`,
    "X-Cognito-Id-Token": session.tokens?.idToken?.toString() || "",
    "Content-Type": "application/json",
  };
}

async function loadSuggestions() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/suggestions`, {
    headers: await getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Could not load suggestions.");
  return response.json();
}

async function createSuggestion(suggestion) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/suggestions`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(suggestion),
  });
  if (!response.ok) throw new Error("Could not submit suggestion.");
  return response.json();
}
