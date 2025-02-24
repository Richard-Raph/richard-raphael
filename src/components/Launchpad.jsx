import React from 'react';
import PropTypes from 'prop-types';
import '../assets/css/Launchpad.css';

export default function Launchpad({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className='launchpad-overlay' onClick={onClose}>
            <div className='launchpad-content' onClick={(e) => e.stopPropagation()}>
                <h2>Launchpad</h2>
                <p>Quick access to apps</p>
                {/* Add grid of icons here */}
            </div>
        </div>
    );
}

Launchpad.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};