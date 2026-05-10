import { useEffect, useState } from "react";
import Globe from "../Components/Globe";
import "./HomePage.css";
import { User, LogIn, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserAttributes } from "aws-amplify/auth";
import { useAuth } from '../Context/AuthContext';

const TODAY_EVENT_LIMIT = 9;

export default function HomePage() {
    const [name, setName] = useState("");
    const [todayEvents, setTodayEvents] = useState([]);
    const [todayStatus, setTodayStatus] = useState("loading");
    const navigate = useNavigate();
    const { isLogged, logout } = useAuth();

    useEffect(() => {
        const fetchName = async () => {
            try {
                const attributes = await fetchUserAttributes();
                setName(attributes.name || "User");
            } catch {
                // nothing to do
            }
        };

        if (isLogged) fetchName();
    }, [isLogged]);

    useEffect(() => {
        const controller = new AbortController();
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        const fetchTodayEvents = async () => {
            setTodayStatus("loading");

            try {
                const response = await fetch(
                    `https://en.wikipedia.org/api/rest_v1/feed/onthisday/selected/${month}/${day}`,
                    {
                        signal: controller.signal,
                        headers: {
                            "Api-User-Agent": "Terra-Historia/1.0",
                        },
                    }
                );

                if (!response.ok) throw new Error("Could not load today's events");

                const data = await response.json();
                setTodayEvents((data.selected || []).slice(0, TODAY_EVENT_LIMIT));
                setTodayStatus("ready");
            } catch (err) {
                if (err.name === "AbortError") return;
                setTodayStatus("error");
            }
        };

        fetchTodayEvents();

        return () => controller.abort();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setName("");
            navigate("/");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <>
            {isLogged ? userLogged(handleLogout) : userNotLogged()}

            {isLogged && (
                <div className="hello-text">
                    Hello, {name}
                </div>
            )}

            <TodaySection events={todayEvents} status={todayStatus} />
            <Globe />
        </>
    );
}

function TodaySection({ events, status }) {
    return (
        <aside className="today-section" aria-label="Today in history">
            <div className="today-section__header">
                <span>Today {new Date().toLocaleDateString()}</span>
                <h2>On This Day</h2>
            </div>

            {status === "loading" && (
                <p className="today-section__message">Loading historical moments...</p>
            )}

            {status === "error" && (
                <p className="today-section__message">Today&apos;s history could not be loaded.</p>
            )}

            {status === "ready" && (
                <ol className="today-section__list">
                    {events.map((event) => {
                        const page = event.pages?.[0];
                        const href = page?.content_urls?.desktop?.page;

                        return (
                            <li key={`${event.year}-${event.text}`} className="today-section__event">
                                <span className="today-section__year">{event.year}</span>
                                <p>{event.text}</p>
                                {href && (
                                    <a href={href} target="_blank" rel="noreferrer">
                                        Read more
                                    </a>
                                )}
                            </li>
                        );
                    })}
                </ol>
            )}
        </aside>
    );
}

function userNotLogged() {
    return (
        <Link to="/login" className="login-button" title="log-in">
            <LogIn size={22} />
        </Link>
    );
}

function userLogged(handleLogout) {
    return (
        <>
            <Link to="/account" className="header-account-btn" title="my account">
                <User size={22} />
            </Link>

            <button className="logout-button" title="log out" onClick={handleLogout}>
                <LogOut size={22} />
            </button>
        </>
    );
}
