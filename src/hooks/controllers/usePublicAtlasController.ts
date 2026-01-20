import { useState, useMemo, useCallback, useEffect } from 'react';
import { useAtlasStore, type AnswerData } from '@/store/useAtlasStore';
import { useAuthStore } from '@/store/useAuthStore';
import { AnswersService } from '@/lib/client/services/AnswersService';
import { UsersService } from '@/lib/client/services/UsersService';
import { TypeEnum } from '@/lib/client/models/TypeEnum';
import type { IdeologySection } from '@/lib/client/models/IdeologySection';
import type { CompletedAnswer } from '@/lib/client/models/CompletedAnswer';
import { checkVisibility } from '@/lib/domain/atlas-logic';

const CONTEXT_SECTION_UUID = 'context';
const normalizeUuid = (uuid: string) => (uuid ? uuid.replace(/-/g, '') : '');

export function usePublicAtlasController(uuid: string, contextSectionLabel: string) {
  const { complexities, conditioners, sections, axes, isInitialized, fetchAllData } = useAtlasStore();
  const { isAuthenticated } = useAuthStore();

  const [answerData, setAnswerData] = useState<CompletedAnswer | null>(null);
  const [affinity, setAffinity] = useState<number | null>(null);
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(true);
  const [selectedComplexity, setSelectedComplexity] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  useEffect(() => {
    if (!isInitialized) {
      fetchAllData(false);
    }
  }, [isInitialized, fetchAllData]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingAnswer(true);
        const data = await AnswersService.answersCompletedRetrieve(uuid);
        setAnswerData(data);

        if (isAuthenticated && data.completed_by?.uuid) {
          try {
            const affinityData = await UsersService.usersAffinityRetrieve(data.completed_by.uuid);
            setAffinity(affinityData.affinity);
          } catch (err) {
            console.error('Failed to load affinity', err);
          }
        }
      } catch (error) {
        console.error('Failed to load answer', error);
      } finally {
        setIsLoadingAnswer(false);
      }
    };
    if (uuid) loadData();
  }, [uuid, isAuthenticated]);

  useEffect(() => {
    if (complexities.length > 0 && !selectedComplexity) {
      const sorted = [...complexities].sort((a, b) => a.complexity - b.complexity);
      setSelectedComplexity(sorted[0].uuid);
    }
  }, [complexities, selectedComplexity]);

  const { answers, conditionerAnswers } = useMemo(() => {
    if (!answerData?.answers) return { answers: {}, conditionerAnswers: {} };

    const rawAxis = (answerData.answers.axis || []) as Array<{
      uuid: string;
      value: number | null;
      margin_left?: number;
      margin_right?: number;
    }>;
    const rawConds = (answerData.answers.conditioners || []) as Array<{ uuid: string; value: string }>;

    const axisMap: Record<string, AnswerData> = {};
    rawAxis.forEach(item => {
      axisMap[item.uuid] = {
        value: item.value,
        margin_left: item.margin_left,
        margin_right: item.margin_right,
        is_indifferent: item.value === null && !item.margin_left,
      };
    });

    const condMap: Record<string, string> = {};
    rawConds.forEach(item => {
      condMap[item.uuid] = item.value;
    });

    return { answers: axisMap, conditionerAnswers: condMap };
  }, [answerData]);

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

  const visibilityChecker = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (rulesInput: any) => checkVisibility(rulesInput, combinedConditionerAnswers),
    [combinedConditionerAnswers],
  );

  const displaySections: IdeologySection[] = useMemo(() => {
    const rawSections = selectedComplexity ? sections[selectedComplexity] || [] : [];
    const rawConditioners = selectedComplexity ? conditioners[selectedComplexity] || [] : [];

    const filteredSections = rawSections.filter(section => visibilityChecker(section.condition_rules));

    const visibleConditioners = rawConditioners.filter(
      cond => cond.type !== TypeEnum.AXIS_RANGE && visibilityChecker(cond.condition_rules),
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
  }, [selectedComplexity, sections, conditioners, visibilityChecker, contextSectionLabel]);

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

  const progressMap = useMemo(() => {
    const map: Record<string, number> = {};

    complexities.forEach(c => {
      const compSections = sections[c.uuid] || [];
      const compConditioners = conditioners[c.uuid] || [];

      let totalItems = 0;
      let answeredItems = 0;

      compConditioners.forEach(cond => {
        if (cond.type !== TypeEnum.AXIS_RANGE && visibilityChecker(cond.condition_rules)) {
          totalItems++;
          if (conditionerAnswers[cond.uuid]) {
            answeredItems++;
          }
        }
      });

      compSections.forEach(sec => {
        if (visibilityChecker(sec.condition_rules)) {
          const secAxes = axes[sec.uuid] || [];
          secAxes.forEach(axis => {
            if (visibilityChecker(axis.condition_rules)) {
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
  }, [complexities, sections, axes, answers, conditioners, conditionerAnswers, visibilityChecker]);

  const currentConditioners = useMemo(() => {
    const raw = selectedComplexity ? conditioners[selectedComplexity] || [] : [];
    return raw.filter(cond => cond.type !== TypeEnum.AXIS_RANGE && visibilityChecker(cond.condition_rules));
  }, [selectedComplexity, conditioners, visibilityChecker]);

  const currentAxes = useMemo(() => {
    if (!selectedSection || selectedSection === CONTEXT_SECTION_UUID) return [];
    const rawAxes = axes[selectedSection] || [];
    return rawAxes.filter(axis => visibilityChecker(axis.condition_rules));
  }, [selectedSection, axes, visibilityChecker]);

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

  const selectedComplexityObj = complexities.find(c => c.uuid === selectedComplexity);
  const selectedProgress = selectedComplexity ? progressMap[selectedComplexity] || 0 : 0;

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
      answerData,
      affinity,
    },
    loading: {
      isGlobalLoading: (!isInitialized && complexities.length === 0) || isLoadingAnswer,
      isSectionLoading: false,
    },
    actions: {
      selectComplexity: setSelectedComplexity,
      selectSection: setSelectedSection,
    },
  };
}
