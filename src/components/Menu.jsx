import '../assets/css/Menu.css';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import logo from '../assets/images/logo-fff.webp';
import { TbWifi, TbWorldCancel } from 'react-icons/tb';
import { PiBatteryLowFill, PiBatteryHighFill, PiBatteryFullFill, PiBatteryChargingFill } from 'react-icons/pi';

export default function MenuBar({ activeWindow, windows }) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [battery, setBattery] = useState(null);
  const [isCharging, setIsCharging] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1200);

  // Find the active window name
  const activeWindowName = windows.find((window) => window.id === activeWindow)?.name || 'Welcome';

  useEffect(() => {
    // Handle screen resizing
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Fetch battery status from the browser (if available)
    const getBatteryStatus = async () => {
      if ('getBattery' in navigator) {
        const batteryStatus = await navigator.getBattery();
        setBattery(batteryStatus);
        setIsCharging(batteryStatus.charging);

        // Update battery state when it changes
        const updateBatteryStatus = () => setBattery(batteryStatus);
        const updateChargingStatus = () => setIsCharging(batteryStatus.charging);

        batteryStatus.addEventListener('levelChange', updateBatteryStatus);
        batteryStatus.addEventListener('chargingChange', updateChargingStatus);

        return () => {
          batteryStatus.removeEventListener('levelChange', updateBatteryStatus);
          batteryStatus.removeEventListener('chargingChange', updateChargingStatus);
        };
      }
    };

    getBatteryStatus();

    const updateTimeAndDate = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); // Only hours and minutes

      // Manually format the date as 'Mon Jun 10' (without comma)
      const day = now.getDate();
      const options = { weekday: 'short', month: 'short' };
      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(now);
      setDate(`${formattedDate} ${day}`); // Format: 'Mon Jun 10'
    };

    updateTimeAndDate(); // Initialize immediately
    const timeInterval = setInterval(updateTimeAndDate, 60000); // Update every minute

    // Update the online/offline status
    const handleOnlineStatus = () => setIsOnline(true);
    const handleOfflineStatus = () => setIsOnline(false);

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOfflineStatus);

    // Cleanup function
    return () => {
      clearInterval(timeInterval);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOfflineStatus);
    };
  }, []);

  return (
    <header className='menu-bar'>
      <div className='info'>
        <img src={logo} alt='logo' width={40} />
        <h3>{isSmallScreen ? 'Welcome' : activeWindowName}</h3>
      </div>
      <div className='stats'>
        {isOnline ? (
          <TbWifi size={20} />
        ) : (
          <TbWorldCancel size={20} />
        )}
        {battery ? (
          <>
            <span>{Math.round(battery.level * 100)}%</span>
            {isCharging ? (
              <PiBatteryChargingFill size={20} />
            ) : battery.level <= 0.25 ? (
              <PiBatteryLowFill color='#f46b5d' size={20} />
            ) : battery.level <= 0.5 ? (
              <PiBatteryHighFill color='#f9bd4e' size={20} />
            ) : (
              <PiBatteryFullFill size={20} />
            )}
          </>
        ) : null}
        <span>{date}</span>
        <span>{time}</span>
      </div>
    </header>
  );
}

MenuBar.propTypes = {
  activeWindow: PropTypes.number,
  windows: PropTypes.array.isRequired,
};