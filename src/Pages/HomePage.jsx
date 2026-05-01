import { useEffect, useState } from "react";
import Globe from "../Components/Globe";
import "./HomePage.css";
import { User, LogIn, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserAttributes, signOut } from "aws-amplify/auth";
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { isLogged } = useAuth();

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

    const handleLogout = async () => {
        try {
            await signOut();
            setName("");
            logout();
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

            <Globe />
        </>
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