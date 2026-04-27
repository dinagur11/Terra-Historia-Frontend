import { Search } from "lucide-react";
import "./Searchbar.css"

function SearchBar(){
    return (
        <div className="search-container">
            <input type="text" className="searchbar" placeholder="Search country, empire..."></input>
            <button className="search-btn">
                <Search size={20}></Search>
            </button>
            
        </div>
    );
}

export default SearchBar