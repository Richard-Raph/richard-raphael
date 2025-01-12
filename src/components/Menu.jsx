import '../assets/css/Menu.css';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import logo from '../assets/images/logo-fff.webp';
import { TbWifi, TbWorldCancel } from 'react-icons/tb';
import { PiBatteryLowFill, PiBatteryHighFill, PiBatteryFullFill, PiBatteryChargingFill } from 'react-icons/pi';

const formatDateTime = () => {
  const now = new Date();
  const day = now.getDate();
  const suffix = ["th", "st", "nd", "rd"][(day % 10 > 3 || (day % 100 >= 11 && day % 100 <= 13)) ? 0 : day % 10];
  return `${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long' })} ${day}${suffix}, ${now.toLocaleTimeString('en-US', { hour12: true })}`;
};

const useBatteryStatus = () => {
  const [battery, setBattery] = useState({ level: null, charging: false });

  useEffect(() => {
    navigator.getBattery?.().then((batteryStatus) => {
      const updateBattery = () => setBattery({ level: batteryStatus.level, charging: batteryStatus.charging });
      updateBattery();
      batteryStatus.addEventListener('levelchange', updateBattery);
      batteryStatus.addEventListener('chargingchange', updateBattery);
      return () => {
        batteryStatus.removeEventListener('levelchange', updateBattery);
        batteryStatus.removeEventListener('chargingchange', updateBattery);
      };
    });
  }, []);

  return battery;
};

const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const checkInternetAccess = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', { method: 'HEAD' });
        setIsOnline(response.ok);
      } catch {
        setIsOnline(false);
      }
    };

    const handleOnline = () => checkInternetAccess();
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const interval = setInterval(checkInternetAccess, 2000);
    checkInternetAccess();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return isOnline;
};

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