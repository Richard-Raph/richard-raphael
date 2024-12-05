import './App.css';
import Home from './pages/Home';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';
import Project from './pages/Project';
import Layout from './components/Layout';
import Window from './components/Window';
import { useState, useEffect } from 'react';
import Preloader from './components/Preloader';

function App() {
  const [windows, setWindows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeWindow, setActiveWindow] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 9000);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1200);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const windowContent = (windowName) => {
    switch (windowName) {
      case 'Home':
        return <Home />;
      case 'About':
        return <About />;
      case 'Blog':
        return <Blog />;
      case 'Contact':
        return <Contact />;
      case 'Project':
        return <Project />;
      default:
        return <div>Unknown Window</div>;
    }
  };

  const openWindow = (windowName) => {
    if (isMobile) {
      if (activeWindow) {
        setWindows((prevWindows) =>
          prevWindows.map((window) =>
            window.id === activeWindow
              ? { ...window, content: windowContent(windowName), name: windowName }
              : window
          )
        );
      } else {
        const newWindow = {
          id: Date.now(),
          isActive: true,
          name: windowName,
          content: windowContent(windowName),
        };
        setWindows([newWindow]);
        setActiveWindow(newWindow.id); // Set the new window as active
      }
    } else {
      // On desktop, open a new window
      const existingWindow = windows.find((window) => window.name === windowName);
      if (existingWindow) {
        setActiveWindow(existingWindow.id); // Activate the window if it's already open
      } else {
        const newWindow = {
          id: Date.now(),
          isActive: true,
          name: windowName,
          content: windowContent(windowName),
        };
        setWindows((prevWindows) => [...prevWindows, newWindow]);
        setActiveWindow(newWindow.id); // Set the new window as active
      }
    }
  };

  const setActive = (windowId) => {
    setActiveWindow(windowId);
    setWindows((prevWindows) =>
      prevWindows.map((window) => ({
        ...window,
        isActive: window.id === windowId,
      }))
    );
  };

  const closeWindow = (windowId) => {
    setWindows((prevWindows) => prevWindows.filter((window) => window.id !== windowId));
    if (activeWindow === windowId) {
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
          openWindow={openWindow}
          activeWindow={Number(activeWindow)}
        >
          {windows.map((window) => (
            <Window
              id={window.id}
              key={window.id}
              name={window.name}
              setActive={setActive}
              content={window.content}
              closeWindow={closeWindow}
              minimizeWindow={() => { }}
              maximizeWindow={() => { }}
              setDraggedWindow={() => { }}
              isActive={window.id === activeWindow}
            />
          ))}
        </Layout>
      )}
    </>
  );
}

export default App;