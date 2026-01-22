import { useState, useMemo, useCallback, useEffect } from 'react';
import { useAtlasStore, type AnswerData, type AnswerUpdatePayload } from '@/store/useAtlasStore';
import { useAuthStore } from '@/store/useAuthStore';
import { AnswersService } from '@/lib/client/services/AnswersService';
import { UsersService } from '@/lib/client/services/UsersService';
import { TypeEnum } from '@/lib/client/models/TypeEnum';
import type { IdeologySection } from '@/lib/client/models/IdeologySection';
import type { CompletedAnswer } from '@/lib/client/models/CompletedAnswer';
import type { AxisBreakdown } from '@/lib/client/models/AxisBreakdown';
import type { ComplexityAffinity } from '@/lib/client/models/ComplexityAffinity';
import { checkVisibility } from '@/lib/domain/atlas-logic';

const CONTEXT_SECTION_UUID = 'context';
const normalizeUuid = (uuid: string) => (uuid ? uuid.replace(/-/g, '') : '');

export function usePublicAtlasController(uuid: string, contextSectionLabel: string) {
  const {
    complexities,
    conditioners,
    sections,
    axes,
    isInitialized,
    answers: myAxisAnswers,
    conditionerAnswers: myConditionerAnswers,
    fetchAllData,
    saveAnswer: saveAnswerToStore,
    deleteAnswer: deleteAnswerFromStore,
    saveConditionerAnswer: saveConditionerToStore,
  } = useAtlasStore();

  const { isAuthenticated } = useAuthStore();

  const [answerData, setAnswerData] = useState<CompletedAnswer | null>(null);
  const [affinity, setAffinity] = useState<number | null>(null);

  const [axisAffinityMap, setAxisAffinityMap] = useState<
    Record<string, { affinity: number; my_answer: AnswerData | null }>
  >({});
  const [complexityAffinityMap, setComplexityAffinityMap] = useState<Record<string, number>>({});
  const [sectionAffinityMap, setSectionAffinityMap] = useState<Record<string, number>>({});

  const [isLoadingAnswer, setIsLoadingAnswer] = useState(true);
  const [selectedComplexity, setSelectedComplexity] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  useEffect(() => {
    if (!isInitialized) {
      fetchAllData(isAuthenticated);
    }
  }, [isInitialized, fetchAllData, isAuthenticated]);

  const refreshAffinity = useCallback(async () => {
    if (!isAuthenticated || !uuid) return;

    try {
      const affinityData = await UsersService.usersAffinityRetrieve(uuid);
      setAffinity(affinityData.total_affinity);

      const axMap: Record<string, { affinity: number; my_answer: AnswerData | null }> = {};
      const compMap: Record<string, number> = {};
      const secMap: Record<string, number> = {};

      if (affinityData.complexities) {
        affinityData.complexities.forEach((compAff: ComplexityAffinity) => {
          if (compAff.complexity?.uuid) compMap[compAff.complexity.uuid] = compAff.affinity;
          if (compAff.sections) {
            compAff.sections.forEach(secAff => {
              if (secAff.section?.uuid) secMap[secAff.section.uuid] = secAff.affinity;
              if (secAff.axes) {
                secAff.axes.forEach((item: AxisBreakdown) => {
                  if (item.axis?.uuid) {
                    axMap[item.axis.uuid] = {
                      affinity: item.affinity,
                      my_answer: item.my_answer
                        ? {
                            value: item.my_answer.value,
                            margin_left: item.my_answer.margin_left,
                            margin_right: item.my_answer.margin_right,
                            is_indifferent: item.my_answer.is_indifferent ?? false,
                          }
                        : null,
                    };
                  }
                });
              }
            });
          }
        });
      }

      setAxisAffinityMap(axMap);
      setComplexityAffinityMap(compMap);
      setSectionAffinityMap(secMap);
    } catch (err) {
      console.error('Failed to refresh affinity', err);
    }
  }, [isAuthenticated, uuid]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingAnswer(true);
        const data = await AnswersService.answersCompletedRetrieve(uuid);
        setAnswerData(data);
      } catch (error) {
        console.error('Failed to load answer', error);
      } finally {
        setIsLoadingAnswer(false);
      }
    };

    if (uuid) {
      loadData();
      if (isAuthenticated) {
        refreshAffinity();
      }
    }
  }, [uuid, isAuthenticated, refreshAffinity]);

  useEffect(() => {
    if (complexities.length > 0 && !selectedComplexity) {
      const sorted = [...complexities].sort((a, b) => a.complexity - b.complexity);
      setSelectedComplexity(sorted[0].uuid);
    }
  }, [complexities, selectedComplexity]);

  const { answers: theirAxisAnswers, conditionerAnswers: theirConditionerAnswers } = useMemo(() => {
    if (!answerData?.answers) return { answers: {}, conditionerAnswers: {} };

    const rawAxis = (answerData.answers.axis || []) as Array<{
      uuid: string;
      value: number | null;
      margin_left?: number;
      margin_right?: number;
      is_indifferent?: boolean;
    }>;
    const rawConds = (answerData.answers.conditioners || []) as Array<{ uuid: string; value: string }>;

    const axisMap: Record<string, AnswerData> = {};
    rawAxis.forEach(item => {
      axisMap[item.uuid] = {
        value: item.value,
        margin_left: item.margin_left,
        margin_right: item.margin_right,
        is_indifferent: item.is_indifferent ?? false,
      };
    });
    const condMap: Record<string, string> = {};
    rawConds.forEach(item => {
      condMap[item.uuid] = item.value;
    });
    return { answers: axisMap, conditionerAnswers: condMap };
  }, [answerData]);

  const visibilitySource = useMemo(() => {
    if (isAuthenticated) {
      return {
        axis: myAxisAnswers,
        cond: myConditionerAnswers,
      };
    }
    return {
      axis: theirAxisAnswers,
      cond: theirConditionerAnswers,
    };
  }, [isAuthenticated, myAxisAnswers, myConditionerAnswers, theirAxisAnswers, theirConditionerAnswers]);

  const virtualConditionerAnswers = useMemo(() => {
    const computed: Record<string, string> = {};
    const allConditioners = Object.values(conditioners).flat();

    const normSourceAxis: Record<string, AnswerData> = {};
    Object.entries(visibilitySource.axis).forEach(([k, v]) => {
      normSourceAxis[normalizeUuid(k)] = v;
    });

    allConditioners.forEach(cond => {
      if (cond.type === TypeEnum.AXIS_RANGE && cond.source_axis_uuid) {
        const sourceUuid = normalizeUuid(cond.source_axis_uuid);
        const axisAnswer = normSourceAxis[sourceUuid];
        let result = 'false';
        if (axisAnswer && axisAnswer.value !== null && !axisAnswer.is_indifferent) {
          const val = axisAnswer.value;
          const min = cond.axis_min_value ?? -Infinity;
          const max = cond.axis_max_value ?? Infinity;
          if (val > min && val <= max) result = 'true';
        }
        computed[normalizeUuid(cond.uuid)] = result;
      }
    });
    return computed;
  }, [conditioners, visibilitySource.axis]);

  const combinedConditionerAnswers = useMemo(() => {
    const normCond: Record<string, string> = {};
    Object.entries(visibilitySource.cond).forEach(([k, v]) => {
      normCond[normalizeUuid(k)] = v;
    });
    return { ...normCond, ...virtualConditionerAnswers };
  }, [visibilitySource.cond, virtualConditionerAnswers]);

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
          if (theirConditionerAnswers[cond.uuid]) answeredItems++;
        }
      });
      compSections.forEach(sec => {
        if (visibilityChecker(sec.condition_rules)) {
          const secAxes = axes[sec.uuid] || [];
          secAxes.forEach(axis => {
            if (visibilityChecker(axis.condition_rules)) {
              totalItems++;
              const ans = theirAxisAnswers[axis.uuid];
              if (ans && (ans.value !== null || ans.is_indifferent)) {
                answeredItems++;
              }
            }
          });
        }
      });
      map[c.uuid] = totalItems > 0 ? Math.round((answeredItems / totalItems) * 100) : 0;
    });
    return map;
  }, [complexities, sections, axes, theirAxisAnswers, conditioners, theirConditionerAnswers, visibilityChecker]);

  const myProgressMap = useMemo(() => {
    const map: Record<string, number> = {};
    if (!isAuthenticated) return map;
    complexities.forEach(c => {
      const compSections = sections[c.uuid] || [];
      let totalItems = 0;
      let answeredItems = 0;
      compSections.forEach(sec => {
        if (visibilityChecker(sec.condition_rules)) {
          const secAxes = axes[sec.uuid] || [];
          secAxes.forEach(axis => {
            if (visibilityChecker(axis.condition_rules)) {
              totalItems++;
              const ans = myAxisAnswers[axis.uuid];
              if (ans && (ans.value !== null || ans.is_indifferent)) {
                answeredItems++;
              }
            }
          });
        }
      });
      map[c.uuid] = totalItems > 0 ? Math.round((answeredItems / totalItems) * 100) : 0;
    });
    return map;
  }, [complexities, sections, axes, myAxisAnswers, visibilityChecker, isAuthenticated]);

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

  const handleSaveAnswer = async (axisUuid: string, data: AnswerUpdatePayload) => {
    if (!isAuthenticated) return;
    await saveAnswerToStore(axisUuid, data, true);
    await refreshAffinity();
  };

  const handleDeleteAnswer = async (axisUuid: string) => {
    if (!isAuthenticated) return;
    await deleteAnswerFromStore(axisUuid, true);
    await refreshAffinity();
  };

  const handleSaveConditioner = async (uuid: string, value: string) => {
    if (!isAuthenticated) return;
    await saveConditionerToStore(uuid, value, true);
  };

  const effectiveAffinity = useMemo(() => {
    if (affinity === null || !isAuthenticated) return affinity;
    const mutuallyCompleted = complexities
      .filter(c => progressMap[c.uuid] === 100 && myProgressMap[c.uuid] === 100)
      .sort((a, b) => b.complexity - a.complexity);
    if (mutuallyCompleted.length > 0) {
      const highest = mutuallyCompleted[0];
      return complexityAffinityMap[highest.uuid] ?? affinity;
    }
    return affinity;
  }, [affinity, isAuthenticated, complexities, progressMap, myProgressMap, complexityAffinityMap]);

  return {
    state: {
      complexities,
      selectedComplexity,
      selectedSection,
      displaySections,
      currentConditioners,
      currentAxes,
      myAxisAnswers,
      myConditionerAnswers,
      theirAxisAnswers,
      theirConditionerAnswers,
      answers: theirAxisAnswers,
      axisAffinityMap,
      complexityAffinityMap,
      sectionAffinityMap,
      progressMap,
      myProgressMap,
      selectedComplexityObj,
      selectedProgress,
      dependencyNameMap,
      CONTEXT_SECTION_UUID,
      answerData,
      affinity: effectiveAffinity,
    },
    loading: {
      isGlobalLoading: (!isInitialized && complexities.length === 0) || isLoadingAnswer,
      isSectionLoading: false,
    },
    actions: {
      selectComplexity: setSelectedComplexity,
      selectSection: setSelectedSection,
      saveAnswer: handleSaveAnswer,
      deleteAnswer: handleDeleteAnswer,
      saveConditioner: handleSaveConditioner,
    },
  };
}
