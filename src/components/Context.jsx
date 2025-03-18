import '../assets/css/Context.css';
import PropTypes from 'prop-types';
import { useRef, useLayoutEffect } from 'react';
import { FiSun, FiBook, FiCopy, FiMail, FiMoon, FiFolder, FiGithub, FiFileText, FiLinkedin, FiRefreshCcw } from 'react-icons/fi';

export default function Context({ x, y, settings, openWindow, updateSettings }) {
    const menuRef = useRef(null);
    const margin = 10;

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

    const handleResumeDownload = () => {
        const link = document.createElement('a');
        link.href = '/RICHARD.pdf';
        link.download = 'Richard_Raphael.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div ref={menuRef} className='context-menu'>
            <div className='menu-section'>
                <MenuItem icon={<FiRefreshCcw />} label='Refresh Portfolio' action={() => window.location.reload()} />
                <MenuItem icon={<FiGithub />} label='View GitHub' action={() => window.open('https://github.com/Richard-Raph')} />
            </div>

            <span />

            <div className='menu-section'>
                <MenuItem icon={<FiBook />} label='Open Blog' action={() => openWindow('Blog')} />
                <MenuItem icon={<FiFolder />} label='Open Projects' action={() => openWindow('Projects')} />
                <MenuItem icon={<FiFileText />} label='Download Resume' action={handleResumeDownload} />
            </div>

            <span />

            <div className='menu-section'>
                <MenuItem icon={<FiCopy />} label='Copy URL' action={() => navigator.clipboard.writeText(window.location.href)} />
                <MenuItem icon={<FiMail />} label='Compose Email' action={() => window.open('mailto:richardakpan77@gmail.com')} />
                <MenuItem icon={<FiLinkedin />} label='LinkedIn Profile' action={() => window.open('https://www.linkedin.com/in/rich-tech123')} />
                <MenuItem
                    icon={settings.dynamicWallpaper ? <FiSun /> : <FiMoon />}
                    action={() => updateSettings('dynamicWallpaper', !settings.dynamicWallpaper)}
                    label={`${settings.dynamicWallpaper ? 'Disable' : 'Enable'} Dynamic Wallpaper`}
                />
            </div>
        </div>
    );
}

const MenuItem = ({ icon, label, action }) => (
    <div className='menu-item' onClick={action}>
        {icon}
        <span>{label}</span>
    </div>
);

Context.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    settings: PropTypes.object.isRequired,
    openWindow: PropTypes.func.isRequired,
    updateSettings: PropTypes.func.isRequired,
};