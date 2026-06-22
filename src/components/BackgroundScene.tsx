import type { BgAnimation } from '../types';

interface BackgroundSceneProps {
  animation: BgAnimation;
}

/** Static pastel orbs — the original design */
function OrbsScene() {
  return (
    <>
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-800/20 dark:bg-brand-800/20 bg-brand-400/15 blur-3xl animate-float" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-violet-800/20 dark:bg-violet-800/20 bg-violet-400/15 blur-3xl animate-float [animation-delay:3s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-brand-600/10 blur-3xl animate-spin-slow" />
    </>
  );
}


/** Floating particle dots */
function ParticlesScene() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: 2 + (i % 4),
    top: `${(i * 37 + 5) % 100}%`,
    left: `${(i * 53 + 10) % 100}%`,
    delay: `${(i * 0.4) % 5}s`,
    duration: `${5 + (i % 4)}s`,
  }));

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-brand-400/30 dark:bg-brand-400/25"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            animation: `particleFloat ${p.duration} ease-in-out infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}
    </>
  );
}

/** Subtle animated grid */
function GridScene() {
  return (
    <div
      className="absolute inset-0 animate-grid-pulse"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.08) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    />
  );
}

export function BackgroundScene({ animation }: BackgroundSceneProps) {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {animation === 'orbs' && <OrbsScene />}
      {animation === 'particles' && <ParticlesScene />}
      {animation === 'grid' && <GridScene />}
    </div>
  );
}
