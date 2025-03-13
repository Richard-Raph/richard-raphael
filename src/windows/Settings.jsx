import PropTypes from 'prop-types';
import '../assets/css/Settings.css';

export default function Settings({ settings = {}, updateSettings }) {
    return (
        <section className='window-content'>
            <form>
                <fieldset>
                    <p>Desktop and Screensaver:</p>
                    <div>
                        <label>
                            <input
                                type='checkbox'
                                checked={!!settings.dynamicWallpaper}
                                onChange={(e) => updateSettings?.('dynamicWallpaper', e.target.checked)}
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
                                checked={!!settings.showBatteryPercentage}
                                onChange={(e) => updateSettings?.('showBatteryPercentage', e.target.checked)}
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
                                checked={!!settings.showSeconds}
                                onChange={(e) => updateSettings?.('showSeconds', e.target.checked)}
                            />
                            Show seconds
                        </label>
                        <label>
                            <input
                                type='radio'
                                value='12-hour'
                                name='timeFormat'
                                checked={settings.timeFormat === '12-hour'}
                                onChange={(e) => updateSettings?.('timeFormat', e.target.value)}
                            />
                            12-Hour format
                        </label>
                        <label>
                            <input
                                type='radio'
                                value='24-hour'
                                name='timeFormat'
                                checked={settings.timeFormat === '24-hour'}
                                onChange={(e) => updateSettings?.('timeFormat', e.target.value)}
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
                                checked={!!settings.showDate}
                                onChange={(e) => updateSettings?.('showDate', e.target.checked)}
                            />
                            Show Date
                        </label>

                        {["Day, Month DD, YYYY", "DD/MM/YYYY", "MM/DD/YYYY", "YYYY/MM/DD"].map((format) => (
                            <label key={format}>
                                <input
                                    type='radio'
                                    value={format}
                                    name='dateFormat'
                                    disabled={!settings.showDate}
                                    checked={settings.dateFormat === format}
                                    onChange={(e) => updateSettings?.('dateFormat', e.target.value)}
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