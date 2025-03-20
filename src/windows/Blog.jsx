import { memo } from 'react';
import PropTypes from 'prop-types';
import '../assets/css/Blog.css';

function Blog() {
    return (
        <section className='window-content'>
            <div className='sidebar'>
                <div className='title'>Favorites</div>
                <div>Recent</div>
                <div>Downloads</div>
                <div>Documents</div>
                <div>Desktop</div>
                <div>Images</div>
                <div>Music</div>
                <div>Videos</div>
                <div>Apps</div>
            </div>
            <div className='glass'>
                <h2>Blog</h2>
                <p>Follow my latest trends and updates here.</p>
            </div>
        </section>
    );
}

Blog.propTypes = {
    // Add any props if needed
};

export default memo(Blog);