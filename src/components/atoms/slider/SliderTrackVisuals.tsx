'use client';

import { clsx } from 'clsx';
import { SliderMarkers } from './SliderMarkers';

interface SliderTrackVisualsProps {
  lPercent: number;
  rPercent: number;
  color: string;
  isNotAnswered?: boolean;
  isIndifferent?: boolean;
  label?: string;
  notAnsweredLabel?: string;
  indifferentLabel?: string;
}

export function SliderTrackVisuals({
  lPercent,
  rPercent,
  color,
  isNotAnswered,
  isIndifferent,
  label,
  notAnsweredLabel,
  indifferentLabel,
}: SliderTrackVisualsProps) {
  return (
    <div className="relative h-8 w-full">
      {label && (
        <div
          className={clsx(
            'absolute -top-5 left-0 text-xs font-bold tracking-wider uppercase',
            isNotAnswered
              ? 'text-muted-foreground opacity-70'
              : color.startsWith('var(--other') || color.includes('other-user')
                ? 'text-other-user'
                : 'text-primary',
          )}
          style={!color.startsWith('var(--') ? { color } : undefined}
        >
          {label}
        </div>
      )}

      <div
        className={clsx(
          'pointer-events-none absolute top-1/2 right-0 left-0 h-1.5 w-full -translate-y-1/2 rounded-full',
          isNotAnswered ? 'bg-muted border-border border border-dashed' : 'bg-secondary/40',
        )}
      />

      {!isNotAnswered && !isIndifferent && <SliderMarkers />}

      {(isIndifferent || isNotAnswered) && (
        <div className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <div
            className={clsx(
              'flex items-center justify-center rounded-md px-3 py-1.5 shadow-sm backdrop-blur-sm',
              isNotAnswered
                ? 'bg-card/50 text-muted-foreground'
                : 'bg-card/80 border-border text-muted-foreground border',
            )}
          >
            <span className="text-[10px] leading-none font-bold tracking-widest uppercase">
              {isNotAnswered ? notAnsweredLabel : indifferentLabel}
            </span>
          </div>
        </div>
      )}

      {!isIndifferent && !isNotAnswered && (
        <div
          className="pointer-events-none absolute top-1/2 z-10 h-2 -translate-y-1/2 rounded-full transition-all duration-75 ease-out"
          style={{
            left: `${lPercent}%`,
            width: `${rPercent - lPercent}%`,
            backgroundColor: color,
            boxShadow: `0 0 12px 1px color-mix(in srgb, ${color}, transparent 40%)`,
          }}
        />
      )}
    </div>
  );
}
