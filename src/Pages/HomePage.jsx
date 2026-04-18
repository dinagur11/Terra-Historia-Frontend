import Globe from "../Components/Globe"
import "./HomePage.css"
import { User, LogIn} from "lucide-react";
import { Link } from "react-router-dom";


export default function HomePage(){
    let logged = false;

    return (<>
    {logged ? userLogged() : userNotLogged()}
    <Globe /></>);
}

function userNotLogged(){
    return (<><Link to="/login" className="login-button" title="log-in">
            <LogIn size={22} />
        </Link></>);
}

function userLogged(){
    return (<><Link to="/account" className="account-button" title="my account">
            <User size={22} />
        </Link></>);
}