import PropTypes from 'prop-types';
import '../assets/css/Context.css';
import {
    FiCopy,
    FiFolder,
    FiGithub,
    FiRefreshCcw,
} from 'react-icons/fi';

export default function Context({ x, y }) {
    return (
        <div className='context-menu' style={{ top: `${y}px`, left: `${x}px` }}>
            <div className='menu-section'>
                <div className='menu-item' onClick={() => window.location.reload()}>
                    <FiRefreshCcw size={20} color='rgba(0, 0, 0, 0.7)' />
                    <span>Refresh Portfolio</span>
                </div>
                <div className='menu-item' onClick={() => window.open('https://github.com/Richard-Raph', '_blank')}>
                    <FiGithub size={20} color='rgba(0, 0, 0, 0.7)' />
                    <span>View GitHub</span>
                </div>
            </div>
            <span />
            <div className='menu-section'>
                <div className='menu-item' onClick={() => window.open('/projects', '_blank')}>
                    <FiFolder size={20} color='rgba(0, 0, 0, 0.7)' />
                    <span>Open Project</span>
                </div>
                <div className='menu-item' onClick={() => navigator.clipboard.writeText(window.location.href)}>
                    <FiCopy size={20} color='rgba(0, 0, 0, 0.7)' />
                    <span>Copy URL</span>
                </div>
            </div>
        </div>
    );
}

Context.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
};