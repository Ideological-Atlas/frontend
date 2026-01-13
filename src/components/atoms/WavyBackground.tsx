export function WavyBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden rounded-xl bg-gradient-to-br from-[var(--strong-accent)]/5 via-transparent to-purple-500/5">
      <svg
        className="absolute top-0 left-0 h-full w-full opacity-30"
        preserveAspectRatio="none"
        viewBox="0 0 1000 200"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="var(--strong-accent)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M0,100 C150,150 350,50 500,100 C650,150 850,50 1000,100"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="1.5"
        />
        <path
          d="M0,50 C200,150 400,0 600,100 C800,200 1000,50 1200,100"
          fill="none"
          opacity="0.5"
          stroke="url(#lineGradient)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
