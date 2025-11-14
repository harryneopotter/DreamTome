import { Dream } from '../types';

interface ExportCardProps {
  dream: Dream;
}

const categoryConfig = {
  Serene: { emoji: '🌸', color: '#C8E6E6', gradient: 'linear-gradient(135deg, #C8E6E6 0%, #A8C6C6 100%)' },
  Strange: { emoji: '🔮', color: '#CFA1E8', gradient: 'linear-gradient(135deg, #CFA1E8 0%, #AF81C8 100%)' },
  Nightmare: { emoji: '🌑', color: '#D37C7C', gradient: 'linear-gradient(135deg, #D37C7C 0%, #B35C5C 100%)' },
  Epic: { emoji: '⚔️', color: '#F9C784', gradient: 'linear-gradient(135deg, #F9C784 0%, #D9A764 100%)' },
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

/**
 * Smart truncation that breaks at word boundaries
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  // Find the last space before maxLength
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  // If we found a space, break there. Otherwise, use the hard limit
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}

export default function ExportCard({ dream }: ExportCardProps) {
  const config = categoryConfig[dream.category];
  
  // Smart truncation for title (max ~60 chars for 2 lines at 56px font)
  const truncatedTitle = truncateText(dream.title, 60);
  
  // Smart truncation for content (max ~280 chars for 4 lines at 24px font)
  const truncatedContent = truncateText(dream.content, 280);
  
  // Format date
  const formattedDate = new Date(dream.date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      id="dream-export-card"
      style={{
        position: 'fixed',
        left: '-99999px',
        top: '-99999px',
        width: '1200px',
        height: '630px',
        background: 'linear-gradient(135deg, #f9e6c8 0%, #e8d4b0 100%)',
        borderRadius: '24px',
        border: '8px solid #D4AF37',
        padding: '60px 70px',
        boxSizing: 'border-box',
        fontFamily: "'Spectral', serif",
        color: '#2A1B0F',
        overflow: 'hidden',
        visibility: 'hidden',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      {/* Background accent based on category */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '400px',
          height: '100%',
          background: config.gradient,
          opacity: 0.15,
          borderRadius: '0 16px 16px 0',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Category Badge */}
        <div style={{ marginBottom: '20px' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              borderRadius: '999px',
              fontSize: '18px',
              fontWeight: '600',
              backgroundColor: config.color,
              color: '#2A1B0F',
              fontFamily: "'Spectral', serif",
            }}
          >
            {config.emoji} {dream.category}
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Cormorant Unicase', serif",
            fontSize: '56px',
            fontWeight: '700',
            lineHeight: '1.2',
            marginBottom: '28px',
            color: '#8B4049',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'none',
          }}
        >
          {truncatedTitle}
        </h1>

        {/* Content Excerpt */}
        <p
          style={{
            fontFamily: "'Spectral', serif",
            fontSize: '24px',
            lineHeight: '1.65',
            marginBottom: '28px',
            flex: '1',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'none',
          }}
        >
          {truncatedContent}
        </p>

        {/* Tags */}
        {dream.tags && dream.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
            {dream.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '16px',
                  fontWeight: '600',
                  backgroundColor: tagConfig[tag]?.color || '#E8D4B0',
                  color: '#2A1B0F',
                  fontFamily: "'Spectral', serif",
                }}
              >
                {tagConfig[tag]?.emoji} {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '20px',
            borderTop: '2px solid rgba(42, 27, 15, 0.2)',
            marginTop: 'auto',
          }}
        >
          <div style={{ 
            fontFamily: "'Spectral', serif",
            fontSize: '20px', 
            fontWeight: '600', 
            opacity: 0.7 
          }}>
            {formattedDate}
          </div>
          <div
            style={{
              fontFamily: "'Cormorant Unicase', serif",
              fontSize: '32px',
              fontWeight: '700',
              color: '#D4AF37',
              textShadow: '0 0 10px rgba(212, 175, 55, 0.3)',
            }}
          >
            DreamTome
          </div>
        </div>
      </div>
    </div>
  );
}
