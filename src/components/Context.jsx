import PropTypes from 'prop-types';
import '../assets/css/Context.css';

export default function Context({ x, y }) {
    return (
        <ul className='custom-menu' style={{ top: `${y}px`, left: `${x}px` }}>
            <li onClick={() => window.location.reload()}>Refresh</li>
            <li onClick={() => alert('Action 2 triggered!')}>Action 2</li>
            <li onClick={() => alert('Action 3 triggered!')}>Action 3</li>
        </ul>
    );
}

Context.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
};