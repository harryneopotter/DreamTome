import { NavLink } from 'react-router-dom';
import { useSound } from '../hooks/useSound';
// Import high-fidelity artifacts
import CandleArtifact from '../assets/candle-artifact.svg';
import QuillArtifact from '../assets/quill-artifact.svg';
import SealArtifact from '../assets/wax-seal-artifact.svg';

export default function MedievalArtifactNav() {
  const { play } = useSound();

  const handleArtifactClick = (e: React.MouseEvent) => {
    // Don't prevent default - let NavLink handle navigation
    (e.currentTarget as HTMLElement).blur();
    play('pageTurn');
  };

  return (
    <>
      {/* Quill in Inkpot (Tome) - Top Right */}
      <NavLink
        to="/"
        onClick={handleArtifactClick}
        className={({ isActive }) =>
          `artifact quill absolute top-[20%] right-[10%] w-[120px] md:w-[160px] transform hover:scale-105 transition-transform duration-300 z-50 ${isActive ? 'active scale-105 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]' : 'opacity-90 hover:opacity-100'}`
        }
        style={{ backgroundImage: 'none' }} // Override existing CSS
        end
        title="Return to Tome"
      >
        <QuillArtifact className="w-full h-full drop-shadow-xl" />
        <span className="artifact-label sr-only">Tome</span>
      </NavLink>

      {/* Wax Seal (Dreams) - Bottom Center */}
      <NavLink
        to="/dreams"
        onClick={handleArtifactClick}
        className={({ isActive }) =>
          `artifact waxseal absolute bottom-[10%] left-1/2 transform -translate-x-1/2 w-[80px] md:w-[100px] hover:scale-110 transition-transform duration-300 z-50 ${isActive ? 'active scale-110 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]' : 'opacity-90 hover:opacity-100'}`
        }
        style={{ backgroundImage: 'none' }} // Override existing CSS
        title="Dream Scrolls"
      >
        <SealArtifact className="w-full h-full drop-shadow-lg" />
        <span className="artifact-label sr-only">Dream Scrolls</span>
      </NavLink>

      {/* Candle (Reflections) - Top Left */}
      <NavLink
        to="/reflections"
        onClick={handleArtifactClick}
        className={({ isActive }) =>
          `artifact candle absolute top-[15%] left-[10%] w-[100px] md:w-[140px] transform hover:scale-105 transition-transform duration-300 z-50 ${isActive ? 'active scale-105 drop-shadow-[0_0_20px_rgba(255,165,0,0.6)]' : 'opacity-90 hover:opacity-100'}`
        }
        style={{ backgroundImage: 'none' }} // Override existing CSS
        title="Reflections"
      >
        <CandleArtifact className="w-full h-full drop-shadow-2xl" />
        <span className="artifact-label sr-only">Reflections</span>
      </NavLink>

    </>
  );
}
