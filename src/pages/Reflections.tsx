import { useState, useMemo } from 'react';
import { useDreams } from '../hooks/useDreams';
import { generateQuote } from '../utils/promptImprover';
import { calculateStreaks } from '../utils/streakCalculator';
import ArcaneButton from '../components/ArcaneButton';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';
import { useSound } from '../hooks/useSound';

export default function Reflections() {
  const { dreams, clearAllDreams, getDreamDays } = useDreams();
  const [expandedTile, setExpandedTile] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showQuoteInterpretation, setShowQuoteInterpretation] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showResetToast, setShowResetToast] = useState(false);
  const { play } = useSound();

  const categoryCount = useMemo(() =>
    dreams.reduce((acc, dream) => {
      acc[dream.category] = (acc[dream.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    [dreams]
  );

  const tagCount = useMemo(() =>
    dreams.reduce((acc, dream) => {
      dream.tags?.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>),
    [dreams]
  );

  const lastDream = dreams[dreams.length - 1];
  const quote = lastDream ? generateQuote(lastDream.content) : null;

  // Calculate streaks
  const dreamDays = getDreamDays();
  const streakData = calculateStreaks(dreamDays);

  const handleReset = () => {
    setShowResetDialog(true);
    play('hoverGlow');
  };

  const confirmReset = () => {
    clearAllDreams();
    setExpandedTile(null);
    setSelectedCategory(null);
    setShowResetDialog(false);
    setShowResetToast(true);
    play('sealPop');
  };

  const cancelReset = () => {
    setShowResetDialog(false);
    play('flipBack');
  };

  const expandTile = (tileId: string) => {
    setExpandedTile(tileId);
    play('pageTurn');
  };

  const collapseTile = () => {
    setExpandedTile(null);
    play('flipBack');
  };

  const openCategoryPanel = (category: string) => {
    setSelectedCategory(category);
  };

  const closeCategoryPanel = () => {
    setSelectedCategory(null);
  };

  const categoryDreams = selectedCategory 
    ? dreams.filter(d => d.category === selectedCategory)
    : [];

  const categorySeals: Record<string, { emoji: string; color: string }> = {
    Serene: { emoji: '🌸', color: '#6B9EC7' },
    Strange: { emoji: '🔮', color: '#9370DB' },
    Nightmare: { emoji: '🌑', color: '#8B4049' },
    Epic: { emoji: '⚔️', color: '#D4A05E' },
  };

  const quoteInterpretation = "Dreams are the language of the unconscious—a bridge between the waking mind and the vast, symbolic realm within. By recording them, you honor the soul's need to communicate through metaphor and mystery.";

  return (
    <div className="min-h-screen px-4 py-6 fade-in relative">
      <div className="max-w-4xl mx-auto">
        {/* Compact Header */}
        <div className="text-center mb-6 reflection-header">
          <h1 className="text-4xl md:text-5xl font-bold glow-text inline-block" style={{ fontFamily: "'Cormorant Unicase', serif" }}>
            Reflections
          </h1>
        </div>

        {/* Streak Stats Row with Flip Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 justify-items-center">
          {/* Current Streak Tile */}
          <div
            className={`reflection-tile ${expandedTile === 'current' ? 'expanded' : ''}`}
            onClick={() => expandTile('current')}
          >
            <div className="reflection-tile-inner">
              <div className="front">
                <div className="value">{streakData.currentStreak}</div>
                <div className="label">🔥 Current Streak</div>
              </div>
              <div className="back">
                {streakData.currentStreak >= 7
                  ? 'A week of dreams! Your dedication illuminates the path.'
                  : streakData.currentStreak > 0
                  ? 'Keep the flame burning bright through consistent journaling.'
                  : 'Begin anew — every journey starts with a single step.'}
              </div>
            </div>
          </div>

          {/* Longest Streak Tile */}
          <div
            className={`reflection-tile ${expandedTile === 'longest' ? 'expanded' : ''}`}
            onClick={() => expandTile('longest')}
          >
            <div className="reflection-tile-inner">
              <div className="front">
                <div className="value">{streakData.longestStreak}</div>
                <div className="label">🏆 Longest Streak</div>
              </div>
              <div className="back">
                {streakData.longestStreak >= 30
                  ? 'A legendary feat! Your commitment to dreams is unwavering.'
                  : streakData.longestStreak >= 7
                  ? 'Your persistence has forged a remarkable record.'
                  : 'Build your legacy one dream at a time.'}
              </div>
            </div>
          </div>

          {/* Total Days Tile */}
          <div
            className={`reflection-tile ${expandedTile === 'total' ? 'expanded' : ''}`}
            onClick={() => expandTile('total')}
          >
            <div className="reflection-tile-inner">
              <div className="front">
                <div className="value">{streakData.totalDays}</div>
                <div className="label">📅 Days of Dreaming</div>
              </div>
              <div className="back">
                {streakData.totalDays >= 50
                  ? 'Your collection spans countless nights — a true chronicle of the soul.'
                  : streakData.totalDays >= 10
                  ? 'Each day adds another page to your tome of dreams.'
                  : 'The beginning of an epic journey through your subconscious.'}
              </div>
            </div>
          </div>
        </div>

        {/* No Data Helper */}
        {dreams.length === 0 && (
          <div className="text-center py-6 mb-6 opacity-60">
            <p className="text-sm" style={{ fontFamily: 'Spectral, serif' }}>✨ Inscribe a dream today to begin your journey.</p>
          </div>
        )}

        {/* Category Wax Seals */}
        {dreams.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-[var(--gold)] text-center glow-text" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              Dream Categories
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {Object.entries(categoryCount).map(([category, count]) => {
                const config = categorySeals[category];
                return (
                  <button
                    key={category}
                    onClick={() => openCategoryPanel(category)}
                    className="wax-seal-button"
                    style={{ '--seal-color': config.color } as React.CSSProperties}
                    title={`View ${count} ${category} dreams`}
                  >
                    <div className="wax-seal-circle">
                      <span className="seal-emoji">{config.emoji}</span>
                      <span className="seal-count">{count}</span>
                    </div>
                    <div className="seal-label">{category}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tag Distribution */}
        {Object.keys(tagCount).length > 0 && (
          <div className="parchment-panel p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3 text-[var(--burgundy)] glow-text" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              Dream Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(tagCount).map(([tag, count]) => (
                <div
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: getTagColor(tag),
                    color: '#2A1B0F',
                    fontFamily: 'Spectral, serif',
                  }}
                >
                  {getTagEmoji(tag)} {tag} ({count})
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quote of the Night */}
        {quote && (
          <div 
            className="quote-card parchment-panel p-6 mb-6 border-2 border-[var(--gold)] text-center cursor-pointer relative"
            onClick={() => setShowQuoteInterpretation(true)}
          >
            <h2 className="text-lg font-semibold mb-3 text-[var(--burgundy)] glow-text" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              ✨ Quote of the Night
            </h2>
            <blockquote className="text-2xl md:text-3xl italic font-light leading-relaxed" style={{ fontFamily: "'Tangerine', cursive", color: 'var(--ink-brown)', fontWeight: 700 }}>
              "{quote}"
            </blockquote>
            <div className="mt-3 text-xs opacity-60 hover:opacity-100 transition-opacity" style={{ fontFamily: 'Spectral, serif' }}>
              Click to reveal deeper meaning
            </div>
          </div>
        )}

        {dreams.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-xl opacity-70 mb-2" style={{ fontFamily: 'Spectral, serif' }}>No reflections yet</p>
            <p className="opacity-50" style={{ fontFamily: 'Spectral, serif' }}>Start logging dreams to see insights</p>
          </div>
        )}

        {/* Reset Button */}
        {dreams.length > 0 && (
          <div className="text-center mt-12">
            <ArcaneButton variant="secondary" onClick={handleReset} className="justify-center">
              🗑️ Reset Tome
            </ArcaneButton>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showResetDialog}
        title="Clear the Dream Archive?"
        description="This will remove every inscribed dream and reset your streak records. The action cannot be undone."
        confirmLabel="Yes, clear the Tome"
        cancelLabel="Keep my dreams"
        onConfirm={confirmReset}
        onCancel={cancelReset}
      />

      {showResetToast && (
        <Toast message="Your Tome has been reset." onClose={() => setShowResetToast(false)} />
      )}

      {/* Category Parchment Overlay */}
      {selectedCategory && (
        <div className="parchment-overlay" onClick={closeCategoryPanel}>
          <div className="parchment-panel-floating" onClick={(e) => e.stopPropagation()}>
            <button className="close-seal" onClick={closeCategoryPanel}>✕</button>
            <h2 className="text-2xl font-bold mb-4 text-[var(--burgundy)]" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              {categorySeals[selectedCategory].emoji} {selectedCategory} Dreams
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {categoryDreams.map(dream => (
                <div key={dream.id} className="p-3 bg-white/50 rounded-lg border border-[var(--parchment-dark)]/20">
                  <h3 className="font-semibold text-[var(--ink-brown)] mb-1" style={{ fontFamily: "'Cormorant Unicase', serif" }}>
                    {dream.title}
                  </h3>
                  <p className="text-sm opacity-80 line-clamp-2" style={{ fontFamily: 'Spectral, serif' }}>
                    {dream.content}
                  </p>
                  <p className="text-xs opacity-60 mt-1" style={{ fontFamily: 'Spectral, serif' }}>
                    {new Date(dream.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quote Interpretation Overlay */}
      {showQuoteInterpretation && (
        <div className="parchment-overlay" onClick={() => setShowQuoteInterpretation(false)}>
          <div className="parchment-panel-floating" onClick={(e) => e.stopPropagation()}>
            <button className="close-seal" onClick={() => setShowQuoteInterpretation(false)}>✕</button>
            <h2 className="text-2xl font-bold mb-4 text-[var(--gold)] text-center glow-text" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              ✨ Deeper Meaning
            </h2>
            <p className="text-lg italic leading-relaxed text-center" style={{ fontFamily: "'Tangerine', cursive", color: 'var(--ink-brown)', fontWeight: 700, fontSize: '1.6rem' }}>
              {quoteInterpretation}
            </p>
          </div>
        </div>
      )}

      {/* Expanded Tile Backdrop */}
      {expandedTile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[900]"
          onClick={collapseTile}
          style={{ animation: 'fadeIn 0.3s ease' }}
        />
      )}
    </div>
  );
}

function getTagColor(tag: string): string {
  const colors: Record<string, string> = {
    Serene: '#C8E6E6',
    Strange: '#CFA1E8',
    Nightmare: '#D37C7C',
    Epic: '#F9C784',
    Lucid: '#A6E3A1',
    Recurring: '#BFBFBF',
    Prophetic: '#E7D6A7',
  };
  return colors[tag] || '#E8D4B0';
}

function getTagEmoji(tag: string): string {
  const emojis: Record<string, string> = {
    Serene: '🕊️',
    Strange: '🌪️',
    Nightmare: '🌑',
    Epic: '⚔️',
    Lucid: '🌙',
    Recurring: '🔁',
    Prophetic: '🔮',
  };
  return emojis[tag] || '✨';
}
