import { useEffect, useRef, useState } from 'react';
import { Dream } from '../types';
import DreamCardArtifacts from './DreamCardArtifacts';
import { getDreamInsight } from '../utils/dreamInterpreter';
import ProgressiveText from './ProgressiveText';
import { useSound } from '../hooks/useSound';
import { Z_INDEX } from '../constants/zIndex';

interface FlippableDreamCardProps {
  dream: Dream;
  onExpand: () => void;
}

const categoryConfig = {
  Serene: { emoji: '🌸', color: 'bg-blue-100 text-blue-800' },
  Strange: { emoji: '🔮', color: 'bg-purple-100 text-purple-800' },
  Nightmare: { emoji: '🌑', color: 'bg-red-100 text-red-800' },
  Epic: { emoji: '⚔️', color: 'bg-amber-100 text-amber-800' },
};

const tagConfig: Record<string, { emoji: string; color: string }> = {
  Serene: { emoji: '🕊️', color: '#C8E6E6' },
  Strange: { emoji: '🌪️', color: '#CFA1E8' },
  Nightmare: { emoji: '🌑', color: '#D37C7C' },
  Epic: { emoji: '⚔️', color: '#F9C784' },
  Lucid: { emoji: '🌙', color: '#A6E3A1' },
  Recurring: { emoji: '🔁', color: '#BFBFBF' },
  Prophetic: { emoji: '🔮', color: '#E7D6A7' },
};

const insightScrollPositions = new Map<string, number>();

export default function FlippableDreamCard({ dream, onExpand }: FlippableDreamCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [insight, setInsight] = useState(() => getDreamInsight(dream.content));
  const cardRef = useRef<HTMLDivElement>(null);
  const frontFaceRef = useRef<HTMLDivElement | null>(null);
  const insightScrollRef = useRef<HTMLDivElement | null>(null);
  const { play } = useSound();


  const tags = dream.tags ?? [];

  useEffect(() => {
    setInsight(getDreamInsight(dream.content));
  }, [dream.content]);



  useEffect(() => {
    if (!isFlipped) return;

    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && setIsFlipped(false);

    const handleClickOut = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsFlipped(false);
      }
    };

    document.addEventListener('keydown', handleEsc);
    document.addEventListener('mousedown', handleClickOut);

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleClickOut);
    };
  }, [isFlipped]);

  const flipToInsight = () => {
    setIsFlipped(true);
    play('pageTurn');
  };

  const flipBack = () => {
    setIsFlipped(false);
    play('flipBack');
  };

  useEffect(() => {
    if (isFlipped && insightScrollRef.current) {
      const saved = insightScrollPositions.get(dream.id) ?? 0;
      insightScrollRef.current.scrollTop = saved;
    }
  }, [dream.id, isFlipped]);

  useEffect(() => () => {
    insightScrollPositions.delete(dream.id);
  }, [dream.id]);

  const handleInsightScroll: React.UIEventHandler<HTMLDivElement> = (event) => {
    insightScrollPositions.set(dream.id, event.currentTarget.scrollTop);
  };

  const config = categoryConfig[dream.category];

  return (
    <>
      <div
        ref={cardRef}
        className="relative flippable-card"
        style={{
          perspective: '1500px',
          transformStyle: 'preserve-3d',
          zIndex: Z_INDEX.CARD_FLIPPED,
          height: '100%', // Ensure it takes full height of parent
          minHeight: '240px', // Fallback minimum
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%', // Fill the parent container
            transformStyle: 'preserve-3d',
            transition: 'transform 0.7s ease-in-out',
            transform: isFlipped ? 'rotateY(180deg) scale(1.05)' : 'rotateY(0deg)',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          {/* FRONT */}
          <div
            ref={frontFaceRef}
            className="absolute inset-0 parchment-panel p-5 dream-card"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              borderRadius: '12px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
              position: 'absolute',
              zIndex: isFlipped ? 0 : 2, // Front is top when NOT flipped
            }}
            onClick={flipToInsight}
          >
            <DreamCardArtifacts onInterpret={flipToInsight} onExpand={onExpand} />

            <div className="flex items-start justify-between mb-3 mt-8">
              <h3
                className="text-xl font-semibold text-[var(--burgundy)] line-clamp-2 flex-1"
                style={{ fontFamily: "'Cormorant Unicase', serif" }}
              >
                {dream.title}
              </h3>
            </div>

            <p
              className="text-sm opacity-70 line-clamp-3 mb-4"
              style={{ fontFamily: 'Spectral, serif' }}
            >
              {dream.content}
            </p>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: tagConfig[tag]?.color || '#E8D4B0',
                      color: '#2A1B0F',
                    }}
                  >
                    {tagConfig[tag]?.emoji} {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.emoji} {dream.category}
              </span>
              <span className="text-xs opacity-50">{new Date(dream.date).toLocaleDateString()}</span>
            </div>
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0"
            style={{
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'visible', // Ensure it renders even if browser math is fuzzy
              WebkitBackfaceVisibility: 'visible',
              borderRadius: '16px',
              border: '2px solid #d1b48b', // Restore the border aesthetic
              overflow: 'hidden',
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#f4ead6',
              backgroundImage: 'linear-gradient(135deg, #f4ead6 0%, #ede0c4 100%)',
              opacity: 1,
              zIndex: isFlipped ? 50 : 0,
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
            }}
          >
            <div
              style={{
                flex: 1,
                display: 'flex',
                width: '100%',
                height: '100%',
                flexDirection: 'column',
                background: 'linear-gradient(180deg, #f7ecd1, #e8d9b8)',
                borderRadius: '14px',
                border: '3px solid #d7c287',
                boxShadow: '0 10px 26px rgba(0,0,0,0.35), inset 0 0 18px rgba(0,0,0,0.15)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                ref={insightScrollRef}
                onScroll={handleInsightScroll}
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  paddingRight: '10px',
                }}
                className="no-scrollbar"
              >
                <h3 style={{ color: '#7a5c40', fontSize: '0.9rem' }}>EMOTION</h3>
                <p
                  style={{
                    color: '#6a1f1f',
                    marginTop: '-4px',
                    marginBottom: '16px',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                  }}
                >
                  {insight.emotion}
                </p>

                {insight.keywords?.length > 0 && (
                  <>
                    <h3 style={{ color: '#7a5c40', fontSize: '0.9rem' }}>SYMBOLS</h3>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        marginBottom: '16px',
                      }}
                    >
                      {insight.keywords.map((sym) => (
                        <span
                          key={sym}
                          style={{
                            background: '#fff3d6',
                            border: '1px solid #e0c88b',
                            padding: '5px 11px',
                            borderRadius: 999,
                            color: '#7a5c40',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                          }}
                        >
                          {sym}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                <h3 style={{ color: '#7a5c40', fontSize: '0.9rem' }}>INTERPRETATION</h3>
                <ProgressiveText text={insight.interpretation} isActive={isFlipped} className="mt-1" />
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  flipBack();
                }}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '12px',
                  width: '30px',
                  height: '30px',
                  borderRadius: '999px',
                  border: '1px solid #d7c287',
                  background: 'rgba(0,0,0,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div >

      {isFlipped && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 40,
            background: 'radial-gradient(circle at center, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.45) 100%)',
          }}
        />
      )
      }
    </>
  );
}
