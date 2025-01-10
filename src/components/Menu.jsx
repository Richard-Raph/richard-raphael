import '../assets/css/Menu.css';
import PropTypes from 'prop-types';
import logo from '../assets/images/logo-fff.webp';
import { useState, useEffect, useMemo } from 'react';
import { TbWifi, TbWorldCancel } from 'react-icons/tb';
import { PiBatteryLowFill, PiBatteryHighFill, PiBatteryFullFill, PiBatteryChargingFill } from 'react-icons/pi';

// Utility functions
const updateTimeAndDate = () => {
  const now = new Date();
  return {
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: `${new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short' }).format(now)} ${now.getDate()}`,
  };
};

const useBatteryStatus = () => {
  const [battery, setBattery] = useState({ level: null, charging: false });

  useEffect(() => {
    if (!('getBattery' in navigator)) return;

    const fetchBatteryStatus = async () => {
      const batteryStatus = await navigator.getBattery();
      const updateBatteryInfo = () => setBattery({ level: batteryStatus.level, charging: batteryStatus.charging });
      updateBatteryInfo();
      batteryStatus.addEventListener('levelchange', updateBatteryInfo);
      batteryStatus.addEventListener('chargingchange', updateBatteryInfo);

      return () => {
        batteryStatus.removeEventListener('levelchange', updateBatteryInfo);
        batteryStatus.removeEventListener('chargingchange', updateBatteryInfo);
      };
    };

    fetchBatteryStatus();
  }, []);

  return battery;
};

const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(true);
    const handleOfflineStatus = () => setIsOnline(false);

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOfflineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOfflineStatus);
    };
  }, []);

  return isOnline;
};

export default function MenuBar({ activeWindow, windows }) {
  const battery = useBatteryStatus();
  const isOnline = useNetworkStatus();
  const [dateTime, setDateTime] = useState(updateTimeAndDate());

  // Cache the active window name using useMemo
  const activeWindowName = useMemo(
    () => windows.find(({ id }) => id === activeWindow)?.name || 'Welcome',
    [activeWindow, windows]
  );

  useEffect(() => {
    const interval = setInterval(() => setDateTime(updateTimeAndDate()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className='menu-bar'>
      <div className='info'>
        <img src={logo} alt='logo' width={40} />
        <h3>{window.innerWidth < 600 ? 'Welcome' : activeWindowName}</h3>
      </div>
      <div className='stats'>
        {isOnline ? <TbWifi size={20} /> : <TbWorldCancel size={20} />}
        {battery.level !== null && (
          <>
            <span>{Math.round(battery.level * 100)}%</span>
            {battery.charging ? (
              <PiBatteryChargingFill size={20} />
            ) : battery.level <= 0.25 ? (
              <PiBatteryLowFill color='#f46b5d' size={20} />
            ) : battery.level <= 0.5 ? (
              <PiBatteryHighFill color='#f9bd4e' size={20} />
            ) : (
              <PiBatteryFullFill size={20} />
            )}
          </>
        )}
        <span>{dateTime.date}</span>
        <span>{dateTime.time}</span>
      </div>
    </header>
  );
};

MenuBar.propTypes = {
  activeWindow: PropTypes.number,
  windows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};