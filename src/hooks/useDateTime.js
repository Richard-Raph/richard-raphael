export const useDateTime = (settings) => {
    const now = new Date();
    const dateFormats = {
        'DD/MM/YYYY': () => `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`,
        'MM/DD/YYYY': () => `${pad(now.getMonth() + 1)}/${pad(now.getDate())}/${now.getFullYear()}`,
        'YYYY/MM/DD': () => `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())}`,
        'Day, Month DD': () => now.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        }).replace(/,/g, ''),
        default: () => now.toLocaleDateString('en-US')
    };

    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: settings.timeFormat === '12-hour',
        second: settings.showSeconds ? '2-digit' : undefined
    };

    const pad = num => String(num).padStart(2, '0');

    return {
        date: (dateFormats[settings.dateFormat] || dateFormats.default)(),
        time: now.toLocaleTimeString('en-US', timeOptions)
    };
};