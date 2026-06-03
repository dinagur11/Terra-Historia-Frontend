import OHMMap from "../Components/Map/OHMMap"
import "./MapPage.css"
import YearSlider from '../Components/Map/YearSlider';
import SidePanel from "../Components/Map/SidePanel";
import { useState, useEffect } from "react";
import Logo from "../Components/Logo";
import Header from "../Components/Header/Header";
import { CURRENT_YEAR, MIN_MAP_YEAR } from "../constants/mapYears";

export default function MapPage() {
  const defaultYear = CURRENT_YEAR;
  const [year, setYear] = useState(defaultYear);
  const [tempInput, setTempInput] = useState(defaultYear);
  const [tempSliderInput, setTempSliderInput] = useState(defaultYear);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countrySearch, setCountrySearch] = useState(null);

  useEffect(() => {
    setTempInput(year);
    setTempSliderInput(year);
  }, [year]);

  const handleInputChange = (event) => {
    const v = event.target.value;
    if (/^-?\d*$/.test(v)) setTempInput(v);
  };

  const handleBlur = (event) => {
    let rawVal = event.target.value;
    if (rawVal === "" || rawVal === "-") { setTempInput(year); return; }
    const value = Number(rawVal);
    let finalValue;
    if (value > CURRENT_YEAR) finalValue = CURRENT_YEAR;
    else if (value < MIN_MAP_YEAR) finalValue = MIN_MAP_YEAR;
    else finalValue = value;
    setYear(finalValue);
  };

  const handleSliderChange = (event, year) => setYear(year);

  const handleSliderTemp = (event, year) => {
    setTempSliderInput(year);
    setTempInput(year);
  };

  const changeYearBy = (amount) => {
    setYear((currentYear) => {
      const nextYear = currentYear + amount;
      if (nextYear > CURRENT_YEAR) return CURRENT_YEAR;
      if (nextYear < MIN_MAP_YEAR) return MIN_MAP_YEAR;
      return nextYear;
    });
  };

  const handleCountrySearch = (query) => {
    setCountrySearch({ query, id: Date.now() });
  };

  return (
    <div className="page">
      <Header isMapActive={true} onCountrySearch={handleCountrySearch} year={year}></Header>
      <div className="map-container">
        <OHMMap
          yearProp={year}
          onCountrySelect={setSelectedCountry}
          countrySearch={countrySearch}
        />
        <div className="year-overlay">
          <YearSlider
            yearProp={year}
            inputProp={tempInput}
            sliderProp={tempSliderInput}
            handleBlur={handleBlur}
            handleSlider={handleSliderChange}
            handleSliderTemp={handleSliderTemp}
            handleInputChange={handleInputChange}
            minYear={MIN_MAP_YEAR}
            onIncreaseYear={() => changeYearBy(1)}
            onDecreaseYear={() => changeYearBy(-1)
            }
          />
        </div>
      </div>
      <div className={`side-panel${selectedCountry ? " side-panel--selected" : ""}`}>
        <SidePanel
          yearProp={year}
          selectedCountry={selectedCountry}
          onCountryClose={() => setSelectedCountry(null)}
        />
      </div>
    </div>
  );
}
