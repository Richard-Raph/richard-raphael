import { memo } from 'react';
import '../assets/css/About.css';
import PropTypes from 'prop-types';

const About = memo(() => (
    <>
        <aside>
            <h2>Our Story</h2>
        </aside>
        <div className='window-main'>
            <h2>About Me</h2>
            <p>Hello! I'm Richard Raphael, a Software Developer and Data Enthusiast.</p>
        </div>
    </>
));

About.propTypes = {
    // Add any props if needed
};

export default About;