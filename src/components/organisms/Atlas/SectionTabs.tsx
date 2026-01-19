'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Skeleton } from '@/components/atoms/Skeleton';
import type { IdeologySection } from '@/lib/client/models/IdeologySection';

interface SectionTabsProps {
  sections: IdeologySection[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
  variant?: 'default' | 'other';
}

export function SectionTabs({ sections, selectedId, onSelect, isLoading, variant = 'default' }: SectionTabsProps) {
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
        return (
          <button
            key={sec.uuid}
            onClick={() => onSelect(sec.uuid)}
            className={clsx(
              'relative px-6 py-3 text-sm font-medium transition-colors',
              isSelected
                ? isOther
                  ? 'text-other-user'
                  : 'text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {sec.name}
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
