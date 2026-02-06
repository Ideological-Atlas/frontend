'use client';

import { AnimatePresence } from 'framer-motion';
import { DiscoveryCard } from '@/components/molecules/DiscoveryCard';
import type { IdeologyList } from '@/lib/client/models/IdeologyList';
import type { IdeologyAffinity } from '@/lib/client/models/IdeologyAffinity';

interface DiscoveryListProps {
  ideologies: IdeologyList[];
  affinities: Record<string, IdeologyAffinity>;
  loadingMap: Record<string, boolean>;
  getRelevantScore: (affinity?: IdeologyAffinity) => number;
}

export function DiscoveryList({ ideologies, affinities, loadingMap, getRelevantScore }: DiscoveryListProps) {
  return (
    <div className="relative flex flex-col gap-4">
      <AnimatePresence mode="popLayout">
        {ideologies.map(ideology => (
          <DiscoveryCard
            key={ideology.uuid}
            ideology={ideology}
            affinity={getRelevantScore(affinities[ideology.uuid])}
            isLoading={loadingMap[ideology.uuid]}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
