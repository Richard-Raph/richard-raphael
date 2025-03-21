import '../assets/css/Dock.css';
import PropTypes from 'prop-types';
import Launchpad from './Launchpad';
import blog from '../assets/icons/blog.webp';
import about from '../assets/icons/about.webp';
import project from '../assets/icons/project.webp';
import contact from '../assets/icons/contact.webp';
import terminal from '../assets/icons/terminal.webp';
import settings from '../assets/icons/settings.webp';
import launchpad from '../assets/icons/launchpad.webp';
import React, { memo, useState, useCallback } from 'react';

const icons = [
  { id: 'Launchpad', imgSrc: launchpad, tooltip: 'Launchpad' },
  { id: 'About', imgSrc: about, tooltip: 'About Me' },
  { id: 'Projects', imgSrc: project, tooltip: 'Projects' },
  { id: 'Blog', imgSrc: blog, tooltip: 'Follow my trends' },
  { id: 'Contact', imgSrc: contact, tooltip: 'Talk to me' },
  { id: 'Terminal', imgSrc: terminal, tooltip: 'Hire me!' },
  { id: 'Preferences', imgSrc: settings, tooltip: 'Portfolio Preferences' },
];

const Dock = memo(({ windows, openWindow, deviceState, activeWindow, isLaunchpadOpen, setLaunchpadOpen }) => {
  const [restoringWindow, setRestoringWindow] = useState(null);

  // Handle minimizing/restoring a window
  const handleMinimizeRestore = useCallback((id) => {
    const windowState = windows.find(win => win.id === id);
    if (windowState?.isMinimized) {
      setRestoringWindow(id);
      setTimeout(() => setRestoringWindow(null), 300);
    }
    openWindow(id);
  }, [windows, openWindow]);

  // Handle icon clicks
  const handleIconClick = useCallback((id) => {
    if (id === 'Terminal') {
      const pdfUrl = '/RICHARD.pdf';
      window.open(pdfUrl, '_blank');
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'Richard_Raphael.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    if (id === 'Launchpad') {
      setLaunchpadOpen(prev => !prev);
    } else {
      setLaunchpadOpen(false);
      windows.some(win => win.id === id) ? handleMinimizeRestore(id) : openWindow(id);
    }
  }, [windows, openWindow, setLaunchpadOpen, handleMinimizeRestore]);

  return (
    <>
      <nav className='dock-bar'>
        <ul>
          {icons.map(({ id, imgSrc, tooltip }) => (
            <React.Fragment key={id}>
              {id === 'Preferences' && !deviceState.isSmallScreen && <span className='separator' />}
              {(id !== 'Preferences' || !deviceState.isSmallScreen) && (
                <li
                  data-window-id={id}
                  onClick={() => handleIconClick(id)}
                  className={`icon ${restoringWindow === id ? 'restoring' : ''} ${windows.some(win => win.id === id) ? 'open' : ''} ${id === 'Launchpad' ? (isLaunchpadOpen ? 'active' : '') : ''}`}
                >
                  <img src={imgSrc} alt={tooltip} />
                  <span className='tooltip'>{tooltip}</span>
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </nav>

      <Launchpad openWindow={openWindow} isOpen={isLaunchpadOpen} onClose={() => setLaunchpadOpen(false)} />
    </>
  );
});

Dock.propTypes = {
  deviceState: PropTypes.shape({
    isSmallScreen: PropTypes.bool.isRequired,
    isTabletAndAbove: PropTypes.bool.isRequired,
  }).isRequired,
  activeWindow: PropTypes.string,
  openWindow: PropTypes.func.isRequired,
  isLaunchpadOpen: PropTypes.bool.isRequired,
  setLaunchpadOpen: PropTypes.func.isRequired,
  windows: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Dock;