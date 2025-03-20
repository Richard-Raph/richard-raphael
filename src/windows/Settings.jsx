import { memo } from 'react';
import PropTypes from 'prop-types';
import '../assets/css/Settings.css';
import GitHub from '../assets/icons/github.webp';
import Profile from '../assets/images/doodle.webp';
import WhatsApp from '../assets/icons/whatsapp.webp';

function Settings({ settings = {}, updateSettings }) {
    return (
        <>
            <div className='profile-section'>
                <img src={Profile} alt='Profile' className='profile-image' />
                <div className='profile-info'>
                    <h3>Richard Raphael</h3>
                    <p>Software Developer & Data Enthusiast</p>
                </div>
            </div>
            <div className='social-links'>
                <a href='https://github.com/Richard-Raph' target='_blank' rel='noopener noreferrer' className='social-icon'>
                    <img src={GitHub} alt='GitHub' />
                    <span>GitHub</span>
                </a>
                <a href='#' target='_blank' rel='noopener noreferrer' className='social-icon'>
                    <img src={WhatsApp} alt='WhatsApp' />
                    <span>WhatsApp</span>
                </a>
            </div>

            <div className='settings-group'>
                <h2 className='group-title'>Appearance</h2>
                <div className='setting-item'>
                    <label className='macos-toggle'>
                        <input
                            type='checkbox'
                            checked={settings.dynamicWallpaper}
                            onChange={(e) => updateSettings('dynamicWallpaper', e.target.checked)}
                        />
                        <span className='toggle-slider'></span>
                        <span className='setting-label'>Dynamic Wallpaper</span>
                    </label>
                    <p className='setting-description'>Automatically switch between day and night themes</p>
                </div>
            </div>

            <div className='settings-group'>
                <h2 className='group-title'>Status Bar</h2>
                <div className='setting-item'>
                    <label className='macos-toggle'>
                        <input
                            type='checkbox'
                            checked={settings.showBatteryPercentage}
                            onChange={(e) => updateSettings('showBatteryPercentage', e.target.checked)}
                        />
                        <span className='toggle-slider'></span>
                        <span className='setting-label'>Show Battery Percentage</span>
                    </label>
                </div>
            </div>

            <div className='settings-group'>
                <h2 className='group-title'>Time</h2>
                <div className='setting-item'>
                    <label className='macos-toggle'>
                        <input
                            type='checkbox'
                            checked={settings.showSeconds}
                            onChange={(e) => updateSettings('showSeconds', e.target.checked)}
                        />
                        <span className='toggle-slider'></span>
                        <span className='setting-label'>Show Seconds</span>
                    </label>
                </div>
                <div className='time-format'>
                    <div className='radio-group'>
                        <label className='macos-radio'>
                            <input
                                type='radio'
                                name='timeFormat'
                                value='12-hour'
                                checked={settings.timeFormat === '12-hour'}
                                onChange={(e) => updateSettings('timeFormat', e.target.value)}
                            />
                            <span className='radio-check'></span>
                            12-Hour Format
                        </label>
                        <label className='macos-radio'>
                            <input
                                type='radio'
                                name='timeFormat'
                                value='24-hour'
                                checked={settings.timeFormat === '24-hour'}
                                onChange={(e) => updateSettings('timeFormat', e.target.value)}
                            />
                            <span className='radio-check'></span>
                            24-Hour Format
                        </label>
                    </div>
                </div>
            </div>

            <div className='settings-group'>
                <h2 className='group-title'>Date</h2>
                <div className='setting-item'>
                    <label className='macos-toggle'>
                        <input
                            type='checkbox'
                            checked={settings.showDate}
                            onChange={(e) => updateSettings('showDate', e.target.checked)}
                        />
                        <span className='toggle-slider'></span>
                        <span className='setting-label'>Show Date</span>
                    </label>
                </div>
                <div className='date-format'>
                    {['Day, Month DD', 'DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY/MM/DD'].map((format) => (
                        <label className='macos-radio' key={format}>
                            <input
                                type='radio'
                                value={format}
                                name='dateFormat'
                                disabled={!settings.showDate}
                                checked={settings.dateFormat === format}
                                onChange={(e) => updateSettings('dateFormat', e.target.value)}
                            />
                            <span className='radio-check'></span>
                            {format}
                        </label>
                    ))}
                </div>
            </div>
        </>
    );
}

Settings.propTypes = {
    updateSettings: PropTypes.func.isRequired,
    settings: PropTypes.shape({
        showDate: PropTypes.bool.isRequired,
        showSeconds: PropTypes.bool.isRequired,
        dateFormat: PropTypes.string.isRequired,
        dynamicWallpaper: PropTypes.bool.isRequired,
        showBatteryPercentage: PropTypes.bool.isRequired,
        timeFormat: PropTypes.oneOf(['12-hour', '24-hour']).isRequired,
    }).isRequired,
};

export default memo(Settings);