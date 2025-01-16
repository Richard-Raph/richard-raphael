import '../assets/css/Menu.css';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import logo from '../assets/images/logo-fff.webp';
import { TbWifi, TbWorldCancel, TbBluetooth, TbBluetoothOff } from 'react-icons/tb';

const formatDateTime = () => {
  const now = new Date();
  const day = now.getDate();
  const year = now.getFullYear();
  const month = now.toLocaleDateString('en-US', { month: 'long' });
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
  return `${weekday}, ${month} ${day}, ${year}, ${now.toLocaleTimeString('en-US', { hour12: true })}`;
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

const useBluetoothStatus = () => {
  const [isBluetoothOn, setIsBluetoothOn] = useState(false);

  useEffect(() => {
    navigator.bluetooth?.getAvailability().then(setIsBluetoothOn);
  }, []);

  return isBluetoothOn;
};

export default function MenuBar({ windows, activeWindow, closeAllWindows, showBatteryPercentage }) {
  const battery = useBatteryStatus();
  const isOnline = useNetworkStatus();
  const isBluetoothOn = useBluetoothStatus();
  const [dateTime, setDateTime] = useState(formatDateTime());

  useEffect(() => {
    const interval = setInterval(() => setDateTime(formatDateTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  const activeWindowName = windows.find(({ id }) => id === activeWindow)?.name || 'Welcome';

  return (
    <header className='menu-bar'>
      <div className='info'>
        <img src={logo} alt='logo' width={30} onClick={closeAllWindows} />
        <h3>{window.innerWidth < 600 ? 'Welcome' : activeWindowName}</h3>
      </div>
      <div className='stats'>
        <span>
          {isOnline ? <TbWifi size={18} /> : <TbWorldCancel size={18} />}
          {isBluetoothOn ? <TbBluetooth size={18} /> : <TbBluetoothOff size={18} />}
        </span>
        <span>
          {battery.level !== null && (
            <>
            {showBatteryPercentage ? `${Math.round(battery.level * 100)}%` : null}
              <i
                className={`${battery.charging ? 'charging' : ''}`}
                style={{ '--level': `${Math.round(battery.level * 100)}%` }} />
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
  showBatteryPercentage: PropTypes.bool.isRequired,
};