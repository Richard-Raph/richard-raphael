import '../assets/css/Window.css';
import PropTypes from 'prop-types';
import { TbTableFilled } from 'react-icons/tb';
import { useState, useRef, useEffect, useCallback } from 'react';

export default function Window({ id, name, content, isActive, setActive, closeWindow, isMinimized, isMaximized, updateContent, minimizeWindow, maximizeWindow, setDraggedWindow }) {
  const dragRef = useRef(null);
  const [menu, setMenu] = useState(false);
  const [minAnimate, setMinAnimate] = useState(false);
  const [deviceState, setDeviceState] = useState(() => ({
    isSmallScreen: window.innerWidth < 600,
    isTabletAndAbove: window.innerWidth >= 600,
    isLaptopAndAbove: window.innerWidth >= 1200,
    isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
  }));
  const [pos, setPos] = useState({ top: -50, left: 0, width: null, height: null });

  // Update content on activation if not on a laptop or larger
  useEffect(() => {
    if (isActive && !deviceState.isLaptopAndAbove) {
      updateContent?.(content);
    }
  }, [content, isActive, updateContent, deviceState.isLaptopAndAbove]);

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

  // Update device state on window resize
  useEffect(() => {
    const handleResize = () => {
      setDeviceState({
        isSmallScreen: window.innerWidth < 600,
        isTabletAndAbove: window.innerWidth >= 600,
        isLaptopAndAbove: window.innerWidth >= 1200,
        isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const createResizeHandler = (direction) => (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startTop = pos.top;
    const startLeft = pos.left;
    const startWidth = pos.width;
    const startHeight = pos.height;

    const handleMouseMove = (e) => {
      const minSize = 100;
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
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    if (!deviceState.isLaptopAndAbove || isMaximized || deviceState.isTouchDevice) return;

    const offsetY = e.clientY - pos.top;
    const offsetX = e.clientX - pos.left;

    const handleMouseMove = ({ clientY, clientX }) => {
      setPos(prev => ({
        ...prev,
        left: Math.min(Math.max(0, clientX - offsetX), window.innerWidth - prev.width),
        top: Math.min(Math.max(0, clientY - offsetY), window.innerHeight - prev.height),
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
  };

  const calculateDockPosition = useCallback(() => {
    const dockIcon = document.querySelector(`[data-window-id="${id}"]`);
    if (!dockIcon || !dragRef.current) return;

    const dockRect = dockIcon.getBoundingClientRect();
    const windowRect = dragRef.current.getBoundingClientRect();

    return {
      x: dockRect.left - windowRect.left + (dockRect.width - windowRect.width) / 2,
      y: dockRect.top - windowRect.top + (dockRect.height - windowRect.height) / 2,
    };
  }, [id]);

  // Update the handleMinimize function in Window.jsx
  const handleMinimize = useCallback((e) => {
    e.stopPropagation();
    const position = calculateDockPosition();
    if (position) {
      const originalStyle = {
        opacity: dragRef.current.style.opacity,
        transform: dragRef.current.style.transform,
      };

      dragRef.current.style.opacity = '0';
      dragRef.current.style.transform = `translate(${position.x}px, ${position.y}px) scale(0.1)`;
      dragRef.current.style.transition = 'transform 0.3s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.2s';

      setTimeout(() => {
        minimizeWindow(id);
        dragRef.current.style.opacity = originalStyle.opacity;
        dragRef.current.style.transform = originalStyle.transform;
        dragRef.current.style.transition = originalStyle.transition;
      }, 300);
    }
  }, [id, minimizeWindow, calculateDockPosition]);

  const handleMouseDown = useCallback(() => {
    setActive(id);
    if (deviceState.isLaptopAndAbove && !deviceState.isTouchDevice) {
      setDraggedWindow?.(id);
    }
  }, [id, setActive, setDraggedWindow, deviceState]);

  const handleClose = useCallback((e) => {
    e.stopPropagation();
    closeWindow(id);
  }, [id, closeWindow]);

  const handleMaximize = useCallback((e) => {
    e.stopPropagation();
    maximizeWindow(id);
  }, [id, maximizeWindow]);

  const handleMenu = () => setMenu(prev => !prev);

  return (
    <section
      ref={dragRef}
      onMouseDown={handleMouseDown}
      className={`window ${isActive ? 'active' : ''} ${isMinimized ? 'min' : ''} ${isMaximized ? 'max' : ''}`}
      style={{
        width: pos.width ? `${pos.width}px` : undefined,
        height: pos.height ? `${pos.height}px` : undefined,
        top: deviceState.isSmallScreen || isMaximized ? '0' : `${pos.top}px`,
        ...(deviceState.isSmallScreen && { width: '100vw', height: '100vh' }),
        left: deviceState.isSmallScreen || isMaximized ? '0' : `${pos.left}px`,
        transition: minAnimate ? 'transform 0.3s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.3s' : '',
      }}
    >
      <div className='window-bar' onMouseDown={handleDragStart}>
        {!deviceState.isSmallScreen && (
          <div className='window-dots'>
            <button className='red' onClick={handleClose} aria-label='Close Window' />
            <button className='yellow' onClick={handleMinimize} aria-label='Minimize Window' />
            <button
              aria-label='Maximize Window'
              className={name === 'Portfolio Preferences' ? '' : 'green'}
              onClick={name === 'Portfolio Preferences' ? undefined : handleMaximize}
              style={{ pointerEvents: name === 'Portfolio Preferences' ? 'none' : 'auto' }}
            />
          </div>
        )}
        <div className='window-header'>
          <h3>{name}</h3>
          {name !== 'Portfolio Preferences' && deviceState.isSmallScreen && (<TbTableFilled onClick={handleMenu} size={20} />)}
          {deviceState.isSmallScreen && menu && (<div className='window-menu' />)}
        </div>
      </div>
      {content}
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