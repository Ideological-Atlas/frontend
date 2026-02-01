'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/atoms/Skeleton';
import { ComplexitySelector } from './ComplexitySelector';
import { SectionTabs } from './SectionTabs';
import { AxisList } from './AxisList';
import { ConditionerList } from './ConditionerList';
import { PageHeader } from '@/components/molecules/PageHeader';
import { SectionNavigation } from '@/components/molecules/SectionNavigation';
import { useIdeologyAtlasController } from '@/hooks/controllers/useIdeologyAtlasController';
import { IdeologyDrawer } from '@/components/molecules/IdeologyDrawer';
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { IdeologyList } from '@/lib/client/models/IdeologyList';
import { Link } from '@/components/atoms/SmartLink';
import { Button } from '@/components/atoms/Button';

interface IdeologyAtlasViewProps {
  uuid: string;
}

export function IdeologyAtlasView({ uuid }: IdeologyAtlasViewProps) {
  const t = useTranslations('Atlas');
  const { state, loading, actions } = useIdeologyAtlasController(uuid, t('context_section'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (loading.isGlobalLoading) {
    return (
      <div className="layout-content-container mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-5 py-8 md:px-10 lg:flex-row">
        <aside className="w-full lg:w-[280px] lg:shrink-0">
          <Skeleton className="mb-6 h-32 w-full rounded-2xl" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </aside>
        <main className="flex-1 space-y-8">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </main>
      </div>
    );
  }

  const ideologyName = state.ideologyData?.name || 'Ideology';
  const ideologyColor = state.ideologyData?.color || '#64748b';

  const completedSteps = state.displaySections.map(section => (state.sectionProgressMap[section.uuid] || 0) === 100);

  return (
    <>
      <AnimatePresence>
        {isDrawerOpen && state.ideologyData && (
          <IdeologyDrawer
            key={state.ideologyData.uuid}
            ideology={state.ideologyData as unknown as IdeologyList}
            onClose={() => setIsDrawerOpen(false)}
            showExploreAction={false}
          />
        )}
      </AnimatePresence>

      <div className="layout-content-container mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-5 py-8 md:px-10 lg:flex-row">
        <aside className="flex w-full flex-col lg:sticky lg:top-24 lg:w-[280px] lg:shrink-0 lg:self-start">
          {state.isSuperUser && (
            <div className="mb-4 w-full">
              <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-[10px] font-black tracking-widest text-amber-500 uppercase select-none">
                <span className="material-symbols-outlined text-sm">edit_document</span>
                {t('admin_mode_label')}
              </div>
            </div>
          )}

          <div
            onClick={() => setIsDrawerOpen(true)}
            className="bg-card border-border group mb-8 w-full cursor-pointer overflow-hidden rounded-2xl border shadow-sm transition-all hover:scale-[1.02] hover:shadow-xl"
          >
            <div className="relative h-32 w-full">
              <div
                className="absolute inset-0 z-0 transition-colors duration-300 group-hover:brightness-110"
                style={{ backgroundColor: ideologyColor }}
              />

              {state.ideologyData?.flag ? (
                <div
                  className="absolute inset-0 z-10 w-[70%]"
                  style={{
                    maskImage: 'linear-gradient(to right, black 40%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, black 40%, transparent 100%)',
                  }}
                >
                  <Image
                    src={state.ideologyData.flag}
                    alt={ideologyName}
                    fill
                    className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="absolute inset-0 z-10 flex items-center justify-center text-white/30">
                  <span className="material-symbols-outlined text-5xl mix-blend-overlay">flag</span>
                </div>
              )}

              <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute bottom-0 left-0 z-30 flex w-full items-end justify-between p-4">
                <div>
                  <span className="mb-1 block text-[10px] font-bold tracking-widest text-white/60 uppercase">
                    {t('ideology_definition_label') || 'Definición'}
                  </span>
                  <h1 className="text-xl leading-tight font-black text-white shadow-black drop-shadow-md">
                    {ideologyName}
                  </h1>
                </div>
                <div className="mr-1 mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
                  <span className="material-symbols-outlined text-sm text-white">visibility</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 px-1">
            <h2 className="text-foreground text-lg font-bold tracking-tight">{t('complexity_level')}</h2>
          </div>

          <ComplexitySelector
            complexities={state.complexities}
            selectedId={state.selectedComplexity}
            onSelect={actions.selectComplexity}
            isLoading={false}
            progressMap={state.progressMap}
          />

          <div className="border-border/50 mt-8 border-t pt-6">
            <Link href="/encyclopedia" className="block w-full">
              <Button
                variant="primary"
                size="lg"
                className="shadow-primary/20 w-full justify-center gap-2 text-base font-bold shadow-lg"
              >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
                {t('back_to_encyclopedia')}
              </Button>
            </Link>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-8">
          <PageHeader
            title={state.selectedComplexityObj?.name || t('header_title')}
            description={state.selectedComplexityObj?.description || t('header_description')}
          />

          <div className="flex flex-col gap-6">
            <SectionTabs
              sections={state.displaySections}
              selectedId={state.selectedSection}
              onSelect={actions.selectSection}
              isLoading={false}
              sectionProgressMap={state.sectionProgressMap}
            />

            {state.isContextSelected ? (
              <ConditionerList
                conditioners={state.currentConditioners}
                answers={state.conditionerAnswers}
                onSaveAnswer={actions.saveConditioner}
                isLoading={false}
                dependencyNameMap={state.dependencyNameMap}
                readOnly={!state.isSuperUser}
              />
            ) : (
              <AxisList
                axes={state.currentAxes}
                answers={state.axisAnswers}
                onSaveAnswer={actions.saveAnswer}
                isLoading={false}
                isLevelLoading={false}
                readOnly={!state.isSuperUser}
                customHexColor={ideologyColor}
              />
            )}

            <SectionNavigation
              onNext={actions.next}
              onPrevious={actions.previous}
              onStepClick={actions.jumpToSection}
              showNext={state.navigation.showNext}
              showPrevious={state.navigation.showPrevious}
              isNextLevel={state.navigation.isNextLevel}
              currentIndex={state.navigation.currentIndex}
              totalSteps={state.navigation.totalSteps}
              completedSteps={completedSteps}
            />
          </div>
        </main>
      </div>
    </>
  );
}
