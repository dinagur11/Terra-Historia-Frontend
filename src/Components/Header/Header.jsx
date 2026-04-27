import "./Header.css"
import SearchBar from "./SearchBar";
import LogoImage from "../../assets/logo.png"
import { Link } from "react-router-dom";
import { User } from "lucide-react";

function Header(){
    return(
        <div className="header-container"> 
            <div className="header-left">
                <Link to="/" title="home">
                    <img src={LogoImage} className="logo-img"></img>
                </Link>
                <Link to="/map" className="link"><p>Map</p></Link>
                <Link to="/deep-dives" className="link"><p>Deep Dives</p></Link>
            </div>   
            <div className="header-center">
                <SearchBar />
            </div>
            <div className="header-right">
                <Link to="/suggestions" className="link"><p>Suggestion Box</p></Link>
                <Link to="/account" className="account-button" title="my account">
                    <User size={22} />
                </Link>
            </div>
        </div>
    );
}

export default Header