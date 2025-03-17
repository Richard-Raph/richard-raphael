import '../assets/css/Dock.css';
import PropTypes from 'prop-types';
import Launchpad from './Launchpad';
import blog from '../assets/icons/blog.webp';
import about from '../assets/icons/about.webp';
import project from '../assets/icons/project.webp';
import contact from '../assets/icons/contact.webp';
import terminal from '../assets/icons/terminal.webp';
import settings from '../assets/icons/settings.webp';
import React, { useState, useCallback } from 'react';
import launchpad from '../assets/icons/launchpad.webp';

const icons = [
  { id: 'About', imgSrc: about, tooltip: 'About Me' },
  { id: 'Projects', imgSrc: project, tooltip: 'Projects' },
  { id: 'Blog', imgSrc: blog, tooltip: 'Follow my trends' },
  { id: 'Contact', imgSrc: contact, tooltip: 'Talk to me' },
  { id: 'Terminal', imgSrc: terminal, tooltip: 'Hire me!' },
  { id: 'Launchpad', imgSrc: launchpad, tooltip: 'Launchpad' },
  { id: 'Portfolio Preferences', imgSrc: settings, tooltip: 'Preferences' },
];

export default function DockBar({ windows, openWindow, activeWindow, isLaunchpadOpen, setLaunchpadOpen }) {
  const [restoringWindow, setRestoringWindow] = useState(null);

  const handleMinimizeRestore = useCallback((id) => {
    const windowState = windows.find(win => win.id === id);
    if (windowState?.isMinimized) {
      setRestoringWindow(id);
      setTimeout(() => setRestoringWindow(null), 300);
    }
    openWindow(id);
  }, [openWindow, windows]);

  const handleIconClick = (id) => {
    if (id === 'Terminal') {
      const pdfUrl = '/RICHARD.pdf';
      window.open(pdfUrl, '_blank');
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'RICHARD.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const windowState = windows.find(win => win.id === id);
    if (windowState) {
      handleMinimizeRestore(id);
    } else {
      id === 'Launchpad'
        ? setLaunchpadOpen(prev => !prev)
        : (setLaunchpadOpen(false), openWindow(id));
    }
  };

  return (
    <>
      <nav className='dock-bar'>
        <ul>
          {icons
            .toSorted((a, b) => (a.id === 'Launchpad' ? -1 : b.id === 'Launchpad' ? 1 : 0))
            .map(({ id, imgSrc, tooltip }) => (
              <React.Fragment key={id}>
                {id === 'Portfolio Preferences' && <span className='separator' />}
                <li
                  data-window-id={id}
                  onClick={() => handleIconClick(id)}
                  className={`icon  ${restoringWindow === id ? 'restoring' : ''} ${windows.some(win => win.id === id) ? 'open' : ''} ${id === 'Launchpad' ? (isLaunchpadOpen ? 'active' : '') : ''}`}
                >
                  <img src={imgSrc} alt={tooltip} />
                  <span className='tooltip'>{tooltip}</span>
                </li>
              </React.Fragment>
            ))}
        </ul>
      </nav>

      <Launchpad isOpen={isLaunchpadOpen} onClose={() => setLaunchpadOpen(false)} />
    </>
  );
}

DockBar.propTypes = {
  activeWindow: PropTypes.string,
  openWindow: PropTypes.func.isRequired,
  isLaunchpadOpen: PropTypes.bool.isRequired,
  setLaunchpadOpen: PropTypes.func.isRequired,
  windows: PropTypes.arrayOf(PropTypes.object).isRequired,
};