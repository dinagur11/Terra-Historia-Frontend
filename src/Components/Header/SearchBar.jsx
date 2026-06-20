import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getCountrySearchSuggestions } from "../../utils/countrySearch.js";
import "./Searchbar.css"

function SearchBar({ onSearch, year, countryOptions = [] }) {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const suggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    const ohmSuggestions = countryOptions
        .filter(option => option.name.toLowerCase().startsWith(normalizedQuery))
        .map(option => option.name);

    const staticSuggestions = getCountrySearchSuggestions(query, year);

    const seen = new Set();
    const merged = [];
    for (const name of [...ohmSuggestions, ...staticSuggestions]) {
        const key = name.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        merged.push(name);
    }

    return merged.sort((a, b) => a.localeCompare(b)).slice(0, 8);
    }, [countryOptions, query, year]);
    const showSuggestions = isFocused && suggestions.length > 0;

    const submitQuery = (value) => {
        const nextQuery = value.trim();
        if (!nextQuery) return;
        const option = countryOptions.find(
            country => country.name.toLowerCase() === nextQuery.toLowerCase()
        );
        setQuery(nextQuery);
        setIsFocused(false);
        setActiveSuggestion(-1);
        onSearch?.(nextQuery, option);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (showSuggestions && activeSuggestion >= 0) {
            submitQuery(suggestions[activeSuggestion]);
            return;
        }
        submitQuery(query);
    };

    const handleChange = (event) => {
        setQuery(event.target.value);
        setIsFocused(true);
        setActiveSuggestion(-1);
    };

    const handleKeyDown = (event) => {
        if (!showSuggestions) return;

        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveSuggestion(current => (current + 1) % suggestions.length);
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveSuggestion(current =>
                current <= 0 ? suggestions.length - 1 : current - 1
            );
        }

        if (event.key === "Escape") {
            setIsFocused(false);
            setActiveSuggestion(-1);
        }
    };

    return (
        <form className="search-container" onSubmit={handleSubmit}>
            <input
                type="text"
                name="countrySearch"
                className="searchbar"
                placeholder="Search country..."
                autoComplete="off"
                value={query}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                aria-label="Search country"
                aria-expanded={showSuggestions}
                aria-controls="country-search-suggestions"
            />
            <button type="submit" className="search-btn" aria-label="search country">
                <Search size={20}></Search>
            </button>
            {showSuggestions && (
                <ul id="country-search-suggestions" className="search-suggestions">
                    {suggestions.map((suggestion, index) => (
                        <li key={suggestion}>
                            <button
                                type="button"
                                className={`search-suggestion ${index === activeSuggestion ? "active" : ""}`}
                                onMouseDown={(event) => {
                                    event.preventDefault();
                                    submitQuery(suggestion);
                                }}
                            >
                                {suggestion}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </form>
    );
}

export default SearchBar
