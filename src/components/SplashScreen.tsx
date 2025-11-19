import { useEffect, useState } from 'react';
import DreamTomeBook from '../assets/dream-tome-final.svg';
import candle from '../assets/candle.webp';
import quill from '../assets/quill.webp';
import TomePage from '../pages/Tome';

type SplashScreenProps = {
  onStart: () => void;
};

const EXIT_DELAY = 1200;

export default function SplashScreen({ onStart }: SplashScreenProps) {
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!start) {
      return;
    }

    const handle = window.setTimeout(onStart, EXIT_DELAY);
    return () => window.clearTimeout(handle);
  }, [start, onStart]);

  const handleSealClick = () => {
    if (start) {
      return;
    }

    setStart(true);
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-[#1c1109]">
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-700 ease-out ${
          start ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!start}
      >
        <TomePage />
      </div>

      <div
        className={`relative z-10 h-full w-full bg-deskTexture overflow-hidden transition-opacity duration-700 ease-out ${
          start ? 'opacity-0 delay-700' : 'opacity-100'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" aria-hidden />

        <img
          src={candle}
          alt="Golden candle casting a soft glow"
          className="absolute left-10 top-20 w-40 select-none drop-shadow-[0_24px_48px_rgba(0,0,0,0.6)]"
          draggable={false}
        />

        <img
          src={quill}
          alt="Quill resting beside an inkwell"
          className="absolute right-16 top-40 w-32 select-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
          draggable={false}
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <DreamTomeBook
            className={`block w-[480px] transform-gpu drop-shadow-2xl transition-transform duration-700 ease-[cubic-bezier(.22,.61,.36,1)] hover:-rotate-2 hover:scale-[1.02] ${
              start ? 'kamui-implosion' : ''
            }`}
            title="Dream Tome resting on the desk"
            aria-label="Closed Dream Tome bound in leather"
            role="img"
          />
        </div>

        <button
          type="button"
          onClick={handleSealClick}
          disabled={start}
          className="absolute bottom-20 left-1/2 flex h-32 w-32 -translate-x-1/2 items-center justify-center bg-waxSeal bg-cover bg-center transition-transform duration-500 ease-out hover:scale-110 focus-visible:scale-110 focus-visible:outline-none disabled:cursor-default disabled:scale-95 disabled:opacity-75"
          aria-pressed={start}
          aria-label="Break the wax seal to open the Dream Tome"
        >
          <span className="sr-only">Open the Dream Tome</span>
        </button>
      </div>
    </div>
  );
}
