import '../assets/css/Dock.css';
import PropTypes from 'prop-types';
import Launchpad from './Launchpad';
import React, { useState } from 'react';
import blog from '../assets/images/blog.webp';
import about from '../assets/images/about.webp';
import project from '../assets/images/project.webp';
import contact from '../assets/images/contact.webp';
import terminal from '../assets/images/terminal.webp';
import settings from '../assets/images/settings.webp';
import launchpad from '../assets/images/launchpad.webp';

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
  const handleIconClick = (id) => {
    if (id === 'Terminal') {
      const link = document.createElement('a');
      link.href = '/path/to/your-resume.pdf';
      link.download = 'Resume.pdf';
      link.click();
    } else if (id === 'Launchpad') { setLaunchpadOpen((prevState) => !prevState); } else { openWindow(id); }
  };

  return (
    <>
      <nav className='dock-bar'>
        <ul>
          {icons.map(({ id, imgSrc, tooltip }) => (
            <React.Fragment key={id}>
              {id === 'Portfolio Preferences' && <span className='separator' />}
              <li
                onClick={() => handleIconClick(id)}
                className={`icon ${activeWindow === id || windows.some((win) => win.name === id) ? 'open' : ''}`}
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