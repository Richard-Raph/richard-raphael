import { useState, useEffect } from 'react';

export const useBatteryStatus = () => {
    const [battery, setBattery] = useState({ level: null, charging: false });

    useEffect(() => {
        const getBattery = async () => {
            try {
                const battery = await navigator.getBattery();
                const update = () => setBattery({
                    level: battery.level,
                    charging: battery.charging
                });

                update();
                battery.addEventListener('levelchange', update);
                battery.addEventListener('chargingchange', update);

                return () => {
                    battery.removeEventListener('levelchange', update);
                    battery.removeEventListener('chargingchange', update);
                };
            } catch {
                setBattery({ level: null, charging: false });
            }
        };

        getBattery();
    }, []);

    return battery;
};