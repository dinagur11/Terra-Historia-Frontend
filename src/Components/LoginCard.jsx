import "./LoginCard.css"
import facebookLogo from "../assets/facebooklogo.png"
import googleLogo from "../assets/googlelogo.png"
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "./PasswordInput.jsx";
import { signIn } from 'aws-amplify/auth';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function LoginCard(){
    const { login } = useAuth();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await signIn({ username: email, password })
            login();
            navigate('/') 
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
    <div className="login-card">
        <h2 className="sign-in-txt">Sign In</h2>
        {error && <p className="error-msg">{error}</p>}
        <div className="input-group">
            <input
                type="text"
                className="input-mail"
                placeholder="Email or Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput value={password} placeholder={"Password"} onChange={(e) => setPassword(e.target.value)} />
            <div className="pass-remember">
                <label>
                    <input type="checkbox" /> Remember me
                </label>
                <Link to="/forgot-password" className="pass-reset">
                    <p>Forgot password?</p>
                </Link>
            </div>
        </div>
        <button className="next-btn" onClick={handleLogin} disabled={loading}>
            {loading ? 'Signing in...' : 'Next'}
        </button>
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
    </div>
    );
}

export default LoginCard