import { memo } from 'react';
import '../assets/css/Contact.css';
import PropTypes from 'prop-types';

const Contact = memo(() => (
    <>
        <aside>
            <h2>Get in touch</h2>
        </aside>
        <div className='window-main'>
            <h2>Contact Me</h2>
            <p>Feel free to reach out to me for collaborations or inquiries.</p>
        </div>
    </>
));

Contact.propTypes = {
    // Add any props if needed
};

export default Contact;