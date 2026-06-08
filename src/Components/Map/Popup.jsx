import "./Popup.css";
import { useState } from "react";

export default function Popup({
    eventName,
    eventDate,
    eventDescription,
    onClose
}) {

    const toggleFavorite = () => {
        setIsFavorite(prev => !prev);
    };

    return (
        <div className="popup-container">
            <div className="popup-scrollable">
                <button className="popup-close" onClick={onClose}>
                    ×
                </button>
                <p className="title">{eventName}</p>
                <p className="date">{eventDate}</p>
                <p className="description">{eventDescription}</p>
            </div>
        </div>
    );
}