import PropTypes from 'prop-types';
import '../assets/css/Context.css';
import {
    FiSun,
    FiBook,
    FiCopy,
    FiMail,
    FiMoon,
    FiFolder,
    FiGithub,
    FiFileText,
    FiLinkedin,
    FiRefreshCcw,
} from 'react-icons/fi';

export default function Context({ x, y, settings, openWindow, updateSettings }) {
    const handleResumeDownload = () => {
        const pdfUrl = '/RICHARD.pdf';
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'Richard_Raphael_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className='context-menu' style={{ top: `${y}px`, left: `${x}px` }}>
            {/* Main Section */}
            <div className='menu-section'>
                <div className='menu-item' onClick={() => window.location.reload()}>
                    <FiRefreshCcw size={20} color='rgba(0, 0, 0, 0.8)' />
                    <span>Refresh Portfolio</span>
                </div>
                <div className='menu-item' onClick={() => window.open('https://github.com/Richard-Raph', '_blank')}>
                    <FiGithub size={20} color='rgba(0, 0, 0, 0.8)' />
                    <span>View GitHub</span>
                </div>
            </div>

            <span />

            {/* Portfolio Options */}
            <div className='menu-section'>
                <div className='menu-item' onClick={() => openWindow('Blog')}>
                    <FiBook size={20} color='rgba(0, 0, 0, 0.8)' />
                    <span>Open Blog</span>
                </div>
                <div className='menu-item' onClick={() => openWindow('Projects')}>
                    <FiFolder size={20} color='rgba(0, 0, 0, 0.8)' />
                    <span>Open Projects</span>
                </div>
                <div className='menu-item' onClick={handleResumeDownload}>
                    <FiFileText size={20} color='rgba(0, 0, 0, 0.8)' />
                    <span>Download Resume</span>
                </div>
            </div>

            <span />

            {/* Social & Contact */}
            <div className='menu-section'>
                <div className='menu-item' onClick={() => navigator.clipboard.writeText(window.location.href)}>
                    <FiCopy size={20} color='rgba(0, 0, 0, 0.8)' />
                    <span>Copy URL</span>
                </div>
                <div className='menu-item' onClick={() => window.open('mailto:richardakpan77@gmail.com')}>
                    <FiMail size={20} color='rgba(0, 0, 0, 0.8)' />
                    <span>Compose Email</span>
                </div>
                <div className='menu-item' onClick={() => window.open('https://www.linkedin.com/in/rich-tech123', '_blank')}>
                    <FiLinkedin size={20} color='rgba(0, 0, 0, 0.8)' />
                    <span>Visit LinkedIn Profile</span>
                </div>
                <div className='menu-item' onClick={() => updateSettings('dynamicWallpaper', !settings.dynamicWallpaper)}>
                    {settings.dynamicWallpaper ? <FiSun size={20} color='rgba(0, 0, 0, 0.8)' /> : <FiMoon size={20} color='rgba(0, 0, 0, 0.8)' />}
                    <span>{settings.dynamicWallpaper ? 'Disable' : 'Enable'} Dynamic Wallpaper</span>
                </div>
            </div>
        </div>
    );
}

Context.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    settings: PropTypes.object.isRequired,
    openWindow: PropTypes.func.isRequired,
    updateSettings: PropTypes.func.isRequired,
};