import { memo } from 'react';
import PropTypes from 'prop-types';
import '../assets/css/Projects.css';

function Projects() {
  return (
    <section className='window-content'>
      <div className='project-bar'>
        <div className='activity-bar'></div>
        <div className='primary-bar'></div>
      </div>
      <div className='glass'>
        <h2>Projects</h2>
        <p>Explore my latest projects and contributions.</p>
      </div>
    </section>
  );
}

Projects.propTypes = {
  // Add any props if needed
};

export default memo(Projects);