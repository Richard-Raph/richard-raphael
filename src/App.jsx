import './App.css';
import Home from './pages/Home';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';
import Project from './pages/Project';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import Window from './components/Window';
import { useState, useEffect } from 'react';
import Preloader from './components/Preloader';

function App() {
  const [windows, setWindows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [windowStack, setWindowStack] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [dynamicWallpaper, setDynamicWallpaper] = useState(true);
  const [deviceState, setDeviceState] = useState(() => getDeviceState());

  const contentMap = {
    Home: <Home />,
    Blog: <Blog />,
    About: <About />,
    Contact: <Contact />,
    Projects: <Project />,
    Settings: <Settings onDynamicWallpaperChange={handleDynamicWallpaperChange} />,
  };

  function handleDynamicWallpaperChange(isDynamic) {
    setDynamicWallpaper(isDynamic);
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
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const openWindow = (windowName) => {
    if (deviceState.isSmallScreen) {
      if (windows.length > 0) {
        setWindows([
          {
            ...windows[0],
            name: windowName,
            content: contentMap[windowName] || <div>Unknown Window</div>,
          },
        ]);
        setActive(windowName); // Use the string name as activeWindow
        return;
      }
    }

    const existingWindow = windows.find((win) => win.name === windowName);
    if (existingWindow) {
      setActive(existingWindow.name); // Use the string name
    } else {
      const newWindow = {
        id: windowName, // Use string-based ID
        name: windowName,
        content: contentMap[windowName] || <div>Unknown Window</div>,
      };
      setWindows((prev) => [...prev, newWindow]);
      setActive(newWindow.id); // Use the string name
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
        <Layout windows={windows} openWindow={openWindow} activeWindow={activeWindow} closeAllWindows={closeAllWindows} dynamicWallpaper={dynamicWallpaper}>
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
    </>
  );
}

export default App;