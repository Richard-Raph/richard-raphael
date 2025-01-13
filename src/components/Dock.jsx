import React from 'react';
import '../assets/css/Dock.css';
import PropTypes from 'prop-types';
import home from '../assets/images/home.webp';
import blog from '../assets/images/blog.webp';
import about from '../assets/images/about.webp';
import project from '../assets/images/project.webp';
import contact from '../assets/images/contact.webp';
import terminal from '../assets/images/terminal.webp';
import settings from '../assets/images/settings.webp';

const icons = [
  { id: 'Home', imgSrc: home, tooltip: 'Home' },
  { id: 'About', imgSrc: about, tooltip: 'About Me' },
  { id: 'Projects', imgSrc: project, tooltip: 'Projects' },
  { id: 'Blog', imgSrc: blog, tooltip: 'Follow my trends' },
  { id: 'Contact', imgSrc: contact, tooltip: 'Talk to me' },
  { id: 'Terminal', imgSrc: terminal, tooltip: 'Hire me!' },
  { id: 'Settings', imgSrc: settings, tooltip: 'Portfolio Preferences' },
];

export default function DockBar({ openWindow, activeWindow }) {
  const handleIconClick = (id) => {
    if (id === 'Terminal') {
      const link = document.createElement('a');
      link.href = '/path/to/your-resume.pdf';
      link.download = 'Resume.pdf';
      link.click();
    } else {
      openWindow(id);
    }
  };

  return (
    <nav className='dock-bar'>
      <ul>
        {icons.map(({ id, imgSrc, tooltip }, index) => (
          <React.Fragment key={id}>
            {id === 'Settings' && <span className='separator'></span>}
            <li
              onClick={() => handleIconClick(id)}
              className={`icon ${activeWindow === id ? 'active' : ''}`}
            >
              <img src={imgSrc} alt={tooltip} />
              <span className='tooltip'>{tooltip}</span>
            </li>
          </React.Fragment>
        ))}
      </ul>
    </nav>
  );
}

DockBar.propTypes = {
  activeWindow: PropTypes.number,
  openWindow: PropTypes.func.isRequired,
};