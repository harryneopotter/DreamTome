import { useState, useMemo } from 'react';
import { useDreams } from '../hooks/useDreams';
import { Dream } from '../types';
import DreamModal from '../components/DreamModal';
import SearchBar from '../components/SearchBar';
import FlippableDreamCard from '../components/FlippableDreamCard';
import ArcaneButton from '../components/ArcaneButton';

const categoryConfig = {
  Serene: { emoji: '🌸', color: 'bg-blue-100 text-blue-800' },
  Strange: { emoji: '🔮', color: 'bg-purple-100 text-purple-800' },
  Nightmare: { emoji: '🌑', color: 'bg-red-100 text-red-800' },
  Epic: { emoji: '⚔️', color: 'bg-amber-100 text-amber-800' },
};

export default function DreamLibrary() {
  const { dreams, addTestDreams, clearTestDreams } = useDreams();
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const hasTestDreams = dreams.some((dream) => dream.isTest);

  const filteredDreams = useMemo(() =>
    dreams.filter((dream) => {
      const query = searchQuery.toLowerCase();
      return (
        dream.title.toLowerCase().includes(query) ||
        dream.content.toLowerCase().includes(query)
      );
    }),
    [dreams, searchQuery]
  );

  return (
    <div className="min-h-screen px-4 py-8 fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-center md:text-left glow-text flex-1" style={{ fontFamily: "'Cormorant Unicase', serif" }}>
            Dream Scrolls
          </h1>
          <div className="flex justify-center md:justify-end gap-3">
            <ArcaneButton onClick={() => addTestDreams(5)} className="whitespace-nowrap">
              Generate 5 Dreams
            </ArcaneButton>
            {hasTestDreams && (
              <ArcaneButton variant="ghost" onClick={clearTestDreams} className="whitespace-nowrap">
                Clear Test Dreams
              </ArcaneButton>
            )}
          </div>
        </div>

        {dreams.length > 0 && (
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        )}

        {dreams.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📜✨</div>
            <p className="text-xl opacity-70 mb-2" style={{ fontFamily: 'Spectral, serif' }}>No scrolls recorded yet</p>
            <p className="opacity-50" style={{ fontFamily: 'Spectral, serif' }}>Visit the Tome to inscribe your first dream</p>
          </div>
        ) : filteredDreams.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl opacity-70 mb-2" style={{ fontFamily: 'Spectral, serif' }}>No dreams found</p>
            <p className="opacity-50" style={{ fontFamily: 'Spectral, serif' }}>Try a different search term</p>
          </div>
        ) : (
          <div className="dream-stack">
            {filteredDreams.map((dream, index) => (
              <div key={dream.id} className="dream-sheet">
                <FlippableDreamCard
                  dream={dream}
                  onExpand={() => setSelectedDream(dream)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedDream && (
        <DreamModal
          dream={selectedDream}
          onClose={() => setSelectedDream(null)}
        />
      )}
    </div>
  );
}
