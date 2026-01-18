import { useState, useMemo, useCallback, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAtlasStore, type AnswerData, type AnswerUpdatePayload } from '@/store/useAtlasStore';
import type { IdeologySection } from '@/lib/client/models/IdeologySection';
import type { IdeologySectionConditioner } from '@/lib/client/models/IdeologySectionConditioner';
import type { IdeologyAxisConditioner } from '@/lib/client/models/IdeologyAxisConditioner';
import type { IdeologyConditioner } from '@/lib/client/models/IdeologyConditioner';
import { TypeEnum } from '@/lib/client/models/TypeEnum';

interface LocalConditionerRule {
  uuid?: string;
  source_conditioner_uuid: string;
  condition_values: string | number | boolean | (string | number | boolean)[];
  conditioner?: IdeologyConditioner;
}

const CONTEXT_SECTION_UUID = 'context';
const normalizeUuid = (uuid: string) => (uuid ? uuid.replace(/-/g, '') : '');

type ConditionRule = IdeologySectionConditioner | IdeologyAxisConditioner | LocalConditionerRule;

const parseRules = (rules: string | unknown[]): ConditionRule[] => {
  if (Array.isArray(rules)) return rules as ConditionRule[];
  if (typeof rules === 'string') {
    try {
      return JSON.parse(rules) as ConditionRule[];
    } catch {
      return [];
    }
  }
  return [];
};

export function useAtlasController(contextSectionLabel: string) {
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
    if (!isInitialized) {
      fetchAllData(isAuthenticated);
    }
  }, [isInitialized, isAuthenticated, fetchAllData]);

  useEffect(() => {
    if (complexities.length > 0 && !selectedComplexity) {
      const sorted = [...complexities].sort((a, b) => a.complexity - b.complexity);
      setSelectedComplexity(sorted[0].uuid);
    }
  }, [complexities, selectedComplexity]);

  const normalizedAnswers = useMemo(() => {
    const map: Record<string, AnswerData> = {};
    Object.entries(answers).forEach(([key, value]) => {
      map[normalizeUuid(key)] = value;
    });
    return map;
  }, [answers]);

  const normalizedConditionerAnswers = useMemo(() => {
    const map: Record<string, string> = {};
    Object.entries(conditionerAnswers).forEach(([key, value]) => {
      map[normalizeUuid(key)] = value;
    });
    return map;
  }, [conditionerAnswers]);

  const virtualConditionerAnswers = useMemo(() => {
    const computed: Record<string, string> = {};
    const allConditioners = Object.values(conditioners).flat();

    allConditioners.forEach(cond => {
      if (cond.type === TypeEnum.AXIS_RANGE && cond.source_axis_uuid) {
        const sourceUuid = normalizeUuid(cond.source_axis_uuid);
        const axisAnswer = normalizedAnswers[sourceUuid];

        let result = 'false';

        if (axisAnswer && axisAnswer.value !== null && !axisAnswer.is_indifferent) {
          const val = axisAnswer.value;
          const min = cond.axis_min_value ?? -Infinity;
          const max = cond.axis_max_value ?? Infinity;

          if (val > min && val <= max) {
            result = 'true';
          }
        }

        computed[normalizeUuid(cond.uuid)] = result;
      }
    });

    return computed;
  }, [conditioners, normalizedAnswers]);

  const combinedConditionerAnswers = useMemo(() => {
    return { ...normalizedConditionerAnswers, ...virtualConditionerAnswers };
  }, [normalizedConditionerAnswers, virtualConditionerAnswers]);

  const checkVisibility = useCallback(
    (rulesInput: string | ConditionRule[]) => {
      const rules = parseRules(rulesInput);
      if (!rules || rules.length === 0) return true;

      return rules.every(rule => {
        const nestedConditioner = rule.conditioner;

        let rawSourceUuid: string | undefined;

        if ('source_conditioner_uuid' in rule && rule.source_conditioner_uuid) {
          rawSourceUuid = rule.source_conditioner_uuid;
        } else if (nestedConditioner?.uuid) {
          rawSourceUuid = nestedConditioner.uuid;
        }

        if (!rawSourceUuid) return true;

        const sourceUuid = normalizeUuid(rawSourceUuid);
        const userAnswer = combinedConditionerAnswers[sourceUuid];

        if (!userAnswer) return false;

        let accepted = rule.condition_values;

        const isAxisRange = nestedConditioner?.type === TypeEnum.AXIS_RANGE;
        const hasNoValues = !accepted || (Array.isArray(accepted) && accepted.length === 0);

        if (hasNoValues && isAxisRange) {
          accepted = ['true'];
        }

        if (Array.isArray(accepted)) {
          return accepted.includes(userAnswer);
        }
        return accepted === userAnswer;
      });
    },
    [combinedConditionerAnswers],
  );

  const displaySections: IdeologySection[] = useMemo(() => {
    const rawSections = selectedComplexity ? sections[selectedComplexity] || [] : [];
    const rawConditioners = selectedComplexity ? conditioners[selectedComplexity] || [] : [];

    const filteredSections = rawSections.filter(section => checkVisibility(section.condition_rules));

    const visibleConditioners = rawConditioners.filter(
      cond => cond.type !== TypeEnum.AXIS_RANGE && checkVisibility(cond.condition_rules),
    );

    if (visibleConditioners.length > 0) {
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
        if (cond.type !== TypeEnum.AXIS_RANGE && checkVisibility(cond.condition_rules)) {
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

  const dependencyNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    Object.values(conditioners)
      .flat()
      .forEach(cond => {
        map[cond.uuid] = cond.name;
        map[normalizeUuid(cond.uuid)] = cond.name;
      });
    return map;
  }, [conditioners]);

  const currentConditioners = useMemo(() => {
    const raw = selectedComplexity ? conditioners[selectedComplexity] || [] : [];
    return raw.filter(cond => cond.type !== TypeEnum.AXIS_RANGE && checkVisibility(cond.condition_rules));
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
      dependencyNameMap,
      CONTEXT_SECTION_UUID,
    },
    loading: loadingState,
    actions: handlers,
  };
}
