import { useEffect } from 'react';

export default function Preloader() {
  useEffect(() => {
    window.lord?.init();
  }, []);

  return (
    <div className='preloader'>
      <lord-icon
        delay='1000'
        trigger='loop'
        state='in-reveal'
        style={{ width: 200, height: 200 }}
        src='https://cdn.lordicon.com/gyevrheg.json'
        colors='primary:#000000,secondary:#794628,tertiary:#ffffff,quaternary:#000000,quinary:#000000'
      ></lord-icon>
    </div>
  );
}