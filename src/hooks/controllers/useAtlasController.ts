import { useEffect, useState, useMemo, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useAuthStore } from '@/store/useAuthStore';
import { useAtlasStore, type AnswerUpdatePayload } from '@/store/useAtlasStore';
import type { IdeologySection } from '@/lib/client/models/IdeologySection';
import type { IdeologySectionConditioner } from '@/lib/client/models/IdeologySectionConditioner';
import type { IdeologyAxisConditioner } from '@/lib/client/models/IdeologyAxisConditioner';
import type { IdeologyConditionerConditioner } from '@/lib/client/models/IdeologyConditionerConditioner';

const CONTEXT_SECTION_UUID = 'context';
const normalizeUuid = (uuid: string) => (uuid ? uuid.replace(/-/g, '') : '');

type ConditionRule = IdeologySectionConditioner | IdeologyAxisConditioner | IdeologyConditionerConditioner;

export function useAtlasController(contextSectionLabel: string) {
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
    deleteAnswer,
    saveConditionerAnswer,
    deleteConditionerAnswer,
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

  const checkVisibility = useCallback(
    (rules: ConditionRule[]) => {
      if (!rules || rules.length === 0) return true;

      return rules.every(rule => {
        // @ts-expect-error - Complex union type discrimination
        const rawSourceUuid = rule.source_conditioner_uuid || rule.conditioner?.uuid;
        const sourceUuid = normalizeUuid(rawSourceUuid);
        const userAnswer = conditionerAnswers[sourceUuid];

        if (!userAnswer) return false;

        const accepted = rule.condition_values;
        if (Array.isArray(accepted)) {
          return accepted.includes(userAnswer);
        }
        return accepted === userAnswer;
      });
    },
    [conditionerAnswers],
  );

  const displaySections: IdeologySection[] = useMemo(() => {
    const rawSections = selectedComplexity ? sections[selectedComplexity] || [] : [];
    const rawConditioners = selectedComplexity ? conditioners[selectedComplexity] || [] : [];

    const filteredSections = rawSections.filter(section => checkVisibility(section.condition_rules));

    if (rawConditioners.length > 0) {
      const contextSection: IdeologySection = {
        uuid: CONTEXT_SECTION_UUID,
        name: contextSectionLabel,
        description: null,
        icon: 'info',
        condition_rules: [],
      };
      return [contextSection, ...filteredSections];
    }

    return filteredSections;
  }, [selectedComplexity, sections, conditioners, checkVisibility, contextSectionLabel]);

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

  const handlers = {
    saveAnswer: (axisUuid: string, data: AnswerUpdatePayload) => {
      saveAnswer(axisUuid, data, isAuthenticated);
    },
    deleteAnswer: (axisUuid: string) => {
      deleteAnswer(axisUuid, isAuthenticated);
    },
    saveConditioner: (condUuid: string, value: string) => {
      saveConditionerAnswer(condUuid, value, isAuthenticated);
    },
    deleteConditioner: (condUuid: string) => {
      deleteConditionerAnswer(condUuid, isAuthenticated);
    },
    selectComplexity: handleSelectComplexity,
    selectSection: handleSelectSection,
  };

  const progressMap = useMemo(() => {
    const map: Record<string, number> = {};

    complexities.forEach(c => {
      const compSections = sections[c.uuid] || [];
      const compConditioners = conditioners[c.uuid] || [];

      let totalItems = 0;
      let answeredItems = 0;

      compConditioners.forEach(cond => {
        if (checkVisibility(cond.condition_rules)) {
          totalItems++;
          if (conditionerAnswers[cond.uuid]) {
            answeredItems++;
          }
        }
      });

      compSections.forEach(sec => {
        if (checkVisibility(sec.condition_rules)) {
          const secAxes = axes[sec.uuid] || [];
          secAxes.forEach(axis => {
            if (checkVisibility(axis.condition_rules)) {
              totalItems++;
              if (answers[axis.uuid]) {
                answeredItems++;
              }
            }
          });
        }
      });

      map[c.uuid] = totalItems > 0 ? Math.round((answeredItems / totalItems) * 100) : 0;
    });
    return map;
  }, [complexities, sections, axes, answers, conditioners, conditionerAnswers, checkVisibility]);

  const currentConditioners = useMemo(() => {
    const raw = selectedComplexity ? conditioners[selectedComplexity] || [] : [];
    return raw.filter(cond => checkVisibility(cond.condition_rules));
  }, [selectedComplexity, conditioners, checkVisibility]);

  const currentAxes = useMemo(() => {
    if (!selectedSection || selectedSection === CONTEXT_SECTION_UUID) return [];
    const rawAxes = axes[selectedSection] || [];
    return rawAxes.filter(axis => checkVisibility(axis.condition_rules));
  }, [selectedSection, axes, checkVisibility]);

  const selectedComplexityObj = complexities.find(c => c.uuid === selectedComplexity);
  const selectedProgress = selectedComplexity ? progressMap[selectedComplexity] || 0 : 0;

  const loadingState = {
    isGlobalLoading: !isInitialized && complexities.length === 0,
    isSectionLoading: selectedComplexity ? !sections[selectedComplexity] : true,
    isAxesLoading: selectedSection && selectedSection !== CONTEXT_SECTION_UUID ? !axes[selectedSection] : false,
  };

  return {
    state: {
      complexities,
      selectedComplexity,
      selectedSection,
      displaySections,
      currentConditioners,
      currentAxes,
      conditionerAnswers,
      answers,
      progressMap,
      selectedComplexityObj,
      selectedProgress,
      CONTEXT_SECTION_UUID,
    },
    loading: loadingState,
    actions: handlers,
  };
}
