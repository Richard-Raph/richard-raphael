import '../assets/css/Menu.css';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import logo from '../assets/images/logo-fff.webp';
import { TbWifi, TbWifiOff, TbBluetooth, TbBluetoothX } from 'react-icons/tb';

const formatDateTime = (settings) => {
  const now = new Date();

  let date;
  let timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: settings.timeFormat === '12-hour',
    second: settings.showSeconds ? '2-digit' : undefined,
  };

  switch (settings.dateFormat) {
    case 'DD/MM/YYYY':
      date = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      break;
    case 'MM/DD/YYYY':
      date = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()}`;
      break;
    case 'YYYY/MM/DD':
      date = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
      break;
    case 'Day, Month DD':
      date = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).replace(/,/g, '');
      break;
    default:
      date = now.toLocaleDateString('en-US');
  }

  const time = now.toLocaleTimeString('en-US', timeOptions);

  return { date, time };
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
    navigator.onLine ? setIsOnline(true) : setIsOnline(false);
    const updateOnlineStatus = () => setIsOnline(true);
    const updateOfflineStatus = () => setIsOnline(false);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOfflineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOfflineStatus);
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

export default function MenuBar({ windows, settings, activeWindow, closeAllWindows }) {
  const battery = useBatteryStatus();
  const isOnline = useNetworkStatus();
  const isBluetoothOn = useBluetoothStatus();
  const [dateTime, setDateTime] = useState(() => formatDateTime(settings));

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(formatDateTime(settings));
    }, 1000);
    return () => clearInterval(interval);
  }, [settings]);

  const activeWindowName = windows.find(({ id }) => id === activeWindow)?.name || 'Welcome';

  return (
    <header className='menu-bar'>
      <div className='info'>
        <img src={logo} alt='logo' width={30} onClick={closeAllWindows} />
        <h3>{window.innerWidth < 600 ? 'Welcome' : activeWindowName}</h3>
      </div>
      <div className='stats'>
        <div>
          {battery.level !== null && (
            <>
              {settings.showBatteryPercentage && <ins style={{ marginRight: '4px' }}>{Math.round(battery.level * 100)}%</ins>}
              <p style={{ position: 'relative', display: 'inline-flex' }}>
                <span />
                <small
                  style={{
                    width: `${0.1 + battery.level * 0.96}rem`,
                    backgroundColor:
                      battery.charging ? 'rgb(74 222 128 / 1)' : battery.level < .2 ? 'rgb(239 68 68 / 1)' : battery.level < .5 ? 'rgb(234 179 8 / 1)' : 'rgb(255 255 255 / 1)',
                  }}
                />
                {battery.charging && <i />}
              </p>
            </>
          )}
        </div>
        <span>
          {isOnline ? <TbWifi size={18} /> : <TbWifiOff size={18} />}
          {isBluetoothOn ? <TbBluetooth size={18} /> : <TbBluetoothX size={18} />}
        </span>
        {settings.showDate && <time>{dateTime.date}</time>}
        <time>{dateTime.time}</time>
      </div>
    </header>
  );
}

MenuBar.propTypes = {
  activeWindow: PropTypes.string,
  windows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  closeAllWindows: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    showDate: PropTypes.bool.isRequired,
    showSeconds: PropTypes.bool.isRequired,
    dateFormat: PropTypes.string.isRequired,
    dynamicWallpaper: PropTypes.bool.isRequired,
    showBatteryPercentage: PropTypes.bool.isRequired,
    timeFormat: PropTypes.oneOf(['12-hour', '24-hour']).isRequired,
  }).isRequired,
};