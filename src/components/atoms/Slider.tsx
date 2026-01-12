'use client';

import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftLabel?: string;
  rightLabel?: string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, leftLabel, rightLabel, ...props }, ref) => {
    return (
      <div className="flex w-full flex-col gap-3">
        <div className="text-muted-foreground flex justify-between text-xs font-medium">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
        <input
          type="range"
          min="-100"
          max="100"
          step="1"
          ref={ref}
          className={twMerge(
            clsx(
              'bg-secondary h-2 w-full cursor-pointer appearance-none rounded-lg',
              'accent-primary hover:accent-primary-hover focus:ring-primary/50 focus:ring-2 focus:outline-none',
              className,
            ),
          )}
          {...props}
        />
      </div>
    );
  },
);

Slider.displayName = 'Slider';
