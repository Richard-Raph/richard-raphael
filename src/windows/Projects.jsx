import { memo } from 'react';
import PropTypes from 'prop-types';
import '../assets/css/Projects.css';

const Projects = memo(() => (
  <>
    <aside>
      <div className='activity-bar'></div>
      <div className='primary-bar'></div>
    </aside>
    <div className='window-main'>
      <h2>Projects</h2>
      <p>Explore my latest projects and contributions.</p>
    </div>
  </>
));
Projects.propTypes = {
  // Add any props if needed
};

export default Projects;