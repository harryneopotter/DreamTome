import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Dream } from '../types';
import { X, Edit, Trash } from './Icons';
import { useDreams } from '../hooks/useDreams';
import ExportCard from './ExportCard';
import Toast from './Toast';
import ConfirmDialog from './ConfirmDialog';
import { exportDreamAsPNG } from '../utils/exportDream';
import ArcaneButton from './ArcaneButton';
import { useSound } from '../hooks/useSound';
import { Z_INDEX } from '../constants/zIndex';
import { generateDreamProse, analyzeDream } from '../services/gemini';

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
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [viewMode, setViewMode] = useState<'original' | 'story'>(dream.prose ? 'story' : 'original');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { updateDream, deleteDream } = useDreams();
  const { play } = useSound();

  const handleSave = () => {
    updateDream(dream.id, { content: editedContent });
    setIsEditing(false);
  };

  const handleEnhance = async () => {
    setIsEnhancing(true);
    play('hoverGlow');
    try {
      // Parallel execution for speed
      const [prose, analysis] = await Promise.all([
        generateDreamProse(dream.content),
        analyzeDream(dream.content)
      ]);

      updateDream(dream.id, {
        prose,
        interpretation: analysis.interpretation,
        mood: analysis.mood,
        tags: analysis.tags ? [...(dream.tags || []), ...analysis.tags] : dream.tags
      });

      setViewMode('story');
      play('bookOpen');
    } catch (error) {
      console.error("Enhancement failed:", error);
      setShowErrorToast(true);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
    play('hoverGlow');
  };

  const confirmDelete = () => {
    deleteDream(dream.id);
    setShowDeleteDialog(false);
    play('sealPop');
    onClose();
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    play('flipBack');
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportDreamAsPNG(dream.title);
      setShowSuccessToast(true);
    } catch (error) {
      setShowErrorToast(true);
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const config = categoryConfig[dream.category];

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 fade-in"
        style={{ zIndex: Z_INDEX.MODAL }}
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
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.emoji} {dream.category}
              </span>
              {dream.mood && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                  ✨ {dream.mood}
                </span>
              )}
            </div>

            <h2 className="text-3xl font-bold text-[var(--burgundy)] mb-2 break-words" style={{ fontFamily: "'Cormorant Unicase', serif" }}>
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

          {/* AI Insights Section */}
          {dream.interpretation && !isEditing && (
            <div className="mb-6 p-4 bg-[var(--parchment-dark)]/5 rounded-lg border border-[var(--parchment-dark)]/20 italic text-[var(--ink-brown)]">
              <p className="font-bold text-xs uppercase tracking-widest opacity-60 mb-2">My Interpretation</p>
              <p className="text-lg" style={{ fontFamily: "'Tangerine', cursive" }}>{dream.interpretation}</p>
            </div>
          )}

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
            <div className="mb-6 relative">
              {/* View Toggle */}
              {dream.prose && (
                <div className="flex justify-end mb-2">
                  <div className="bg-[var(--parchment-dark)]/10 p-1 rounded-full inline-flex">
                    <button
                      onClick={() => setViewMode('original')}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${viewMode === 'original' ? 'bg-white shadow text-[var(--burgundy)]' : 'text-[var(--ink-brown)] opacity-60'}`}
                    >
                      Notes
                    </button>
                    <button
                      onClick={() => setViewMode('story')}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${viewMode === 'story' ? 'bg-white shadow text-[var(--burgundy)]' : 'text-[var(--ink-brown)] opacity-60'}`}
                    >
                      Story
                    </button>
                  </div>
                </div>
              )}

              <p className="leading-relaxed whitespace-pre-wrap break-words text-lg" style={{ fontFamily: 'Spectral, serif', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                {viewMode === 'story' && dream.prose ? dream.prose : dream.content}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-4 border-t border-[var(--parchment-dark)]/20">
            {/* MAGIC BUTTON */}
            {!isEditing && !dream.prose && (
              <ArcaneButton
                onClick={handleEnhance}
                disabled={isEnhancing}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-900 to-purple-900 text-white border-none shadow-lg hover:shadow-indigo-500/30"
              >
                {isEnhancing ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                    Consulting Oracles...
                  </>
                ) : (
                  <>
                    <span>✨</span> Unveil Mysteries
                  </>
                )}
              </ArcaneButton>
            )}

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
                  Export Card
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

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Dream?"
        description="This dream will be permanently removed from your Tome. This action cannot be undone."
        confirmLabel="Yes, delete it"
        cancelLabel="Keep it"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {/* Success toast */}
      {showSuccessToast && (
        <Toast
          message="Dream exported as PNG!"
          onClose={() => setShowSuccessToast(false)}
        />
      )}

      {/* Error toast */}
      {showErrorToast && (
        <Toast
          message="Failed to export dream. Please try again."
          onClose={() => setShowErrorToast(false)}
        />
      )}
    </>,
    document.body
  );
}
