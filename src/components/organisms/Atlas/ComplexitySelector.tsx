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
}

export function ComplexitySelector({ complexities, selectedId, onSelect, isLoading }: ComplexitySelectorProps) {
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
      {complexities.map(c => (
        <button
          key={c.uuid}
          onClick={() => onSelect(c.uuid)}
          className={clsx(
            'group relative flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200',
            selectedId === c.uuid
              ? 'bg-primary text-primary-foreground shadow-lg shadow-blue-500/20'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
          )}
        >
          <span className="relative z-10">{c.name}</span>
          {selectedId === c.uuid && (
            <motion.span
              layoutId="complexity-active"
              className="bg-primary-foreground/20 absolute inset-0 rounded-xl"
              initial={false}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
