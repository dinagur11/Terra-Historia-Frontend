import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Logo.css";

export default function Logo() {
  const navigate = useNavigate();

  return (
    <button
      className="logo-btn"
      onClick={() => navigate("/")}
      title="Go to home page"
    >
      <img src={logo} className="logo-img" />
    </button>
  );
}