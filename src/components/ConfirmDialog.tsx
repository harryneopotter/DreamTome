import { useId } from 'react';
import ArcaneButton from './ArcaneButton';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const labelId = useId();
  const descriptionId = useId();

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 fade-in"
      style={{ zIndex: 1000000 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
      onClick={onCancel}
    >
      <div
        className="parchment-panel max-w-md w-full p-6 relative"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id={labelId}
          className="text-2xl font-semibold text-[var(--burgundy)] mb-3"
          style={{ fontFamily: "'Cormorant Unicase', serif" }}
        >
          {title}
        </h2>
        <p
          id={descriptionId}
          className="text-sm leading-relaxed opacity-80 mb-6"
          style={{ fontFamily: 'Spectral, serif' }}
        >
          {description}
        </p>
        <div className="flex flex-wrap gap-3 justify-end">
          <ArcaneButton onClick={onConfirm} className="flex-1 min-w-[120px] justify-center">
            {confirmLabel}
          </ArcaneButton>
          <ArcaneButton
            variant="ghost"
            onClick={onCancel}
            className="flex-1 min-w-[120px] justify-center"
          >
            {cancelLabel}
          </ArcaneButton>
        </div>
      </div>
    </div>
  );
}
