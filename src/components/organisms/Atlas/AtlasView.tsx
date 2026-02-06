'use client';

import { useTranslations, useLocale } from 'next-intl';
import { SectionTabs } from './SectionTabs';
import { AxisList } from './AxisList';
import { ConditionerList } from './ConditionerList';
import { PageHeader } from '@/components/molecules/PageHeader';
import { SectionNavigation } from '@/components/molecules/SectionNavigation';
import { useAtlasController } from '@/hooks/controllers/useAtlasController';
import { useSmartRouter } from '@/hooks/useSmartRouter';
import { AtlasTemplate } from '@/components/templates/AtlasTemplate';
import { AtlasSkeleton } from '@/components/molecules/AtlasSkeleton';
import { AtlasOverlays } from './AtlasOverlays';
import { AtlasSidebar } from './AtlasSidebar';

export function AtlasView() {
  const t = useTranslations('Atlas');
  const locale = useLocale();
  const router = useSmartRouter();

  const { state, loading, actions } = useAtlasController(t('context_section'));

  if (loading.isGlobalLoading) {
    return <AtlasSkeleton />;
  }

  const handleRestartTutorial = () => {
    window.dispatchEvent(new Event('start-atlas-tour'));
  };

  const handleDiscoveryClick = () => {
    router.push(`/${locale}/atlas/discovery`);
  };

  const completedSteps = state.displaySections.map(section => (state.sectionProgressMap[section.uuid] || 0) === 100);

  return (
    <>
      <AtlasOverlays state={state} actions={actions} />

      <AtlasTemplate
        sidebar={
          <AtlasSidebar
            state={state}
            actions={actions}
            loading={loading}
            onDiscoveryClick={handleDiscoveryClick}
            onRestartTutorial={handleRestartTutorial}
          />
        }
      >
        <div id="atlas-header">
          <PageHeader
            title={state.selectedComplexityObj?.name || t('header_title')}
            description={state.selectedComplexityObj?.description || t('header_description')}
          />
        </div>

        <div className="flex flex-col gap-6">
          <div id="atlas-sections">
            <SectionTabs
              sections={state.displaySections}
              selectedId={state.selectedSection}
              onSelect={actions.selectSection}
              isLoading={loading.isSectionLoading}
              sectionProgressMap={state.sectionProgressMap}
            />
          </div>

          {state.isContextSelected ? (
            <div id="atlas-conditioners">
              <ConditionerList
                conditioners={state.currentConditioners}
                answers={state.conditionerAnswers}
                onSaveAnswer={actions.saveConditioner}
                onResetAnswer={actions.deleteConditioner}
                isLoading={false}
                dependencyNameMap={state.dependencyNameMap}
              />
            </div>
          ) : (
            <div id="atlas-axis-list">
              <AxisList
                axes={state.currentAxes}
                answers={state.answers}
                onSaveAnswer={actions.saveAnswer}
                onDeleteAnswer={actions.deleteAnswer}
                isLoading={loading.isAxesLoading}
                isLevelLoading={false}
              />
            </div>
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
