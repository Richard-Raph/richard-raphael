import '../assets/css/Window.css';
import PropTypes from 'prop-types';
import { TbTableFilled } from 'react-icons/tb';
import { useState, useRef, useEffect, useCallback } from 'react';

export default function Window({ id, name, content, isActive, setActive, closeWindow, updateContent, maximizeWindow, setDraggedWindow }) {
  const dragRef = useRef(null);
  const [menu, setMenu] = useState(false);
  const [pos, setPos] = useState({ top: -50, left: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [deviceState, setDeviceState] = useState(() => ({
    isSmallScreen: window.innerWidth < 600,
    isTabletAndAbove: window.innerWidth >= 600,
    isLaptopAndAbove: window.innerWidth >= 1200,
    isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
  }));

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
        left: (window.innerWidth - offsetWidth) / 2,
        top: (window.innerHeight - offsetHeight) / 2 - 43,
      });
    }
  }, [isActive]);

  const handleMenu = () => setMenu(prev => !prev);

  const handleClose = useCallback((e) => {
    e.stopPropagation();
    closeWindow(id);
  }, [closeWindow, id]);

  const handleMouseDown = useCallback(() => {
    setActive(id);
    if (deviceState.isLaptopAndAbove && !deviceState.isTouchDevice) {
      setDraggedWindow?.(id);
    }
  }, [id, setActive, setDraggedWindow, deviceState]);

  const handleMaximize = useCallback((e) => {
    e.stopPropagation();
    if (deviceState.isTabletAndAbove) {
      setIsMaximized(prev => !prev);
      maximizeWindow?.(id);
    }
  }, [id, maximizeWindow, deviceState.isTabletAndAbove]);

  const handleDragStart = (e) => {
    if (!deviceState.isLaptopAndAbove || isMaximized || deviceState.isTouchDevice) return;

    const offsetY = e.clientY - pos.top;
    const offsetX = e.clientX - pos.left;

    const handleMouseMove = ({ clientY, clientX }) => {
      setPos({
        left: Math.min(Math.max(0, clientX - offsetX), window.innerWidth - dragRef.current?.offsetWidth),
        top: Math.min(Math.max(0, clientY - offsetY), window.innerHeight - dragRef.current?.offsetHeight),
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    e.preventDefault();
  };

  return (
    <section
      ref={dragRef}
      onMouseDown={handleMouseDown}
      className={`window ${isActive ? 'active' : ''} ${isMaximized ? 'max' : ''}`}
      style={{
        left: deviceState.isSmallScreen || isMaximized ? '0' : `${pos.left}px`,
        top: name === 'Portfolio Preferences' ? `${pos.top + 20}px` : (deviceState.isSmallScreen || isMaximized ? '0' : `${pos.top}px`),
        ...(deviceState.isSmallScreen ? { width: '100vw', height: '100vh' } : name === 'Portfolio Preferences' ? { width: '750px', height: '510px' } : {}),
      }}
    >
      <div className='window-bar' onMouseDown={handleDragStart}>
        {!deviceState.isSmallScreen ? (
          <div className='window-dots'>
            <button className='red' onClick={handleClose} />
            <button className='yellow' />
            <button
              className={name === 'Portfolio Preferences' ? '' : 'green'}
              onClick={name === 'Portfolio Preferences' ? null : handleMaximize}
              style={{ pointerEvents: name === 'Portfolio Preferences' ? 'none' : 'auto' }}
            />
          </div>
        ) : (
          <div className='window-header'>
            <h3>{name}</h3>
            {name === 'Portfolio Preferences' ? null : <TbTableFilled onClick={handleMenu} size={20} />}
            {menu && <div className='window-menu' />}
          </div>
        )}
      </div>
      {content}
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
  maximizeWindow: PropTypes.func.isRequired,
  setDraggedWindow: PropTypes.func.isRequired,
};