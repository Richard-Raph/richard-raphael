import PropTypes from 'prop-types';
import '../assets/css/Launchpad.css';
import x from '../assets/icons/w.png';
import blog from '../assets/icons/blog.webp';
import about from '../assets/icons/about.webp';
import github from '../assets/icons/github.webp';
import project from '../assets/icons/project.webp';
import contact from '../assets/icons/contact.webp';
import linkedin from '../assets/icons/linkedin.webp';
import settings from '../assets/icons/settings.webp';
import terminal from '../assets/icons/terminal.webp';
import { useDownloadResume } from '../hooks/useDownloadResume';
import React, { memo, useRef, useState, useEffect, useCallback } from 'react';

const apps = [
    { id: 'About', icon: about, label: 'About Me', action: 'openWindow' },
    { id: 'Projects', icon: project, label: 'Projects', action: 'openWindow' },
    { id: 'Blog', icon: blog, label: 'Follow my trends', action: 'openWindow' },
    { id: 'Contact', icon: contact, label: 'Talk to me', action: 'openWindow' },
    { id: 'Terminal', icon: terminal, label: 'Hire me!', action: 'downloadResume' },
    { id: 'Preferences', icon: settings, label: 'Preferences', action: 'openWindow' },
    { id: 'X', icon: x, label: 'X', action: 'openLink', url: 'https://x.com/rich_tech123' },
    { id: 'GitHub', icon: github, label: 'GitHub', action: 'openLink', url: 'https://github.com/Richard-Raph' },
    { id: 'LinkedIn', icon: linkedin, label: 'LinkedIn', action: 'openLink', url: 'https://www.linkedin.com/in/rich-tech123' },
];

const Launchpad = memo(({ isOpen, onClose, openWindow }) => {
    const searchInputRef = useRef(null);
    const downloadResume = useDownloadResume();
    const [isVisible, setIsVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredApps = apps.filter(app => app.label.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleOverlayClick = useCallback((e) => {
        if (!e.target.closest('.launchpad-search') && !e.target.closest('.launchpad-item')) { onClose(); }
    }, [onClose]);

    const handleAppClick = useCallback((app) => {
        if (app.action === 'openWindow') {
            onClose();
            openWindow(app.id);
        } else if (app.action === 'downloadResume') { downloadResume(); }
        else if (app.action === 'openLink') { window.open(app.url, '_blank'); }
    }, [onClose, openWindow, downloadResume]);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setTimeout(() => {
                if (searchInputRef.current) { searchInputRef.current.focus(); }
            }, 0);
        } else { setIsVisible(false); }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <section className={`launchpad ${isVisible ? 'visible' : ''}`} onClick={handleOverlayClick}>
            <div className='launchpad-search'>
                <span />
                <input
                    type='text'
                    value={searchQuery}
                    ref={searchInputRef}
                    placeholder='Search...'
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className='launchpad-icons'>
                {filteredApps.length > 0 ? (
                    filteredApps.map((app) => (
                        <div key={app.id} className='launchpad-item' onClick={() => handleAppClick(app)}>
                            <img width={80} src={app.icon} alt={app.label} />
                            <span>{app.label}</span>
                        </div>
                    ))
                ) : <p>No results found for "<strong>{searchQuery}</strong>"</p>}
            </div>
        </section>
    );
});

Launchpad.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    openWindow: PropTypes.func.isRequired,
};

export default Launchpad;