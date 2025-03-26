import { useState, useEffect } from 'react';

export const useDeviceState = () => {
    const [deviceState, setDeviceState] = useState(() => ({
        isSmallScreen: window.innerWidth < 750,
        isTabletAndAbove: window.innerWidth >= 750,
        isLaptopAndAbove: window.innerWidth >= 1200,
        isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    }));

    useEffect(() => {
        const handleResize = () => {
            setDeviceState({
                isSmallScreen: window.innerWidth < 750,
                isTabletAndAbove: window.innerWidth >= 750,
                isLaptopAndAbove: window.innerWidth >= 1200,
                isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return deviceState;
};