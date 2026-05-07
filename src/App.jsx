import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import MapPage from "./Pages/MapPage";
import LogInPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";
import VerifyPage from "./Pages/VerifyPage";
import ForgotPassword from "./Pages/ForgotPassPage"
import SuggestionPage from "./Pages/SuggestionPage";
import UserPage from "./Pages/UserPage";
import DeepDivesPage from "./Pages/DeepDivesPage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/suggestions" element={<SuggestionPage />} />
        <Route path="/account" element={<UserPage />} />
        <Route path="/deep-dives" element={<DeepDivesPage />} />
      </Routes>
    </BrowserRouter>
  );
}
