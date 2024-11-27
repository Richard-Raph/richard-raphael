import '../assets/css/Window.css';
import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';

export default function Window({
  id,
  name,
  content,
  isActive,
  setActive,
  closeWindow,
  minimizeWindow,
  maximizeWindow,
  setDraggedWindow,
}) {
  const dragRef = useRef(null);
  const dragBarRef = useRef(null);
  const [pos, setPos] = useState({ top: -50, left: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true); // To control initial centering

  useEffect(() => {
    if (isFirstRender && isActive) {
      const windowWidth = dragRef.current?.offsetWidth || 300; // Default width
      const windowHeight = dragRef.current?.offsetHeight || 200; // Default height
      const centerLeft = (window.innerWidth - windowWidth) / 2; // Center horizontally
      const centerTop = (window.innerHeight - windowHeight) / 2; // Center vertically

      // Adjust top to start at -50px initially
      const adjustedTop = centerTop - 43;

      setPos({ top: adjustedTop, left: centerLeft });
      setIsFirstRender(false); // Ensure it only runs once per activation
    }
  }, [isActive, isFirstRender]);

  const handleClose = (e) => {
    e.stopPropagation();
    closeWindow(id);
  };

  const handleMouseDown = () => {
    setActive(id);
    setDraggedWindow(id);
  };

  const handleMinimize = (e) => {
    e.stopPropagation();
    minimizeWindow(id);
  };

  const handleMaximize = (e) => {
    e.stopPropagation();
    setIsMaximized((prev) => !prev);
    maximizeWindow(id);
  };

  const handleDragStart = (e) => {
    if (isMaximized) return; // Cannot drag when maximized

    const offsetY = e.clientY - (pos.top || 0);
    const offsetX = e.clientX - (pos.left || 0);

    const handleMouseMove = (moveEvent) => {
      const newTop = moveEvent.clientY - offsetY;
      const newLeft = moveEvent.clientX - offsetX;
      setPos({ top: newTop, left: newLeft });
    };

    const handleMouseUp = () => {
      setDraggedWindow(null);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
  };

  return (
    <section
      ref={dragRef}
      onMouseDown={handleMouseDown}
      style={{
        top: isMaximized ? 'auto' : `${pos.top}px`,
        left: isMaximized ? 'auto' : `${pos.left}px`,
      }}
      className={`window ${isActive ? 'active' : ''} ${isMaximized ? 'max' : ''}`}
    >
      <span className='glare outer'></span>
      <div className='window-outline'>
        <span className='glare inner'></span>
        <div className='window-main'>
          <div
            ref={dragBarRef}
            className='window-bar'
            onMouseDown={handleDragStart}
          >
            <div className='window-dots'>
              <button className='dot red' onClick={handleClose}></button>
              <button className='dot yellow' onClick={handleMinimize}></button>
              <button className='dot green' onClick={handleMaximize}></button>
            </div>
          </div>
          <div className='window-content' title={name}>{content}</div>
        </div>
      </div>
    </section>
  );
}

Window.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  isActive: PropTypes.bool.isRequired,
  setActive: PropTypes.func.isRequired,
  closeWindow: PropTypes.func.isRequired,
  minimizeWindow: PropTypes.func.isRequired,
  maximizeWindow: PropTypes.func.isRequired,
  setDraggedWindow: PropTypes.func.isRequired,
};