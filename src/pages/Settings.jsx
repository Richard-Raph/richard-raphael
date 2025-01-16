import PropTypes from 'prop-types';
import '../assets/css/Settings.css';
import React, { useState } from 'react';

export default function Settings({ onDynamicWallpaperChange, onBatteryPercentageChange, onShowSecondsChange, onTimeFormatChange, onDateFormatChange }) {
    const [showDate, setShowDate] = useState(true);
    const [showSeconds, setShowSeconds] = useState(true);
    const [timeFormat, setTimeFormat] = useState('12-hour');
    const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
    const [dynamicWallpaper, setDynamicWallpaper] = useState(true);
    const [showBatteryPercentage, setShowBatteryPercentage] = useState(true);

    // Handle "Show Seconds" toggle
    const handleShowSecondsChange = (e) => {
        const isChecked = e.target.checked;
        setShowSeconds(isChecked);
        onShowSecondsChange(isChecked);
    };

    // Handle "Show Date" toggle
    const handleShowDateChange = (e) => {
        const isChecked = e.target.checked;
        setShowDate(isChecked);
        onDateFormatChange(isChecked ? dateFormat : '');
    };

    return (
        <section className='window-content'>
            <form>
                <fieldset>
                    <p>Desktop and Screensaver:</p>
                    <div>
                        <label>
                            <input
                                type='checkbox'
                                checked={dynamicWallpaper}
                                onChange={(e) => {
                                    setDynamicWallpaper(e.target.checked);
                                    onDynamicWallpaperChange(e.target.checked);
                                }}
                            />
                            Dynamic Wallpaper
                        </label>
                        <span>Wallpaper changes between day and night mode automatically.</span>
                    </div>
                </fieldset>

                <fieldset>
                    <p>Battery:</p>
                    <div>
                        <label>
                            <input
                                type='checkbox'
                                checked={showBatteryPercentage}
                                onChange={(e) => {
                                    setShowBatteryPercentage(e.target.checked);
                                    onBatteryPercentageChange(e.target.checked);
                                }}
                            />
                            Show battery percentage
                        </label>
                        <span>Remaining battery percentage will be displayed.</span>
                    </div>
                </fieldset>

                <fieldset>
                    <p>Time:</p>
                    <div>
                        <label>
                            <input
                                type='checkbox'
                                checked={showSeconds}
                                onChange={handleShowSecondsChange}
                            />
                            Show seconds
                        </label>
                        <label>
                            <input
                                type='radio'
                                name='timeFormat'
                                value='12-hour'
                                checked={timeFormat === '12-hour'}
                                onChange={(e) => {
                                    if (showSeconds) {
                                        setTimeFormat(e.target.value);
                                        onTimeFormatChange(e.target.value);
                                    }
                                }}
                                disabled={!showSeconds}
                            />
                            12-Hour format
                        </label>
                        <label>
                            <input
                                type='radio'
                                name='timeFormat'
                                value='24-hour'
                                checked={timeFormat === '24-hour'}
                                onChange={(e) => {
                                    if (showSeconds) {
                                        setTimeFormat(e.target.value);
                                        onTimeFormatChange(e.target.value);
                                    }
                                }}
                                disabled={!showSeconds}
                            />
                            24-Hour format
                        </label>
                        <span>Show seconds along with hours and minutes.<br />Choose between 12-hour or 24-hour format.</span>
                    </div>
                </fieldset>

                <fieldset>
                    <p>Date:</p>
                    <div>
                        <label>
                            <input
                                type='checkbox'
                                checked={showDate}
                                onChange={handleShowDateChange}
                            />
                            Show Date
                        </label>
                        <label>
                            <input
                                type='radio'
                                name='dateFormat'
                                value='DD/MM/YYYY'
                                checked={dateFormat === 'DD/MM/YYYY'}
                                onChange={(e) => {
                                    if (showDate) {
                                        setDateFormat(e.target.value);
                                        onDateFormatChange(e.target.value);
                                    }
                                }}
                                disabled={!showDate}
                            />
                            DD/MM/YYYY
                        </label>
                        <label>
                            <input
                                type='radio'
                                name='dateFormat'
                                value='MM/DD/YYYY'
                                checked={dateFormat === 'MM/DD/YYYY'}
                                onChange={(e) => {
                                    if (showDate) {
                                        setDateFormat(e.target.value);
                                        onDateFormatChange(e.target.value);
                                    }
                                }}
                                disabled={!showDate}
                            />
                            MM/DD/YYYY
                        </label>
                        <label>
                            <input
                                type='radio'
                                name='dateFormat'
                                value='YYYY/MM/DD'
                                checked={dateFormat === 'YYYY/MM/DD'}
                                onChange={(e) => {
                                    if (showDate) {
                                        setDateFormat(e.target.value);
                                        onDateFormatChange(e.target.value);
                                    }
                                }}
                                disabled={!showDate}
                            />
                            YYYY/MM/DD
                        </label>
                        <label>
                            <input
                                type='radio'
                                name='dateFormat'
                                value='Day, Month DD, YYYY'
                                checked={dateFormat === 'Day, Month DD, YYYY'}
                                onChange={(e) => {
                                    if (showDate) {
                                        setDateFormat(e.target.value);
                                        onDateFormatChange(e.target.value);
                                    }
                                }}
                                disabled={!showDate}
                            />
                            Day, Month DD, YYYY
                        </label>
                        <span>Show date.<br />Select your preferred date format.</span>
                    </div>
                </fieldset>
            </form>
        </section>
    );
}

Settings.propTypes = {
    onDateFormatChange: PropTypes.func.isRequired,
    onTimeFormatChange: PropTypes.func.isRequired,
    onShowSecondsChange: PropTypes.func.isRequired,
    onDynamicWallpaperChange: PropTypes.func.isRequired,
    onBatteryPercentageChange: PropTypes.func.isRequired,
};