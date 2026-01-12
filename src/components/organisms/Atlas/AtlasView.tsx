'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useAuthStore } from '@/store/useAuthStore';
import { useAtlasStore } from '@/store/useAtlasStore';
import { Skeleton } from '@/components/atoms/Skeleton';

import { ComplexitySelector } from './ComplexitySelector';
import { ContextGrid } from './ContextGrid';
import { SectionTabs } from './SectionTabs';
import { AxisList } from './AxisList';

export function AtlasView() {
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedComplexity(sorted[0].uuid);
    }
  }, [complexities, selectedComplexity]);

  useEffect(() => {
    if (selectedComplexity) {
      const currentSections = sections[selectedComplexity];
      if (currentSections && currentSections.length > 0 && !selectedSection) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const handleSaveAnswer = (axisUuid: string, value: number) => {
    saveAnswer(axisUuid, value, isAuthenticated);
  };

  if (!isInitialized && complexities.length === 0) {
    return (
      <div className="flex w-full flex-col gap-8 pb-20">
        <section className="border-border bg-card/50 border-b px-5 py-4 backdrop-blur-sm">
          <div className="mx-auto max-w-[1200px]">
            <Skeleton className="h-10 w-full max-w-md rounded-full" />
          </div>
        </section>
        <div className="layout-content-container mx-auto w-full max-w-[1200px] px-5 md:px-20">
          <Skeleton className="mb-8 h-40 w-full rounded-xl" />
          <Skeleton className="mb-8 h-12 w-full rounded-lg" />
          <div className="flex flex-col gap-6">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const currentConditioners = selectedComplexity ? conditioners[selectedComplexity] || [] : [];
  const currentSections = selectedComplexity ? sections[selectedComplexity] || [] : [];
  const currentAxes = selectedSection ? axes[selectedSection] || [] : [];

  const isLoadingConditioners = selectedComplexity ? !conditioners[selectedComplexity] : true;
  const isLoadingSections = selectedComplexity ? !sections[selectedComplexity] : true;
  const isLoadingAxes = selectedSection ? !axes[selectedSection] : true;

  return (
    <div className="flex w-full flex-col gap-8 pb-20">
      <ComplexitySelector
        complexities={complexities}
        selectedId={selectedComplexity}
        onSelect={handleSelectComplexity}
        isLoading={false}
      />

      <div className="layout-content-container mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 md:px-20">
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
    </div>
  );
}
