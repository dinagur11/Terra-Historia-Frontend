import "./Header.css"
import SearchBar from "./SearchBar";
import LogoImage from "../../assets/logo.png"
import { Link, useNavigate } from "react-router-dom";
import { User, LogIn, LogOut } from "lucide-react";
import { useAuth } from '../../Context/AuthContext';

function Header({isMapActive, onCountrySearch}){
    const { isLogged, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return(
        <div className="header-container"> 
            <div className="header-left">
                <Link to="/" title="home">
                    <img src={LogoImage} className="logo-img"></img>
                </Link>
                <Link to="/map" className="link"><p>Map</p></Link>
                <Link to="/deep-dives" className="link"><p>Deep Dives</p></Link>
            </div>   
            {isMapActive ?
            (<div className="header-center">
                <SearchBar onSearch={onCountrySearch} />
            </div>):
            (<></>)
            }
            <div className="header-right">
                {isLogged ? (
                    <>
                    <Link to="/suggestions" className="link"><p>Suggestion Box</p></Link>
                    <button type="button" className="account-button" title="log out" aria-label="log out" onClick={handleLogout}>
                        <LogOut size={22} />
                    </button>
                    <Link to="/account" className="account-button" title="my account">
                        <User size={22} />
                    </Link>
                    </>
                ) : (
                    <Link to="/login" className="account-button" title="log-in">
                    <LogIn size={22} />
                    </Link>
                )}
            </div>
        </div>
    );
}

export default Header
