'use client';

import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/atoms/Skeleton';
import type { IdeologyAbstractionComplexity } from '@/lib/client/models/IdeologyAbstractionComplexity';

interface ComplexitySelectorProps {
  complexities: IdeologyAbstractionComplexity[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
  progressMap?: Record<string, number>;
}

export function ComplexitySelector({
  complexities,
  selectedId,
  onSelect,
  isLoading,
  progressMap = {},
}: ComplexitySelectorProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {complexities.map(c => {
        const progress = progressMap[c.uuid] || 0;
        const isSelected = selectedId === c.uuid;
        const isCompleted = progress === 100;

        return (
          <button
            key={c.uuid}
            onClick={() => onSelect(c.uuid)}
            className={clsx(
              'group relative flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200',
              isSelected
                ? 'bg-primary text-primary-foreground shadow-lg shadow-blue-500/20'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
            )}
          >
            <div className="relative z-10 flex items-center gap-2">
              <span>{c.name}</span>
              {isCompleted && !isSelected && (
                <span className="material-symbols-outlined text-[16px] text-green-500">check_circle</span>
              )}
            </div>

            <div className="relative z-10 flex items-center gap-2">
              <span
                className={clsx(
                  'text-xs font-bold',
                  isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground/60',
                  isCompleted && !isSelected && 'text-green-500',
                )}
              >
                {progress}%
              </span>
            </div>

            {/* Background for selected state */}
            {isSelected && (
              <motion.span
                layoutId="complexity-active"
                className="bg-primary-foreground/20 absolute inset-0 rounded-xl"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}

            {!isSelected && progress > 0 && progress < 100 && (
              <div
                className="bg-primary/5 absolute top-0 bottom-0 left-0 rounded-xl transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
