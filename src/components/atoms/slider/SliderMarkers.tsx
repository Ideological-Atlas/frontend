'use client';

import { clsx } from 'clsx';

const AXIS_MARKERS = [12.5, 25, 37.5, 50, 62.5, 75, 87.5];

export function SliderMarkers() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {AXIS_MARKERS.map(pos => (
        <div
          key={pos}
          className={clsx(
            'absolute top-1/2 w-px -translate-x-1/2 -translate-y-1/2 rounded-full',
            pos === 50 ? 'bg-foreground/30 h-3' : 'bg-foreground/20 h-1.5',
          )}
          style={{ left: `${pos}%` }}
        />
      ))}
    </div>
  );
}
