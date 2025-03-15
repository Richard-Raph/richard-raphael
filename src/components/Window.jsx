// import '../assets/css/Window.css';
// import PropTypes from 'prop-types';
// import { TbTableFilled } from 'react-icons/tb';
// import { useState, useRef, useEffect, useCallback } from 'react';

// export default function Window({ id, name, content, isActive, setActive, closeWindow, updateContent, maximizeWindow, setDraggedWindow }) {
//   const dragRef = useRef(null);
//   const [menu, setMenu] = useState(false);
//   const [pos, setPos] = useState({ top: -50, left: 0 });
//   const [isMaximized, setIsMaximized] = useState(false);
//   const [deviceState, setDeviceState] = useState(() => ({
//     isSmallScreen: window.innerWidth < 600,
//     isTabletAndAbove: window.innerWidth >= 600,
//     isLaptopAndAbove: window.innerWidth >= 1200,
//     isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
//   }));

//   // Update device state on window resize
//   useEffect(() => {
//     const handleResize = () => {
//       setDeviceState({
//         isSmallScreen: window.innerWidth < 600,
//         isTabletAndAbove: window.innerWidth >= 600,
//         isLaptopAndAbove: window.innerWidth >= 1200,
//         isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
//       });
//     };
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Update content on activation if not on a laptop or larger
//   useEffect(() => {
//     if (isActive && !deviceState.isLaptopAndAbove) {
//       updateContent?.(content);
//     }
//   }, [content, isActive, updateContent, deviceState.isLaptopAndAbove]);

//   // Center window on activation
//   useEffect(() => {
//     if (isActive && dragRef.current) {
//       const { offsetWidth = 300, offsetHeight = 200 } = dragRef.current;
//       setPos({
//         left: (window.innerWidth - offsetWidth) / 2,
//         top: (window.innerHeight - offsetHeight) / 2 - 43,
//       });
//     }
//   }, [isActive]);

//   const handleMenu = () => setMenu(prev => !prev);

//   const handleClose = useCallback((e) => {
//     e.stopPropagation();
//     closeWindow(id);
//   }, [closeWindow, id]);

//   const handleMouseDown = useCallback(() => {
//     setActive(id);
//     if (deviceState.isLaptopAndAbove && !deviceState.isTouchDevice) {
//       setDraggedWindow?.(id);
//     }
//   }, [id, setActive, setDraggedWindow, deviceState]);

//   const handleMaximize = useCallback((e) => {
//     e.stopPropagation();
//     if (deviceState.isTabletAndAbove) {
//       setIsMaximized(prev => !prev);
//       maximizeWindow?.(id);
//     }
//   }, [id, maximizeWindow, deviceState.isTabletAndAbove]);

//   const handleDragStart = (e) => {
//     if (!deviceState.isLaptopAndAbove || isMaximized || deviceState.isTouchDevice) return;

//     const offsetY = e.clientY - pos.top;
//     const offsetX = e.clientX - pos.left;

//     const handleMouseMove = ({ clientY, clientX }) => {
//       setPos({
//         left: Math.min(Math.max(0, clientX - offsetX), window.innerWidth - dragRef.current?.offsetWidth),
//         top: Math.min(Math.max(0, clientY - offsetY), window.innerHeight - dragRef.current?.offsetHeight),
//       });
//     };

//     const handleMouseUp = () => {
//       document.removeEventListener('mouseup', handleMouseUp);
//       document.removeEventListener('mousemove', handleMouseMove);
//     };

//     document.addEventListener('mouseup', handleMouseUp);
//     document.addEventListener('mousemove', handleMouseMove);
//     e.preventDefault();
//   };

//   return (
//     <section
//       ref={dragRef}
//       onMouseDown={handleMouseDown}
//       className={`window ${isActive ? 'active' : ''} ${isMaximized ? 'max' : ''}`}
//       style={{
//         left: deviceState.isSmallScreen || isMaximized ? '0' : `${pos.left}px`,
//         top: name === 'Portfolio Preferences' ? `${pos.top + 25}px` : (deviceState.isSmallScreen || isMaximized ? '0' : `${pos.top}px`),
//         ...(deviceState.isSmallScreen ? { width: '100vw', height: '100vh' } : name === 'Portfolio Preferences' ? { width: '750px', height: '510px' } : {}),
//       }}
//     >
//       <div className='window-bar' onMouseDown={handleDragStart}>
//         {!deviceState.isSmallScreen ? (
//           <div className='window-dots'>
//             <button className='red' onClick={handleClose} />
//             <button className='yellow' />
//             <button
//               className={name === 'Portfolio Preferences' ? '' : 'green'}
//               onClick={name === 'Portfolio Preferences' ? null : handleMaximize}
//               style={{ pointerEvents: name === 'Portfolio Preferences' ? 'none' : 'auto' }}
//             />
//           </div>
//         ) : (
//           <div className='window-header'>
//             <h3>{name}</h3>
//             {name === 'Portfolio Preferences' ? null : <TbTableFilled onClick={handleMenu} size={20} />}
//             {menu && <div className='window-menu' />}
//           </div>
//         )}
//       </div>
//       {content}
//     </section>
//   );
// }

// Window.propTypes = {
//   updateContent: PropTypes.func,
//   id: PropTypes.number.isRequired,
//   name: PropTypes.string.isRequired,
//   content: PropTypes.node.isRequired,
//   isActive: PropTypes.bool.isRequired,
//   setActive: PropTypes.func.isRequired,
//   closeWindow: PropTypes.func.isRequired,
//   maximizeWindow: PropTypes.func.isRequired,
//   setDraggedWindow: PropTypes.func.isRequired,
// };

import '../assets/css/Window.css';
import PropTypes from 'prop-types';
import { TbTableFilled } from 'react-icons/tb';
import { useState, useRef, useEffect, useCallback } from 'react';

export default function Window({ id, name, content, isActive, setActive, closeWindow, updateContent, maximizeWindow, setDraggedWindow }) {
  const dragRef = useRef(null);
  const [menu, setMenu] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [deviceState, setDeviceState] = useState(() => ({
    isSmallScreen: window.innerWidth < 600,
    isTabletAndAbove: window.innerWidth >= 600,
    isLaptopAndAbove: window.innerWidth >= 1200,
    isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
  }));
  const [pos, setPos] = useState({ top: -50, left: 0, width: null, height: null });

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
        width: offsetWidth,
        height: offsetHeight,
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
    e.preventDefault();
  };

  const createResizeHandler = (direction) => (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startTop = pos.top;
    const startLeft = pos.left;
    const startWidth = pos.width;
    const startHeight = pos.height;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const newPos = { ...pos };
      const minSize = 100;

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

  return (
    <section
      ref={dragRef}
      onMouseDown={handleMouseDown}
      className={`window ${isActive ? 'active' : ''} ${isMaximized ? 'max' : ''}`}
      style={{
        width: pos.width ? `${pos.width}px` : undefined,
        height: pos.height ? `${pos.height}px` : undefined,
        left: deviceState.isSmallScreen || isMaximized ? '0' : `${pos.left}px`,
        top: name === 'Portfolio Preferences' ? `${pos.top + 25}px` : (deviceState.isSmallScreen || isMaximized ? '0' : `${pos.top}px`),
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
      {!deviceState.isSmallScreen && !isMaximized && (
        <>
          <div className="resize-handle top" onMouseDown={createResizeHandler('top')} />
          <div className="resize-handle left" onMouseDown={createResizeHandler('left')} />
          <div className="resize-handle right" onMouseDown={createResizeHandler('right')} />
          <div className="resize-handle bottom" onMouseDown={createResizeHandler('bottom')} />
          <div className="resize-handle top-left" onMouseDown={createResizeHandler('top-left')} />
          <div className="resize-handle top-right" onMouseDown={createResizeHandler('top-right')} />
          <div className="resize-handle bottom-left" onMouseDown={createResizeHandler('bottom-left')} />
          <div className="resize-handle bottom-right" onMouseDown={createResizeHandler('bottom-right')} />
        </>
      )}
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