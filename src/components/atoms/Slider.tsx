'use client';

import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SliderProps {
  leftLabel?: string;
  rightLabel?: string;

  value: number;
  marginLeft: number;
  marginRight: number;
  bottomLabel?: string;

  otherValue?: number | null;
  otherMarginLeft?: number | null;
  otherMarginRight?: number | null;
  otherIsIndifferent?: boolean;
  otherIndifferentLabel?: string;
  topLabel?: string;

  onChange?: (updates: { value?: number; marginLeft?: number; marginRight?: number }) => void;
  onCommit?: () => void;
  onThumbWheel?: (delta: number) => void;
  className?: string;
  readOnly?: boolean;
  variant?: 'default' | 'other';
  showLabels?: boolean;
}

const Thumb = ({
  left,
  active,
  type,
  color,
  isDragging,
}: {
  left: number;
  active: boolean;
  type: 'bracket' | 'center';
  color: string;
  isDragging: boolean | null;
}) => {
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
};

interface TrackProps {
  cPercent: number;
  lPercent: number;
  rPercent: number;
  color: string;
  label?: string;
  isInteractive?: boolean;
  isIndifferent?: boolean;
  indifferentLabel?: string;
  onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerLeave?: (e: React.PointerEvent<HTMLDivElement>) => void;
  isDragging?: 'center' | 'left' | 'right' | null;
}

const Track = ({
  cPercent,
  lPercent,
  rPercent,
  color,
  label,
  isInteractive,
  isIndifferent,
  indifferentLabel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerLeave,
  isDragging,
}: TrackProps) => (
  <div className="relative h-8 w-full">
    {label && (
      <div
        className={clsx(
          'absolute -top-5 left-0 text-xs font-bold tracking-wider uppercase',
          color.includes('other') ? 'text-other-user' : 'text-primary',
        )}
      >
        {label}
      </div>
    )}

    <div className="bg-secondary/40 pointer-events-none absolute top-1/2 right-0 left-0 h-1.5 w-full -translate-y-1/2 rounded-full" />

    {isIndifferent ? (
      <div className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        <div className="border-border bg-card/80 text-muted-foreground flex items-center gap-1.5 rounded-md border px-2 py-1 backdrop-blur-sm">
          <span className="material-symbols-outlined text-[14px]">remove</span>
          <span className="text-[10px] font-bold tracking-wider uppercase">{indifferentLabel || 'Indifferent'}</span>
        </div>
      </div>
    ) : (
      <>
        <div
          className="pointer-events-none absolute top-1/2 z-10 h-2 -translate-y-1/2 rounded-full transition-all duration-75 ease-out"
          style={{
            left: `${lPercent}%`,
            width: `${rPercent - lPercent}%`,
            backgroundColor: color,
            boxShadow: `0 0 12px 1px color-mix(in srgb, ${color}, transparent 40%)`,
          }}
        />

        {isInteractive ? (
          <>
            <Thumb
              left={lPercent}
              active={isDragging === 'left'}
              type="bracket"
              color={color}
              isDragging={!!isDragging}
            />
            <Thumb
              left={rPercent}
              active={isDragging === 'right'}
              type="bracket"
              color={color}
              isDragging={!!isDragging}
            />
            <Thumb
              left={cPercent}
              active={isDragging === 'center'}
              type="center"
              color={color}
              isDragging={!!isDragging}
            />

            <div
              className={clsx('absolute inset-0 z-40 touch-none', isDragging ? 'cursor-grabbing' : 'cursor-pointer')}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerLeave}
            />
          </>
        ) : (
          <>
            <div
              className="bg-card absolute top-1/2 z-20 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] shadow-sm"
              style={{ left: `${lPercent}%`, borderColor: color }}
            />
            <div
              className="bg-card absolute top-1/2 z-20 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] shadow-sm"
              style={{ left: `${rPercent}%`, borderColor: color }}
            />
            <div
              className="absolute top-1/2 z-20 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[2px] border-white shadow-md"
              style={{ left: `${cPercent}%`, backgroundColor: color }}
            >
              <div className="h-2 w-2 rounded-full bg-white/50 blur-[0.5px]" />
            </div>
          </>
        )}
      </>
    )}
  </div>
);

export const Slider = ({
  className,
  leftLabel,
  rightLabel,
  value,
  marginLeft,
  marginRight,
  bottomLabel,
  otherValue,
  otherMarginLeft,
  otherMarginRight,
  otherIsIndifferent,
  otherIndifferentLabel,
  topLabel,
  onChange,
  onCommit,
  onThumbWheel,
  readOnly = false,
  variant = 'default',
}: SliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<null | 'center' | 'left' | 'right'>(null);

  const toPercent = (val: number) => ((val + 100) / 200) * 100;

  const centerPercent = toPercent(value);
  const leftBoundVal = Math.max(-100, value - marginLeft);
  const rightBoundVal = Math.min(100, value + marginRight);
  const leftPercent = toPercent(leftBoundVal);
  const rightPercent = toPercent(rightBoundVal);

  const activeColor = variant === 'other' ? 'var(--other-user)' : 'var(--primary)';

  const hasOther = otherValue !== undefined && otherValue !== null;
  const otherCenterPercent = hasOther ? toPercent(otherValue!) : 50;
  const otherColor = 'var(--other-user-strong)';

  let otherLeftPercent = 0;
  let otherRightPercent = 0;
  if (hasOther) {
    const omL = otherMarginLeft ?? 10;
    const omR = otherMarginRight ?? 10;
    const otherLeftVal = Math.max(-100, otherValue! - omL);
    const otherRightVal = Math.min(100, otherValue! + omR);
    otherLeftPercent = toPercent(otherLeftVal);
    otherRightPercent = toPercent(otherRightVal);
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (readOnly || !onChange) return;

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
        {hasOther && !otherIsIndifferent && (
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
            <div className={clsx(otherIsIndifferent && 'opacity-75')}>
              <Track
                cPercent={otherCenterPercent}
                lPercent={otherLeftPercent}
                rPercent={otherRightPercent}
                color={otherColor}
                label={topLabel}
                isInteractive={false}
                isIndifferent={otherIsIndifferent}
                indifferentLabel={otherIndifferentLabel}
              />
            </div>
          )}

          <Track
            cPercent={centerPercent}
            lPercent={leftPercent}
            rPercent={rightPercent}
            color={activeColor}
            label={hasOther ? bottomLabel : undefined}
            isInteractive={!readOnly}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            isDragging={isDragging ? isDragging : undefined}
          />
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
