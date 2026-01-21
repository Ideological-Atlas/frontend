'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Skeleton } from '@/components/atoms/Skeleton';
import type { IdeologySection } from '@/lib/client/models/IdeologySection';
import { getAffinityBadgeStyles } from '@/lib/affinity-utils';

interface SectionTabsProps {
  sections: IdeologySection[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
  affinityMap?: Record<string, number>;
  variant?: 'default' | 'other';
}

export function SectionTabs({
  sections,
  selectedId,
  onSelect,
  isLoading,
  affinityMap,
  variant = 'default',
}: SectionTabsProps) {
  if (isLoading) {
    return (
      <div className="flex gap-4">
        <Skeleton className="h-12 flex-1 rounded-lg" />
        <Skeleton className="h-12 flex-1 rounded-lg" />
        <Skeleton className="h-12 flex-1 rounded-lg" />
      </div>
    );
  }

  const isOther = variant === 'other';

  return (
    <div className="border-border flex flex-wrap gap-2 border-b">
      {sections.map(sec => {
        const isSelected = selectedId === sec.uuid;

        let affinity = undefined;
        if (affinityMap) {
          affinity = affinityMap[sec.uuid];
          if (affinity === undefined && sec.uuid) {
            const simpleUuid = sec.uuid.replace(/-/g, '');
            affinity = affinityMap[simpleUuid];
          }
        }

        const affinityStyle = affinity !== undefined ? getAffinityBadgeStyles(affinity) : null;

        return (
          <button
            key={sec.uuid}
            onClick={() => onSelect(sec.uuid)}
            className={clsx(
              'group relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
              isSelected
                ? isOther
                  ? 'text-other-user'
                  : 'text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <span>{sec.name}</span>
            {affinityStyle && (
              <span
                className={clsx(
                  'ml-1 rounded border px-1.5 py-0.5 text-[10px] font-bold transition-all',
                  affinityStyle.badgeClass,
                  !isSelected && 'opacity-70 group-hover:opacity-100',
                )}
              >
                {Math.round(affinity!)}%
              </span>
            )}
            {isSelected && (
              <motion.div
                layoutId="activeTab"
                className={clsx('absolute right-0 bottom-0 left-0 h-0.5', isOther ? 'bg-other-user' : 'bg-primary')}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
