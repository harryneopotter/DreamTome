import { NavLink } from 'react-router-dom';
import { useRef } from 'react';

export default function DeskArtifactNavigation() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleArtifactClick = () => {
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.volume = 0.25;
      audio.currentTime = 0;
      audio.play().catch((err) => console.log('Audio blocked:', err.message));
    }
  };

  return (
    <>
      {/* Quill (Tome) */}
      <NavLink
        to="/"
        onClick={handleArtifactClick}
        className={({ isActive }) =>
          `desk-artifact quill ${isActive ? 'active' : ''}`
        }
        end
        title="Return to Tome"
      >
        🪶
        <span className="artifact-label">Tome</span>
      </NavLink>

      {/* Wax Seal (Dreams) */}
      <NavLink
        to="/dreams"
        onClick={handleArtifactClick}
        className={({ isActive }) =>
          `desk-artifact waxseal ${isActive ? 'active' : ''}`
        }
        title="Your Dream Scrolls"
      >
        💠
        <span className="artifact-label">Dreams</span>
      </NavLink>

      {/* Candle (Reflections) */}
      <NavLink
        to="/reflections"
        onClick={handleArtifactClick}
        className={({ isActive }) =>
          `desk-artifact candle-nav ${isActive ? 'active' : ''}`
        }
        title="Reflections"
      >
        🕯️
        <span className="artifact-label">Reflections</span>
      </NavLink>

      {/* Audio element */}
      <audio ref={audioRef} preload="auto" src="/page-turn.mp3"></audio>
    </>
  );
}
