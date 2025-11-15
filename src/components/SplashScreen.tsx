import { useEffect, useState } from 'react';
import TomePage from '../pages/Tome';
import dreamTomeBookImg from '../assets/dreamBook.svg';
import candleImg from '../assets/candle.webp';
import quillImg from '../assets/quill.webp';

interface SplashScreenProps {
  onComplete?: () => void;
}

const KAMUI_DURATION = 1100;

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [kamui, setKamui] = useState(false);

  useEffect(() => {
    if (!kamui) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onComplete?.();
    }, KAMUI_DURATION);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [kamui, onComplete]);

  const handleWaxSealClick = () => {
    if (kamui) {
      return;
    }
    setKamui(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${kamui ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!kamui}
      >
        <TomePage />
      </div>

      <div
        className={`absolute inset-0 z-10 flex min-h-screen w-full items-center justify-center bg-deskTexture transition-opacity duration-500 ${kamui ? 'opacity-0 delay-[650ms]' : 'opacity-100'}`}
      >
        <div className="relative h-full w-full max-w-6xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.2),_transparent_55%)]" aria-hidden />

          <img
            src={candleImg}
            alt="Candle resting on the desk"
            className="absolute left-10 top-20 w-40 select-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
            draggable={false}
          />

          <img
            src={quillImg}
            alt="Quill resting on an inkpot"
            className="absolute right-16 top-40 w-32 select-none drop-shadow-[0_16px_32px_rgba(0,0,0,0.45)]"
            draggable={false}
          />

          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform-gpu transition-all duration-[1100ms] ${kamui ? 'kamui-implosion' : ''}`}
          >
            <img
              src={dreamTomeBookImg}
              alt="Closed Dream Tome"
              className="w-[480px] drop-shadow-2xl transition-transform duration-700 ease-[cubic-bezier(.22,.61,.36,1)] hover:-rotate-2 hover:scale-[1.02]"
              draggable={false}
            />
          </div>

          <button
            type="button"
            onClick={handleWaxSealClick}
            className={`absolute bottom-20 left-1/2 flex h-32 w-32 -translate-x-1/2 items-center justify-center bg-waxSeal bg-cover transition-transform duration-500 hover:scale-110 focus-visible:scale-110 focus-visible:outline-none ${kamui ? 'pointer-events-none scale-95 opacity-70' : ''}`}
            style={{ backgroundImage: "url('/wax-seal.svg')" }}
            aria-label="Open the Dream Tome"
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center">
            <div className="h-1 w-64 rounded-full bg-black/40 blur-sm" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
