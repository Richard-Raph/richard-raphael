import '../assets/css/Menu.css';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import logo from '../assets/images/logo-fff.webp';
import { TbWifi, TbWorldCancel } from 'react-icons/tb';
import { PiBatteryLowFill, PiBatteryHighFill, PiBatteryFullFill, PiBatteryChargingFill } from 'react-icons/pi';

// Utility function for date and time
const formatDateTime = () => {
  const now = new Date();
  const day = now.getDate();

  const suffix = ['th', 'st', 'nd', 'rd'][(day % 10 > 3 || (day % 100 >= 11 && day % 100 <= 13)) ? 0 : day % 10];
  const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const formattedDate = `${now.toLocaleDateString('en-US', { weekday: 'long' })}, ${now.toLocaleDateString('en-US', { month: 'long' })} ${day}${suffix}, ${now.getFullYear()}`;

  return `${formattedDate}, ${formattedTime}`;
};

// Custom hook for battery status
const useBatteryStatus = () => {
  const [battery, setBattery] = useState({ level: null, charging: false });

  useEffect(() => {
    const updateBattery = (batteryStatus) => setBattery({ level: batteryStatus.level, charging: batteryStatus.charging });

    navigator.getBattery?.().then((batteryStatus) => {
      updateBattery(batteryStatus);
      batteryStatus.addEventListener('levelchange', () => updateBattery(batteryStatus));
      batteryStatus.addEventListener('chargingchange', () => updateBattery(batteryStatus));
    });

    return () => { }; // Cleanup handled automatically if navigator.getBattery is not supported
  }, []);

  return battery;
};

// Custom hook for network status
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  return isOnline;
};

// MenuBar component
export default function MenuBar({ windows, activeWindow, closeAllWindows }) {
  const battery = useBatteryStatus();
  const isOnline = useNetworkStatus();
  const [dateTime, setDateTime] = useState(formatDateTime());

  useEffect(() => {
    const interval = setInterval(() => setDateTime(formatDateTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  const activeWindowName = windows.find(({ id }) => id === activeWindow)?.name || 'Welcome';

  return (
    <header className='menu-bar'>
      <div className='info'>
        <img src={logo} alt='logo' width={40} onClick={closeAllWindows} />
        <h3>{window.innerWidth < 600 ? 'Welcome' : activeWindowName}</h3>
      </div>
      <div className='stats'>
        <span>
          {isOnline ? <TbWifi size={18} /> : <TbWorldCancel size={18} />}
          {battery.level !== null && (
            <>
              {Math.round(battery.level * 100)}%
              {battery.charging ? (
                <PiBatteryChargingFill size={18} />
              ) : battery.level <= 0.25 ? (
                <PiBatteryLowFill color='#f46b5d' size={18} />
              ) : battery.level <= 0.5 ? (
                <PiBatteryHighFill color='#f9bd4e' size={18} />
              ) : (
                <PiBatteryFullFill size={18} />
              )}
            </>
          )}
        </span>
        <time>{dateTime}</time>
      </div>
    </header>
  );
}

MenuBar.propTypes = {
  windows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeWindow: PropTypes.number,
  closeAllWindows: PropTypes.func.isRequired,
};