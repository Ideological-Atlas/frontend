'use client';

import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/atoms/Skeleton';
import type { IdeologyAbstractionComplexity } from '@/lib/client/models/IdeologyAbstractionComplexity';
import { getAffinityLevel } from '@/lib/affinity-utils';

interface ComplexitySelectorProps {
  complexities: IdeologyAbstractionComplexity[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
  progressMap?: Record<string, number>;
  myProgressMap?: Record<string, number>;
  targetUsername?: string;
  viewerUsername?: string;
  affinityMap?: Record<string, number | null>;
  variant?: 'default' | 'other';
}

export function ComplexitySelector({
  complexities,
  selectedId,
  onSelect,
  isLoading,
  progressMap = {},
  myProgressMap = {},
  targetUsername,
  viewerUsername,
  affinityMap,
  variant = 'default',
}: ComplexitySelectorProps) {
  const t = useTranslations('Atlas');

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  const isComparison = variant === 'other' && Object.keys(myProgressMap).length > 0;
  const targetLabel = targetUsername ? `@${targetUsername}` : t('anonymous_user') || 'Anónimo';

  return (
    <div className="flex flex-col gap-2">
      {complexities.map(c => {
        const theirProgress = progressMap[c.uuid] || 0;
        const myProgress = myProgressMap[c.uuid] || 0;

        const affinity = affinityMap ? affinityMap[c.uuid] : undefined;

        const isSelected = selectedId === c.uuid;
        const theirCompleted = theirProgress === 100;
        const myCompleted = myProgress === 100;
        const bothCompleted = theirCompleted && myCompleted;

        const hasAffinity = affinity !== undefined && affinity !== null;
        const affinityStyle = hasAffinity ? getAffinityLevel(affinity as number) : null;

        if (!isComparison) {
          return (
            <button
              key={c.uuid}
              id={`complexity-item-${c.uuid}`}
              onClick={() => onSelect(c.uuid)}
              className={clsx(
                'group relative flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200',
                isSelected
                  ? 'bg-primary text-white shadow-lg shadow-blue-500/20'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              <div className="relative z-10 flex items-center gap-2">
                <span>{c.name}</span>
                {theirCompleted && !isSelected && (
                  <span className="material-symbols-outlined text-[16px] text-green-500">check_circle</span>
                )}
              </div>
              <div className="relative z-10 flex items-center gap-2">
                <span
                  className={clsx(
                    'text-xs font-bold',
                    isSelected ? 'text-white/80' : 'text-muted-foreground/60',
                    theirCompleted && !isSelected && 'text-green-500',
                  )}
                >
                  {theirProgress}%
                </span>
              </div>
              {isSelected && (
                <motion.span
                  layoutId="complexity-active"
                  className="absolute inset-0 rounded-xl bg-white/20"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              {!isSelected && theirProgress > 0 && theirProgress < 100 && (
                <div
                  className="bg-primary/5 absolute top-0 bottom-0 left-0 rounded-xl transition-all duration-500"
                  style={{ width: `${theirProgress}%` }}
                />
              )}
            </button>
          );
        }

        return (
          <button
            key={c.uuid}
            id={`complexity-item-${c.uuid}`}
            onClick={() => onSelect(c.uuid)}
            className={clsx(
              'group relative flex w-full flex-col gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200',
              isSelected
                ? 'bg-other-user shadow-other-user/20 text-white shadow-lg'
                : 'bg-card border-border hover:bg-secondary/50 border',
            )}
          >
            <div className="relative z-10 flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={clsx('font-bold', isSelected ? 'text-white' : 'text-foreground')}>{c.name}</span>
                <div className="flex items-center -space-x-1">
                  {theirCompleted && (
                    <span
                      className={clsx(
                        'material-symbols-outlined text-[16px]',
                        isSelected ? 'text-white/80' : 'text-other-user',
                      )}
                    >
                      check_circle
                    </span>
                  )}
                  {myCompleted && (
                    <span
                      className={clsx(
                        'material-symbols-outlined text-[16px]',
                        isSelected ? 'text-white/80' : 'text-primary',
                      )}
                    >
                      check_circle
                    </span>
                  )}
                </div>
              </div>

              <span
                className={clsx(
                  'text-xs font-black',
                  isSelected
                    ? 'text-white'
                    : bothCompleted && hasAffinity && affinityStyle
                      ? affinityStyle.colorClass
                      : 'text-muted-foreground/50',
                )}
              >
                {bothCompleted && hasAffinity ? `${Math.round(affinity as number)}%` : 'N/A'}
              </span>
            </div>
            <div className="relative z-10 flex w-full flex-col gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-bold tracking-wider uppercase opacity-70">
                  <span>{targetLabel}</span>
                  <span>{theirProgress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/20">
                  <div
                    className={clsx('h-full rounded-full', isSelected ? 'bg-white' : 'bg-other-user')}
                    style={{ width: `${theirProgress}%` }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-bold tracking-wider uppercase opacity-70">
                  <span>@{viewerUsername}</span>
                  <span>{myProgress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/20">
                  <div
                    className={clsx('h-full rounded-full', isSelected ? 'bg-white/60' : 'bg-primary')}
                    style={{ width: `${myProgress}%` }}
                  />
                </div>
              </div>
            </div>
            {isSelected && (
              <motion.span
                layoutId="complexity-active"
                className="absolute inset-0 z-0 rounded-xl bg-white/10"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
