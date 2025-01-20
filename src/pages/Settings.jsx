import { useState } from 'react';
import PropTypes from 'prop-types';
import '../assets/css/Settings.css';

export default function Settings({ onDynamicWallpaperChange, onBatteryPercentageChange, onShowSecondsChange, onTimeFormatChange, onDateFormatChange, onShowDateChange }) {
    const [showDate, setShowDate] = useState(true);
    const [showSeconds, setShowSeconds] = useState(true);
    const [timeFormat, setTimeFormat] = useState('12-hour');
    const [dynamicWallpaper, setDynamicWallpaper] = useState(true);
    const [dateFormat, setDateFormat] = useState('Day, Month DD, YYYY');
    const [showBatteryPercentage, setShowBatteryPercentage] = useState(true);

    const handleShowSecondsChange = (e) => {
        const isChecked = e.target.checked;
        setShowSeconds(isChecked);
        onShowSecondsChange(isChecked);
    };

    const handleShowDateChange = (e) => {
        const isChecked = e.target.checked;
        setShowDate(isChecked);
        onShowDateChange(isChecked);
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
                                value='12-hour'
                                name='timeFormat'
                                checked={timeFormat === '12-hour'}
                                onChange={(e) => {
                                    setTimeFormat(e.target.value);
                                    onTimeFormatChange(e.target.value);
                                }}
                            />
                            12-Hour format
                        </label>
                        <label>
                            <input
                                type='radio'
                                value='24-hour'
                                name='timeFormat'
                                checked={timeFormat === '24-hour'}
                                onChange={(e) => {
                                    setTimeFormat(e.target.value);
                                    onTimeFormatChange(e.target.value);
                                }}
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

                        {['Day, Month DD, YYYY', 'DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY/MM/DD'].map((format) => (
                            <label key={format}>
                                <input
                                    type='radio'
                                    value={format}
                                    name='dateFormat'
                                    disabled={!showDate}
                                    checked={dateFormat === format}
                                    onChange={(e) => {
                                        setDateFormat(e.target.value);
                                        onDateFormatChange(e.target.value);
                                    }}
                                />
                                {format}
                            </label>
                        ))}
                        <span>Show date.<br />Select your preferred date format.</span>
                    </div>
                </fieldset>
            </form>
        </section>
    );
}

Settings.propTypes = {
    onShowDateChange: PropTypes.func.isRequired,
    onTimeFormatChange: PropTypes.func.isRequired,
    onDateFormatChange: PropTypes.func.isRequired,
    onShowSecondsChange: PropTypes.func.isRequired,
    onDynamicWallpaperChange: PropTypes.func.isRequired,
    onBatteryPercentageChange: PropTypes.func.isRequired,
};