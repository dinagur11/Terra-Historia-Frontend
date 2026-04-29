import "./Header.css"
import SearchBar from "./SearchBar";
import LogoImage from "../../assets/logo.png"
import { Link } from "react-router-dom";
import { User, LogIn } from "lucide-react";
import { useAuth } from '../../Context/AuthContext';

function Header({isMapActive}){
    const { isLogged } = useAuth();
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
                <SearchBar />
            </div>):
            (<></>)
            }
            <div className="header-right">
                <div className="header-right">
                    {isLogged ? (
                        <>
                        <Link to="/suggestions" className="link"><p>Suggestion Box</p></Link>
                        <Link to="/account" className="account-button" title="my account">
                            <User size={22} />
                        </Link>
                        </>
                    ) : (
                        <Link to="/login" className="login-button" title="log-in">
                        <LogIn size={22} />
                        </Link>
                    )}
                    </div>
            </div>
        </div>
    );
}

export default Header