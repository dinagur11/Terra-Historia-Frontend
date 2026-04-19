import "./LoginCard.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword, confirmResetPassword } from "aws-amplify/auth";
import PasswordInput from "./PasswordInput.jsx";

function ForgotPasswordCard() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSendCode = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            await resetPassword({ username: email });
            setMessage("A verification code was sent to your email.");
            setStep(2);
        } catch (err) {
            setError(err.message || "Failed to send reset code.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            await confirmResetPassword({
                username: email,
                confirmationCode: code,
                newPassword: newPassword,
            });

            navigate("/login");
        } catch (err) {
            setError(err.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-card">
            <h2 className="sign-in-txt">Forgot Password</h2>

            {error && <p className="error-msg">{error}</p>}
            {message && <p>{message}</p>}

            {step === 1 ? (
                <div className="input-group">
                    <input
                        type="email"
                        className="input-mail"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <button className="next-btn" onClick={handleSendCode} disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Code"}
                    </button>
                </div>
            ) : (
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

                    <PasswordInput
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <button className="next-btn" onClick={handleResetPassword} disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </div>
            )}

            <Link to="/login" className="register">
                <p>Back to Sign In</p>
            </Link>
        </div>
    );
}

export default ForgotPasswordCard;