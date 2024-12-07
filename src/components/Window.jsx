import '../assets/css/Window.css';
import PropTypes from 'prop-types';
import { useState, useRef, useEffect, useCallback } from 'react';

export default function Window({
  id,
  name,
  content,
  isActive,
  setActive,
  closeWindow,
  updateContent,
  minimizeWindow,
  maximizeWindow,
  setDraggedWindow,
}) {
  const dragRef = useRef(null);
  const [pos, setPos] = useState({ top: -50, left: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);

  // Update content if active
  useEffect(() => {
    isActive && updateContent?.(content);
  }, [content, isActive, updateContent]);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Center window with adjusted top
  useEffect(() => {
    if (isActive && dragRef.current) {
      const { offsetWidth = 300, offsetHeight = 200 } = dragRef.current;
      setPos({
        left: (window.innerWidth - offsetWidth) / 2,
        top: (window.innerHeight - offsetHeight) / 2 - 43, // Adjusted top
      });
    }
  }, [isActive]);

  // Event Handlers
  const handleClose = useCallback((e) => {
    e.stopPropagation();
    closeWindow(id);
  }, [closeWindow, id]);

  const handleMouseDown = useCallback(() => {
    setActive(id);
    setDraggedWindow(id);
  }, [id, setActive, setDraggedWindow]);

  const handleMinimize = useCallback((e) => {
    e.stopPropagation();
    minimizeWindow(id);
  }, [id, minimizeWindow]);

  const handleMaximize = useCallback((e) => {
    e.stopPropagation();
    setIsMaximized((prev) => !prev);
    maximizeWindow(id);
  }, [id, maximizeWindow]);

  const handleDragStart = (e) => {
    if (isMaximized) return;

    const offsetY = e.clientY - pos.top;
    const offsetX = e.clientX - pos.left;

    const handleMouseMove = ({ clientY, clientX }) => {
      const windowWidth = dragRef.current?.offsetWidth || 300;
      const windowHeight = dragRef.current?.offsetHeight || 200;

      setPos({
        left: Math.min(Math.max(0, clientX - offsetX), window.innerWidth - windowWidth),
        top: Math.min(Math.max(0, clientY - offsetY), window.innerHeight - windowHeight),
      });
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
        zIndex: isActive ? 10 : 1,
        top: isSmallScreen ? '0px' : isMaximized ? 'auto' : `${pos.top}px`,
        left: isSmallScreen ? '0px' : isMaximized ? 'auto' : `${pos.left}px`,
      }}
      className={`window ${isActive ? 'active' : ''} ${isMaximized ? 'max' : ''}`}
    >
      <span className="glare outer"></span>
      <div className="window-outline">
        <span className="glare inner"></span>
        <div className="window-main">
          <div className="window-bar" onMouseDown={handleDragStart}>
            {!isSmallScreen ? (
              <div className="window-dots">
                <button className="dot red" onClick={handleClose}></button>
                <button className="dot yellow" onClick={handleMinimize}></button>
                <button className="dot green" onClick={handleMaximize}></button>
              </div>
            ) : (
              <>
                <h3>{name}</h3>
                <button className="close" onClick={handleClose}></button>
              </>
            )}
          </div>
          {content}
        </div>
      </div>
    </section>
  );
}

Window.propTypes = {
  updateContent: PropTypes.func,
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