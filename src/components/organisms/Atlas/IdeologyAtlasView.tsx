'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence } from 'framer-motion';
import { SectionTabs } from './SectionTabs';
import { AxisList } from './AxisList';
import { ConditionerList } from './ConditionerList';
import { PageHeader } from '@/components/molecules/PageHeader';
import { SectionNavigation } from '@/components/molecules/SectionNavigation';
import { IdeologyDrawer } from '@/components/molecules/IdeologyDrawer';
import { AtlasTemplate } from '@/components/templates/AtlasTemplate';
import { AtlasSkeleton } from '@/components/molecules/AtlasSkeleton';
import { IdeologyAtlasSidebar } from './IdeologyAtlasSidebar';
import { useIdeologyAtlasController } from '@/hooks/controllers/useIdeologyAtlasController';
import { useAuthStore } from '@/store/useAuthStore';
import type { IdeologyList } from '@/lib/client/models/IdeologyList';

interface IdeologyAtlasViewProps {
  uuid: string;
}

export function IdeologyAtlasView({ uuid }: IdeologyAtlasViewProps) {
  const t = useTranslations('Atlas');
  const { user } = useAuthStore();
  const { state, loading, actions } = useIdeologyAtlasController(uuid, t('context_section'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (loading.isGlobalLoading) {
    return <AtlasSkeleton />;
  }

  const ideologyColor = state.ideologyData?.color || 'var(--muted-foreground)';
  const viewVariant = state.isSuperUser ? 'default' : 'other';
  const completedSteps = state.displaySections.map(section => (state.sectionProgressMap[section.uuid] || 0) === 100);

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

      <AtlasTemplate
        sidebar={
          <IdeologyAtlasSidebar
            state={state}
            actions={actions}
            user={user}
            onOpenDrawer={() => setIsDrawerOpen(true)}
          />
        }
      >
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
              answers={viewVariant === 'other' ? state.myUserCondAnswers : state.conditionerAnswers}
              otherAnswers={viewVariant === 'other' ? state.conditionerAnswers : undefined}
              onSaveAnswer={actions.saveConditioner}
              onResetAnswer={actions.deleteConditioner}
              isLoading={false}
              dependencyNameMap={state.dependencyNameMap}
              readOnly={false}
              variant={viewVariant}
              targetUsername={state.ideologyData?.name}
            />
          ) : (
            <AxisList
              axes={state.currentAxes}
              answers={state.axisAnswers}
              myAnswers={viewVariant === 'other' ? state.myUserAnswers : undefined}
              targetUsername={state.ideologyData?.name}
              onSaveAnswer={actions.saveAnswer}
              onDeleteAnswer={actions.deleteAnswer}
              isLoading={false}
              isLevelLoading={false}
              readOnly={false}
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
      </AtlasTemplate>
    </>
  );
}
