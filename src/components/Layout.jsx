import Menu from './Menu';
import Dock from './Dock';
import '../assets/css/Layout.css';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import bgD from '../assets/images/darkBg.webp';
import bgL from '../assets/images/lightBg.webp';

export default function Layout({ children, settings, openWindow, windows = [], closeAllWindows, activeWindow, isLaunchpadOpen, setLaunchpadOpen }) {
    const [background, setBackground] = useState(bgD);

    useEffect(() => {
        if (settings.dynamicWallpaper) {
            const updateBackground = () => {
                const hour = new Date().getHours();
                setBackground(hour >= 18 || hour < 7 ? bgD : bgL);
            };

            updateBackground();
            const interval = setInterval(updateBackground, 60000);
            return () => clearInterval(interval);
        } else {
            setBackground(bgD);
        }
    }, [settings.dynamicWallpaper]);

    return (
        <>
            <Menu windows={windows} settings={settings} activeWindow={activeWindow} closeAllWindows={closeAllWindows} />
            <main>
                {children}
                <section className='layout'>
                    <img src={background} alt='background' />
                    {/* <div className='layout-content'>
                        <div className='layout-text'><span>I&#39;m a</span><h1>Full-stack</h1></div>
                        <div className='layout-text'><h1>Developer</h1><span>&amp;</span></div>
                        <div className='layout-text'><h1>Software</h1></div>
                        <div className='layout-text'><h1>Engineer</h1></div>
                    </div> */}
                </section>
            </main>
            <Dock windows={windows} openWindow={openWindow} activeWindow={activeWindow} isLaunchpadOpen={isLaunchpadOpen} setLaunchpadOpen={setLaunchpadOpen} />
        </>
    );
}

Layout.propTypes = {
    windows: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
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
    closeAllWindows: PropTypes.func.isRequired,
    isLaunchpadOpen: PropTypes.bool.isRequired,
    setLaunchpadOpen: PropTypes.func.isRequired,
};