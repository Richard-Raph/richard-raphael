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
  const [windowStack, setWindowStack] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [activeWindow, setActiveWindow] = useState(null);
  const [deviceState, setDeviceState] = useState(() => getDeviceState());
  const [settings, setSettings] = useState({
    showDate: true,
    showSeconds: true,
    timeFormat: '12-hour',
    dynamicWallpaper: true,
    showBatteryPercentage: true,
    dateFormat: 'Day, Month DD, YYYY',
  });

  const updateSettings = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const contentMap = {
    Home: <Home />,
    Blog: <Blog />,
    About: <About />,
    Contact: <Contact />,
    Projects: <Projects />,
    'Portfolio Preferences': (
      <Settings settings={settings} updateSettings={updateSettings} />
    ),
  };

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

      const margin = 5; // Some margin for better visibility
      const menuWidth = 160;  // Width of your context menu (adjust accordingly)
      const menuHeight = 110; // Height of your context menu (adjust accordingly)

      let x = event.pageX;
      let y = event.pageY;

      // Check if the context menu is near the right edge
      if (x + menuWidth > window.innerWidth - margin) {
        x = window.innerWidth - menuWidth - margin; // Shift to the left
      }

      // Check if the context menu is near the bottom edge
      if (y + menuHeight > window.innerHeight - margin) {
        y = window.innerHeight - menuHeight - margin; // Shift to the top
      }

      setContextMenu({ x, y });
    };

    const handleClickOutside = (event) => {
      if (!event.target.closest('.custom-menu')) { // Ensure clicks inside the context menu don't close it
        setContextMenu(null); // Close menu on any click outside
      }
    };

    const handleWindowBlur = () => {
      setContextMenu(null); // Close context menu when window loses focus (e.g., tab switch, app change)
    };

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('contextmenu', handleContextMenu);

    // Cleanup event listeners when component unmounts
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('contextmenu', handleContextMenu);
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
        <Layout windows={windows} settings={settings} openWindow={openWindow} closeAllWindows={closeAllWindows} activeWindow={activeWindow}>
          {windows.map((window) => <Window {...window} key={window.id} setActive={setActive} closeWindow={closeWindow} isActive={window.id === activeWindow} />)}
        </Layout>
      )}
      {contextMenu && <Context x={contextMenu.x} y={contextMenu.y} />}
    </>
  );
}

export default App;