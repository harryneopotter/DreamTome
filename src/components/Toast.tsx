import { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, onClose, duration = 2500 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] fade-in">
      <div className="bg-[var(--parchment-dark)] text-[var(--parchment-light)] px-6 py-3 rounded-lg shadow-2xl border-2 border-[var(--gold)] flex items-center gap-2">
        <span className="text-xl">✨</span>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}
