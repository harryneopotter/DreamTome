import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSound } from '../hooks/useSound';

interface SplashScreenProps {
  onComplete: () => void;
}

const TRANSITION_DURATION = 850;
const SWIRL_DELAY = 220;

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const navigate = useNavigate();
  const { play, stop } = useSound();
  const [isOpening, setIsOpening] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [showSwirl, setShowSwirl] = useState(false);
  const [showDust, setShowDust] = useState(false);
  const exitTimeout = useRef<number | null>(null);
  const fadeTimeout = useRef<number | null>(null);
  const swirlTimeout = useRef<number | null>(null);
  const rustleTimeout = useRef<number | null>(null);

  useEffect(() => {
    play('ambientCandle');
    const dustFrame = requestAnimationFrame(() => setShowDust(true));

    return () => {
      cancelAnimationFrame(dustFrame);
      stop('ambientCandle');
      if (exitTimeout.current !== null) {
        window.clearTimeout(exitTimeout.current);
      }
      if (fadeTimeout.current !== null) {
        window.clearTimeout(fadeTimeout.current);
      }
      if (swirlTimeout.current !== null) {
        window.clearTimeout(swirlTimeout.current);
      }
      if (rustleTimeout.current !== null) {
        window.clearTimeout(rustleTimeout.current);
      }
    };
  }, [play, stop]);

  const proceedToTome = useCallback(() => {
    if (isOpening) {
      return;
    }
    setIsOpening(true);
    play('bookOpen');
    rustleTimeout.current = window.setTimeout(() => play('pageRustle'), 140);

    swirlTimeout.current = window.setTimeout(() => {
      setShowSwirl(true);
      fadeTimeout.current = window.setTimeout(() => {
        setIsFading(true);
      }, SWIRL_DELAY);
    }, 120);

    exitTimeout.current = window.setTimeout(() => {
      stop('ambientCandle');
      navigate('/tome');
      onComplete();
    }, TRANSITION_DURATION);
  }, [isOpening, navigate, onComplete, play, stop]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        proceedToTome();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [proceedToTome]);

  return (
    <div className={`desk-root ${isFading ? 'desk-fade' : ''}`}>
      <div className={`ink-splash ${showSwirl ? 'active' : ''}`} aria-hidden />
      <div className={`dust-field ${showDust ? 'active' : ''}`} aria-hidden />

      <div className="static candle" aria-hidden>
        <div className="candle-shadow" />
        <div className="candle-body" />
        <div className="candle-flame" />
        <div className="candle-glow" />
      </div>

      <div className="static quill" aria-hidden>
        <div className="quill-feather" />
        <div className="quill-shaft" />
        <div className="ink-well" />
      </div>

      <div className="static letters" aria-hidden>
        <div className="letter-sheet" />
        <div className="letter-sheet second" />
      </div>

      <div className="static wax" aria-hidden>
        <div className="wax-stamp" />
        <div className="wax-ribbon" />
      </div>

      <div className="static key" aria-hidden>
        <div className="key-ring" />
        <div className="key-teeth" />
      </div>

      <div className="book-halo" aria-hidden />

      <div
        className={`book-container ${isOpening ? 'opening' : ''}`}
        role="button"
        tabIndex={0}
        onClick={proceedToTome}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            proceedToTome();
          }
        }}
      >
        <div className={`tome ${isOpening ? 'open' : ''}`}>
          <div className="tome-cover" aria-hidden />
          <div className="tome-pages" aria-hidden />
          <div className="tome-spine" aria-hidden />
          <div className="tome-shine" aria-hidden />
        </div>
        <div className="title-emboss">Dream Tome</div>
      </div>
    </div>
  );
}
