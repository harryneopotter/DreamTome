import { NavLink } from 'react-router-dom';
import { useRef } from 'react';

export default function MedievalArtifactNav() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleArtifactClick = (e: React.MouseEvent) => {
    // Don't prevent default - let NavLink handle navigation
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.volume = 0.25;
      audio.currentTime = 0;
      audio.play().catch((err) => console.log('Audio blocked:', err.message));
    }
  };

  return (
    <>
      {/* Quill in Inkpot (Tome) */}
      <NavLink
        to="/"
        onClick={handleArtifactClick}
        className={({ isActive }) =>
          `artifact quill ${isActive ? 'active' : ''}`
        }
        style={{
          backgroundImage: 'url(/quill-ink.svg)',
        }}
        end
        title="Return to Tome"
      >
        <span className="artifact-label">Tome</span>
      </NavLink>

      {/* Wax Seal (Dreams) */}
      <NavLink
        to="/dreams"
        onClick={handleArtifactClick}
        className={({ isActive }) =>
          `artifact waxseal ${isActive ? 'active' : ''}`
        }
        style={{
          backgroundImage: 'url(/wax-seal.svg)',
        }}
        title="Dream Scrolls"
      >
        <span className="artifact-label">Dream Scrolls</span>
      </NavLink>

      {/* Candle (Reflections) */}
      <NavLink
        to="/reflections"
        onClick={handleArtifactClick}
        className={({ isActive }) =>
          `artifact candle ${isActive ? 'active' : ''}`
        }
        style={{
          backgroundImage: 'url(/candle.svg)',
        }}
        title="Reflections"
      >
        <span className="artifact-label">Reflections</span>
      </NavLink>

      {/* Audio element */}
      <audio ref={audioRef} preload="auto" src="/page-turn.mp3"></audio>
    </>
  );
}
