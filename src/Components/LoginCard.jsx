import "./LoginCard.css"
import facebookLogo from "../assets/facebooklogo.png"
import googleLogo from "../assets/googlelogo.png"
import { Link } from "react-router-dom";
import PasswordInput from "./PasswordInput.jsx";

function LoginCard(){
    return (<>
    <div className="login-card">
        <h2 className="sign-in-txt">Sign In</h2>
        <div className="input-group">
            <input
                type="text"
                className="input-mail"
                placeholder="Email or Username"
            />
            <PasswordInput />
            <div className="pass-remember">
                <label>
                    <input type="checkbox" /> Remember me
                </label>
                <Link to="/" className="pass-reset">
                    <p >Forgot password?</p>
                </Link>
            </div>
        </div>
        <button className="next-btn">Next</button>
            <div className="divider">
                <span className="or-text">or</span>
            </div>
        <div className="social-login">
            <div className="social-buttons">
                <button className="social-login-btn">
                <img src={googleLogo} alt="Google" />
                Google
                </button>
                <button className="social-login-btn">
                <img src={facebookLogo} alt="Facebook" />
                Facebook
                </button>
            </div>
        </div>
        <Link to="/register" className="register">
            <p>Don't have an account?</p>
        </Link>
    </div></>);
}

export default LoginCard