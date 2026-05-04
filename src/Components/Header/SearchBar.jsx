import { Search } from "lucide-react";
import "./Searchbar.css"

function SearchBar({ onSearch }){
    const handleSubmit = (event) => {
        event.preventDefault();
        const query = event.currentTarget.elements.countrySearch.value.trim();
        if (!query) return;
        onSearch?.(query);
    };

    return (
        <form className="search-container" onSubmit={handleSubmit}>
            <input
                type="text"
                name="countrySearch"
                className="searchbar"
                placeholder="Search country..."
                autoComplete="off"
            />
            <button type="submit" className="search-btn" aria-label="search country">
                <Search size={20}></Search>
            </button>
        </form>
    );
}

export default SearchBar
