import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ArcaneButton from '../components/ArcaneButton';
import ProgressiveText from '../components/ProgressiveText';
import { useDreams } from '../hooks/useDreams';
import { useSound } from '../hooks/useSound';
import { improveDreamText } from '../utils/promptImprover';

const BANNER_DISMISSED_KEY = 'dreamtome_sample_banner_dismissed';

const SAMPLE_DREAM = {
  title: 'The Staircase That Never Ended',
  description:
    'I was climbing a spiral staircase made of clouds, each step humming softly like a heartbeat. The higher I went, the more I forgot why I was climbing. The moon was above me, but it kept drifting farther away. When I finally looked down, there was no beginning anymore—just endless mist and the faint echo of laughter I could not place.',
  tag: 'Serene' as const,
};

const MAX_TITLE_LENGTH = 100;
const MAX_CONTENT_LENGTH = 5000;

type SaveState = 'idle' | 'saving' | 'saved';

export default function Tome() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [refinedContent, setRefinedContent] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [showBanner, setShowBanner] = useState(false);
  const [leftPageTarget, setLeftPageTarget] = useState<Element | null>(null);
  const { addDream, dreams } = useDreams();
  const { play } = useSound();
  const timeoutsRef = useRef<number[]>([]);

  const scheduleTimeout = useCallback((callback: () => void, delay: number) => {
    const timeoutId = window.setTimeout(() => {
      timeoutsRef.current = timeoutsRef.current.filter((storedId) => storedId !== timeoutId);
      callback();
    }, delay);
    timeoutsRef.current.push(timeoutId);
    return timeoutId;
  }, []);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      timeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    const dismissed = localStorage.getItem(BANNER_DISMISSED_KEY);
    const shouldShow = dreams.length === 0 && !dismissed;
    setShowBanner(shouldShow);
  }, [dreams.length]);

  useEffect(() => {
    setLeftPageTarget(document.getElementById('refined-prose-page'));
  }, []);

  const canInscribe = useMemo(
    () => Boolean(title.trim()) && Boolean(refinedContent.trim()) && saveState !== 'saving',
    [title, refinedContent, saveState]
  );

  const handleRefine = () => {
    if (!content.trim()) return;

    setIsRefining(true);
    setSaveState('idle');
    setRefinedContent('');

    scheduleTimeout(() => {
      const refined = improveDreamText(content);
      setRefinedContent(refined);
      setIsRefining(false);
      play('pageTurn');
    }, 1200);
  };

  const handleSave = () => {
    if (!canInscribe) return;

    setSaveState('saving');
    scheduleTimeout(() => {
      addDream({
        title: title.trim(),
        content: refinedContent,
        originalContent: content,
      });
      setSaveState('saved');
      scheduleTimeout(() => {
        setTitle('');
        setContent('');
        setRefinedContent('');
        setSaveState('idle');
        setShowBanner(false);
      }, 600);
    }, 500);
  };

  const handleLoadSample = () => {
    setTitle(SAMPLE_DREAM.title);
    setContent(SAMPLE_DREAM.description);
    setRefinedContent('');
    setShowBanner(false);

    scheduleTimeout(() => {
      const refined = improveDreamText(SAMPLE_DREAM.description);
      setRefinedContent(refined);
      play('pageTurn');
    }, 500);
  };

  const handleDismissBanner = () => {
    localStorage.setItem(BANNER_DISMISSED_KEY, 'true');
    setShowBanner(false);
  };

  return (
    <div className="flex flex-col h-full">
      {showBanner && (
        <div className="mb-4 p-3 rounded-lg border-2 border-[var(--gold)] bg-gradient-to-br from-amber-50 to-yellow-50 fade-in">
          <div className="flex items-start gap-2">
            <div className="text-xl">✨</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-[var(--burgundy)] mb-1" style={{ fontFamily: "'Cormorant Unicase', serif" }}>
                New here? Try a sample.
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <ArcaneButton onClick={handleLoadSample} className="!px-4 !py-2 !text-xs">
                  Load Sample
                </ArcaneButton>
                <ArcaneButton
                  variant="ghost"
                  onClick={handleDismissBanner}
                  className="!px-4 !py-2 !text-xs"
                >
                  Dismiss
                </ArcaneButton>
              </div>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-3 text-[var(--burgundy)]" style={{ fontFamily: "'Cormorant Unicase', serif" }}>
        Chronicle a Dream
      </h2>

      <div className="mb-3">
        <label className="block text-xs font-medium mb-1 opacity-70" style={{ fontFamily: 'Spectral, serif' }}>
          Dream Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE_LENGTH))}
          placeholder="The Floating Garden..."
          maxLength={MAX_TITLE_LENGTH}
          aria-label="Dream title"
          className="w-full px-3 py-2 rounded-md border border-[var(--parchment-dark)]/30 bg-white/70 text-[var(--parchment-dark)] focus:outline-none focus:border-[var(--gold)] transition-colors text-sm"
          style={{ fontFamily: 'Spectral, serif' }}
        />
        <div className="text-xs opacity-50 mt-1" style={{ fontFamily: 'Spectral, serif' }}>
          {title.length}/{MAX_TITLE_LENGTH} characters
        </div>
      </div>

      <div className="mb-3 flex-1 flex flex-col">
        <label className="block text-xs font-medium mb-1 opacity-70" style={{ fontFamily: 'Spectral, serif' }}>
          Describe your dream...
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, MAX_CONTENT_LENGTH))}
          placeholder="I found myself walking through a garden suspended in the clouds..."
          maxLength={MAX_CONTENT_LENGTH}
          aria-label="Dream description"
          className="w-full flex-1 px-3 py-2 rounded-md border border-[var(--parchment-dark)]/30 bg-white/70 text-[var(--parchment-dark)] focus:outline-none focus:border-[var(--gold)] transition-colors resize-none text-sm"
          style={{ fontFamily: 'Spectral, serif', minHeight: '120px' }}
          rows={5}
        />
        <div className="text-xs opacity-50 mt-1" style={{ fontFamily: 'Spectral, serif' }}>
          {content.length}/{MAX_CONTENT_LENGTH} characters
        </div>
      </div>

      <ArcaneButton
        onClick={handleRefine}
        disabled={!content.trim() || isRefining}
        className="w-full justify-center mb-3"
      >
        {isRefining ? (
          <>
            <span className="inline-block w-3 h-3 border-2 border-[var(--parchment-dark)] border-t-transparent rounded-full animate-spin"></span>
            Refining with Magic...
          </>
        ) : (
          '✨ Refine with Magic'
        )}
      </ArcaneButton>

      <p className="text-center text-xs opacity-50 mt-auto pt-3" style={{ fontFamily: 'Spectral, serif' }}>
        🔒 Stored locally — safe within your Tome
      </p>

      {leftPageTarget &&
        createPortal(
          <LeftPagePanel
            content={refinedContent}
            saveState={saveState}
            canInscribe={canInscribe}
            onInscribe={handleSave}
          />,
          leftPageTarget
        )}
    </div>
  );
}

interface LeftPagePanelProps {
  content: string;
  saveState: SaveState;
  canInscribe: boolean;
  onInscribe: () => void;
}

function LeftPagePanel({ content, saveState, canInscribe, onInscribe }: LeftPagePanelProps) {
  const hasContent = Boolean(content.trim());

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center">
      {hasContent ? (
        <div className="refined-prose visible w-full">
          <ProgressiveText text={content} isActive={hasContent} />
        </div>
      ) : (
        <p className="text-sm italic text-[var(--ink-brown)]/70" style={{ fontFamily: 'Spectral, serif' }}>
          Your refined prose will glow into existence here.
        </p>
      )}

      <ArcaneButton
        onClick={onInscribe}
        disabled={!canInscribe}
        className="mt-6"
      >
        {saveState === 'saving' ? 'Inscribing...' : saveState === 'saved' ? 'Inscribed!' : '💾 Inscribe into Tome'}
      </ArcaneButton>
    </div>
  );
}
