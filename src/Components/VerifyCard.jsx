import "./LoginCard.css";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";

function VerifyCard() {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState(location.state?.email || "");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            await confirmSignUp({
                username: email,
                confirmationCode: code,
            });

            navigate("/login");
        } catch (err) {
            setError(err.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError("");
        setMessage("");

        try {
            await resendSignUpCode({ username: email });
            setMessage("A new code was sent to your email.");
        } catch (err) {
            setError(err.message || "Failed to resend code");
        }
    };

    return (
        <div className="login-card">
            <h2 className="sign-in-txt">Verify Email</h2>

            {error && <p className="error-msg">{error}</p>}
            {message && <p>{message}</p>}

            <div className="input-group">
                <input
                    type="email"
                    className="input-mail"
                    value={email}
                    disabled
                />

                <input
                    type="text"
                    className="input-mail"
                    placeholder="Verification Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
            </div>

            <button className="next-btn" onClick={handleVerify} disabled={loading}>
                {loading ? "Verifying..." : "Verify"}
            </button>

            <button
                className="social-login-btn"
                type="button"
                onClick={handleResend}
            >
                Resend Code
            </button>
        </div>
    );
}

export default VerifyCard;