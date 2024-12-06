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
          <div className='window-content'>
            <div className='grid'>
              <svg xmlns='http://www.w3.org/2000/svg' width='982' height='786' viewBox='0 0 982 786' fill='none'>
                <path fillRule='evenodd' clipRule='evenodd' d='M490 401V537H348.5V401H490ZM490 785.5V676H348.5V785.5H347.5V676H206V785.5H205V676H63.5V785.5H62.5V676H0V675H62.5V538H0V537H62.5V401H0V400H62.5V258H0V257H62.5V116H0V115H62.5V0H63.5V115L205 115V0H206V115L347.5 115V0H348.5V115H490V0H491V115L627.5 115V0H628.5V115H765V0H766V115L902.5 115V0H903.5V115H982V116H903.5V257H982V258H903.5V400H982V401H903.5V537H982V538H903.5V675H982V676H903.5V785.5H902.5V676H766V785.5H765V676H628.5V785.5H627.5V676H491V785.5H490ZM902.5 675V538H766V675H902.5ZM902.5 537V401H766V537H902.5ZM902.5 400V258H766V400H902.5ZM902.5 257V116L766 116V257H902.5ZM627.5 675H491V538H627.5V675ZM765 675H628.5V538H765V675ZM348.5 675H490V538H348.5V675ZM347.5 538V675H206V538H347.5ZM205 538V675H63.5V538H205ZM765 537V401H628.5V537H765ZM765 400V258H628.5V400H765ZM765 257V116H628.5V257H765ZM347.5 401V537H206V401H347.5ZM205 401V537H63.5V401H205ZM627.5 401V537H491V401H627.5ZM627.5 116L491 116V257H627.5V116ZM627.5 258H491V400H627.5V258ZM63.5 257V116L205 116V257H63.5ZM63.5 400V258H205V400H63.5ZM206 116V257H347.5V116L206 116ZM348.5 116V257H490V116H348.5ZM206 400V258H347.5V400H206ZM348.5 258V400H490V258H348.5Z' fill='url(#paint0_radial_1_8)' />
                <defs>
                  <radialGradient id='paint0_radial_1_8' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='translate(491 392.75) rotate(90) scale(513.25 679.989)'>
                    <stop stopColor='white' stopOpacity='0.2' />
                    <stop offset='1' stopColor='#000' stopOpacity='0' />
                  </radialGradient>
                </defs>
              </svg>
              <span></span>
            </div>
            {content}
          </div>
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