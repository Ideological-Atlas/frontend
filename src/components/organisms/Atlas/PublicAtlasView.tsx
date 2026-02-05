'use client';

import { useTranslations } from 'next-intl';
import { ComplexitySelector } from './ComplexitySelector';
import { SectionTabs } from './SectionTabs';
import { AxisList } from './AxisList';
import { ConditionerList } from './ConditionerList';
import { PageHeader } from '@/components/molecules/PageHeader';
import { ProfileHeader } from '@/components/molecules/ProfileHeader';
import { SectionNavigation } from '@/components/molecules/SectionNavigation';
import { AtlasSkeleton } from '@/components/molecules/AtlasSkeleton';
import { AtlasTemplate } from '@/components/templates/AtlasTemplate';
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
    return <AtlasSkeleton />;
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

  const completedSteps = state.displaySections.map(section => (state.sectionProgressMap[section.uuid] || 0) === 100);

  return (
    <AtlasTemplate
      sidebar={
        <>
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
        </>
      }
    >
      <ProfileHeader
        user={targetUser || null}
        affinity={effectiveAffinity}
        isPublic={targetUser?.is_public ?? false}
        createdDate={state.answerData?.created}
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
          sectionProgressMap={state.sectionProgressMap}
        />

        {state.isContextSelected ? (
          <ConditionerList
            conditioners={state.currentConditioners}
            answers={isAuthenticated ? state.myConditionerAnswers : state.theirConditionerAnswers}
            otherAnswers={!isSelfView ? state.theirConditionerAnswers : undefined}
            targetUsername={targetUser?.username}
            onSaveAnswer={actions.saveConditioner}
            onResetAnswer={actions.deleteConditioner} // <--- FALTABA ESTO
            isLoading={false}
            dependencyNameMap={state.dependencyNameMap}
            readOnly={false}
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
            onDeleteAnswer={actions.deleteAnswer} // <--- FALTABA ESTO
            isLoading={false}
            isLevelLoading={false}
            readOnly={false}
            variant={effectiveVariant}
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
  );
}
