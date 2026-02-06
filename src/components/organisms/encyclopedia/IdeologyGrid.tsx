'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/atoms/Button';
import { Skeleton } from '@/components/atoms/Skeleton';
import { IdeologyCard } from '@/components/molecules/IdeologyCard';
import type { IdeologyList } from '@/lib/client/models/IdeologyList';

interface IdeologyGridProps {
  isLoading: boolean;
  ideologies: IdeologyList[];
  affinities: Record<string, number | null>;
  canCalculateAffinity: boolean;
  onSelect: (ideology: IdeologyList) => void;
  onClearFilters: () => void;
}

export function IdeologyGrid({
  isLoading,
  ideologies,
  affinities,
  canCalculateAffinity,
  onSelect,
  onClearFilters,
}: IdeologyGridProps) {
  const t = useTranslations('Encyclopedia');
  const tCommon = useTranslations('Common');

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-4 rounded-2xl border p-4">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (ideologies.length === 0) {
    return (
      <div className="flex h-60 flex-col items-center justify-center gap-4 text-center">
        <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
          <span className="material-symbols-outlined text-muted-foreground text-3xl">search_off</span>
        </div>
        <p className="text-muted-foreground font-medium">{t('no_results')}</p>
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          {tCommon('show_all') || 'Mostrar todo'}
        </Button>
      </div>
    );
  }

  return (
    <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <AnimatePresence mode="popLayout">
        {ideologies.map((ideology, index) => (
          <IdeologyCard
            key={ideology.uuid}
            ideology={ideology}
            index={index}
            onClick={() => onSelect(ideology)}
            affinity={affinities[ideology.uuid]}
            isLoading={canCalculateAffinity && affinities[ideology.uuid] === undefined}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
