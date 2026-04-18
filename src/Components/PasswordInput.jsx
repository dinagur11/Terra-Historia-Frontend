import {Eye, EyeOff} from "lucide-react"
import "./PasswordInput.css"
import { useState } from "react";

function PasswordInput(){
    const [showPass, setShowPass] = useState(false);
    return (<div className="pass-input-container">
                <input
                    type={showPass ? "text" : "password"}
                    className="input-password"
                    placeholder="Password"
                />
                <button className="show-pass-btn" title="show password" onClick={()=>setShowPass(!showPass)}>
                    {showPass? <Eye size={18} /> : <EyeOff size={18} />}   
                </button>
            </div>);
}


export default PasswordInput