import { useEffect, useState } from 'react';
// SVG Component Imports (using Vite's SVGR plugin)
import BookArtifact from '../assets/dream-tome-final.svg';
import CandleArtifact from '../assets/candle-artifact.svg';
import QuillArtifact from '../assets/quill-artifact.svg';
import SealArtifact from '../assets/wax-seal-artifact.svg';


type SplashScreenProps = {
  onEnter: () => void;
};

const EXIT_DELAY = 1200;

export default function SplashScreen({ onEnter }: SplashScreenProps) {
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!start) return;
    const handle = window.setTimeout(onEnter, EXIT_DELAY);
    return () => window.clearTimeout(handle);
  }, [start, onEnter]);

  const handleSealClick = () => {
    if (start) return;
    setStart(true);
  };

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#1c1109] transition-opacity duration-1000 ease-in-out ${start ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      {/* 
        BACKGROUND: 
        Replicating/Using the .desk-root style for consistency with the vertical wood grain. 
        We apply it directly here to ensure it covers the splash screen perfectly.
      */}
      <div className="absolute inset-0 z-0 bg-desk-root" style={{
        background: `
          radial-gradient(circle at 20% 15%, rgba(255, 244, 214, 0.08), transparent 55%),
          radial-gradient(circle at 80% 85%, rgba(255, 215, 128, 0.08), transparent 60%),
          repeating-linear-gradient(90deg, rgba(38, 24, 16, 0.94) 0px, rgba(38, 24, 16, 0.94) 14px, rgba(31, 19, 12, 0.96) 14px, rgba(31, 19, 12, 0.96) 28px),
          radial-gradient(circle at 50% 50%, #2c1b11, #1c120b 70%, #120b07 100%)
        `
      }} />



      {/* The Splash Screen Scene Container */}
      <div
        className={`relative z-10 h-full w-full pointer-events-none transition-all duration-1000 ease-in-out ${start ? 'opacity-0 scale-110' : 'opacity-100'
          }`}
      >

        {/* CANDLE - Top Left */}
        <div className="absolute top-[15%] left-[10%] w-[180px] md:w-[220px] pointer-events-auto transform hover:scale-105 transition-transform duration-500">
          <CandleArtifact className="w-full h-full drop-shadow-2xl" />
        </div>

        {/* QUILL - Top Right */}
        <div className="absolute top-[20%] right-[10%] w-[200px] md:w-[260px] pointer-events-auto transform hover:scale-105 transition-transform duration-500 rotate-12">
          <QuillArtifact className="w-full h-full drop-shadow-xl" />
        </div>

        {/* BOOK - Center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[55%] w-[350px] md:w-[500px] pointer-events-auto z-20">
          <BookArtifact
            className={`w-full h-full drop-shadow-2xl tome-kamui-target transition-all duration-700 !bg-transparent ${start ? 'scale-0 rotate-180 opacity-0 blur-xl' : ''}`}
            onClick={handleSealClick} style={{ cursor: 'pointer' }}
          />
        </div>

        {/* WAX SEAL - Bottom Center (The Trigger) */}
        <div
          className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 cursor-pointer pointer-events-auto z-30 group"
          onClick={handleSealClick}
          id="waxSealContainer"
        >
          <div className="w-[100px] h-[100px] transition-transform duration-300 group-hover:scale-110">
            <SealArtifact className="w-full h-full drop-shadow-lg" />
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#d4af37] font-serif text-lg tracking-widest pointer-events-none">
            OPEN TOME
          </div>
        </div>

      </div>
    </div>
  );
}
