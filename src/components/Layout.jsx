import Menu from './Menu';
import Dock from './Dock';
import '../assets/css/Layout.css';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import bgD from '../assets/images/darkBg.webp';
import bgL from '../assets/images/lightBg.webp';

export default function Layout({ children, windows = [], openWindow, activeWindow = 0, closeAllWindows }) {
    const [background, setBackground] = useState(bgL);

    useEffect(() => {
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
    }, []);

    return (
        <>
            <svg width='219' height='147' viewBox='0 0 219 147' fill='none' cursor='none' xmlns='http://www.w3.org/2000/svg'>
                <rect opacity='0.18' x='10.4252' y='75.8326' width='7.50168' height='7.50168' transform='rotate(110.283 10.4252 75.8326)' fill='#686868' stroke='white' strokeWidth='1.22683' />
                <rect opacity='0.18' x='180.869' y='138.825' width='7.50168' height='7.50168' transform='rotate(110.283 180.869 138.825)' fill='#686868' stroke='white' strokeWidth='1.22683' />
                <rect x='69.4713' y='-91.84' width='180.485' height='180.485' transform='rotate(20.2832 69.4713 -91.84)' stroke='white' strokeOpacity='0.1' strokeWidth='1.22683' />
            </svg>
            <svg width='232' height='191' viewBox='0 0 232 191' fill='none' cursor='none' xmlns='http://www.w3.org/2000/svg'>
                <circle cx='50.5685' cy='172.432' r='112.068' stroke='white' strokeOpacity='0.09' />
                <g opacity='0.1'>
                    <path d='M26.4932 5.20547L228.856 172.432' stroke='#D9D9D9' />
                    <rect x='22.4384' y='0.5' width='6.15753' height='6.15753' fill='#686868' stroke='white' />
                    <rect x='224.801' y='169.027' width='6.15753' height='6.15753' fill='#686868' stroke='white' />
                    <circle cx='121.819' cy='83.613' r='1.7774' fill='#323232' stroke='white' />
                </g>
            </svg>
            <Menu windows={windows} activeWindow={activeWindow} closeAllWindows={closeAllWindows} />
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
    openWindow: PropTypes.func.isRequired,
    closeAllWindows: PropTypes.func.isRequired,
};