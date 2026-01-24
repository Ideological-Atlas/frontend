'use client';

import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/atoms/Skeleton';
import { ComplexitySelector } from './ComplexitySelector';
import { SectionTabs } from './SectionTabs';
import { AxisList } from './AxisList';
import { ConditionerList } from './ConditionerList';
import { PageHeader } from '@/components/molecules/PageHeader';
import { ProfileHeader } from '@/components/molecules/ProfileHeader';
import { usePublicAtlasController } from '@/hooks/controllers/usePublicAtlasController';
import { useAuthStore } from '@/store/useAuthStore';

interface PublicAtlasViewProps {
  uuid: string;
}

export function PublicAtlasView({ uuid }: PublicAtlasViewProps) {
  const t = useTranslations('Atlas');
  const { state, loading, actions } = usePublicAtlasController(uuid, t('context_section'));
  const { isAuthenticated, user: authUser } = useAuthStore();

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

  const targetUser = state.answerData?.completed_by;

  const isSelfView =
    isAuthenticated &&
    ((authUser?.uuid && targetUser?.uuid && authUser.uuid === targetUser.uuid) ||
      (authUser?.username && targetUser?.username && authUser.username === targetUser.username));

  const effectiveVariant = isSelfView ? 'default' : 'other';

  const currentLevelAffinity =
    !isSelfView && state.selectedComplexity ? state.complexityAffinityMap[state.selectedComplexity] : undefined;

  const effectiveAffinity = isSelfView ? null : state.affinity;
  const effectiveSectionAffinity = isSelfView ? undefined : state.sectionAffinityMap;
  const effectiveAxisAffinity = isSelfView ? undefined : state.axisAffinityMap;

  return (
    <div className="layout-content-container mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-5 py-8 md:px-10 lg:flex-row">
      <aside className="w-full lg:sticky lg:top-24 lg:w-[280px] lg:shrink-0 lg:self-start">
        <div className="mb-6 flex flex-col gap-1 px-1">
          <h2 className="text-foreground text-lg font-bold tracking-tight">{t('complexity_level')}</h2>
          <p className="text-muted-foreground text-xs">{t('complexity_subtitle')}</p>
        </div>

        <ComplexitySelector
          complexities={state.complexities}
          selectedId={state.selectedComplexity}
          onSelect={actions.selectComplexity}
          isLoading={false}
          progressMap={state.progressMap}
          myProgressMap={isSelfView ? undefined : state.myProgressMap}
          targetUsername={targetUser?.username}
          viewerUsername={authUser?.username}
          affinityMap={isSelfView ? undefined : state.complexityAffinityMap}
          variant={effectiveVariant}
        />
      </aside>

      <main className="flex min-w-0 flex-1 flex-col gap-8">
        <ProfileHeader
          user={targetUser || null}
          affinity={effectiveAffinity}
          isPublic={targetUser?.is_public ?? false}
        />

        <PageHeader
          title={state.selectedComplexityObj?.name || t('header_title')}
          description={state.selectedComplexityObj?.description || t('header_description')}
          affinity={currentLevelAffinity}
          variant={effectiveVariant}
        />

        <div className="flex flex-col gap-6">
          <SectionTabs
            sections={state.displaySections}
            selectedId={state.selectedSection}
            onSelect={actions.selectSection}
            isLoading={loading.isSectionLoading}
            affinityMap={effectiveSectionAffinity}
            variant={effectiveVariant}
          />

          {state.selectedSection === state.CONTEXT_SECTION_UUID ? (
            <ConditionerList
              conditioners={state.currentConditioners}
              answers={isAuthenticated ? state.myConditionerAnswers : state.theirConditionerAnswers}
              otherAnswers={isAuthenticated && !isSelfView ? state.theirConditionerAnswers : undefined}
              targetUsername={targetUser?.username}
              onSaveAnswer={actions.saveConditioner}
              isLoading={false}
              dependencyNameMap={state.dependencyNameMap}
              readOnly={!isAuthenticated}
              variant={effectiveVariant}
            />
          ) : (
            <AxisList
              axes={state.currentAxes}
              answers={state.theirAxisAnswers}
              myAnswers={!isSelfView ? state.myAxisAnswers : undefined}
              axisAffinityMap={effectiveAxisAffinity}
              targetUsername={targetUser?.username}
              onSaveAnswer={actions.saveAnswer}
              isLoading={false}
              isLevelLoading={false}
              readOnly={!isAuthenticated}
              variant={effectiveVariant}
            />
          )}
        </div>
      </main>
    </div>
  );
}
