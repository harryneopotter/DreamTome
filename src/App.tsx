import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Tome from './pages/Tome';
import DreamLibrary from './pages/DreamLibrary';
import Reflections from './pages/Reflections';
import SplashScreen from './components/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Always show splash on mount
    setShowSplash(true);
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <Router>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Tome />} />
          <Route path="tome" element={<Tome />} />
          <Route path="dreams" element={<DreamLibrary />} />
          <Route path="reflections" element={<Reflections />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
