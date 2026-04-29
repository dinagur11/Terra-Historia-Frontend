import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import Header from '../Components/Header/Header';
import './SuggestionPage.css'


export default function SuggestionPage(){
    const [selection, setSelection] = useState("event");
    return (
        <div className='suggestion-page'>
            <Header isMapActive={false}/>
            <div className="suggestion-page__body">
                <div className="suggestion-page__card">
                    <h1 className='suggestion-page__title'>Contact us</h1>
                    <p className='suggestion-page__subtitle'>Want to notify us of a mistake, add missing information or make another suggestion? Feel free to contact us.</p>
                    <div className="suggestion-page__divider" />
                    <Select
                        value={selection}
                        onChange={(e) => setSelection(e.target.value)}
                        size="small"
                        fullWidth
                        sx={{
                            fontFamily: 'Raleway, sans-serif',
                            fontSize: '0.8rem',
                            color: '#e8e0d0',
                            borderRadius: '4px',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(255,255,255,0.07)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(201, 162, 39, 0.4)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#c9a227',
                            },
                            '& .MuiSvgIcon-root': { color: '#6a6050' },
                        }}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    background: '#161412',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    borderRadius: '4px',
                                    '& .MuiMenuItem-root': {
                                        fontFamily: 'Raleway, sans-serif',
                                        fontSize: '0.8rem',
                                        color: '#e8e0d0',
                                        '&:hover': { background: 'rgba(201, 162, 39, 0.08)' },
                                        '&.Mui-selected': {
                                            background: 'rgba(201, 162, 39, 0.12)',
                                            color: '#c9a227',
                                        },
                                    },
                                },
                            },
                        }}
                    >
                        <MenuItem value="event">Suggest a missing event</MenuItem>
                        <MenuItem value="mistake">Correct a mistake</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                    </Select>
                    {selection === 'event' && <SelectionEvent />}
                    {selection === 'mistake' && <SelectionMistake />}
                    {selection === 'other' && <SelectionOther />}
                    <button className="suggestion-page__submit" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
}

function handleSubmit(){

}

export function SelectionEvent(){
    return (
        <div className='suggestion-form'>
            <div className='suggestion-form__field'>
                <label className='suggestion-form__label'>Event name <span>*</span></label>
                <input className='suggestion-form__input' placeholder='e.g. Battle of Hastings' />
            </div>
            <div className='suggestion-form__field'>
                <label className='suggestion-form__label'>Event date</label>
                <input className='suggestion-form__input' placeholder='e.g. 1066' />
            </div>
            <div className='suggestion-form__field'>
                <label className='suggestion-form__label'>Event description <span>*</span></label>
                <textarea className='suggestion-form__textarea' placeholder='Describe the event...' />
            </div>
        </div>
    );
}

export function SelectionMistake(){
    return (
        <div className='suggestion-form'>
            <div className='suggestion-form__field'>
                <label className='suggestion-form__label'>Mistake description <span>*</span></label>
                <textarea className='suggestion-form__textarea' placeholder='What is incorrect and what should it be?' />
            </div>
            <div className='suggestion-form__field'>
                <label className='suggestion-form__label'>Link (if applicable)</label>
                <input className='suggestion-form__input' placeholder='https://...' />
            </div>
        </div>
    );
}

export function SelectionOther(){
    return (
        <div className='suggestion-form'>
            <div className='suggestion-form__field'>
                <label className='suggestion-form__label'>Tell us more<span>*</span></label>
                <textarea className='suggestion-form__textarea suggestion-form__textarea--tall' placeholder='Your message...' />
            </div>
        </div>
    );
}
