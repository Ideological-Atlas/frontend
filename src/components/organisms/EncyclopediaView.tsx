'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { IdeologyDrawer } from '@/components/molecules/IdeologyDrawer';
import { MagneticBackground } from '@/components/molecules/MagneticBackground';
import { useEncyclopediaController } from '@/hooks/controllers/useEncyclopediaController';
import { EncyclopediaFilters } from './encyclopedia/EncyclopediaFilters';
import { IdeologyGrid } from './encyclopedia/IdeologyGrid';

export function EncyclopediaView() {
  const t = useTranslations('Encyclopedia');
  const { state, actions } = useEncyclopediaController();

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <AnimatePresence>
        {state.selectedIdeology && (
          <IdeologyDrawer ideology={state.selectedIdeology} onClose={() => actions.setSelectedIdeology(null)} />
        )}
      </AnimatePresence>

      <div className="relative flex flex-col items-center justify-center px-6 py-20 text-center md:py-28">
        <MagneticBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-20 w-full max-w-4xl space-y-6"
        >
          <h1 className="text-foreground text-4xl font-black tracking-tight md:text-6xl">{t('title')}</h1>
          <p className="text-muted-foreground text-lg md:text-xl">{t('subtitle')}</p>

          <EncyclopediaFilters
            search={state.search}
            onSearchChange={actions.setSearch}
            sortBy={state.sortBy}
            onSortChange={actions.setSortBy}
            showFilters={state.showFilters}
            onToggleFilters={() => actions.setShowFilters(!state.showFilters)}
            canCalculateAffinity={state.canCalculateAffinity}
            options={state.options}
            filters={state.filters}
            onFilterChange={{
              country: actions.setSelectedCountry,
              region: actions.setSelectedRegion,
              religion: actions.setSelectedReligion,
              tag: actions.setSelectedTag,
            }}
            onClear={actions.clearFilters}
            isCalculating={state.isCalculating}
            progress={state.progress}
          />
        </motion.div>
      </div>

      <div className="bg-muted/30 relative z-10 min-h-screen border-t py-12">
        <div className="layout-content-container mx-auto w-full max-w-[1400px] px-5 md:px-10">
          <IdeologyGrid
            isLoading={state.isLoading}
            ideologies={state.ideologies}
            affinities={state.affinities}
            canCalculateAffinity={state.canCalculateAffinity}
            onSelect={actions.setSelectedIdeology}
            onClearFilters={actions.clearFilters}
          />
        </div>
      </div>
    </div>
  );
}
