import { memo } from 'react';
import '../assets/css/About.css';
import PropTypes from 'prop-types';

const About = memo(() => (
    <section className='window-content'>
        <div className='glass'>
            <h2>About Me</h2>
            <p>Hello! I'm Richard Raphael, a Software Developer and Data Enthusiast.</p>
        </div>
    </section>
));

About.propTypes = {
    // Add any props if needed
};

export default About;