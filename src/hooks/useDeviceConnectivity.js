import { useState, useEffect } from 'react';

export const useDeviceConnectivity = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isBluetoothOn, setIsBluetoothOn] = useState(false);

  // Network status effect
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Bluetooth status effect
  useEffect(() => {
    if (navigator.bluetooth) {
      navigator.bluetooth.getAvailability()
        .then(setIsBluetoothOn)
        .catch(console.error);
    }
  }, []);

  return {
    isOnline,
    isBluetoothOn,
    isFullyConnected: isOnline && isBluetoothOn
  };
};