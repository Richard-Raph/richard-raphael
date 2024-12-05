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
  updateContent,
  minimizeWindow,
  maximizeWindow,
  setDraggedWindow,
}) {
  const dragRef = useRef(null);
  const dragBarRef = useRef(null);
  const [pos, setPos] = useState({ top: -50, left: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1200);

  useEffect(() => {
    if (isActive) {
      updateContent && updateContent(content);
    }
  }, [content, isActive, updateContent]);

  useEffect(() => {
    const handleResize = () => {
      console.log('Window resized');
      setIsSmallScreen(window.innerWidth < 1200);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isFirstRender && isActive) {
      const windowWidth = dragRef.current?.offsetWidth || 300;
      const centerLeft = (window.innerWidth - windowWidth) / 2;
      const windowHeight = dragRef.current?.offsetHeight || 200;
      const centerTop = (window.innerHeight - windowHeight) / 2;

      const adjustedTop = centerTop - 43;

      setPos({ top: adjustedTop, left: centerLeft });
      setIsFirstRender(false);
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
    if (isMaximized) return;

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
        zIndex: isActive ? 10 : 1,
        top: isSmallScreen ? '0px' : isMaximized ? 'auto' : `${pos.top}px`,
        left: isSmallScreen ? '0px' : isMaximized ? 'auto' : `${pos.left}px`,
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
            {!isSmallScreen && (
              <div className='window-dots'>
                <button className='dot red' onClick={handleClose}></button>
                <button className='dot yellow' onClick={handleMinimize}></button>
                <button className='dot green' onClick={handleMaximize}></button>
              </div>
            )}
            {isSmallScreen && (
              <>
                <h3>{name}</h3>
                <button className='close' onClick={handleClose}></button>
              </>
            )}
          </div>
          <div className='window-content'>{content}</div>
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