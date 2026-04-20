import "./Popup.css";
import { Star } from "lucide-react";
import { useState } from "react";

export default function Popup({
    eventName,
    eventDate,
    eventDescription,
    onClose
}) {
    const [isFavorite, setIsFavorite] = useState(false);

    const toggleFavorite = () => {
        setIsFavorite(prev => !prev);
    };

    return (
        <div className="popup-container">
            <button className="popup-close" onClick={onClose}>
                ×
            </button>

            <button className="favorite-btn" title="Add to favorites" onClick={toggleFavorite}>
                <Star
                    size={20}
                    fill={isFavorite ? "gold" : "white"}   
                    stroke="black"                        
                    strokeWidth={1}
                />
            </button>

            <p className="title">{eventName}</p>
            <p className="date">{eventDate}</p>
            <p className="description">{eventDescription}</p>
        </div>
    );
}