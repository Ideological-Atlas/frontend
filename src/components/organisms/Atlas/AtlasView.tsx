'use client';

import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/atoms/Skeleton';
import { Button } from '@/components/atoms/Button';
import { ComplexitySelector } from './ComplexitySelector';
import { SectionTabs } from './SectionTabs';
import { AxisList } from './AxisList';
import { ConditionerList } from './ConditionerList';
import { PageHeader } from '@/components/molecules/PageHeader';
import { ProgressCard } from '@/components/molecules/ProgressCard';
import { ShareModal } from '@/components/molecules/ShareModal';
import { AtlasOnboarding } from './AtlasOnboarding';
import { useAtlasController } from '@/hooks/controllers/useAtlasController';

export function AtlasView() {
  const t = useTranslations('Atlas');
  const tOnboarding = useTranslations('Onboarding');

  const { state, loading, actions } = useAtlasController(t('context_section'));

  if (loading.isGlobalLoading) {
    return (
      <div className="layout-content-container mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-5 py-8 md:px-10 lg:flex-row">
        <aside className="w-full lg:w-[280px] lg:shrink-0">
          <Skeleton className="mb-6 h-8 w-32" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-12 w-full rounded-xl" />
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

  const handleRestartTutorial = () => {
    window.dispatchEvent(new Event('start-atlas-tour'));
  };

  return (
    <>
      <AtlasOnboarding />
      <ShareModal isOpen={state.isShareModalOpen} onClose={actions.closeShareModal} shareUrl={state.shareUrl} />

      <div
        id="atlas-view-container"
        className="layout-content-container mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-5 py-8 md:px-10 lg:flex-row"
      >
        <aside id="atlas-sidebar" className="w-full lg:sticky lg:top-24 lg:w-[280px] lg:shrink-0 lg:self-start">
          <div className="mb-6 flex flex-col gap-1 px-1">
            <h2 className="text-foreground text-lg font-bold tracking-tight">{t('complexity_level')}</h2>
            <p className="text-muted-foreground text-xs">{t('complexity_subtitle')}</p>
          </div>

          <div id="atlas-complexity-list">
            <ComplexitySelector
              complexities={state.complexities}
              selectedId={state.selectedComplexity}
              onSelect={actions.selectComplexity}
              isLoading={false}
              progressMap={state.progressMap}
            />
          </div>

          {state.selectedComplexity && (
            <div id="atlas-progress-card">
              <ProgressCard
                label={t('progress_label', { name: state.selectedComplexityObj?.name || '' })}
                percentage={state.selectedProgress}
                className="mt-6"
                onShare={actions.share}
                isSharing={loading.isGeneratingShare}
              />
            </div>
          )}

          <div className="mt-4 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRestartTutorial}
              className="text-muted-foreground hover:text-primary text-xs"
            >
              <span className="material-symbols-outlined mr-2 text-[16px]">help</span>
              {tOnboarding('restart_tutorial')}
            </Button>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-8">
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
              />
            </div>

            {state.selectedSection === state.CONTEXT_SECTION_UUID ? (
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
          </div>
        </main>
      </div>
    </>
  );
}
