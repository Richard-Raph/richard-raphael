import '../assets/css/Menu.css';
import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import logo from '../assets/images/logo-fff.webp';
import { useDateTime } from '../hooks/useDateTime';
import { useBatteryStatus } from '../hooks/useBatteryStatus';
import { useDeviceConnectivity } from '../hooks/useDeviceConnectivity';
import { TbWifi, TbWifiOff, TbBluetooth, TbBluetoothX } from 'react-icons/tb';

const Menu = memo(({ windows, settings, activeWindow }) => {
  const battery = useBatteryStatus();
  const dateTime = useDateTime(settings);
  const { isOnline, isBluetoothOn } = useDeviceConnectivity();

  const activeWindowName = useMemo(() => (
    windows.find(({ id }) => id === activeWindow)?.name || 'Welcome'
  ), [windows, activeWindow]);

  const batteryLevel = useMemo(() => (
    battery.level !== null ? Math.round(battery.level * 100) : null
  ), [battery.level]);

  const batteryColor = useMemo(() => (
    battery.charging ? '#00ca4e' :
      battery.level < 0.2 ? 'rgb(239 68 68 / 1)' :
        battery.level < 0.5 ? 'rgb(234 179 8 / 1)' :
          'rgb(255 255 255 / 1)'
  ), [battery.level, battery.charging]);

  return (
    <header className='menu-bar'>
      <div className='info'>
        <img src={logo} alt='logo' width={30} />
        <h3>{window.innerWidth < 600 ? 'Welcome' : activeWindowName}</h3>
      </div>
      <div className='stats'>
        <div>
          {battery.level !== null && (
            <>
              {settings.showBatteryPercentage && <ins style={{ marginRight: '4px' }}>{batteryLevel}%</ins>}
              <p style={{ position: 'relative', display: 'inline-flex' }}>
                <span />
                <small style={{
                  backgroundColor: batteryColor,
                  width: `${0.1 + battery.level * 0.96}rem`
                }} />
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
});

Menu.propTypes = {
  windows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  settings: PropTypes.shape({
    showDate: PropTypes.bool.isRequired,
    showSeconds: PropTypes.bool.isRequired,
    dateFormat: PropTypes.string.isRequired,
    dynamicWallpaper: PropTypes.bool.isRequired,
    showBatteryPercentage: PropTypes.bool.isRequired,
    timeFormat: PropTypes.oneOf(['12-hour', '24-hour']).isRequired,
  }).isRequired,
  activeWindow: PropTypes.string,
};

export default Menu;