import '../assets/css/Dock.css';
import PropTypes from 'prop-types';
import home from '../assets/images/home.webp';
import blog from '../assets/images/blog.webp';
import about from '../assets/images/about.webp';
import contact from '../assets/images/contact.webp';
import project from '../assets/images/project.webp';
import terminal from '../assets/images/terminal.webp';

const icons = [
  { id: 'Home', imgSrc: home, tooltip: 'Home' },
  { id: 'About', imgSrc: about, tooltip: 'About Me' },
  { id: 'Project', imgSrc: project, tooltip: 'Projects' },
  { id: 'Blog', imgSrc: blog, tooltip: 'Follow my trends' },
  { id: 'Contact', imgSrc: contact, tooltip: 'Talk to me' },
  { id: 'Terminal', imgSrc: terminal, tooltip: 'Hire me!' },
];

export default function DockBar({ openWindow, activeWindow }) {
  const handleIconClick = (id) => {
    if (id === 'Terminal') {
      const resumeLink = '/path/to/your-resume.pdf'; // Update with the actual path to your resume file
      const anchor = document.createElement('a');
      anchor.href = resumeLink;
      anchor.download = 'Resume.pdf';
      anchor.setAttribute('rel', 'noopener noreferrer');
      anchor.click();
    } else {
      openWindow(id);
    }
  };

  return (
    <nav className='dock-bar'>
      <ul>
        {icons.map(({ id, imgSrc, tooltip }, index) => (
          <li
            key={index}
            onClick={() => handleIconClick(id)}
            className={`icon ${activeWindow === id ? 'active' : ''}`}
          >
            <img src={imgSrc} alt={tooltip} />
            <span className='tooltip'>{tooltip}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}

DockBar.propTypes = {
  openWindow: PropTypes.func.isRequired,
  activeWindow: PropTypes.string.isRequired,
};