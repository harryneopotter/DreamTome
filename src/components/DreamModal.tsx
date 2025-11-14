import { useState } from 'react';
import { Dream } from '../types';
import { X, Edit, Trash } from './Icons';
import { useDreams } from '../hooks/useDreams';
import ExportCard from './ExportCard';
import Toast from './Toast';
import { exportDreamAsPNG } from '../utils/exportDream';
import ArcaneButton from './ArcaneButton';

interface DreamModalProps {
  dream: Dream;
  onClose: () => void;
}

const categoryConfig = {
  Serene: { emoji: '🌸', color: 'bg-blue-100 text-blue-800' },
  Strange: { emoji: '🔮', color: 'bg-purple-100 text-purple-800' },
  Nightmare: { emoji: '🌑', color: 'bg-red-100 text-red-800' },
  Epic: { emoji: '⚔️', color: 'bg-amber-100 text-amber-800' },
};

export default function DreamModal({ dream, onClose }: DreamModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(dream.content);
  const [isExporting, setIsExporting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { updateDream, deleteDream } = useDreams();

  const handleSave = () => {
    updateDream(dream.id, { content: editedContent });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this dream?')) {
      deleteDream(dream.id);
      onClose();
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportDreamAsPNG(dream.title);
      setShowToast(true);
    } catch (error) {
      alert('Failed to export dream. Please try again.');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const config = categoryConfig[dream.category];

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 fade-in"
        style={{ zIndex: 1000000 }}
        onClick={onClose}
      >
        <div
          className="parchment-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full border border-[var(--burgundy)]/40 flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Close"
          >
            <X />
          </button>

          <div className="mb-4">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${config.color} mb-3`}>
              {config.emoji} {dream.category}
            </span>
            <h2 className="text-3xl font-bold text-[var(--burgundy)] mb-2" style={{ fontFamily: "'Cormorant Unicase', serif" }}>
              {dream.title}
            </h2>
            <p className="text-sm opacity-60" style={{ fontFamily: 'Spectral, serif' }}>
              {new Date(dream.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {isEditing ? (
            <div className="mb-6">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-[var(--parchment-dark)] bg-white/60 focus:outline-none focus:border-[var(--gold)] transition-colors resize-none"
                style={{ fontFamily: 'Spectral, serif' }}
                rows={10}
              />
              <div className="flex flex-wrap gap-3 mt-4">
                <ArcaneButton onClick={handleSave} className="flex-1 justify-center">
                  Save Changes
                </ArcaneButton>
                <ArcaneButton
                  variant="ghost"
                  onClick={() => {
                    setEditedContent(dream.content);
                    setIsEditing(false);
                  }}
                  className="flex-1 justify-center"
                >
                  Cancel
                </ArcaneButton>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <p className="leading-relaxed whitespace-pre-line" style={{ fontFamily: 'Spectral, serif' }}>
                {dream.content}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-4 border-t border-[var(--parchment-dark)]/20">
            <ArcaneButton
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-[var(--parchment-dark)] border-t-transparent rounded-full animate-spin"></span>
                  Exporting...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Export Card (PNG)
                </>
              )}
            </ArcaneButton>

            <ArcaneButton
              variant="secondary"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              <Edit />
              {isEditing ? 'Finish Editing' : 'Edit'}
            </ArcaneButton>

            <ArcaneButton
              variant="ghost"
              onClick={handleDelete}
              className="flex items-center gap-2"
            >
              <Trash />
              Delete
            </ArcaneButton>
          </div>
        </div>
      </div>

      {/* Hidden export card - stays completely off-screen */}
      <ExportCard dream={dream} />

      {/* Success toast */}
      {showToast && (
        <Toast
          message="Dream exported as PNG!"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}
