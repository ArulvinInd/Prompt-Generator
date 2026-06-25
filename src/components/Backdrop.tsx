interface BackdropProps {
  isOpen: boolean;
  onClick: () => void;
  /** Tailwind bg utility, e.g. "bg-black/50" (default) or "bg-black/60" */
  bg?: string;
  /** Transition duration in ms (default 300) */
  duration?: 200 | 300;
}

/**
 * Shared full-screen backdrop overlay.
 * Uses `invisible` when closed so the browser skips backdrop-blur
 * GPU calculations on an invisible layer.
 */
export function Backdrop({ isOpen, onClick, bg = 'bg-black/50', duration = 300 }: BackdropProps) {
  return (
    <div
      aria-hidden
      onClick={onClick}
      className={`fixed inset-0 z-40 backdrop-blur-sm transition-opacity ${bg} ${
        duration === 200 ? 'duration-200' : 'duration-300'
      } ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none invisible'}`}
    />
  );
}
