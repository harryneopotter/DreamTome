import { useState, useEffect } from 'react';
import { useDreams } from '../hooks/useDreams';
import { improveDreamText } from '../utils/promptImprover';

const BANNER_DISMISSED_KEY = 'dreamtome_sample_banner_dismissed';

const SAMPLE_DREAM = {
  title: 'The Staircase That Never Ended',
  description: `I was climbing a spiral staircase made of clouds, each step humming softly like a heartbeat. The higher I went, the more I forgot why I was climbing. The moon was above me, but it kept drifting farther away. When I finally looked down, there was no beginning anymore—just endless mist and the faint echo of laughter I couldn't place.`,
  tag: 'Serene' as const,
};

export default function Tome() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [refinedContent, setRefinedContent] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const { addDream, dreams } = useDreams();

  // Check if banner should be shown
  useEffect(() => {
    const dismissed = localStorage.getItem(BANNER_DISMISSED_KEY);
    const shouldShow = dreams.length === 0 && !dismissed;
    setShowBanner(shouldShow);
  }, [dreams.length]);

  const handleRefine = () => {
    if (!content.trim()) return;
    
    setIsRefining(true);
    setTimeout(() => {
      const refined = improveDreamText(content);
      setRefinedContent(refined);
      
      // Display refined prose on left page
      const leftPage = document.getElementById('refined-prose-page');
      if (leftPage) {
        leftPage.innerHTML = `
          <div class="refined-prose visible">${refined}</div>
          <button class="inscribe-button" id="inscribe-btn">
            💾 Inscribe into Tome
          </button>
        `;
        
        // Attach event listener to the button
        const inscribeBtn = document.getElementById('inscribe-btn');
        if (inscribeBtn) {
          inscribeBtn.addEventListener('click', handleSave);
        }
      }
      
      setIsRefining(false);
    }, 1200);
  };

  const handleSave = () => {
    if (!title.trim() || !refinedContent.trim()) return;
    
    const inscribeBtn = document.getElementById('inscribe-btn') as HTMLButtonElement;
    if (!inscribeBtn) return;

    // Disable button and show loading state
    inscribeBtn.disabled = true;
    inscribeBtn.style.opacity = '0.75';
    inscribeBtn.style.cursor = 'not-allowed';
    inscribeBtn.innerHTML = `
      <span style="display: inline-block; width: 16px; height: 16px; border: 2px solid var(--parchment-dark); border-top-color: transparent; border-radius: 50%; animation: spin 0.6s linear infinite; margin-right: 8px;"></span>
      Inscribing...
    `;

    // Add spin animation if it doesn't exist
    if (!document.getElementById('spin-animation')) {
      const style = document.createElement('style');
      style.id = 'spin-animation';
      style.textContent = `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    // Simulate save delay
    setTimeout(() => {
      addDream({
        title: title.trim(),
        content: refinedContent,
        originalContent: content,
      });

      // Show success state
      inscribeBtn.innerHTML = `
        <span style="font-size: 20px; margin-right: 8px;">✓</span>
        Inscribed!
      `;
      inscribeBtn.style.backgroundColor = '#10b981';
      inscribeBtn.style.opacity = '1';

      // Reset form after brief delay
      setTimeout(() => {
        setTitle('');
        setContent('');
        setRefinedContent('');
        
        // Clear left page
        const leftPage = document.getElementById('refined-prose-page');
        if (leftPage) {
          leftPage.innerHTML = '';
        }
        
        // Hide banner after first dream is saved
        setShowBanner(false);
        
        alert('✨ Dream inscribed into your Tome!');
      }, 800);
    }, 600);
  };

  const handleLoadSample = () => {
    setTitle(SAMPLE_DREAM.title);
    setContent(SAMPLE_DREAM.description);
    setRefinedContent('');
    setShowBanner(false);
    
    // Small delay then trigger refine
    setTimeout(() => {
      const refined = improveDreamText(SAMPLE_DREAM.description);
      setRefinedContent(refined);
      
      // Display on left page
      const leftPage = document.getElementById('refined-prose-page');
      if (leftPage) {
        leftPage.innerHTML = `
          <div class="refined-prose visible">${refined}</div>
          <button class="inscribe-button" id="inscribe-btn">
            💾 Inscribe into Tome
          </button>
        `;
        
        // Attach event listener
        const inscribeBtn = document.getElementById('inscribe-btn');
        if (inscribeBtn) {
          inscribeBtn.addEventListener('click', handleSave);
        }
      }
    }, 500);
  };

  const handleDismissBanner = () => {
    localStorage.setItem(BANNER_DISMISSED_KEY, 'true');
    setShowBanner(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Onboarding Banner */}
      {showBanner && (
        <div className="mb-4 p-3 rounded-lg border-2 border-[var(--gold)] bg-gradient-to-br from-amber-50 to-yellow-50 fade-in">
          <div className="flex items-start gap-2">
            <div className="text-xl">✨</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-[var(--burgundy)] mb-1">
                New here? Try a sample.
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={handleLoadSample}
                  className="px-3 py-1.5 bg-[var(--gold)] text-[var(--parchment-dark)] rounded text-xs font-medium hover:bg-[#c9a332] transition-all"
                  style={{ fontFamily: "'Marcellus SC', serif" }}
                >
                  Load Sample
                </button>
                <button
                  onClick={handleDismissBanner}
                  className="px-3 py-1.5 bg-[var(--parchment-dark)]/10 text-[var(--parchment-dark)] rounded text-xs font-medium hover:bg-[var(--parchment-dark)]/20 transition-all"
                  style={{ fontFamily: "'Marcellus SC', serif" }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dream Form */}
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
          onChange={(e) => setTitle(e.target.value)}
          placeholder="The Floating Garden..."
          className="w-full px-3 py-2 rounded-md border border-[var(--parchment-dark)]/30 bg-white/70 text-[var(--parchment-dark)] focus:outline-none focus:border-[var(--gold)] transition-colors text-sm"
          style={{ fontFamily: 'Spectral, serif' }}
        />
      </div>

      <div className="mb-3 flex-1 flex flex-col">
        <label className="block text-xs font-medium mb-1 opacity-70" style={{ fontFamily: 'Spectral, serif' }}>
          Describe your dream...
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="I found myself walking through a garden suspended in the clouds..."
          className="w-full flex-1 px-3 py-2 rounded-md border border-[var(--parchment-dark)]/30 bg-white/70 text-[var(--parchment-dark)] focus:outline-none focus:border-[var(--gold)] transition-colors resize-none text-sm"
          style={{ fontFamily: 'Spectral, serif', minHeight: '120px' }}
          rows={5}
        />
      </div>

      <button
        onClick={handleRefine}
        disabled={!content.trim() || isRefining}
        className="w-full bg-[#7b3f00] text-[#fff3e0] py-2.5 rounded-md font-medium hover:bg-[#a05a1b] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mb-3"
        style={{ fontFamily: "'Marcellus SC', serif" }}
      >
        {isRefining ? (
          <>
            <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Refining with Magic...
          </>
        ) : (
          '✨ Refine with Magic'
        )}
      </button>

      {/* Footer Note */}
      <p className="text-center text-xs opacity-50 mt-auto pt-3" style={{ fontFamily: 'Spectral, serif' }}>
        🔒 Stored locally — safe within your Tome
      </p>
    </div>
  );
}
