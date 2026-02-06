'use client';

import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SliderThumb } from '@/components/atoms/slider/SliderThumb';
import { SliderTrackVisuals } from '@/components/atoms/slider/SliderTrackVisuals';

interface SliderProps {
  leftLabel?: string;
  rightLabel?: string;
  value: number;
  marginLeft: number;
  marginRight: number;
  bottomLabel?: string;
  isIndifferent?: boolean;
  indifferentLabel?: string;
  isNotAnswered?: boolean;
  notAnsweredLabel?: string;
  otherValue?: number | null;
  otherMarginLeft?: number | null;
  otherMarginRight?: number | null;
  otherIsIndifferent?: boolean;
  otherIsNotAnswered?: boolean;
  otherIndifferentLabel?: string;
  otherNotAnsweredLabel?: string;
  topLabel?: string;
  onChange?: (updates: { value?: number; marginLeft?: number; marginRight?: number }) => void;
  onCommit?: () => void;
  onThumbWheel?: (delta: number) => void;
  className?: string;
  readOnly?: boolean;
  variant?: 'default' | 'other';
  customHexColor?: string;
  otherCustomColor?: string;
  primaryOverlay?: React.ReactNode;
}

export const Slider = ({
  className,
  leftLabel,
  rightLabel,
  value,
  marginLeft,
  marginRight,
  bottomLabel,
  isIndifferent,
  indifferentLabel,
  isNotAnswered,
  notAnsweredLabel,
  otherValue,
  otherMarginLeft,
  otherMarginRight,
  otherIsIndifferent,
  otherIsNotAnswered,
  otherIndifferentLabel,
  otherNotAnsweredLabel,
  topLabel,
  onChange,
  onCommit,
  onThumbWheel,
  readOnly = false,
  variant = 'default',
  customHexColor,
  otherCustomColor,
  primaryOverlay,
}: SliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<null | 'center' | 'left' | 'right'>(null);

  const toPercent = (val: number) => ((val + 100) / 200) * 100;

  const centerPercent = isIndifferent ? 50 : toPercent(value);
  const leftBoundVal = Math.max(-100, value - marginLeft);
  const rightBoundVal = Math.min(100, value + marginRight);
  const leftPercent = isIndifferent ? 0 : toPercent(leftBoundVal);
  const rightPercent = isIndifferent ? 0 : toPercent(rightBoundVal);

  const activeColor = customHexColor ? customHexColor : variant === 'other' ? 'var(--other-user)' : 'var(--primary)';

  const hasOther = otherValue !== undefined || otherIsNotAnswered || otherIsIndifferent;
  const otherCenterPercent = hasOther && otherValue !== null && otherValue !== undefined ? toPercent(otherValue) : 50;
  const otherColor = otherCustomColor || 'var(--other-user-strong)';

  let otherLeftPercent = 0;
  let otherRightPercent = 0;
  if (hasOther && otherValue !== null && otherValue !== undefined) {
    const omL = otherMarginLeft ?? 25;
    const omR = otherMarginRight ?? 25;
    const otherLeftVal = Math.max(-100, otherValue - omL);
    const otherRightVal = Math.min(100, otherValue + omR);
    otherLeftPercent = toPercent(otherLeftVal);
    otherRightPercent = toPercent(otherRightVal);
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (readOnly || !onChange || isIndifferent || isNotAnswered || primaryOverlay) return;
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const centerX = (centerPercent / 100) * width;
    const leftX = (leftPercent / 100) * width;
    const rightX = (rightPercent / 100) * width;

    const distCenter = Math.abs(clickX - centerX);
    const distLeft = Math.abs(clickX - leftX);
    const distRight = Math.abs(clickX - rightX);
    const threshold = 40;
    const minDist = Math.min(distCenter, distLeft, distRight);

    if (minDist > threshold) return;

    if (minDist === distCenter) setIsDragging('center');
    else if (minDist === distLeft) setIsDragging('left');
    else setIsDragging('right');

    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !onChange || readOnly) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const width = rect.width;
    const x = Math.max(0, Math.min(width, e.clientX - rect.left));
    const percent = (x / width) * 100;
    const rawVal = Math.round((percent / 100) * 200 - 100);

    if (isDragging === 'center') {
      const newVal = rawVal;
      const maxAllowedLeft = newVal + 100;
      const maxAllowedRight = 100 - newVal;
      const newMarginLeft = Math.min(marginLeft, maxAllowedLeft);
      const newMarginRight = Math.min(marginRight, maxAllowedRight);
      onChange({ value: newVal, marginLeft: newMarginLeft, marginRight: newMarginRight });
    } else if (isDragging === 'left') {
      const cappedVal = Math.min(rawVal, value);
      const newMarginLeft = value - cappedVal;
      onChange({ marginLeft: newMarginLeft });
    } else if (isDragging === 'right') {
      const cappedVal = Math.max(rawVal, value);
      const newMarginRight = cappedVal - value;
      onChange({ marginRight: newMarginRight });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(null);
    if (onCommit) onCommit();
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) handlePointerUp(e);
  };

  useEffect(() => {
    if (readOnly) return;
    const container = containerRef.current;
    if (!container || !onThumbWheel) return;

    const handleWheel = (e: WheelEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const thumbX = (centerPercent / 100) * rect.width;
      const hitRadius = 40;
      if (Math.abs(mouseX - thumbX) <= hitRadius) {
        e.preventDefault();
        const step = 1;
        const delta = e.deltaY < 0 ? step : -step;
        onThumbWheel(delta);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [centerPercent, onThumbWheel, readOnly]);

  return (
    <div className={twMerge('flex w-full flex-col select-none', readOnly && 'opacity-90', className)}>
      <div ref={containerRef} className="relative flex flex-col pt-6 pb-2">
        {hasOther &&
          !otherIsIndifferent &&
          !otherIsNotAnswered &&
          !isIndifferent &&
          !isNotAnswered &&
          !primaryOverlay && (
            <svg className="pointer-events-none absolute top-0 left-0 z-0 h-full w-full">
              <line
                x1={`${otherCenterPercent}%`}
                y1="42px"
                x2={`${centerPercent}%`}
                y2="114px"
                stroke="currentColor"
                strokeOpacity="0.15"
                strokeWidth="2"
                strokeDasharray="6 4"
                className="text-foreground"
              />
            </svg>
          )}

        <div className="flex flex-col gap-10">
          {hasOther && (
            <div className={clsx((otherIsIndifferent || otherIsNotAnswered) && 'opacity-75')}>
              <div className="relative h-8 w-full">
                <SliderTrackVisuals
                  lPercent={otherLeftPercent}
                  rPercent={otherRightPercent}
                  color={otherColor}
                  label={topLabel}
                  isNotAnswered={otherIsNotAnswered}
                  isIndifferent={otherIsIndifferent}
                  notAnsweredLabel={otherNotAnsweredLabel}
                  indifferentLabel={otherIndifferentLabel}
                />
                {!otherIsIndifferent && !otherIsNotAnswered && (
                  <>
                    <SliderThumb
                      left={otherLeftPercent}
                      active={false}
                      type="bracket"
                      color={otherColor}
                      isDragging={false}
                    />
                    <SliderThumb
                      left={otherRightPercent}
                      active={false}
                      type="bracket"
                      color={otherColor}
                      isDragging={false}
                    />
                    <SliderThumb
                      left={otherCenterPercent}
                      active={false}
                      type="center"
                      color={otherColor}
                      isDragging={false}
                    />
                  </>
                )}
              </div>
            </div>
          )}

          <div className="relative">
            {primaryOverlay ? (
              <div className="flex w-full items-center justify-center py-1">{primaryOverlay}</div>
            ) : (
              <div className="relative h-8 w-full">
                <SliderTrackVisuals
                  lPercent={leftPercent}
                  rPercent={rightPercent}
                  color={activeColor}
                  label={hasOther ? bottomLabel : undefined}
                  isNotAnswered={isNotAnswered}
                  isIndifferent={isIndifferent}
                  notAnsweredLabel={notAnsweredLabel}
                  indifferentLabel={indifferentLabel}
                />

                {!isIndifferent && !isNotAnswered && (
                  <>
                    <SliderThumb
                      left={leftPercent}
                      active={isDragging === 'left'}
                      type="bracket"
                      color={activeColor}
                      isDragging={!!isDragging}
                    />
                    <SliderThumb
                      left={rightPercent}
                      active={isDragging === 'right'}
                      type="bracket"
                      color={activeColor}
                      isDragging={!!isDragging}
                    />
                    <SliderThumb
                      left={centerPercent}
                      active={isDragging === 'center'}
                      type="center"
                      color={activeColor}
                      isDragging={!!isDragging}
                    />

                    {!readOnly && (
                      <div
                        className={clsx(
                          'absolute inset-0 z-40 touch-none',
                          isDragging ? 'cursor-grabbing' : 'cursor-pointer',
                        )}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerLeave}
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-muted-foreground/60 mt-2 flex justify-between px-1 text-[10px] font-bold tracking-widest uppercase">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
};

Slider.displayName = 'Slider';
