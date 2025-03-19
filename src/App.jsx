import './App.css';
import Blog from './windows/Blog';
import About from './windows/About';
import Contact from './windows/Contact';
import Layout from './components/Layout';
import Window from './components/Window';
import Projects from './windows/Projects';
import Settings from './windows/Settings';
import Context from './components/Context';
import Preloader from './components/Preloader';
import React, { useState, useEffect } from 'react';
import { AsideContent, Content } from './components/Window';

const getDeviceState = () => {
  return {
    isSmallScreen: window.innerWidth < 1200,
    isTabletAndAbove: window.innerWidth >= 600,
  };
}

const getInitialSettings = () => {
  try {
    const storedSettings = JSON.parse(localStorage.getItem('userSettings'));
    return storedSettings && typeof storedSettings === 'object' ? storedSettings : {};
  } catch (error) {
    console.error("Error loading settings:", error);
    return {};
  }
};

function App() {
  const [windows, setWindows] = useState([]);
  const [windowStack, setWindowStack] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [activeWindow, setActiveWindow] = useState(null);
  const [loadComplete, setLoadComplete] = useState(false);
  const [isLaunchpadOpen, setLaunchpadOpen] = useState(false);
  const [deviceState, setDeviceState] = useState(() => getDeviceState());
  const [settings, setSettings] = useState(() => ({
    showDate: getInitialSettings().showDate ?? true,
    showSeconds: getInitialSettings().showSeconds ?? true,
    timeFormat: getInitialSettings().timeFormat ?? '12-hour',
    dateFormat: getInitialSettings().dateFormat ?? 'Day, Month DD',
    dynamicWallpaper: getInitialSettings().dynamicWallpaper ?? true,
    showBatteryPercentage: getInitialSettings().showBatteryPercentage ?? true,
  }));

  const updateSettings = (key, value) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: value };
      console.log("Updated settings:", newSettings);
      localStorage.setItem('userSettings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const getWindowContent = (windowName) => {
    let asideContent = null;
    let mainContent = null;

    const content = (() => {
      switch (windowName) {
        case 'Blog': return <Blog />;
        case 'About': return <About />;
        case 'Contact': return <Contact />;
        case 'Projects': return <Projects />;
        case 'Preferences': return <Settings settings={settings} updateSettings={updateSettings} />;
        default: return <div>Unknown Window</div>;
      }
    })();

    const traverse = (node) => {
      if (!node) return;

      // Handle React Fragments
      if (node.type?.toString() === 'Symbol(react.fragment)') {
        React.Children.forEach(node.props.children, traverse);
        return;
      }

      if (node.type === AsideContent) {
        asideContent = node.props.children;
      } else if (node.type === Content) {
        mainContent = node.props.children;
      }

      if (node.props?.children) {
        React.Children.forEach(node.props.children, child => {
          if (typeof child !== 'string') traverse(child);
        });
      }
    };

    traverse(content);

    return { asideContent, content: mainContent };
  };

  const minimizeWindow = (windowId) => {
    setWindows(prevWindows => prevWindows.map(win => win.id === windowId ? { ...win, isMinimized: !win.isMinimized } : win));
    setWindowStack((prevStack) => {
      const newStack = prevStack.filter((id) => id !== windowId);
      setActiveWindow(newStack.length > 0 ? newStack[newStack.length - 1] : null);
      return newStack;
    });
  };

  const maximizeWindow = (windowId) => {
    setWindows(prevWindows =>
      prevWindows.map(win =>
        win.id === windowId ? { ...win, isMaximized: !win.isMaximized, isMinimized: false } : win
      )
    );
  };

  const openWindow = (windowName) => {
    if (deviceState.isSmallScreen) {
      setWindows(prev => [{
        id: windowName,
        name: windowName,
        isMinimized: false,
        isMaximized: false
      }]);
      return;
    }

    const existingWindow = windows.find(win => win.id === windowName);
    if (existingWindow) {
      setWindows(prev => prev.map(win =>
        win.id === windowName ? { ...win, isMinimized: false } : win
      ));
    } else {
      setWindows(prev => [...prev, {
        id: windowName,
        name: windowName,
        isMinimized: false,
        isMaximized: false
      }]);
    }
    setActive(windowName);
  };

  const setActive = (windowId) => {
    setWindowStack((prevStack) =>
      prevStack.includes(windowId) ? [...prevStack.filter((id) => id !== windowId), windowId] : [...prevStack, windowId]
    );
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

  useEffect(() => {
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

    window.addEventListener('resize', handleResize);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <>
      <Layout windows={windows} settings={settings} openWindow={openWindow} activeWindow={activeWindow} updateSettings={updateSettings} isLaunchpadOpen={isLaunchpadOpen} closeAllWindows={closeAllWindows} setLaunchpadOpen={setLaunchpadOpen}>
        {!loadComplete && (<Preloader onComplete={() => setLoadComplete(true)} />)}
        {/* <Preloader onComplete={() => setLoadComplete(true)} /> */}
        {windows.map(window => (
          <Window
            {...window}
            key={window.id}
            setActive={setActive}
            closeWindow={closeWindow}
            minimizeWindow={minimizeWindow}
            maximizeWindow={maximizeWindow}
            isActive={window.id === activeWindow}
          >
            {(() => {
              switch (window.id) {
                case 'Blog': return <Blog />;
                case 'About': return <About />;
                case 'Contact': return <Contact />;
                case 'Projects': return <Projects />;
                case 'Preferences': return <Settings settings={settings} updateSettings={updateSettings} />;
                default: return <div>Unknown Window</div>;
              }
            })()}
          </Window>
        ))}
      </Layout>

      {contextMenu && <Context x={contextMenu.x} y={contextMenu.y} settings={settings} openWindow={openWindow} updateSettings={updateSettings} setLaunchpadOpen={setLaunchpadOpen} />}
    </>
  );
}

export default App;