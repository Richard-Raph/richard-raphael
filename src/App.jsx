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
  const [windowStack, setWindowStack] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 9000);
    const handleResize = () => {
      const isMobile = window.innerWidth < 1200;
      setWindowStack((prev) => (isMobile ? [prev[prev.length - 1]] : prev));
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const contentMap = {
    Home: <Home />,
    About: <About />,
    Blog: <Blog />,
    Contact: <Contact />,
    Project: <Project />,
  };

  const openWindow = (windowName) => {
    const existingWindow = windows.find((win) => win.name === windowName);
    if (existingWindow) {
      setActive(existingWindow.id);
    } else {
      const newWindow = {
        id: Date.now(),
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

  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <Layout windows={windows} openWindow={openWindow} activeWindow={activeWindow}>
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