'use client';

import { forwardRef } from 'react';
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
  className?: string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, leftLabel, rightLabel, value, marginLeft, marginRight, onChange, onCommit }, ref) => {
    const toPercent = (val: number) => ((val + 100) / 200) * 100;

    const centerVal = value;
    const leftBoundVal = Math.max(-100, value - marginLeft);
    const rightBoundVal = Math.min(100, value + marginRight);

    const centerPercent = toPercent(centerVal);
    const leftBoundPercent = toPercent(leftBoundVal);
    const rightBoundPercent = toPercent(rightBoundVal);

    const thumbInputStyles = clsx(
      'absolute inset-0 h-full w-full appearance-none bg-transparent pointer-events-none z-20',
      'focus:outline-none',
      '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110',
      '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110',
    );

    return (
      <div className={twMerge('flex w-full flex-col gap-5 select-none pt-2', className)}>
        <div className="relative h-10 flex items-center">
          <div className="bg-secondary/60 absolute right-0 left-0 h-2 rounded-full" />
          <div className="absolute right-0 left-0 top-1/2 flex -translate-y-1/2 justify-between px-0.5">
            <div className="bg-foreground/10 h-1 w-0.5 rounded-full" />
            <div className="bg-foreground/10 h-1 w-0.5 rounded-full" />
            <div className="bg-foreground/10 h-1 w-0.5 rounded-full" />
          </div>
          <div
            className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-[var(--strong-accent)] transition-all"
            style={{
              left: `${leftBoundPercent}%`,
              width: `${rightBoundPercent - leftBoundPercent}%`,
              boxShadow: '0 0 15px color-mix(in srgb, var(--strong-accent), transparent 60%)',
            }}
          />
          <div
            className="absolute top-1/2 z-10 h-4 w-4 -ml-2 -translate-y-1/2 rounded-full border bg-background shadow-sm transition-transform pointer-events-none"
            style={{
              left: `${leftBoundPercent}%`,
              borderColor: 'color-mix(in srgb, var(--strong-accent), transparent 50%)',
            }}
          />
          <div
            className="absolute top-1/2 z-10 h-4 w-4 -ml-2 -translate-y-1/2 rounded-full border bg-background shadow-sm transition-transform pointer-events-none"
            style={{
              left: `${rightBoundPercent}%`,
              borderColor: 'color-mix(in srgb, var(--strong-accent), transparent 50%)',
            }}
          />
          <div
            className="absolute top-1/2 z-30 h-6 w-6 -ml-3 -translate-y-1/2 rounded-full bg-[var(--strong-accent)] transition-transform pointer-events-none flex items-center justify-center"
            style={{
              left: `${centerPercent}%`,
              background: `linear-gradient(to bottom, color-mix(in srgb, var(--strong-accent), white 20%), var(--strong-accent))`,
              boxShadow: '0 10px 15px -3px color-mix(in srgb, var(--strong-accent), transparent 60%)',
            }}
          >
            <div className="bg-white/30 h-2 w-2 rounded-full blur-[1px]" />
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            step="1"
            value={leftBoundVal}
            onChange={e => {
              const newVal = parseInt(e.target.value);
              if (newVal <= centerVal) {
                onChange({ marginLeft: centerVal - newVal });
              }
            }}
            onMouseUp={onCommit}
            onTouchEnd={onCommit}
            className={clsx(
              thumbInputStyles,
              'z-20 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4',
            )}
          />

          <input
            type="range"
            min="-100"
            max="100"
            step="1"
            value={rightBoundVal}
            onChange={e => {
              const newVal = parseInt(e.target.value);
              if (newVal >= centerVal) {
                onChange({ marginRight: newVal - centerVal });
              }
            }}
            onMouseUp={onCommit}
            onTouchEnd={onCommit}
            className={clsx(
              thumbInputStyles,
              'z-20 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4',
            )}
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

              onChange({ 
                value: newVal,
                marginLeft: newMarginLeft,
                marginRight: newMarginRight
              });
            }}
            onMouseUp={onCommit}
            onTouchEnd={onCommit}
            className={clsx(
              thumbInputStyles,
              'z-30 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6',
            )}
          />
        </div>

        <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60 px-1">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      </div>
    );
  },
);

Slider.displayName = 'Slider';
