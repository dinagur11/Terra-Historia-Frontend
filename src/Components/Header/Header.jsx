import "./Header.css"
import SearchBar from "./SearchBar";
import LogoImage from "../../assets/logo.png"
import { Link } from "react-router-dom";

function Header(){
    return(
        <div className="header-container"> 
            <div className="header-left">
                <img src={LogoImage} className="logo-img"></img>
                <Link to="/" className="link"><p>Home</p></Link>
                <Link to="/map" className="link"><p>Map</p></Link>
            </div>   
            <div className="header-center">
                <SearchBar />
            </div>
            <div className="header-right">
                <p>hi</p>
            </div>
        </div>
    );
}

export default Header