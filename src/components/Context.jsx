import '../assets/css/Context.css';
import PropTypes from 'prop-types';
import { useDownloadResume } from '../hooks/useDownloadResume';
import { memo, useRef, useCallback, useLayoutEffect } from 'react';
import { FiSun, FiMail, FiMoon, FiFolder, FiGithub, FiXSquare, FiFileText, FiLinkedin, FiSettings, FiRefreshCcw } from 'react-icons/fi';

const Context = memo(({ x, y, settings, openWindow, updateSettings, closeAllWindows, setLaunchpadOpen }) => {
    const downloadResume = useDownloadResume();
    const menuRef = useRef(null);
    const margin = 10;

    // Adjust menu position to stay within viewport
    useLayoutEffect(() => {
        if (!menuRef.current) return;

        const { width, height } = menuRef.current.getBoundingClientRect();
        let adjustedX = x;
        let adjustedY = y;

        if (x + width > window.innerWidth - margin) {
            adjustedX = window.innerWidth - width - margin;
        } else if (x < margin) {
            adjustedX = margin;
        }

        if (y + height > window.innerHeight - margin) {
            adjustedY = window.innerHeight - height - margin;
        } else if (y < margin) {
            adjustedY = margin;
        }

        menuRef.current.style.top = `${adjustedY}px`;
        menuRef.current.style.left = `${adjustedX}px`;
    }, [x, y]);

    // Handle opening a window
    const handleOpenWindow = useCallback((windowName) => {
        setLaunchpadOpen(false);
        openWindow(windowName);
    }, [openWindow, setLaunchpadOpen]);

    // Handler to prevent context menu inside the context menu
    const handleMenuContextMenu = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    return (
        <div ref={menuRef} className='context-menu' onContextMenu={handleMenuContextMenu}>
            <div className='menu-section'>
                <ContextItem icon={<FiRefreshCcw />} label='Refresh Portfolio' action={() => window.location.reload()} />
                <ContextItem icon={<FiGithub />} label='View GitHub' action={() => window.open('https://github.com/Richard-Raph')} />
            </div>

            <span />

            <div className='menu-section'>
                <ContextItem icon={<FiFolder />} label='Open Projects' action={() => handleOpenWindow('Projects')} />
                <ContextItem icon={<FiSettings />} label='Open Preferences' action={() => handleOpenWindow('Preferences')} />
                <ContextItem icon={<FiXSquare  />} action={closeAllWindows} label='Close All Windows' />
            </div>

            <span />

            <div className='menu-section'>
                <ContextItem icon={<FiFileText />} label='View Resume' action={() => downloadResume({ openInNewTab: true })} />
                <ContextItem icon={<FiMail />} label='Compose Email' action={() => window.open('mailto:richardakpan77@gmail.com')} />
                <ContextItem icon={<FiLinkedin />} label='LinkedIn Profile' action={() => window.open('https://www.linkedin.com/in/rich-tech123')} />
                <ContextItem
                    icon={settings.dynamicWallpaper ? <FiSun /> : <FiMoon />}
                    action={() => updateSettings('dynamicWallpaper', !settings.dynamicWallpaper)}
                    label={`${settings.dynamicWallpaper ? 'Disable' : 'Enable'} Dynamic Wallpaper`}
                />
            </div>
        </div>
    );
});

const ContextItem = memo(({ icon, label, action }) => (
    <div className='menu-item' onClick={action}>
        {icon}
        <span>{label}</span>
    </div>
));

ContextItem.propTypes = {
    icon: PropTypes.node.isRequired,
    action: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
};

Context.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    settings: PropTypes.object.isRequired,
    openWindow: PropTypes.func.isRequired,
    updateSettings: PropTypes.func.isRequired,
    closeAllWindows: PropTypes.func.isRequired,
    setLaunchpadOpen: PropTypes.func.isRequired,
};

export default Context;