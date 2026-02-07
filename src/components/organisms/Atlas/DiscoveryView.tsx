'use client';

import { useTranslations } from 'next-intl';
import { useDiscoveryController } from '@/hooks/controllers/useDiscoveryController';
import { DiscoveryResultModal } from '@/components/molecules/DiscoveryResultModal';
import { PageHeader } from '@/components/molecules/PageHeader';
import { DiscoveryListSkeleton } from '@/components/molecules/DiscoveryListSkeleton';
import { DiscoveryList } from './DiscoveryList';
import { motion, AnimatePresence } from 'framer-motion';

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

        <AnimatePresence>
          {state.isCalculating && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="w-full overflow-hidden"
            >
              <div className="text-muted-foreground/80 mb-2 flex justify-between px-1 text-[10px] font-bold tracking-wider uppercase">
                <span>{t('affinity_pending')}...</span>
                <span>{state.progress}%</span>
              </div>
              <div className="bg-secondary/50 h-2 w-full overflow-hidden rounded-full backdrop-blur-sm">
                <motion.div
                  className="bg-primary h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${state.progress}%` }}
                  transition={{ ease: 'linear', duration: 0.2 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
