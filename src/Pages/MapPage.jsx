import OHMMap from "../Components/OHMMap"
import "./MapPage.css"
import YearSlider from '../Components/YearSlider';
import { useState, useEffect } from "react";

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = -1000;

export default function MapPage(){
  const defaultYear = new Date().getFullYear();
  const [year, setYear] = useState(defaultYear);
  const [tempInput, setTempInput] = useState(defaultYear);
  const [tempSliderInput, setTempSliderInput] = useState(defaultYear);
  useEffect(() => {setTempInput(year); setTempSliderInput(year)}, [year]);

  const handleInputChange = (event)=> {
    const v = event.target.value;
    if (/^-?\d*$/.test(v))
      setTempInput(v);
  };
    
  const handleBlur = (event) => {
    let rawVal = event.target.value;
    if(rawVal === "" || rawVal === "-"){
      setTempInput(year);
      return;
    }
    let value = Number (rawVal);
    if(value > CURRENT_YEAR  || value < MIN_YEAR){
      setYear(CURRENT_YEAR)
    }
    else{
      console.log(value);
      setYear(value);
    }
  };

  const handleSliderChange = (event, year) => {
    setYear(year);
  };
    
  const handleSliderTemp = (event, year) => {
    setTempSliderInput(year);
    setTempInput(year);
  };

  return(
  <div className="page">
    <div className="map-container">
      <OHMMap yearProp={year}/>
      <div className="year-overlay">
        <YearSlider
          yearProp={year}
          inputProp={tempInput}
          sliderProp = {tempSliderInput}
          handleBlur={handleBlur}
          handleSlider={handleSliderChange}
          handleSliderTemp={handleSliderTemp}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  </div>);
}