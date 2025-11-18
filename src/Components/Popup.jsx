import "./Popup.css"

export default function Popup({eventName, eventDate, eventDescription, onClose}){
    return(
        <div className="popup-container">
            <button className="popup-close" onClick={onClose}>
                ×
            </button>
            <p className="title">{eventName}</p>
            <p className="date">{eventDate}</p>
            <p className="description">{eventDescription}</p>
        </div>
    );
}