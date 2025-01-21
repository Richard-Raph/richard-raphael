import './App.css';
import Home from './pages/Home';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';
import Projects from './pages/Projects';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import Window from './components/Window';
import Context from './components/Context';
import { useState, useEffect } from 'react';
import Preloader from './components/Preloader';

function App() {
  const [windows, setWindows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [windowStack, setWindowStack] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [showSeconds, setShowSeconds] = useState(true);
  const [activeWindow, setActiveWindow] = useState(null);
  const [timeFormat, setTimeFormat] = useState('12-hour');
  const [dynamicWallpaper, setDynamicWallpaper] = useState(true);
  const [dateFormat, setDateFormat] = useState('Day, Month DD, YYYY');
  const [deviceState, setDeviceState] = useState(() => getDeviceState());
  const [showBatteryPercentage, setShowBatteryPercentage] = useState(true);

  const contentMap = {
    Home: <Home />,
    Blog: <Blog />,
    About: <About />,
    Contact: <Contact />,
    Projects: <Projects />,
    'Portfolio Preferences': <Settings
      onDateFormatChange={setDateFormat}
      onShowDateChange={handleShowDateChange}
      onTimeFormatChange={handleTimeFormatChange}
      onShowSecondsChange={handleShowSecondsChange}
      onDynamicWallpaperChange={handleDynamicWallpaperChange}
      onBatteryPercentageChange={handleBatteryPercentageChange}
    />,
  };

  function handleDynamicWallpaperChange(isDynamic) {
    setDynamicWallpaper(isDynamic);
  }

  function handleBatteryPercentageChange(showBattery) {
    setShowBatteryPercentage(showBattery);
  }

  function handleTimeFormatChange(format) {
    setTimeFormat(format);
  }

  function handleShowSecondsChange(show) {
    setShowSeconds(show);
  }

  function handleShowDateChange(show) {
    setShowDate(show);
    if (!show) {
      setDateFormat('');  // Prevent changing date format when date is hidden
    }
  }

  function getDeviceState() {
    return {
      isSmallScreen: window.innerWidth < 1200,
      isTabletAndAbove: window.innerWidth >= 600,
    };
  }

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 9000);

    const handleResize = () => {
      setDeviceState(getDeviceState());
      const isMobile = window.innerWidth < 1200;
      setWindowStack((prev) => (isMobile ? [prev[prev.length - 1]] : prev));
    };

    const handleContextMenu = (event) => {
      event.preventDefault(); // Prevent default right-click menu
      setContextMenu({ x: event.pageX, y: event.pageY });
    };

    const handleClick = () => {
      setContextMenu(null); // Close menu on any click
    };

    window.addEventListener('resize', handleResize);
    document.querySelector('body').addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      document.querySelector('body').removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const openWindow = (windowName) => {
    if (deviceState.isSmallScreen) {
      setWindows((prev) => {
        const updatedWindow = {
          ...prev[0],
          id: windowName,
          name: windowName,
          content: contentMap[windowName] || <div>Unknown Window</div>,
        };
        setActive(updatedWindow.id);
        return [updatedWindow];
      });
      return;
    }

    const existingWindow = windows.find((win) => win.id === windowName);
    if (existingWindow) {
      setActive(existingWindow.id);
    } else {
      const newWindow = {
        id: windowName,
        name: windowName,
        content: contentMap[windowName] || <div>Unknown Window</div>,
      };
      setWindows((prev) => [...prev, newWindow]);
      setActive(newWindow.id);
    }
  };

  const setActive = (windowId) => {
    setActiveWindow(windowId);
    setWindowStack((prevStack) => [...prevStack.filter((id) => id !== windowId), windowId]);
  };

  const closeWindow = (windowId) => {
    setWindows((prev) => prev.filter((win) => win.id !== windowId));
    setWindowStack((prevStack) => {
      const newStack = prevStack.filter((id) => id !== windowId);
      setActiveWindow(newStack[newStack.length - 1] || null);
      return newStack;
    });
  };

  const closeAllWindows = () => {
    if (windows.length > 0) {
      setWindows([]);
      setWindowStack([]);
      setActiveWindow(null);
    }
  };

  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <Layout
          windows={windows}
          showDate={showDate}
          openWindow={openWindow}
          timeFormat={timeFormat}
          dateFormat={dateFormat}
          showSeconds={showSeconds}
          activeWindow={activeWindow}
          closeAllWindows={closeAllWindows}
          dynamicWallpaper={dynamicWallpaper}
          showBatteryPercentage={showBatteryPercentage}
        >
          {windows.map((window) => (
            <Window
              {...window}
              key={window.id}
              setActive={setActive}
              closeWindow={closeWindow}
              isActive={window.id === activeWindow}
            />
          ))}
        </Layout>
      )}
      {contextMenu && <Context x={contextMenu.x} y={contextMenu.y} />}
    </>
  );
}

export default App;