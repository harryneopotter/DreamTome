import { useState } from 'react';
import { useDreams } from '../hooks/useDreams';
import { Dream } from '../types';
import DreamModal from '../components/DreamModal';
import SearchBar from '../components/SearchBar';
import FlippableDreamCard from '../components/FlippableDreamCard';

const categoryConfig = {
  Serene: { emoji: '🌸', color: 'bg-blue-100 text-blue-800' },
  Strange: { emoji: '🔮', color: 'bg-purple-100 text-purple-800' },
  Nightmare: { emoji: '🌑', color: 'bg-red-100 text-red-800' },
  Epic: { emoji: '⚔️', color: 'bg-amber-100 text-amber-800' },
};

export default function DreamLibrary() {
  const { dreams } = useDreams();
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDreams = dreams.filter((dream) => {
    const query = searchQuery.toLowerCase();
    return (
      dream.title.toLowerCase().includes(query) ||
      dream.content.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen px-4 py-8 fade-in">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-8 glow-text" style={{ fontFamily: "'Cormorant Unicase', serif" }}>
          Dream Scrolls
        </h1>

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
