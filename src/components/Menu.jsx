import '../assets/css/Menu.css';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import logo from '../assets/images/logo-fff.webp';
import { TbWifi, TbWorldCancel, TbBluetooth, TbBluetoothOff } from 'react-icons/tb';

const formatDateTime = (showSeconds, timeFormat, dateFormat) => {
  const now = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };

  // Adjust format based on selected dateFormat
  switch (dateFormat) {
    case 'DD/MM/YYYY':
      options.day = '2-digit';
      options.year = 'numeric';
      options.month = '2-digit';
      break;
    case 'MM/DD/YYYY':
      options.day = '2-digit';
      options.year = 'numeric';
      options.month = '2-digit';
      break;
    case 'YYYY/MM/DD':
      options.day = '2-digit';
      options.year = 'numeric';
      options.month = '2-digit';
      break;
    case 'Day, Month DD, YYYY':
    default:
      break;
  }

  let date = now.toLocaleDateString('en-US', options);
  let time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: timeFormat === '12-hour',
    second: showSeconds ? '2-digit' : undefined,
  });

  return `${date}, ${time}`;
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

    const handleOffline = () => setIsOnline(false);
    const handleOnline = () => checkInternetAccess();

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

export default function MenuBar({ windows, activeWindow, closeAllWindows, showBatteryPercentage, showSeconds, timeFormat, dateFormat }) {
  const battery = useBatteryStatus();
  const isOnline = useNetworkStatus();
  const isBluetoothOn = useBluetoothStatus();
  const [dateTime, setDateTime] = useState(formatDateTime(showSeconds, timeFormat));

  useEffect(() => {
    const interval = setInterval(() => setDateTime(formatDateTime(showSeconds, timeFormat, dateFormat)), 1000);
    return () => clearInterval(interval);
  }, [showSeconds, timeFormat, dateFormat]);

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
  showSeconds: PropTypes.bool.isRequired,
  closeAllWindows: PropTypes.func.isRequired,
  showBatteryPercentage: PropTypes.bool.isRequired,
  timeFormat: PropTypes.oneOf(['12-hour', '24-hour']).isRequired,
};