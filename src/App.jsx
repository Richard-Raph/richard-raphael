import Blog from './windows/Blog';
import About from './windows/About';
import Contact from './windows/Contact';
import Projects from './windows/Projects';
import Settings from './windows/Settings';
import Layout from './components/Layout';
import Window from './components/Window';
import Context from './components/Context';
import Preloader from './components/Preloader';
import { useSettings } from './hooks/useSettings';
import { useDeviceState } from './hooks/useDeviceState';
import { useWindowReducer } from './hooks/useWindowReducer';
import { memo, useMemo, useReducer, useState, useEffect, useCallback } from 'react';

function App() {
  const deviceState = useDeviceState();
  const [settings, updateSettings] = useSettings();
  const [contextMenu, setContextMenu] = useState(null);
  const [loadComplete, setLoadComplete] = useState(false);
  const [isLaunchpadOpen, setLaunchpadOpen] = useState(false);
  const [windowState, dispatch] = useReducer(useWindowReducer, {
    stack: [],
    windows: [],
    active: null,
  });

  const windowComponents = useMemo(() => ({
    Blog: <Blog />,
    About: <About />,
    Contact: <Contact />,
    Projects: <Projects />,
    Preferences: <Settings settings={settings} updateSettings={updateSettings} />,
  }), [settings, updateSettings]);

  const openWindow = useCallback((id) => {
    dispatch({
      id,
      deviceState,
      type: 'OPEN',
      content: windowComponents[id],
    });
  }, [deviceState, windowComponents]);

  const handleContextMenu = useCallback((event) => {
    event.preventDefault();
    const menuWidth = 160, menuHeight = 110, margin = 10;

    setContextMenu({
      x: Math.min(event.clientX, window.innerWidth - menuWidth - margin),
      y: Math.min(event.clientY, window.innerHeight - menuHeight - margin),
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
        openWindow={openWindow}
        deviceState={deviceState}
        windows={windowState.windows}
        updateSettings={updateSettings}
        activeWindow={windowState.active}
        isLaunchpadOpen={isLaunchpadOpen}
        setLaunchpadOpen={setLaunchpadOpen}
        closeAllWindows={() => dispatch({ type: 'CLOSE_ALL' })}
      >
        {!loadComplete && <Preloader onComplete={() => setLoadComplete(true)} />}

        {windowState.windows.map(window => (
          <Window
            {...window}
            key={window.id}
            setActive={openWindow}
            deviceState={deviceState}
            content={windowComponents[window.id]}
            isActive={window.id === windowState.active}
            closeWindow={() => dispatch({ type: 'CLOSE', id: window.id })}
            minimizeWindow={() => dispatch({ type: 'MINIMIZE', id: window.id })}
            maximizeWindow={() => dispatch({ type: 'MAXIMIZE', id: window.id })}
          />
        ))}
      </Layout>

      {contextMenu && (
        <Context
          x={contextMenu.x}
          y={contextMenu.y}
          settings={settings}
          openWindow={openWindow}
          updateSettings={updateSettings}
          setLaunchpadOpen={setLaunchpadOpen}
        />
      )}
    </>
  );
}

export default memo(App);