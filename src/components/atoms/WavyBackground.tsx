'use client';

interface WavyBackgroundProps {
  variant?: 'default' | 'other';
}

export function WavyBackground({ variant = 'default' }: WavyBackgroundProps) {
  const isOther = variant === 'other';

  const color1 = isOther ? 'var(--other-user)' : 'var(--strong-accent)';
  const color2 = isOther ? 'var(--other-user-strong)' : 'var(--primary)';

  const bgGradient = isOther ? 'from-other-user-strong/5 to-other-user/5' : 'from-accent-strong/5 to-accent/5';

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden rounded-xl bg-gradient-to-br via-transparent ${bgGradient}`}>
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_85%)]">
        <svg className="absolute top-0 left-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
          <defs>
            <linearGradient
              id={`flowingGradient-${variant}`}
              x1="0"
              y1="0"
              x2="500"
              y2="0"
              gradientUnits="userSpaceOnUse"
              spreadMethod="repeat"
            >
              <stop offset="0%" stopColor={color1} stopOpacity="0.4" />
              <stop offset="50%" stopColor={color2} stopOpacity="1" />
              <stop offset="100%" stopColor={color1} stopOpacity="0.4" />

              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                from="0 0"
                to="-500 0"
                dur="6s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>

          <path
            d="M0,100 C150,150 350,50 500,100 C650,150 850,50 1000,100"
            fill="none"
            stroke={`url(#flowingGradient-${variant})`}
            strokeWidth="3"
          />
          <path
            d="M0,50 C200,150 400,0 600,100 C800,200 1000,50 1200,100"
            fill="none"
            opacity="0.8"
            stroke={`url(#flowingGradient-${variant})`}
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}
