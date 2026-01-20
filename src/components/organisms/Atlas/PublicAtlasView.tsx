'use client';

import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/atoms/Skeleton';
import { ComplexitySelector } from './ComplexitySelector';
import { SectionTabs } from './SectionTabs';
import { AxisList } from './AxisList';
import { ConditionerList } from './ConditionerList';
import { PageHeader } from '@/components/molecules/PageHeader';
import { ProgressCard } from '@/components/molecules/ProgressCard';
import { ProfileHeader } from '@/components/molecules/ProfileHeader';
import { usePublicAtlasController } from '@/hooks/controllers/usePublicAtlasController';

interface PublicAtlasViewProps {
  uuid: string;
}

export function PublicAtlasView({ uuid }: PublicAtlasViewProps) {
  const t = useTranslations('Atlas');
  const { state, loading, actions } = usePublicAtlasController(uuid, t('context_section'));

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

  const user = state.answerData?.completed_by;

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
          variant="other"
        />

        {state.selectedComplexity && (
          <ProgressCard
            label={t('progress_label', { name: state.selectedComplexityObj?.name || '' })}
            percentage={state.selectedProgress}
            className="mt-6"
            variant="other"
          />
        )}
      </aside>

      <main className="flex min-w-0 flex-1 flex-col gap-8">
        {user && <ProfileHeader user={user} affinity={state.affinity} isPublic={user.is_public} />}

        <PageHeader
          title={state.selectedComplexityObj?.name || t('header_title')}
          description={state.selectedComplexityObj?.description || t('header_description')}
          variant="other"
        />

        <div className="flex flex-col gap-6">
          <SectionTabs
            sections={state.displaySections}
            selectedId={state.selectedSection}
            onSelect={actions.selectSection}
            isLoading={loading.isSectionLoading}
            variant="other"
          />

          {state.selectedSection === state.CONTEXT_SECTION_UUID ? (
            <ConditionerList
              conditioners={state.currentConditioners}
              answers={state.conditionerAnswers}
              isLoading={false}
              dependencyNameMap={state.dependencyNameMap}
              readOnly={true}
              variant="other"
            />
          ) : (
            <AxisList
              axes={state.currentAxes}
              answers={state.answers}
              isLoading={false}
              isLevelLoading={false}
              readOnly={true}
              variant="other"
            />
          )}
        </div>
      </main>
    </div>
  );
}
