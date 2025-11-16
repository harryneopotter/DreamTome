import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Tome from './pages/Tome';
import DreamLibrary from './pages/DreamLibrary';
import Reflections from './pages/Reflections';
import SplashScreen from './components/SplashScreen';
import { cleanupAudioContext } from './hooks/useSound';

function App() {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    return () => {
      cleanupAudioContext();
    };
  }, []);

  if (!entered) {
    return <SplashScreen onEnter={() => setEntered(true)} />;
  }

  return (
    <Router>
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
