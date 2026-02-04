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
import { useAuthStore } from '@/store/useAuthStore';

interface IdeologyAtlasViewProps {
  uuid: string;
}

export function IdeologyAtlasView({ uuid }: IdeologyAtlasViewProps) {
  const t = useTranslations('Atlas');
  const tEnc = useTranslations('Encyclopedia');
  const { user } = useAuthStore();
  const { state, loading, actions } = useIdeologyAtlasController(uuid, t('context_section'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (loading.isGlobalLoading) {
    return (
      <div className="layout-content-container mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-5 py-8 md:px-10 lg:flex-row">
        <aside className="w-full lg:w-[320px] lg:shrink-0">
          <Skeleton className="mb-6 h-[400px] w-full rounded-3xl" />
        </aside>
        <main className="flex-1 space-y-8">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </main>
      </div>
    );
  }

  const ideologyName = state.ideologyData?.name || 'Ideology';
  const ideologyColor = state.ideologyData?.color || '#64748b';

  const completedSteps = state.displaySections.map(section => (state.sectionProgressMap[section.uuid] || 0) === 100);

  const isSuperUser = state.isSuperUser;
  const viewVariant = isSuperUser ? 'default' : 'other';

  const canEdit = true;

  const conditionerAnswers = viewVariant === 'other' ? state.myUserCondAnswers : state.conditionerAnswers;
  const conditionerOtherAnswers = viewVariant === 'other' ? state.conditionerAnswers : undefined;

  const locationText = state.ideologyData?.associated_countries.length
    ? state.ideologyData.associated_countries.map(c => c.name).join(', ')
    : 'Universal';

  const religionText = state.ideologyData?.associated_religions.length
    ? state.ideologyData.associated_religions.map(r => r.name).join(', ')
    : tEnc('secular') || 'Laico';

  const tags = state.ideologyData?.tags || [];

  return (
    <>
      <AnimatePresence>
        {isDrawerOpen && state.ideologyData && (
          <IdeologyDrawer
            key={state.ideologyData.uuid}
            ideology={state.ideologyData as unknown as IdeologyList}
            onClose={() => setIsDrawerOpen(false)}
            showExploreAction={true}
          />
        )}
      </AnimatePresence>

      <div className="layout-content-container mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-5 py-8 md:px-10 lg:flex-row">
        <aside className="flex w-full flex-col gap-6 lg:sticky lg:top-24 lg:w-[320px] lg:shrink-0 lg:self-start">
          {isSuperUser && (
            <div className="w-full">
              <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-[10px] font-black tracking-widest text-amber-500 uppercase select-none">
                <span className="material-symbols-outlined text-sm">edit_document</span>
                {t('admin_mode_label')}
              </div>
            </div>
          )}

          <div className="bg-card border-border overflow-hidden rounded-3xl border shadow-xl">
            <div className="relative h-48 w-full">
              <div className="absolute inset-0 z-0" style={{ backgroundColor: ideologyColor }} />
              {state.ideologyData?.flag ? (
                <Image
                  src={state.ideologyData.flag}
                  alt={ideologyName}
                  fill
                  className="object-cover opacity-60 mix-blend-overlay"
                  unoptimized
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              <div className="absolute top-4 right-4 left-4 flex flex-wrap gap-2">
                {tags.slice(0, 3).map(tag => (
                  <span
                    key={tag.uuid}
                    className="rounded-md border border-white/10 bg-black/40 px-2 py-1 text-[10px] font-bold tracking-wide text-white/90 uppercase backdrop-blur-md"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>

              <div className="absolute bottom-0 left-0 w-full p-6">
                <h1 className="text-3xl leading-none font-black text-white shadow-black drop-shadow-md">
                  {ideologyName}
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4">
              <div className="bg-secondary/50 border-border/50 flex flex-col gap-1 rounded-xl border p-3">
                <div className="text-muted-foreground flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">public</span>
                  <span className="text-[10px] font-bold tracking-wider uppercase">
                    {tEnc('location_label') || 'Ubicación'}
                  </span>
                </div>
                <span className="truncate text-sm font-bold" title={locationText}>
                  {locationText}
                </span>
              </div>
              <div className="bg-secondary/50 border-border/50 flex flex-col gap-1 rounded-xl border p-3">
                <div className="text-muted-foreground flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">temple_buddhist</span>
                  <span className="text-[10px] font-bold tracking-wider uppercase">
                    {tEnc('religion_label') || 'Creencia'}
                  </span>
                </div>
                <span className="truncate text-sm font-bold" title={religionText}>
                  {religionText}
                </span>
              </div>
            </div>

            <div className="p-4 pt-0 pb-6">
              <Button
                variant="primary"
                className="group relative w-full justify-center gap-2 overflow-hidden bg-blue-600 py-6 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-blue-500/40"
                onClick={() => setIsDrawerOpen(true)}
              >
                <span>{tEnc('read_full_article') || 'Leer artículo completo'}</span>
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-foreground px-1 text-sm font-bold tracking-widest uppercase opacity-70">
              {t('complexity_level')}
            </h2>
            <ComplexitySelector
              complexities={state.complexities}
              selectedId={state.selectedComplexity}
              onSelect={actions.selectComplexity}
              isLoading={false}
              progressMap={state.progressMap}
              myProgressMap={viewVariant === 'other' ? state.myProgressMap : undefined}
              targetUsername={ideologyName}
              viewerUsername={user?.username}
              affinityMap={viewVariant === 'other' ? state.complexityAffinityMap : undefined}
              variant={viewVariant}
              customHexColor={ideologyColor}
            />
          </div>

          <div className="border-border/50 border-t pt-6">
            <Link href="/encyclopedia" className="block w-full">
              <Button
                variant="ghost"
                size="default"
                className="text-muted-foreground hover:text-foreground w-full justify-start gap-3 pl-0 hover:bg-transparent"
              >
                <div className="bg-secondary flex h-8 w-8 items-center justify-center rounded-full">
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                </div>
                {t('back_to_encyclopedia')}
              </Button>
            </Link>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-8">
          <PageHeader
            title={state.selectedComplexityObj?.name || t('header_title')}
            description={state.selectedComplexityObj?.description || t('header_description')}
            affinity={
              viewVariant === 'other' && state.selectedComplexity
                ? state.complexityAffinityMap[state.selectedComplexity]
                : undefined
            }
            variant={viewVariant}
          />

          <div className="flex flex-col gap-6">
            <SectionTabs
              sections={state.displaySections}
              selectedId={state.selectedSection}
              onSelect={actions.selectSection}
              isLoading={false}
              sectionProgressMap={state.sectionProgressMap}
              affinityMap={viewVariant === 'other' ? state.sectionAffinityMap : undefined}
              variant={viewVariant}
            />

            {state.isContextSelected ? (
              <ConditionerList
                conditioners={state.currentConditioners}
                answers={conditionerAnswers}
                otherAnswers={conditionerOtherAnswers}
                onSaveAnswer={actions.saveConditioner}
                onResetAnswer={actions.deleteConditioner}
                isLoading={false}
                dependencyNameMap={state.dependencyNameMap}
                readOnly={!canEdit}
                variant={viewVariant}
                targetUsername={ideologyName}
              />
            ) : (
              <AxisList
                axes={state.currentAxes}
                answers={state.axisAnswers}
                myAnswers={viewVariant === 'other' ? state.myUserAnswers : undefined}
                targetUsername={ideologyName}
                onSaveAnswer={actions.saveAnswer}
                onDeleteAnswer={actions.deleteAnswer}
                isLoading={false}
                isLevelLoading={false}
                readOnly={!canEdit}
                customHexColor={ideologyColor}
                variant={viewVariant}
                axisAffinityMap={viewVariant === 'other' ? state.axisAffinityMap : undefined}
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
