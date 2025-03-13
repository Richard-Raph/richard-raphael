import '../assets/css/Preloader.css';
import { useState, useEffect } from 'react';

export default function Preloader({ onComplete }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const minPreloaderTime = 8500; // 7 seconds in milliseconds
    const startTime = Date.now();

    const handleLoad = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minPreloaderTime - elapsedTime);

      setTimeout(() => {
        setIsLoading(false);
        onComplete(); // Call when loading is complete
      }, remainingTime);
    };

    // Ensure assets are fully loaded before hiding the preloader
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => window.removeEventListener('load', handleLoad);
  }, [onComplete]);

  if (!isLoading) return null;

  return (
    <div className='preloader'>
      <div className='animation01'>
        <div className='rhombus_small'>
          <div className='rhombus'>
            <div className='border_box'>
              {[...Array(4)].map((_, i) => <span key={i} className={`line line0${i + 1}`} />)}
              {[...Array(4)].map((_, i) => <span key={i} className={`circle circle0${i + 1}`} />)}
              {[...Array(8)].map((_, i) =>
                i % 2 === 1 ? (
                  <span key={i} className={`animation_line_wrapper animation_line0${i + 1}_wrapper`}>
                    <span className={`animation_line animation_line0${i + 1}`} />
                  </span>
                ) : (
                  <span key={i} className={`animation_line animation_line0${i + 1}`} />
                )
              )}
            </div>
            <div className='wave'>
              <div className='wave_wrapper'><div className='wave_box' /></div>
            </div>
          </div>
        </div>
      </div>
      <div className='animation02'>
        <div className='rhombus_box'>
          <span className='rhombus_item_wrapper rhombus_item01_wrapper'><span className='rhombus_item' /></span>
          <span className='rhombus_item_wrapper rhombus_item02_wrapper'><span className='rhombus_item' /></span>
        </div>
        <div className='double_content'>
          {['dotted', 'white', 'gray', 'orange'].map((color, i) => (
            <div key={i} className={`double_wrapper02 ${color}02`}><div className={`double_wrapper01 ${color}01`} /></div>
          ))}
        </div>
        <div className='name'>
          <p>RICHARD-RAPHAEL</p>
          <span className='name_circle01' />
          <span className='name_circle02' />
        </div>
      </div>
    </div>
  );
}