import Menu from './Menu';
import Dock from './Dock';
import '../assets/css/Layout.css';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import day from '../assets/images/day.webp';
import night from '../assets/images/night.webp';

export default function Layout({ children, settings, openWindow, windows = [], updateSettings, closeAllWindows, activeWindow, isLaunchpadOpen, setLaunchpadOpen }) {
    const [background, setBackground] = useState(night);

    useEffect(() => {
        if (settings.dynamicWallpaper) {
            const updateBackground = () => {
                const hour = new Date().getHours();
                setBackground(hour >= 18 || hour < 7 ? night : day);
            };

            updateBackground();
            const interval = setInterval(updateBackground, 60000);
            return () => clearInterval(interval);
        } else { setBackground(night); }
    }, [settings.dynamicWallpaper]);

    return (
        <>
            <Menu windows={windows} settings={settings} activeWindow={activeWindow} updateSettings={updateSettings} closeAllWindows={closeAllWindows} />
            <main>
                {children}
                <section className='layout'><img src={background} alt='background' /></section>
            </main>
            <Dock windows={windows} openWindow={openWindow} activeWindow={activeWindow} isLaunchpadOpen={isLaunchpadOpen} setLaunchpadOpen={setLaunchpadOpen} />
        </>
    );
}

Layout.propTypes = {
    windows: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    settings: PropTypes.shape({
        showDate: PropTypes.bool.isRequired,
        showSeconds: PropTypes.bool.isRequired,
        timeFormat: PropTypes.string.isRequired,
        dateFormat: PropTypes.string.isRequired,
        dynamicWallpaper: PropTypes.bool.isRequired,
        showBatteryPercentage: PropTypes.bool.isRequired,
    }).isRequired,
    activeWindow: PropTypes.string,
    children: PropTypes.node.isRequired,
    openWindow: PropTypes.func.isRequired,
    updateSettings: PropTypes.func.isRequired,
    closeAllWindows: PropTypes.func.isRequired,
    isLaunchpadOpen: PropTypes.bool.isRequired,
    setLaunchpadOpen: PropTypes.func.isRequired,
};