import { useEffect, useState } from "react";
import Globe from "../Components/Globe";
import "./HomePage.css";
import { User, LogIn, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, signOut, fetchUserAttributes } from "aws-amplify/auth";

export default function HomePage() {
    const [logged, setLogged] = useState(false);
    const [name, setName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            try {
                await getCurrentUser();
                setLogged(true);

                const attributes = await fetchUserAttributes();
                setName(attributes.name || "User");
            } catch (err) {
                console.error("Auth check failed:", err);
                setLogged(false);
            }
        };

        checkUser();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut();
            setLogged(false);
            setName("");
            navigate("/");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <>
            {logged ? userLogged(handleLogout) : userNotLogged()}

            {logged && (
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
            <Link to="/account" className="account-button" title="my account">
                <User size={22} />
            </Link>

            <button className="logout-button" title="log out" onClick={handleLogout}>
                <LogOut size={22} />
            </button>
        </>
    );
}