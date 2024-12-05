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

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 9000);
    return () => clearTimeout(timer);
  }, []);

  const openWindow = (windowName, url) => {
    const existingWindow = windows.find((window) => window.name === windowName);

    if (existingWindow) {
      // Activate the window if it's already open
      setActiveWindow(existingWindow.id);
    } else {
      // Create a new window if it doesn't exist
      const newWindow = {
        id: Date.now(),
        isActive: true,
        name: windowName,
        content: url ? <iframe src={url} title={windowName} /> : windowContent(windowName),
      };
      setWindows((prevWindows) => [...prevWindows, newWindow]);
      setActiveWindow(newWindow.id);  // Set the new window as active
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

  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <Layout
          windows={windows}
          openWindow={openWindow}
          activeWindow={activeWindow}
        >
          {windows.map((window) => (
            <Window
              id={window.id}
              key={window.id}
              name={window.name}
              setActive={setActive}
              content={window.content}
              closeWindow={closeWindow}
              minimizeWindow={() => {}}
              maximizeWindow={() => {}}
              setDraggedWindow={() => {}}
              isActive={window.id === activeWindow}
            />
          ))}
        </Layout>
      )}
    </>
  );
}

export default App;