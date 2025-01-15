import PropTypes from 'prop-types';
import '../assets/css/Settings.css';
import React, { useState } from 'react';

export default function Settings({ onDynamicWallpaperChange }) {
  const [dynamicWallpaper, setDynamicWallpaper] = useState(true);

  const handleDynamicWallpaperChange = (e) => {
    setDynamicWallpaper(e.target.checked);
    onDynamicWallpaperChange(e.target.checked);
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
                onChange={handleDynamicWallpaperChange}
              />
              Dynamic Wallpaper
            </label>
            <span>
              Wallpaper will change to night mode from 18:00 to 7:00.
              <br />
              By default, it will display night mode wallpaper.
            </span>
          </div>
        </fieldset>

        <fieldset>
          <p>Battery:</p>
          <div>
            <label>
              <input type='checkbox' />
              Show battery percentage
            </label>
            <span>Remaining battery percentage will be displayed.</span>
          </div>
        </fieldset>

        <fieldset>
          <p>Time:</p>
          <div>
            <label>
              <input type='checkbox' />
              Show seconds
            </label>
            <label>
              <input type='radio' name='timeFormat' value='12-hour' />
              12-Hour format
            </label>
            <label>
              <input type='radio' name='timeFormat' value='24-hour' />
              24-Hour format
            </label>
            <span>
              Show seconds along with hours and minutes.
              <br />
              Choose between 12-hour or 24-hour format.
            </span>
          </div>
        </fieldset>

        <fieldset>
          <p>Date:</p>
          <div>
            <label>
              <input type='checkbox' />
              Show Date
            </label>
            <label>
              <input type='radio' name='dateFormat' value='DD/MM/YYYY' />
              DD/MM/YYYY
            </label>
            <label>
              <input type='radio' name='dateFormat' value='MM/DD/YYYY' />
              MM/DD/YYYY
            </label>
            <label>
              <input type='radio' name='dateFormat' value='YYYY/MM/DD' />
              YYYY/MM/DD
            </label>
            <label>
              <input type='radio' name='dateFormat' value='Day, Month DD, YYYY' />
              Day, Month DD, YYYY
            </label>
            <span>
              Show date on the menu bar.
              <br />
              Select your preferred date format.
            </span>
          </div>
        </fieldset>
      </form>
    </section>
  );
}

Settings.propTypes = {
  onDynamicWallpaperChange: PropTypes.func.isRequired,
};