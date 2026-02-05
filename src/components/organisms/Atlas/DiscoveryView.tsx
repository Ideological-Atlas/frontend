'use client';

import { useTranslations } from 'next-intl';
import { useDiscoveryController } from '@/hooks/controllers/useDiscoveryController';
import { DiscoveryResultModal } from '@/components/molecules/DiscoveryResultModal';
import { PageHeader } from '@/components/molecules/PageHeader';
import { DiscoveryListSkeleton } from '@/components/molecules/DiscoveryListSkeleton';
import { DiscoveryList } from './DiscoveryList';

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

      <div className="min-h-[500px]">
        {state.isGlobalLoading ? (
          <DiscoveryListSkeleton />
        ) : (
          <DiscoveryList
            ideologies={state.ideologies}
            affinities={state.affinities}
            loadingMap={state.loadingMap}
            getRelevantScore={state.getRelevantScore}
          />
        )}
      </div>
    </div>
  );
}
