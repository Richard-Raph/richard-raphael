import { memo } from 'react';
import '../assets/css/Blog.css';
import PropTypes from 'prop-types';

const Blog = memo(() => (
    <>
        <aside>
            <div className='title'>Favorites</div>
            <div>Recent</div>
            <div>Downloads</div>
            <div>Documents</div>
            <div>Desktop</div>
            <div>Images</div>
            <div>Music</div>
            <div>Videos</div>
            <div>Apps</div>
        </aside>
        <div className='window-main'>
            <h2>Blog</h2>
            <p>Follow my latest trends and updates here.</p>
        </div>
    </>
));

Blog.propTypes = {
    // Add any props if needed
};

export default Blog;