import "./LoginCard.css"
import facebookLogo from "../assets/facebooklogo.png"
import googleLogo from "../assets/googlelogo.png"
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "./PasswordInput.jsx";
import { signUp } from 'aws-amplify/auth';
import { useState } from 'react';

function SignUpCard(){
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSignUp = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await signUp({
                username: email,
                password,
                options: {
                    userAttributes: {
                        name: name,
                        email: email
                    }
                }
            })
            navigate("/verify", { state: { email } });
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
    <div className="login-card">
        <h2 className="sign-in-txt">Sign Up</h2>
        {error && <p className="error-msg">{error}</p>}
        <div className="input-group">
            <input
                type="text"
                className="input-mail"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                className="input-mail"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput value={password} placeholder={"Password"} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button className="next-btn" onClick={handleSignUp} disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
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

        <Link to="/login" className="register">
            <p>Already have an account?</p>
        </Link>
    </div>
    );
}

export default SignUpCard;