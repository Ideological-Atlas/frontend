interface WavyBackgroundProps {
  variant?: 'default' | 'other';
}

export function WavyBackground({ variant = 'default' }: WavyBackgroundProps) {
  const activeColor = variant === 'other' ? 'var(--other-user-strong)' : 'var(--strong-accent)';

  return (
    <div className="from-accent-strong/5 to-accent/5 absolute inset-0 z-0 overflow-hidden rounded-xl bg-gradient-to-br via-transparent">
      <svg className="absolute top-0 left-0 h-full w-full opacity-60" preserveAspectRatio="none" viewBox="0 0 1000 200">
        <defs>
          <linearGradient id={`lineGradient-${variant}`} x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor={activeColor} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M0,100 C150,150 350,50 500,100 C650,150 850,50 1000,100"
          fill="none"
          stroke={`url(#lineGradient-${variant})`}
          strokeWidth="2"
        />
        <path
          d="M0,50 C200,150 400,0 600,100 C800,200 1000,50 1200,100"
          fill="none"
          opacity="0.6"
          stroke={`url(#lineGradient-${variant})`}
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
