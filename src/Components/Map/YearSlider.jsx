import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import { ChevronDown, ChevronUp } from 'lucide-react';
import "./YearSlider.css"

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = -1000;

export default function YearSlider({
  inputProp,
  sliderProp,
  handleBlur,
  handleSlider,
  handleInputChange,
  handleSliderTemp,
  onIncreaseYear,
  onDecreaseYear
}) {
  const numericYear = typeof sliderProp === 'number' ? sliderProp : Number(inputProp);

  return (
      <div className="slider-container">
          <div className="year-stepper">
            <button
              type="button"
              className="year-stepper__button"
              onClick={onIncreaseYear}
              disabled={numericYear >= CURRENT_YEAR}
              aria-label="Increase year"
              title="Increase year"
            >
              <ChevronUp size={16} strokeWidth={2.4} />
            </button>
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
            <button
              type="button"
              className="year-stepper__button"
              onClick={onDecreaseYear}
              disabled={numericYear <= MIN_YEAR}
              aria-label="Decrease year"
              title="Decrease year"
            >
              <ChevronDown size={16} strokeWidth={2.4} />
            </button>
          </div>
            <Slider
              value={typeof sliderProp === 'number' ? sliderProp : 0}
              onChangeCommitted={handleSlider}
              onChange={handleSliderTemp}
              className='input-slider'
              min={MIN_YEAR}
              max={CURRENT_YEAR}
              step={1}
              aria-label="Year"
              sx={{
                mx: '8px',
                width: 'calc(100% - 16px)',
                '& .MuiSlider-thumb.Mui-active': {
                  transform: 'translate(-50%, -50%) scale(1)',
                },
              }}
            />
      </div>
  );}
