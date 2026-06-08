import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  fetchAuthSession,
  fetchUserAttributes,
  updatePassword,
} from "aws-amplify/auth";
import Header from "../Components/Header/Header";
import { useAuth } from "../Context/AuthContext";
import "./UserPage.css";

export default function UserPage() {
  const { isLogged, isAuthReady } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [savedBookmarks, setSavedBookmarks] = useState([]);
  const [savedBookmarksError, setSavedBookmarksError] = useState("");
  const [isBookmarksLoading, setIsBookmarksLoading] = useState(false);
  const [completedTimelines, setCompletedTimelines] = useState([]);
  const [isProgressLoading, setIsProgressLoading] = useState(false);
  const [progressError, setProgressError] = useState("");
  const [activeProgressSection, setActiveProgressSection] = useState(null); 

  function toggleSection(section) {
    setActiveProgressSection((current) => (current === section ? null : section));
  }

  useEffect(() => {
    if (!isLogged) return;

    fetchUserAttributes()
      .then((attributes) => {
        setEmail(attributes.email || "");
      })
      .catch(() => {
        setEmail("");
      });
  }, [isLogged]);

  useEffect(() => {
    if (!isLogged) return;

    setIsBookmarksLoading(true);

    fetchUserBookmarks()
      .then(setSavedBookmarks)
      .catch(() => {
        setSavedBookmarksError("Saved bookmarks could not be loaded.");
      })
      .finally(() => {
        setIsBookmarksLoading(false);
      });
  }, [isLogged]);

  useEffect(() => {
    if (!isLogged) return;

    setIsProgressLoading(true);

    fetchUserProgress()
      .then((timelineProgress) => {
        const completed = Object.keys(timelineProgress).filter(
          (k) => timelineProgress[k]
        );
        setCompletedTimelines(completed);
      })
      .catch(() => {
        setProgressError("Progress could not be loaded.");
      })
      .finally(() => {
        setIsProgressLoading(false);
      });
  }, [isLogged]);

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsChangingPassword(true);

    try {
      await updatePassword({ oldPassword, newPassword });
      setOldPassword("");
      setNewPassword("");
      setShowPasswordForm(false);
      setMessage("Password updated successfully.");
    } catch (err) {
      setError(err.message || "Could not update password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="user-page">
        <Header isMapActive={false} />
      </div>
    );
  }

  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="user-page">
      <Header isMapActive={false} />

      <main className="user-page__body">
        <section className="user-page__panel">
          <p className="user-page__eyebrow">My Account</p>
          <h1 className="user-page__title">Account Details</h1>
          <p className="user-page__subtitle">
            Manage your Terra Historia profile and account settings.
          </p>

          <div className="user-page__divider" />

          <div className="user-page__info">
            <span className="user-page__label">Email address</span>
            <span className="user-page__value">{email || "Loading..."}</span>
          </div>

          <div className="user-page__divider" />

          <div className="user-page__actions">
            <button
              type="button"
              className="user-page__button"
              onClick={() => {
                setShowPasswordForm((current) => !current);
                setMessage("");
                setError("");
              }}
            >
              Change Password
            </button>

            <button
              type="button"
              className="user-page__button"
              onClick={() => navigate("/suggestions")}
            >
              My Suggestions
            </button>
          </div>

          {showPasswordForm && (
            <>
              <div className="user-page__divider" />

              <form
                className="user-page__password-form"
                onSubmit={handlePasswordChange}
              >
                <label className="user-page__label" htmlFor="old-password">
                  Current password
                </label>
                <input
                  id="old-password"
                  className="user-page__input"
                  type="password"
                  value={oldPassword}
                  onChange={(event) => setOldPassword(event.target.value)}
                  required
                />

                <label className="user-page__label" htmlFor="new-password">
                  New password
                </label>
                <input
                  id="new-password"
                  className="user-page__input"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  required
                />

                <button
                  type="submit"
                  className="user-page__button user-page__button--primary"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </button>
              </form>
            </>
          )}

          {message && <p className="user-page__message">{message}</p>}
          {error && (
            <p className="user-page__message user-page__message--error">
              {error}
            </p>
          )}
        </section>

        <section className="user-page__progress">
          <p className="user-page__eyebrow">Progress</p>
          <h2 className="user-page__title">Your Journey</h2>
          <p className="user-page__subtitle">
            A larger space for saved eras, explored timelines, achievements, or
            learning progress.
          </p>

          <div className="user-page__progress-grid">
            <div className="user-page__stat">
              <button
                type="button"
                className="user-page__stat-button"
                onClick={() => toggleSection("bookmarks")}>              
                <span className="user-page__stat-value">
                  {savedBookmarks.length}
                </span>
                <span className="user-page__stat-label">Saved bookmarks</span>
              </button>
            </div>

            <div className="user-page__stat">
              <button
                type="button"
                className="user-page__stat-button"
                onClick={() => toggleSection("dives")}>
                <span className="user-page__stat-value">
                  {isProgressLoading ? "—" : completedTimelines.length}
                </span>
                <span className="user-page__stat-label">Deep dives completed</span>
              </button>
            </div>
          </div>

          {savedBookmarksError && (
            <p className="user-page__message user-page__message--error">
              {savedBookmarksError}
            </p>
          )}

          {progressError && (
            <p className="user-page__message user-page__message--error">
              {progressError}
            </p>
          )}

          {activeProgressSection === "bookmarks" && (
            <div className="user-page__saved-dives">
              {isBookmarksLoading ? (
                <div className="user-page__progress-empty">
                  Loading saved bookmarks...
                </div>
              ) : savedBookmarks.length ? (
                savedBookmarks.map((bookmark, index) => (
                  <button
                    key={`${bookmark.timelineId}-${bookmark.eventId}-${bookmark.slideIndex}-${index}`}
                    type="button"
                    className="user-page__saved-dive-card"
                    onClick={() =>
                      navigate(`/deepdives/${bookmark.timelineId}`, {
                        state: {
                          eventId: bookmark.eventId,
                          slideIndex: bookmark.slideIndex,
                        },
                      })
                    }
                  >
                    <span className="user-page__saved-dive-years">
                      {bookmark.slideTitle}
                    </span>

                    <strong>{bookmark.eventTitle}</strong>

                    <span className="user-page__saved-dive-meta">
                      <span />
                      {bookmark.savedAt
                        ? `Saved ${new Date(bookmark.savedAt).toLocaleDateString()}`
                        : "Saved bookmark"}
                    </span>
                  </button>
                ))
              ) : (
                <div className="user-page__progress-empty">
                  No saved bookmarks yet.
                </div>
              )}
            </div>
          )}

          {activeProgressSection === "dives" && (
            <div className="user-page__saved-dives">
              {isProgressLoading ? (
                <div className="user-page__progress-empty">
                  Loading progress...
                </div>
              ) : completedTimelines.length ? (
                completedTimelines.map((timelineId) => (
                  <div
                    key={timelineId}
                    className="user-page__saved-dive-card user-page__saved-dive-card--static"
                  >
                    <strong>{timelineId}</strong>
                    <span className="user-page__saved-dive-meta">
                      Completed
                    </span>
                  </div>
                ))
              ) : (
                <div className="user-page__progress-empty">
                  No deep dives completed yet.
                </div>
              )}
            </div>
          )}
        </section>
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

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/users/me/bookmarks`,
    { headers }
  );

  if (!response.ok) {
    throw new Error("Could not load bookmarks");
  }

  const data = await response.json();
  return data.deepDiveBookmarks || [];
}

async function fetchUserProgress() {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/users/me/progress`,
    { headers }
  );

  if (!response.ok) {
    throw new Error("Could not load progress");
  }

  const data = await response.json();
  return data.timelineProgress || {};
}
