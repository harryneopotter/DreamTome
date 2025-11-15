import { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import TomePage from './pages/Tome';

export default function App() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return <SplashScreen onStart={() => setStarted(true)} />;
  }

  return <TomePage />;
}
