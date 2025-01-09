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
  const [deviceState, setDeviceState] = useState({
    isSmallScreen: window.innerWidth < 600,
    isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
  });

  // Handle screen resizing and device detection
  useEffect(() => {
    const handleResize = () => {
      setDeviceState({
        isSmallScreen: window.innerWidth < 600,
        isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update content when active
  useEffect(() => {
    if (isActive) updateContent?.(content);
  }, [content, isActive, updateContent]);

  // Center window position when active
  useEffect(() => {
    if (isActive && dragRef.current) {
      const { offsetWidth = 300, offsetHeight = 200 } = dragRef.current;
      setPos({
        left: (window.innerWidth - offsetWidth) / 2,
        top: (window.innerHeight - offsetHeight) / 2 - 43,
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
    setIsMaximized(prev => !prev);
    maximizeWindow(id);
  }, [id, maximizeWindow]);

  const handleDragStart = (e) => {
    if (isMaximized || deviceState.isTouchDevice) return;

    const offsetY = e.clientY - pos.top;
    const offsetX = e.clientX - pos.left;

    const handleMouseMove = ({ clientY, clientX }) => {
      setPos({
        top: Math.min(Math.max(0, clientY - offsetY), window.innerHeight - dragRef.current?.offsetHeight),
        left: Math.min(Math.max(0, clientX - offsetX), window.innerWidth - dragRef.current?.offsetWidth),
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  };

  return (
    <section
      ref={dragRef}
      onMouseDown={handleMouseDown}
      style={{
        zIndex: isActive ? 10 : 1,
        top: deviceState.isSmallScreen || isMaximized ? '0px' : `${pos.top}px`,
        left: deviceState.isSmallScreen || isMaximized ? '0px' : `${pos.left}px`,
      }}
      className={`window ${isActive ? 'active' : ''} ${isMaximized ? 'max' : ''}`}
    >
      <span className="glare outer"></span>
      <div className="window-outline">
        <span className="glare inner"></span>
        <div className="window-main">
          <div className="window-bar" onMouseDown={handleDragStart}>
            {!deviceState.isSmallScreen ? (
              <div>
                <button className="red" onClick={handleClose}></button>
                <button className="yellow" onClick={handleMinimize}></button>
                <button className="green" onClick={handleMaximize}></button>
              </div>
            ) : (
              <>
                <h3>{name}</h3>
                <button className="red" onClick={handleClose}></button>
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