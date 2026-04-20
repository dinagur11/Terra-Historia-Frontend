import {Eye, EyeOff} from "lucide-react"
import "./PasswordInput.css"
import { useState } from "react";

function PasswordInput({ value, onChange, placeholder }){
    const [showPass, setShowPass] = useState(false);
    return (
        <div className="pass-input-container">
            <input
                type={showPass ? "text" : "password"}
                className="input-password"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            <button 
                className="show-pass-btn" 
                title="show password" 
                onClick={(e) => {
                    e.preventDefault()
                    setShowPass(!showPass)
                }}
            >
                {showPass ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
        </div>
    );
}

export default PasswordInput