import { useState } from 'react';

interface ArtifactProps {
  icon: string;
  label: string;
  onClick: () => void;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  delay?: number;
}

function Artifact({ icon, label, onClick, position, delay = 0 }: ArtifactProps) {
  const [showLabel, setShowLabel] = useState(false);

  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} z-10`}
      onMouseEnter={() => setShowLabel(true)}
      onMouseLeave={() => setShowLabel(false)}
      style={{
        animationDelay: `${delay}s`,
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="artifact-button relative group"
        aria-label={label}
      >
        <div className="artifact-glow"></div>
        <span className="text-2xl relative z-10">{icon}</span>
        
        {/* Label that fades in on hover */}
        <div
          className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 rounded text-xs font-medium whitespace-nowrap pointer-events-none transition-all duration-300 ${
            showLabel ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
          }`}
          style={{
            backgroundColor: 'rgba(42, 27, 15, 0.95)',
            color: '#D4AF37',
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: '10px',
            textShadow: '0 0 4px rgba(212, 175, 55, 0.6)',
          }}
        >
          {label}
        </div>
      </button>
    </div>
  );
}

interface DreamCardArtifactsProps {
  onInterpret: () => void;
  onExpand: () => void;
}

export default function DreamCardArtifacts({
  onInterpret,
  onExpand,
}: DreamCardArtifactsProps) {
  return (
    <>
      <Artifact
        icon="🌙"
        label="Interpret"
        onClick={onInterpret}
        position="top-left"
        delay={0}
      />
      <Artifact
        icon="📜"
        label="Expand"
        onClick={onExpand}
        position="top-right"
        delay={0.1}
      />
    </>
  );
}
