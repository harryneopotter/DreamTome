import { NavLink } from 'react-router-dom';
import { useSound } from '../hooks/useSound';

export default function MedievalArtifactNav() {
  const { play } = useSound();

  const handleArtifactClick = (e: React.MouseEvent) => {
    // Don't prevent default - let NavLink handle navigation
    (e.currentTarget as HTMLElement).blur();
    play('pageTurn');
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

    </>
  );
}
