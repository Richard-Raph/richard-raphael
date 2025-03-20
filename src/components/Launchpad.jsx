import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import '../assets/css/Launchpad.css';
import blog from '../assets/icons/blog.webp';
import about from '../assets/icons/about.webp';
import github from '../assets/icons/github.webp';
import project from '../assets/icons/project.webp';
import contact from '../assets/icons/contact.webp';
import twitter from '../assets/icons/twitter.webp';
import terminal from '../assets/icons/terminal.webp';
import settings from '../assets/icons/settings.webp';
import linkedin from '../assets/icons/linkedin.webp';

const apps = [
    { id: 'About', icon: about, label: 'About Me', action: 'openWindow' },
    { id: 'Projects', icon: project, label: 'Projects', action: 'openWindow' },
    { id: 'Blog', icon: blog, label: 'Follow my trends', action: 'openWindow' },
    { id: 'Contact', icon: contact, label: 'Talk to me', action: 'openWindow' },
    { id: 'Terminal', icon: terminal, label: 'Hire me!', action: 'downloadResume' },
    { id: 'Preferences', icon: settings, label: 'Preferences', action: 'openWindow' },
    { id: 'GitHub', icon: github, label: 'GitHub', action: 'openLink', url: 'https://github.com/Richard-Raph' },
    { id: 'LinkedIn', icon: linkedin, label: 'LinkedIn', action: 'openLink', url: 'https://www.linkedin.com/in/rich-tech123' },
    { id: 'Twitter', icon: twitter, label: 'Twitter', action: 'openLink', url: 'https://twitter.com' },
];

function Launchpad({ isOpen, onClose, openWindow }) {
    const [isVisible, setIsVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null);

    // Handle app clicks
    const handleAppClick = useCallback((app) => {
        if (app.action === 'openWindow') {
            onClose(); // Close the launchpad
            openWindow(app.id); // Open the selected window
        } else if (app.action === 'openLink') {
            window.open(app.url, '_blank'); // Open link in a new tab
        } else if (app.action === 'downloadResume') {
            const pdfUrl = '/RICHARD.pdf';
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'Richard_Raphael.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }, [onClose, openWindow]);

    // Filter apps based on search query
    const filteredApps = apps.filter(app =>
        app.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle scaling animation
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Focus the search input when Launchpad opens
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    // Close Launchpad when clicking outside
    const handleOverlayClick = useCallback((e) => {
        // Only close if clicking outside the search bar or icons
        if (!e.target.closest('.launchpad-search') && !e.target.closest('.launchpad-item')) {
            onClose();
        }
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className={`launchpad ${isVisible ? 'visible' : ''}`} onClick={handleOverlayClick}>
            <input
                ref={searchInputRef}
                autoFocus
                type='text'
                value={searchQuery}
                placeholder='Search...'
                className='launchpad-search'
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className='launchpad-icons'>
                {filteredApps.length > 0 ? (
                    filteredApps.map((app) => (
                        <div key={app.id} className='launchpad-item' onClick={() => handleAppClick(app)}>
                            <img src={app.icon} alt={app.label} />
                            <span>{app.label}</span>
                        </div>
                    ))
                ) : (
                    <p>No results found for "<strong>{searchQuery}</strong>"</p>
                )}
            </div>
        </div>
    );
}

Launchpad.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    openWindow: PropTypes.func.isRequired,
};

export default memo(Launchpad);