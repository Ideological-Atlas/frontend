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
  customHexColor?: string;
  isProgressLoading?: boolean;
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
  customHexColor,
  isProgressLoading = false,
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

  const hasMyData = myProgressMap && Object.values(myProgressMap).some(v => v > 0);
  const isComparison = variant === 'other' || (variant === 'default' && hasMyData);

  const targetLabel = targetUsername
    ? targetUsername.startsWith('@')
      ? targetUsername
      : targetUsername
    : t('anonymous_user');

  const viewerLabel = viewerUsername ? `@${viewerUsername}` : t('you_label');

  return (
    <div className="flex flex-col gap-2">
      {complexities.map(c => {
        const theirProgress = progressMap[c.uuid] || 0;
        const myProgress = myProgressMap[c.uuid] || 0;

        const affinity = affinityMap ? affinityMap[c.uuid] : undefined;

        const isSelected = selectedId === c.uuid;
        const theirCompleted = theirProgress === 100;
        const myCompleted = myProgress === 100;

        const hasAffinity = affinity !== undefined && affinity !== null;
        const affinityStyle = hasAffinity ? getAffinityLevel(affinity as number) : null;

        const otherBarStyle = customHexColor ? { backgroundColor: customHexColor } : undefined;
        const otherBarClass = customHexColor ? '' : isSelected ? 'bg-white' : 'bg-other-user';

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
                {!isProgressLoading && theirCompleted && !isSelected && (
                  <span className="material-symbols-outlined text-[16px] text-green-500">check_circle</span>
                )}
              </div>
              <div className="relative z-10 flex items-center gap-2">
                {isProgressLoading ? (
                  <span
                    className={clsx(
                      'material-symbols-outlined animate-spin text-[16px]',
                      isSelected ? 'text-white/80' : 'text-muted-foreground/60',
                    )}
                  >
                    progress_activity
                  </span>
                ) : (
                  <span
                    className={clsx(
                      'text-xs font-bold',
                      isSelected ? 'text-white/80' : 'text-muted-foreground/60',
                      theirCompleted && !isSelected && 'text-green-500',
                    )}
                  >
                    {theirProgress}%
                  </span>
                )}
              </div>
              {isSelected && (
                <motion.span
                  layoutId="complexity-active"
                  className="absolute inset-0 rounded-xl bg-white/20"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              {!isSelected && !isProgressLoading && theirProgress > 0 && theirProgress < 100 && (
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
                ? 'bg-card border-primary border-2 shadow-lg'
                : 'bg-card border-border hover:bg-secondary/50 border',
            )}
          >
            <div className="relative z-10 flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={clsx('font-bold', isSelected ? 'text-primary' : 'text-foreground')}>{c.name}</span>
                <div className="flex items-center -space-x-1">
                  {!isProgressLoading && theirCompleted && (
                    <span
                      className={clsx('material-symbols-outlined text-[16px]', customHexColor ? '' : 'text-other-user')}
                      style={customHexColor ? { color: customHexColor } : undefined}
                    >
                      check_circle
                    </span>
                  )}
                  {!isProgressLoading && myCompleted && (
                    <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                  )}
                </div>
              </div>

              {isProgressLoading ? (
                <span className="material-symbols-outlined text-muted-foreground/50 animate-spin text-[16px]">
                  progress_activity
                </span>
              ) : (
                <span
                  className={clsx(
                    'text-xs font-black',
                    hasAffinity && affinityStyle ? affinityStyle.colorClass : 'text-muted-foreground/50',
                  )}
                >
                  {hasAffinity ? `${Math.round(affinity as number)}%` : 'N/A'}
                </span>
              )}
            </div>

            <div className="relative z-10 flex w-full flex-col gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-bold tracking-wider uppercase opacity-70">
                  <span style={customHexColor ? { color: customHexColor } : undefined}>{targetLabel}</span>
                  <span>{isProgressLoading ? '...' : `${theirProgress}%`}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                  <div
                    className={clsx('h-full rounded-full', otherBarClass)}
                    style={{ width: `${isProgressLoading ? 0 : theirProgress}%`, ...otherBarStyle }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-bold tracking-wider uppercase opacity-70">
                  <span className="text-primary">{viewerLabel}</span>
                  <span>{isProgressLoading ? '...' : `${myProgress}%`}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${isProgressLoading ? 0 : myProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
