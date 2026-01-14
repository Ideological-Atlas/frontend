'use client';

import { useEffect, useState, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useAuthStore } from '@/store/useAuthStore';
import { useAtlasStore, type AnswerUpdatePayload } from '@/store/useAtlasStore';
import { Skeleton } from '@/components/atoms/Skeleton';

import { ComplexitySelector } from './ComplexitySelector';
import { SectionTabs } from './SectionTabs';
import { AxisList } from './AxisList';
import { ConditionerList } from './ConditionerList';
import { PageHeader } from '@/components/molecules/PageHeader';
import { ProgressCard } from '@/components/molecules/ProgressCard';
import type { IdeologySection } from '@/lib/client/models/IdeologySection';

const CONTEXT_SECTION_UUID = 'context';

export function AtlasView() {
  const t = useTranslations('Atlas');
  const locale = useLocale();
  const { isAuthenticated } = useAuthStore();

  const {
    complexities,
    conditioners,
    sections,
    axes,
    answers,
    conditionerAnswers,
    isInitialized,
    fetchAllData,
    saveAnswer,
    saveConditionerAnswer,
  } = useAtlasStore();

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

  const displaySections: IdeologySection[] = useMemo(() => {
    const rawSections = selectedComplexity ? sections[selectedComplexity] || [] : [];
    const currentConditioners = selectedComplexity ? conditioners[selectedComplexity] || [] : [];

    const filteredSections = rawSections.filter(section => {
      if (!section.condition_rules || section.condition_rules.length === 0) {
        return true;
      }

      return section.condition_rules.every(rule => {
        const userAnswer = conditionerAnswers[rule.conditioner.uuid];

        if (!userAnswer) return false;

        if (Array.isArray(rule.condition_values)) {
          return rule.condition_values.includes(userAnswer);
        }

        return rule.condition_values === userAnswer;
      });
    });

    if (currentConditioners.length > 0) {
      const contextSection: IdeologySection = {
        uuid: CONTEXT_SECTION_UUID,
        name: t('context_section'),
        description: null,
        icon: 'info',
        condition_rules: [],
      };
      return [contextSection, ...filteredSections];
    }

    return filteredSections;
  }, [selectedComplexity, sections, conditioners, conditionerAnswers, t]);

  useEffect(() => {
    if (displaySections.length > 0) {
      const isSelectedVisible = displaySections.some(s => s.uuid === selectedSection);

      if (!selectedSection || !isSelectedVisible) {
        setSelectedSection(displaySections[0].uuid);
      }
    } else {
      setSelectedSection(null);
    }
  }, [displaySections, selectedSection]);

  const handleSelectComplexity = (uuid: string) => {
    setSelectedComplexity(uuid);
    setSelectedSection(null);
  };

  const handleSelectSection = (uuid: string) => {
    setSelectedSection(uuid);
  };

  const handleSaveAnswer = (axisUuid: string, data: AnswerUpdatePayload) => {
    saveAnswer(axisUuid, data, isAuthenticated);
  };

  const handleSaveConditioner = (condUuid: string, value: string) => {
    saveConditionerAnswer(condUuid, value, isAuthenticated);
  };

  const progressMap = useMemo(() => {
    const map: Record<string, number> = {};
    complexities.forEach(c => {
      const compSections = sections[c.uuid] || [];
      const compConditioners = conditioners[c.uuid] || [];

      let totalItems = 0;
      let answeredItems = 0;

      compSections.forEach(s => {
        const secAxes = axes[s.uuid] || [];
        totalItems += secAxes.length;
        secAxes.forEach(a => {
          if (answers[a.uuid]) {
            answeredItems++;
          }
        });
      });

      totalItems += compConditioners.length;
      compConditioners.forEach(c => {
        if (conditionerAnswers[c.uuid]) {
          answeredItems++;
        }
      });

      map[c.uuid] = totalItems > 0 ? Math.round((answeredItems / totalItems) * 100) : 0;
    });
    return map;
  }, [complexities, sections, axes, answers, conditioners, conditionerAnswers]);

  const currentConditioners = selectedComplexity ? conditioners[selectedComplexity] || [] : [];

  const currentAxes = selectedSection && selectedSection !== CONTEXT_SECTION_UUID ? axes[selectedSection] || [] : [];

  const isLoadingData = !isInitialized && complexities.length === 0;
  const isLoadingSections = selectedComplexity ? !sections[selectedComplexity] : true;

  const isLoadingAxes = selectedSection && selectedSection !== CONTEXT_SECTION_UUID ? !axes[selectedSection] : false;

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

        <div className="flex flex-col gap-6">
          <SectionTabs
            sections={displaySections}
            selectedId={selectedSection}
            onSelect={handleSelectSection}
            isLoading={isLoadingSections}
          />

          {selectedSection === CONTEXT_SECTION_UUID ? (
            <ConditionerList
              conditioners={currentConditioners}
              answers={conditionerAnswers}
              onSaveAnswer={handleSaveConditioner}
              isLoading={false}
            />
          ) : (
            <AxisList
              axes={currentAxes}
              answers={answers}
              sectionId={selectedSection}
              onSaveAnswer={handleSaveAnswer}
              isLoading={isLoadingAxes}
              isLevelLoading={false}
            />
          )}
        </div>
      </main>
    </div>
  );
}
