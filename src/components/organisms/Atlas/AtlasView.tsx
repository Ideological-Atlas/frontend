'use client';

import { useEffect, useState, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useAuthStore } from '@/store/useAuthStore';
import { useAtlasStore, type AnswerUpdatePayload } from '@/store/useAtlasStore';
import { Skeleton } from '@/components/atoms/Skeleton';

import { ComplexitySelector } from './ComplexitySelector';
import { ContextGrid } from './ContextGrid';
import { SectionTabs } from './SectionTabs';
import { AxisList } from './AxisList';
import { PageHeader } from '@/components/molecules/PageHeader';
import { ProgressCard } from '@/components/molecules/ProgressCard';

export function AtlasView() {
  const t = useTranslations('Atlas');
  const locale = useLocale();
  const { isAuthenticated } = useAuthStore();

  const { complexities, conditioners, sections, axes, answers, isInitialized, fetchAllData, saveAnswer } =
    useAtlasStore();

  const [selectedComplexity, setSelectedComplexity] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData(isAuthenticated);
  }, [locale, isAuthenticated, fetchAllData]);

  useEffect(() => {
    if (complexities.length > 0 && !selectedComplexity) {
      const sorted = [...complexities].sort((a, b) => a.complexity - b.complexity);

      setSelectedComplexity(sorted[0].uuid);
    }
  }, [complexities, selectedComplexity]);

  useEffect(() => {
    if (selectedComplexity) {
      const currentSections = sections[selectedComplexity];
      if (currentSections && currentSections.length > 0 && !selectedSection) {
        setSelectedSection(currentSections[0].uuid);
      }
    }
  }, [selectedComplexity, sections, selectedSection]);

  const handleSelectComplexity = (uuid: string) => {
    setSelectedComplexity(uuid);
    const compSections = sections[uuid] || [];
    if (compSections.length > 0) {
      setSelectedSection(compSections[0].uuid);
    } else {
      setSelectedSection(null);
    }
  };

  const handleSelectSection = (uuid: string) => {
    setSelectedSection(uuid);
  };

  const handleSaveAnswer = (axisUuid: string, data: AnswerUpdatePayload) => {
    saveAnswer(axisUuid, data, isAuthenticated);
  };

  const progressMap = useMemo(() => {
    const map: Record<string, number> = {};
    complexities.forEach(c => {
      const compSections = sections[c.uuid] || [];
      let totalAxes = 0;
      let answeredAxes = 0;

      compSections.forEach(s => {
        const secAxes = axes[s.uuid] || [];
        totalAxes += secAxes.length;
        secAxes.forEach(a => {
          if (answers[a.uuid]) {
            answeredAxes++;
          }
        });
      });

      map[c.uuid] = totalAxes > 0 ? Math.round((answeredAxes / totalAxes) * 100) : 0;
    });
    return map;
  }, [complexities, sections, axes, answers]);

  const currentConditioners = selectedComplexity ? conditioners[selectedComplexity] || [] : [];
  const currentSections = selectedComplexity ? sections[selectedComplexity] || [] : [];
  const currentAxes = selectedSection ? axes[selectedSection] || [] : [];

  const isLoadingData = !isInitialized && complexities.length === 0;
  const isLoadingConditioners = selectedComplexity ? !conditioners[selectedComplexity] : true;
  const isLoadingSections = selectedComplexity ? !sections[selectedComplexity] : true;
  const isLoadingAxes = selectedSection ? !axes[selectedSection] : true;

  const selectedProgress = selectedComplexity ? progressMap[selectedComplexity] || 0 : 0;
  const selectedComplexityObj = complexities.find(c => c.uuid === selectedComplexity);

  if (isLoadingData) {
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

  return (
    <div className="layout-content-container mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-5 py-8 md:px-10 lg:flex-row">
      <aside className="w-full lg:sticky lg:top-24 lg:w-[280px] lg:shrink-0 lg:self-start">
        <div className="mb-6 flex flex-col gap-1 px-1">
          <h2 className="text-foreground text-lg font-bold tracking-tight">{t('complexity_level')}</h2>
          <p className="text-muted-foreground text-xs">{t('complexity_subtitle')}</p>
        </div>

        <ComplexitySelector
          complexities={complexities}
          selectedId={selectedComplexity}
          onSelect={handleSelectComplexity}
          isLoading={false}
          progressMap={progressMap}
        />

        {selectedComplexity && (
          <ProgressCard
            label={`Progreso ${selectedComplexityObj?.name || ''}`}
            percentage={selectedProgress}
            className="mt-6"
          />
        )}
      </aside>

      <main className="flex min-w-0 flex-1 flex-col gap-8">
        <PageHeader title={t('header_title')} description={t('header_description')} />

        <div className="flex flex-col gap-8">
          <ContextGrid conditioners={currentConditioners} isLoading={isLoadingConditioners} />

          <div className="flex flex-col gap-6">
            <SectionTabs
              sections={currentSections}
              selectedId={selectedSection}
              onSelect={handleSelectSection}
              isLoading={isLoadingSections}
            />

            <AxisList
              axes={currentAxes}
              answers={answers}
              sectionId={selectedSection}
              onSaveAnswer={handleSaveAnswer}
              isLoading={isLoadingAxes}
              isLevelLoading={false}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
