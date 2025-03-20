import Blog from './windows/Blog';
import About from './windows/About';
import Contact from './windows/Contact';
import Layout from './components/Layout';
import Window from './components/Window';
import Projects from './windows/Projects';
import Settings from './windows/Settings';
import Context from './components/Context';
import Preloader from './components/Preloader';
import { memo, useMemo, useState, useEffect, useReducer, useCallback } from 'react';

// Custom hook for device state
const useDeviceState = () => {
  const [deviceState, setDeviceState] = useState(() => ({
    isSmallScreen: window.innerWidth < 1200,
    isTabletAndAbove: window.innerWidth >= 600,
  }));

  useEffect(() => {
    const handleResize = () => {
      setDeviceState({
        isSmallScreen: window.innerWidth < 1200,
        isTabletAndAbove: window.innerWidth >= 600,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceState;
};

// Window state reducer
const windowReducer = (state, action) => {
  switch (action.type) {
    case 'OPEN':
      return {
        ...state,
        windows: state.windows.some(w => w.id === action.id)
          ? state.windows.map(w => w.id === action.id ? { ...w, isMinimized: false } : w)
          : [...state.windows, { id: action.id, name: action.id, isMinimized: false, isMaximized: false }],
        stack: [...state.stack.filter(id => id !== action.id), action.id],
        active: action.id
      };

    case 'CLOSE':
      return {
        ...state,
        windows: state.windows.filter(w => w.id !== action.id),
        stack: state.stack.filter(id => id !== action.id),
        active: state.stack[state.stack.length - 2] || null
      };

    case 'MINIMIZE':
      return {
        ...state,
        windows: state.windows.map(w => w.id === action.id ? { ...w, isMinimized: !w.isMinimized } : w),
        stack: state.stack.filter(id => id !== action.id),
        active: state.stack[state.stack.length - 2] || null
      };

    case 'MAXIMIZE':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.id ? { ...w, isMaximized: !w.isMaximized, isMinimized: false } : w
        )
      };

    case 'CLOSE_ALL':
      return { stack: [], windows: [], active: null };

    default:
      return state;
  }
};

// Custom hook for settings
const useSettings = () => {
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

function App() {
  const deviceState = useDeviceState();
  const [settings, updateSettings] = useSettings();
  const [contextMenu, setContextMenu] = useState(null);
  const [loadComplete, setLoadComplete] = useState(false);
  const [isLaunchpadOpen, setLaunchpadOpen] = useState(false);

  const [windowState, dispatch] = useReducer(windowReducer, {
    stack: [],
    windows: [],
    active: null
  });

  // Window components map
  const windowComponents = useMemo(() => ({
    Blog: <Blog />,
    About: <About />,
    Contact: <Contact />,
    Projects: <Projects />,
    Preferences: <Settings settings={settings} updateSettings={updateSettings} />
  }), [settings, updateSettings]);

  // Context menu handler
  const handleContextMenu = useCallback((event) => {
    event.preventDefault();
    const menuWidth = 160, menuHeight = 110, margin = 10;

    setContextMenu({
      x: Math.min(event.clientX, window.innerWidth - menuWidth - margin),
      y: Math.min(event.clientY, window.innerHeight - menuHeight - margin)
    });
  }, []);

  // Event effects
  useEffect(() => {
    const handleClickOutside = (e) => !e.target.closest('.custom-menu') && setContextMenu(null);

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [handleContextMenu]);

  return (
    <>
      <Layout
        settings={settings}
        windows={windowState.windows}
        updateSettings={updateSettings}
        activeWindow={windowState.active}
        isLaunchpadOpen={isLaunchpadOpen}
        setLaunchpadOpen={setLaunchpadOpen}
        openWindow={id => dispatch({ type: 'OPEN', id })}
        closeAllWindows={() => dispatch({ type: 'CLOSE_ALL' })}
      >
        {!loadComplete && <Preloader onComplete={() => setLoadComplete(true)} />}

        {windowState.windows.map(window => (
          <Window
            {...window}
            key={window.id}
            content={windowComponents[window.id]}
            isActive={window.id === windowState.active}
            setActive={id => dispatch({ type: 'OPEN', id })}
            closeWindow={() => dispatch({ type: 'CLOSE', id: window.id })}
            minimizeWindow={() => dispatch({ type: 'MINIMIZE', id: window.id })}
            maximizeWindow={() => dispatch({ type: 'MAXIMIZE', id: window.id })}
          >
            {windowComponents[window.id] || <div>Unknown Window</div>}
          </Window>
        ))}
      </Layout>

      {contextMenu && (
        <Context
          x={contextMenu.x}
          y={contextMenu.y}
          settings={settings}
          updateSettings={updateSettings}
          setLaunchpadOpen={setLaunchpadOpen}
          openWindow={id => dispatch({ type: 'OPEN', id })}
        />
      )}
    </>
  );
}

export default memo(App);