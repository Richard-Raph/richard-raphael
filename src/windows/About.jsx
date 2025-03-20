import { memo } from 'react';
import PropTypes from 'prop-types';
import '../assets/css/About.css';

function About() {
    return (
        <section className='window-content'>
            <div className='glass'>
                <h2>About Me</h2>
                <p>Hello! I'm Richard Raphael, a Software Developer and Data Enthusiast.</p>
            </div>
        </section>
    );
}

About.propTypes = {
    // Add any props if needed
};

export default memo(About);