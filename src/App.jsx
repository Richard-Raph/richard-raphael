import './App.css';
import Blog from './windows/Blog';
import About from './windows/About';
import Contact from './windows/Contact';
import Layout from './components/Layout';
import Window from './components/Window';
import Projects from './windows/Projects';
import Settings from './windows/Settings';
import Context from './components/Context';
import CodeIntro from './components/CodeIntro';
import Preloader from './components/Preloader';
import { useMemo, useState, useEffect } from 'react';

function App() {
  const [windows, setWindows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [windowStack, setWindowStack] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [activeWindow, setActiveWindow] = useState(null);
  const [showCodeIntro, setShowCodeIntro] = useState(false);
  const [isLaunchpadOpen, setLaunchpadOpen] = useState(false);
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

  const contentMap = useMemo(() => ({
    Blog: <Blog />,
    About: <About />,
    Contact: <Contact />,
    Projects: <Projects />,
    'Portfolio Preferences': <Settings settings={settings} updateSettings={updateSettings} />,
  }), [settings]);

  function getDeviceState() {
    return {
      isSmallScreen: window.innerWidth < 1200,
      isTabletAndAbove: window.innerWidth >= 600,
    };
  }

  useEffect(() => {
    // Show preloader for 9 seconds, then show CodeIntro
    const preloaderTimer = setTimeout(() => {
      setLoading(false);
      setShowCodeIntro(true);
    }, 9000);

    const handleResize = () => {
      setDeviceState(getDeviceState());
      const isMobile = window.innerWidth < 1200;
      setWindowStack((prev) => (isMobile ? [prev[prev.length - 1]] : prev));
    };

    const handleContextMenu = (event) => {
      event.preventDefault();
      const margin = 10;
      const menuWidth = 160;
      const menuHeight = 110;
      let x = event.clientX;
      let y = event.clientY;

      if (x + menuWidth > window.innerWidth - margin) {
        x = window.innerWidth - menuWidth - margin;
      }
      if (y + menuHeight > window.innerHeight - margin) {
        y = window.innerHeight - menuHeight - margin;
      }

      setContextMenu({ x, y });
    };

    const handleClickOutside = (event) => {
      if (!event.target.closest('.custom-menu')) {
        setContextMenu(null);
      }
    };

    const handleWindowBlur = () => {
      setContextMenu(null);
    };

    // Event Listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      clearTimeout(preloaderTimer);
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
        setLaunchpadOpen((prev) => !prev);
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
    setWindowStack((prevStack) => {
      if (prevStack[prevStack.length - 1] === windowId) return prevStack;
      return [...prevStack.filter((id) => id !== windowId), windowId];
    });
    setActiveWindow(windowId);
  };

  const closeWindow = (windowId) => {
    setWindows((prev) => prev.filter((win) => win.id !== windowId));
    setWindowStack((prevStack) => {
      const newStack = prevStack.filter((id) => id !== windowId);
      setActiveWindow(newStack.length > 0 ? newStack[newStack.length - 1] : null);
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
      ) : showCodeIntro ? (
        <CodeIntro onComplete={() => setShowCodeIntro(false)} />
      ) : (
        <Layout windows={windows} settings={settings} openWindow={openWindow} activeWindow={activeWindow} isLaunchpadOpen={isLaunchpadOpen} closeAllWindows={closeAllWindows} setLaunchpadOpen={setLaunchpadOpen}>
          {windows.map((window) => (
            <Window {...window} key={window.id} setActive={setActive} closeWindow={closeWindow} isActive={window.id === activeWindow} />
          ))}
        </Layout>
      )}
      {contextMenu && <Context x={contextMenu.x} y={contextMenu.y} />}
    </>
  );
}

export default App;