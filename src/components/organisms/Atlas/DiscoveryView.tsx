'use client';

import { useTranslations } from 'next-intl';
import { AnimatePresence } from 'framer-motion';
import { useDiscoveryController } from '@/hooks/controllers/useDiscoveryController';
import { DiscoveryCard } from '@/components/molecules/DiscoveryCard';
import { DiscoveryResultModal } from '@/components/molecules/DiscoveryResultModal';
import { PageHeader } from '@/components/molecules/PageHeader';
import { Skeleton } from '@/components/atoms/Skeleton';

export function DiscoveryView() {
  const t = useTranslations('Atlas');
  const { state, actions } = useDiscoveryController();

  return (
    <div className="layout-content-container mx-auto w-full max-w-[1000px] px-5 py-8 md:px-10">
      <DiscoveryResultModal
        isOpen={state.isModalOpen}
        onClose={actions.closeModal}
        winner={state.winner}
        affinity={state.winner ? state.getRelevantScore(state.affinities[state.winner.uuid]) : 0}
      />

      <div className="mb-10">
        <PageHeader title={t('discovery_title')} description={t('discovery_subtitle')} />
      </div>

      <div className="flex min-h-[500px] flex-col gap-4">
        {state.isGlobalLoading ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
        ) : (
          <div className="relative flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {state.ideologies.map(ideology => (
                <DiscoveryCard
                  key={ideology.uuid}
                  ideology={ideology}
                  affinity={state.getRelevantScore(state.affinities[ideology.uuid])}
                  isLoading={state.loadingMap[ideology.uuid]}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
