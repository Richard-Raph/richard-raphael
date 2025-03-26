import { useState, useEffect } from 'react';

export const useBluetoothStatus = () => {
    const [isBluetoothOn, setIsBluetoothOn] = useState(false);

    useEffect(() => {
        if (navigator.bluetooth) {
            navigator.bluetooth.getAvailability()
                .then(setIsBluetoothOn)
                .catch(console.error);
        }
    }, []);

    return isBluetoothOn;
};