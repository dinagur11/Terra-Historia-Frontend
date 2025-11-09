import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import "./YearSlider.css"
import { useState } from 'react';

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = -1000;

export default function YearSlider({inputProp, sliderProp, handleBlur, handleSlider, handleInputChange, handleSliderTemp}) {

  return (
      <div className="slider-container">
            <MuiInput
              value={inputProp}
              size="small"
              onChange={handleInputChange}
              onBlur = {handleBlur}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
              inputProps={{
                step: 1,
                min: MIN_YEAR,
                max: CURRENT_YEAR,
                type: 'text',
                className: 'input-slider',
                'aria-label': 'Year'
              }}
            />
            <Slider
              value={typeof sliderProp === 'number' ? sliderProp : 0}
              onChangeCommitted={handleSlider}
              onChange={handleSliderTemp}
              className='input-slider'
              min={MIN_YEAR}
              max={CURRENT_YEAR}
              step={1}
              aria-label="Year"
            />
      </div>
  );}
