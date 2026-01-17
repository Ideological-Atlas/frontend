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
}

export function SectionTabs({ sections, selectedId, onSelect, isLoading }: SectionTabsProps) {
  if (isLoading) {
    return (
      <div className="flex gap-4">
        <Skeleton className="h-12 flex-1 rounded-lg" />
        <Skeleton className="h-12 flex-1 rounded-lg" />
        <Skeleton className="h-12 flex-1 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="border-border flex flex-wrap gap-2 border-b">
      {sections.map(sec => (
        <button
          key={sec.uuid}
          onClick={() => onSelect(sec.uuid)}
          className={clsx(
            'relative px-6 py-3 text-sm font-medium transition-colors',
            selectedId === sec.uuid ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {sec.name}
          {selectedId === sec.uuid && (
            <motion.div layoutId="activeTab" className="bg-primary absolute right-0 bottom-0 left-0 h-0.5" />
          )}
        </button>
      ))}
    </div>
  );
}
