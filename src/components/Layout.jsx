import Menu from './Menu';
import Dock from './Dock';
import '../assets/css/Layout.css';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import bgD from '../assets/images/darkBg.webp';
import bgL from '../assets/images/lightBg.webp';

export default function Layout({ children, openWindow, windows = [], closeAllWindows, activeWindow = 0, dynamicWallpaper, showBatteryPercentage, timeFormat, dateFormat, showDate, showSeconds }) {
    const [background, setBackground] = useState(bgD);

    useEffect(() => {
        if (dynamicWallpaper) {
            const updateBackground = () => {
                const hour = new Date().getHours();
                if (hour >= 18 || hour < 7) {
                    setBackground(bgD); // Use dark background for evening and night
                } else {
                    setBackground(bgL); // Use light background for daytime
                }
            };

            updateBackground(); // Initial call to set the correct background
            const interval = setInterval(updateBackground, 60000); // Update every minute to ensure accuracy

            return () => clearInterval(interval); // Cleanup interval on component unmount
        } else {
            setBackground(bgD); // Revert to light mode if dynamic wallpaper is unchecked
        }
    }, [dynamicWallpaper]);

    return (
        <>
            <Menu windows={windows} showDate={showDate} timeFormat={timeFormat} dateFormat={dateFormat} showSeconds={showSeconds} activeWindow={activeWindow} closeAllWindows={closeAllWindows} showBatteryPercentage={showBatteryPercentage} />
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
            <Dock windows={windows} openWindow={openWindow} activeWindow={activeWindow} />
        </>
    );
}

Layout.propTypes = {
    windows: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            id: PropTypes.number.isRequired,
        })
    ).isRequired,
    activeWindow: PropTypes.number,
    children: PropTypes.node.isRequired,
    showDate: PropTypes.bool.isRequired,
    openWindow: PropTypes.func.isRequired,
    showSeconds: PropTypes.bool.isRequired,
    timeFormat: PropTypes.string.isRequired,
    dateFormat: PropTypes.string.isRequired,
    closeAllWindows: PropTypes.func.isRequired,
    dynamicWallpaper: PropTypes.bool.isRequired,
    showBatteryPercentage: PropTypes.bool.isRequired,
};