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
import { useDownloadResume } from '../hooks/useDownloadResume';

const icons = [
  { id: 'Launchpad', imgSrc: launchpad, tooltip: 'Launchpad' },
  { id: 'About', imgSrc: about, tooltip: 'About Me' },
  { id: 'Projects', imgSrc: project, tooltip: 'Projects' },
  { id: 'Blog', imgSrc: blog, tooltip: 'Latest Trends' },
  { id: 'Contact', imgSrc: contact, tooltip: 'Let\'s Talk' },
  { id: 'Preferences', imgSrc: settings, tooltip: 'Preferences' },
  { id: 'Terminal', imgSrc: terminal, tooltip: 'Download Resume' },
];

const Dock = memo(({ windows, openWindow, deviceState, activeWindow, isLaunchpadOpen, setLaunchpadOpen }) => {
  const downloadResume = useDownloadResume();
  const [restoringWindow, setRestoringWindow] = useState(null);

  const handleMinimizeRestore = useCallback((id) => {
    const windowState = windows.find(win => win.id === id);
    if (windowState?.isMinimized) {
      setRestoringWindow(id);
      setTimeout(() => setRestoringWindow(null), 300);
    }
    openWindow(id);
  }, [windows, openWindow]);

  const handleIconClick = useCallback((id) => {
    if (id === 'Terminal') {
      downloadResume();
      return;
    }

    if (id === 'Launchpad') {
      setLaunchpadOpen(prev => !prev);
    } else {
      setLaunchpadOpen(false);
      windows.some(win => win.id === id) ? handleMinimizeRestore(id) : openWindow(id);
    }
  }, [windows, openWindow, downloadResume, setLaunchpadOpen, handleMinimizeRestore]);

  return (
    <>
      <nav className='dock-bar'>
        <ul>
          {icons.map(({ id, imgSrc, tooltip }, index) => (
            <React.Fragment key={id}>
              {id === 'Terminal' && <span className='separator' />}
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
              {id === 'Launchpad' && <span className='separator' />}
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