import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import MapPage from "./Pages/MapPage";
import LogInPage from "./Pages/LoginPage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/login" element={<LogInPage />} />
      </Routes>
    </BrowserRouter>
  );
}
