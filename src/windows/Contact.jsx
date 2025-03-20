import { memo } from 'react';
import PropTypes from 'prop-types';
import '../assets/css/Contact.css';

function Contact() {
    return (
        <section className='window-content'>
            <div className='glass'>
                <h2>Contact Me</h2>
                <p>Feel free to reach out to me for collaborations or inquiries.</p>
            </div>
        </section>
    );
}

Contact.propTypes = {
    // Add any props if needed
};

export default memo(Contact);