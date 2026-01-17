'use client';

import { forwardRef, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SliderProps {
  leftLabel?: string;
  rightLabel?: string;
  value: number;
  marginLeft: number;
  marginRight: number;
  onChange: (updates: { value?: number; marginLeft?: number; marginRight?: number }) => void;
  onCommit: () => void;
  onThumbWheel?: (delta: number) => void;
  className?: string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, leftLabel, rightLabel, value, marginLeft, marginRight, onChange, onCommit, onThumbWheel }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const toPercent = (val: number) => ((val + 100) / 200) * 100;
    const centerVal = value;
    const centerPercent = toPercent(centerVal);

    useEffect(() => {
      const container = containerRef.current;
      if (!container || !onThumbWheel) return;

      const handleWheel = (e: WheelEvent) => {
        const rect = container.getBoundingClientRect();

        const mouseX = e.clientX - rect.left;

        const thumbX = (centerPercent / 100) * rect.width;

        const hitRadius = 25;

        if (Math.abs(mouseX - thumbX) <= hitRadius) {
          e.preventDefault();

          const step = 1;
          const delta = e.deltaY < 0 ? step : -step;
          onThumbWheel(delta);
        }
      };

      container.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }, [centerPercent, onThumbWheel]);

    const leftBoundVal = Math.max(-100, value - marginLeft);
    const rightBoundVal = Math.min(100, value + marginRight);

    const leftBoundPercent = toPercent(leftBoundVal);
    const rightBoundPercent = toPercent(rightBoundVal);

    const thumbInputStyles = clsx(
      'absolute inset-0 h-full w-full appearance-none bg-transparent pointer-events-none z-30',
      'focus:outline-none',
      '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-transparent [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8',
      '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:w-8',
    );

    return (
      <div className={twMerge('flex w-full flex-col gap-5 pt-4 pb-2 select-none', className)}>
        <div ref={containerRef} className="relative flex h-8 items-center">
          <div className="bg-secondary/40 absolute right-0 left-0 h-1.5 w-full rounded-full" />

          <div
            className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full transition-all duration-75 ease-out"
            style={{
              left: `${leftBoundPercent}%`,
              width: `${rightBoundPercent - leftBoundPercent}%`,
              backgroundColor: 'var(--strong-accent)',
              boxShadow: '0 0 12px 1px color-mix(in srgb, var(--strong-accent), transparent 40%)',
            }}
          />

          <div
            className="bg-card border-accent-strong absolute top-1/2 z-20 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] shadow-sm transition-transform"
            style={{ left: `${leftBoundPercent}%` }}
          />

          <div
            className="bg-card border-accent-strong absolute top-1/2 z-20 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] shadow-sm transition-transform"
            style={{ left: `${rightBoundPercent}%` }}
          />

          <div
            className="absolute top-1/2 z-20 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform"
            style={{
              left: `${centerPercent}%`,
              backgroundColor: 'var(--strong-accent)',
              boxShadow: '0 0 20px 4px color-mix(in srgb, var(--strong-accent), transparent 50%)',
            }}
          >
            <div className="h-2 w-2 rounded-full bg-white/50 blur-[0.5px]" />
          </div>

          <input
            type="range"
            min="-100"
            max="100"
            step="1"
            value={leftBoundVal}
            onChange={e => {
              const newVal = parseInt(e.target.value);
              if (newVal <= centerVal) onChange({ marginLeft: centerVal - newVal });
            }}
            onMouseUp={onCommit}
            onTouchEnd={onCommit}
            className={thumbInputStyles}
          />

          <input
            type="range"
            min="-100"
            max="100"
            step="1"
            value={rightBoundVal}
            onChange={e => {
              const newVal = parseInt(e.target.value);
              if (newVal >= centerVal) onChange({ marginRight: newVal - centerVal });
            }}
            onMouseUp={onCommit}
            onTouchEnd={onCommit}
            className={thumbInputStyles}
          />

          <input
            ref={ref}
            type="range"
            min="-100"
            max="100"
            step="1"
            value={centerVal}
            onChange={e => {
              const newVal = parseInt(e.target.value);

              const maxAllowedLeft = newVal + 100;
              const maxAllowedRight = 100 - newVal;

              const newMarginLeft = Math.min(marginLeft, maxAllowedLeft);
              const newMarginRight = Math.min(marginRight, maxAllowedRight);
              onChange({ value: newVal, marginLeft: newMarginLeft, marginRight: newMarginRight });
            }}
            onMouseUp={onCommit}
            onTouchEnd={onCommit}
            className={thumbInputStyles}
          />
        </div>

        <div className="text-muted-foreground/60 flex justify-between px-1 text-[10px] font-bold tracking-widest uppercase">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      </div>
    );
  },
);

Slider.displayName = 'Slider';
