'use client';

import { clsx } from 'clsx';

interface SliderThumbProps {
  left: number;
  active: boolean;
  type: 'bracket' | 'center';
  color: string;
  isDragging: boolean | null;
}

export function SliderThumb({ left, active, type, color, isDragging }: SliderThumbProps) {
  if (type === 'center') {
    return (
      <div
        className={clsx(
          'pointer-events-none absolute top-1/2 z-30 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[2px] border-white shadow-md transition-transform',
          active ? 'scale-110' : '',
          isDragging && !active && 'opacity-50',
        )}
        style={{ left: `${left}%`, backgroundColor: color }}
      >
        <div className="h-2 w-2 rounded-full bg-white/50 blur-[0.5px]" />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'bg-card pointer-events-none absolute top-1/2 z-30 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] shadow-sm transition-transform',
        active ? 'scale-110' : '',
        isDragging && !active && 'opacity-50',
      )}
      style={{ left: `${left}%`, borderColor: color }}
    />
  );
}
