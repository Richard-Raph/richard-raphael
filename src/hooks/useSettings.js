import { useState, useCallback } from 'react';

export const useSettings = () => {
    const [settings, setSettings] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('userSettings')) || {};
        } catch {
            return {};
        }
    });

    const updateSettings = useCallback((key, value) => {
        setSettings(prev => {
            const newSettings = { ...prev, [key]: value };
            localStorage.setItem('userSettings', JSON.stringify(newSettings));
            return newSettings;
        });
    }, []);

    return [settings, updateSettings];
};