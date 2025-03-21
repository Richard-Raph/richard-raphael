import '../assets/css/Window.css';
import PropTypes from 'prop-types';
import { memo, useRef, useMemo, useState, useEffect, useCallback } from 'react';

function Window({
  id,
  name,
  content,
  isActive,
  setActive,
  closeWindow,
  deviceState,
  isMinimized,
  isMaximized,
  minimizeWindow,
  maximizeWindow,
}) {
  const dragRef = useRef(null);
  const [restorePos, setRestorePos] = useState(null);
  const [minAnimate, setMinAnimate] = useState(false);
  const [pos, setPos] = useState({ top: -50, left: 0, width: null, height: null });

  // Center window on activation
  useEffect(() => {
    if (isActive && dragRef.current) {
      const { offsetWidth = 300, offsetHeight = 200 } = dragRef.current;
      setPos({
        width: offsetWidth,
        height: offsetHeight,
        left: (window.innerWidth - offsetWidth) / 2,
        top: (window.innerHeight - offsetHeight) / 2 - 43,
      });
    }
  }, [isActive]);

  // Handle maximize/restore
  useEffect(() => {
    if (isMaximized) {
      setRestorePos(pos); // Save current position
      setPos({
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight - 43, // Adjust for header
      });
    } else if (restorePos) {
      setPos(restorePos); // Restore position
    }
  }, [isMaximized]);

  // Resize handlers
  const createResizeHandler = useCallback((direction) => (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startTop = pos.top;
    const startLeft = pos.left;
    const startWidth = pos.width;
    const startHeight = pos.height;

    const handleMouseMove = (e) => {
      const minSize = 250;
      const newPos = { ...pos };
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      // Horizontal resizing
      if (direction.includes('left')) {
        const maxDelta = Math.min(deltaX, startWidth - minSize);
        newPos.left = startLeft + maxDelta;
        newPos.width = startWidth - maxDelta;
      }
      if (direction.includes('right')) {
        newPos.width = Math.max(minSize, startWidth + deltaX);
      }

      // Vertical resizing
      if (direction.includes('top')) {
        const maxDelta = Math.min(deltaY, startHeight - minSize);
        newPos.top = startTop + maxDelta;
        newPos.height = startHeight - maxDelta;
      }
      if (direction.includes('bottom')) {
        newPos.height = Math.max(minSize, startHeight + deltaY);
      }

      // Constrain to window boundaries
      newPos.width = Math.min(newPos.width, window.innerWidth - newPos.left);
      newPos.height = Math.min(newPos.height, window.innerHeight - newPos.top);
      newPos.left = Math.max(0, Math.min(newPos.left, window.innerWidth - newPos.width));
      newPos.top = Math.max(0, Math.min(newPos.top, window.innerHeight - newPos.height));

      setPos(newPos);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
  }, [pos]);

  // Drag handler
  const handleDragStart = useCallback((e) => {
    e.preventDefault();
    if (!deviceState.isLaptopAndAbove || isMaximized || deviceState.isTouchDevice) return;

    const offsetY = e.clientY - pos.top;
    const offsetX = e.clientX - pos.left;

    const handleMouseMove = ({ clientY, clientX }) => {
      setPos(prev => ({
        ...prev,
        left: Math.min(Math.max(0, clientX - offsetX), window.innerWidth - prev.width * 0.25),
        top: Math.min(Math.max(0, clientY - offsetY), window.innerHeight - prev.height * 0.25),
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
  }, [deviceState, isMaximized, pos]);

  // Window styles
  const windowStyles = useMemo(() => ({
    width: pos.width ? `${pos.width}px` : undefined,
    height: pos.height ? `${pos.height}px` : undefined,
    top: deviceState.isSmallScreen || isMaximized ? '0' : `${pos.top}px`,
    left: deviceState.isSmallScreen || isMaximized ? '0' : `${pos.left}px`,
    transition: minAnimate ? 'transform 0.3s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.3s' : 'none',
  }), [pos, deviceState, isMaximized, minAnimate]);

  // Minimize handler
  const handleMinimize = useCallback((e) => {
    e.stopPropagation();
    minimizeWindow(id);
  }, [id, minimizeWindow]);

  // Close handler
  const handleClose = useCallback((e) => {
    e.stopPropagation();
    closeWindow(id);
  }, [id, closeWindow]);

  // Maximize handler
  const handleMaximize = useCallback((e) => {
    e.stopPropagation();
    maximizeWindow(id);
  }, [id, maximizeWindow]);

  return (
    <section
      ref={dragRef}
      style={windowStyles}
      onMouseDown={() => setActive(id)}
      className={`window ${isActive ? 'active' : ''} ${isMinimized ? 'min' : ''} ${isMaximized ? 'max' : ''}`}
    >
      <div className='window-bar' onMouseDown={handleDragStart}>
        {!deviceState.isSmallScreen && (
          <div className='window-dots'>
            <button className='red' onClick={handleClose} aria-label='Close Window' />
            <button className='yellow' onClick={handleMinimize} aria-label='Minimize Window' />
            <button
              aria-label='Maximize Window'
              className={name === 'Preferences' ? '' : 'green'}
              onClick={name === 'Preferences' ? undefined : handleMaximize}
              style={{ pointerEvents: name === 'Preferences' ? 'none' : 'auto' }}
            />
          </div>
        )}
        <h3>{name}</h3>
      </div>
      <section className={`${name.toLowerCase()}-content`}>
        <div className='window-main'>{content}</div>
      </section>
      {!deviceState.isSmallScreen && !isMaximized && (
        <>
          <div className='window-resize top' onMouseDown={createResizeHandler('top')} />
          <div className='window-resize left' onMouseDown={createResizeHandler('left')} />
          <div className='window-resize right' onMouseDown={createResizeHandler('right')} />
          <div className='window-resize bottom' onMouseDown={createResizeHandler('bottom')} />
          <div className='window-resize top-left' onMouseDown={createResizeHandler('top-left')} />
          <div className='window-resize top-right' onMouseDown={createResizeHandler('top-right')} />
          <div className='window-resize bottom-left' onMouseDown={createResizeHandler('bottom-left')} />
          <div className='window-resize bottom-right' onMouseDown={createResizeHandler('bottom-right')} />
        </>
      )}
    </section>
  );
}

Window.propTypes = {
  isMinimized: PropTypes.bool,
  isMaximized: PropTypes.bool,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  isActive: PropTypes.bool.isRequired,
  setActive: PropTypes.func.isRequired,
  closeWindow: PropTypes.func.isRequired,
  minimizeWindow: PropTypes.func.isRequired,
  maximizeWindow: PropTypes.func.isRequired,
  deviceState: PropTypes.shape({
    isSmallScreen: PropTypes.bool.isRequired,
    isTouchDevice: PropTypes.bool.isRequired,
    isTabletAndAbove: PropTypes.bool.isRequired,
    isLaptopAndAbove: PropTypes.bool.isRequired,
  }).isRequired,
};

export default memo(Window);