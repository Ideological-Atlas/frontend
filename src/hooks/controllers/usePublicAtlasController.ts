import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAnswersStore } from '@/store/useAnswersStore';
import { useAtlasStore, type AnswerUpdatePayload } from '@/store/useAtlasStore';
import { AnswersService } from '@/lib/client/services/AnswersService';
import type { CompletedAnswer } from '@/lib/client/models/CompletedAnswer';
import type { AnswerData } from '@/types/atlas';
import { checkVisibility } from '@/lib/domain/atlas-logic';
import type { IdeologySection } from '@/lib/client/models/IdeologySection';
import { TypeEnum } from '@/lib/client/models/TypeEnum';
import type { AxisBreakdown } from '@/lib/client/models/AxisBreakdown';

const normalizeUuid = (uuid: string) => (uuid ? uuid.replace(/-/g, '') : '');

export function usePublicAtlasController(targetUuid: string, contextLabel: string) {
  const { isAuthenticated, accessToken, user } = useAuthStore();
  const isVerified = user?.is_verified ?? false;
  const { setAnonymousUuid, anonymousAnswerUuid } = useAnswersStore();

  const {
    complexities,
    sections,
    conditioners,
    axes,
    isInitialized,
    fetchAllData,
    answers: myLocalAnswers,
    conditionerAnswers: myLocalConditionerAnswers,
    saveAnswer: saveLocalAnswer,
    saveConditionerAnswer: saveLocalConditionerAnswer,
    deleteAnswer: deleteLocalAnswer,
    deleteConditionerAnswer: deleteLocalConditionerAnswer,
  } = useAtlasStore();

  const [state, setState] = useState({
    answerData: null as CompletedAnswer | null,
    affinity: null as number | null,
    theirAxisAnswers: {} as Record<string, AnswerData>,
    theirConditionerAnswers: {} as Record<string, string>,
    myAxisAnswers: myLocalAnswers,
    myConditionerAnswers: myLocalConditionerAnswers,
    complexityAffinityMap: {} as Record<string, number | null>,
    sectionAffinityMap: {} as Record<string, number | null>,
    axisAffinityMap: {} as Record<string, AxisBreakdown>,
    selectedComplexity: null as string | null,
    selectedSection: null as string | null,
    isContextSelected: false,
  });

  const [loading, setLoading] = useState({
    isGlobalLoading: true,
    isSectionLoading: false,
  });

  useEffect(() => {
    if (!isInitialized) {
      fetchAllData(isAuthenticated, isVerified);
    }
  }, [isInitialized, isAuthenticated, isVerified, fetchAllData]);

  useEffect(() => {
    if (complexities.length > 0 && !state.selectedComplexity) {
      const sorted = [...complexities].sort((a, b) => a.complexity - b.complexity);
      setState(prev => ({ ...prev, selectedComplexity: sorted[0].uuid }));
    }
  }, [complexities, state.selectedComplexity]);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      myAxisAnswers: myLocalAnswers,
      myConditionerAnswers: myLocalConditionerAnswers,
    }));
  }, [myLocalAnswers, myLocalConditionerAnswers]);

  const combinedTargetAnswers = useMemo(() => {
    const computedVirtuals: Record<string, string> = {};
    const normTargetAxis: Record<string, AnswerData> = {};

    Object.entries(state.theirAxisAnswers).forEach(([k, v]) => {
      normTargetAxis[normalizeUuid(k)] = v;
    });

    const allConditioners = Object.values(conditioners).flat();

    allConditioners.forEach(cond => {
      if (cond.type === TypeEnum.AXIS_RANGE && cond.source_axis_uuid) {
        const sourceUuid = normalizeUuid(cond.source_axis_uuid);
        const ax = normTargetAxis[sourceUuid];
        let res = 'false';
        if (ax) {
          if (ax.is_indifferent) res = 'true';
          else if (ax.value !== null) {
            if (ax.value > (cond.axis_min_value ?? -Infinity) && ax.value <= (cond.axis_max_value ?? Infinity)) {
              res = 'true';
            }
          }
        }
        computedVirtuals[normalizeUuid(cond.uuid)] = res;
      }
    });

    const normTargetCond: Record<string, string> = {};
    Object.entries(state.theirConditionerAnswers).forEach(([k, v]) => (normTargetCond[normalizeUuid(k)] = v));

    return { ...normTargetCond, ...computedVirtuals };
  }, [state.theirAxisAnswers, state.theirConditionerAnswers, conditioners]);

  const visibilityChecker = useCallback(
    (rules: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return checkVisibility(rules as any, combinedTargetAnswers);
    },
    [combinedTargetAnswers],
  );

  const updateAffinityCalculation = useCallback(
    async (forceSourceUuid?: string) => {
      try {
        let sourceUuid = forceSourceUuid;

        if (!sourceUuid && !isAuthenticated) {
          const currentStore = useAtlasStore.getState();
          const axisList = Object.entries(currentStore.answers).map(([uuid, data]) => ({
            uuid,
            value: data.value,
            margin_left: data.margin_left ?? 0,
            margin_right: data.margin_right ?? 0,
          }));

          const conditionersList = Object.entries(currentStore.conditionerAnswers).map(([uuid, value]) => ({
            uuid,
            value,
          }));

          try {
            const snapshot = await AnswersService.answersCompletedGenerateCreate({
              axis: axisList,
              conditioners: conditionersList,
            });
            sourceUuid = snapshot.uuid;
            setAnonymousUuid(snapshot.uuid);
          } catch (err) {
            console.error(err);
          }
        }

        if (!sourceUuid && !isAuthenticated && anonymousAnswerUuid) {
          sourceUuid = anonymousAnswerUuid;
        }

        const affinityData = await AnswersService.answersCompletedAffinityRetrieve(targetUuid, sourceUuid);

        const compMap: Record<string, number | null> = {};
        const secMap: Record<string, number | null> = {};
        const axMap: Record<string, AxisBreakdown> = {};
        const extractedTheirAnswers: Record<string, AnswerData> = {};

        if (affinityData.complexities) {
          affinityData.complexities.forEach(c => {
            if (c.complexity?.uuid) compMap[c.complexity.uuid] = c.affinity;
            c.sections.forEach(s => {
              if (s.section?.uuid) secMap[s.section.uuid] = s.affinity;
              s.axes.forEach(a => {
                if (a.axis?.uuid) {
                  axMap[a.axis.uuid] = a;
                  if (a.their_answer) {
                    extractedTheirAnswers[a.axis.uuid] = {
                      value: a.their_answer.value,
                      margin_left: a.their_answer.margin_left,
                      margin_right: a.their_answer.margin_right,
                      is_indifferent: a.their_answer.is_indifferent,
                    };
                  }
                }
              });
            });
          });
        }

        setState(prev => ({
          ...prev,
          affinity: affinityData.total_affinity,
          complexityAffinityMap: compMap,
          sectionAffinityMap: secMap,
          axisAffinityMap: axMap,
          theirAxisAnswers: { ...prev.theirAxisAnswers, ...extractedTheirAnswers },
        }));
      } catch (error) {
        console.error(error);
      }
    },
    [isAuthenticated, anonymousAnswerUuid, setAnonymousUuid, targetUuid],
  );

  const fetchData = useCallback(async () => {
    if (!isInitialized) return;

    if (isAuthenticated && !accessToken) {
      return;
    }

    try {
      const publicData = await AnswersService.answersCompletedRetrieve(targetUuid);

      const theirAxis = publicData.answers?.axis_answers || {};
      const theirCond = publicData.answers?.conditioners_answers || {};

      if (Object.keys(theirAxis).length === 0 && Array.isArray(publicData.answers?.axis)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        publicData.answers.axis.forEach((item: any) => {
          theirAxis[item.uuid] = item;
        });
      }

      setState(prev => ({
        ...prev,
        answerData: publicData,
        theirAxisAnswers: theirAxis,
        theirConditionerAnswers: theirCond,
      }));

      await updateAffinityCalculation();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, isGlobalLoading: false }));
    }
  }, [isInitialized, isAuthenticated, accessToken, targetUuid, updateAffinityCalculation]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveAnswer = async (axisUuid: string, data: AnswerUpdatePayload) => {
    await saveLocalAnswer(axisUuid, data, isAuthenticated, isVerified);
    await updateAffinityCalculation();
  };

  const handleDeleteAnswer = async (axisUuid: string) => {
    await deleteLocalAnswer(axisUuid, isAuthenticated, isVerified);
    await updateAffinityCalculation();
  };

  const handleSaveConditioner = async (condUuid: string, value: string) => {
    await saveLocalConditionerAnswer(condUuid, value, isAuthenticated, isVerified);
    await updateAffinityCalculation();
  };

  const handleDeleteConditioner = async (condUuid: string) => {
    await deleteLocalConditionerAnswer(condUuid, isAuthenticated, isVerified);
    await updateAffinityCalculation();
  };

  const displaySections: IdeologySection[] = useMemo(() => {
    if (!state.selectedComplexity) return [];

    const rawSections = sections[state.selectedComplexity] || [];
    const rawConditioners = conditioners[state.selectedComplexity] || [];

    const filteredSections = rawSections.filter(section => visibilityChecker(section.condition_rules));
    const visibleConditioners = rawConditioners.filter(
      cond => cond.type !== TypeEnum.AXIS_RANGE && visibilityChecker(cond.condition_rules),
    );

    if (visibleConditioners.length > 0) {
      const contextSection: IdeologySection = {
        uuid: `context_${state.selectedComplexity}`,
        name: contextLabel,
        description: null,
        icon: 'info',
        condition_rules: [],
      };
      return [contextSection, ...filteredSections];
    }

    return filteredSections;
  }, [state.selectedComplexity, sections, conditioners, visibilityChecker, contextLabel]);

  useEffect(() => {
    if (displaySections.length > 0) {
      const isSelectedVisible = displaySections.some(s => s.uuid === state.selectedSection);
      if (!state.selectedSection || !isSelectedVisible) {
        setState(prev => ({ ...prev, selectedSection: displaySections[0].uuid }));
      }
    }
  }, [displaySections, state.selectedSection]);

  const isContextSelected = !!state.selectedSection && state.selectedSection.startsWith('context_');

  const currentConditioners = useMemo(() => {
    if (!state.selectedComplexity) return [];
    const raw = conditioners[state.selectedComplexity] || [];
    return raw.filter(cond => cond.type !== TypeEnum.AXIS_RANGE && visibilityChecker(cond.condition_rules));
  }, [state.selectedComplexity, conditioners, visibilityChecker]);

  const currentAxes = useMemo(() => {
    if (!state.selectedSection || isContextSelected) return [];
    const rawAxes = axes[state.selectedSection] || [];
    return rawAxes.filter(axis => visibilityChecker(axis.condition_rules));
  }, [state.selectedSection, axes, visibilityChecker, isContextSelected]);

  const { progressMap, sectionProgressMap, myProgressMap } = useMemo(() => {
    const cMapTheir: Record<string, number> = {};
    const cMapMy: Record<string, number> = {};
    const sMap: Record<string, number> = {};

    complexities.forEach(c => {
      const compSections = sections[c.uuid] || [];
      const compConditioners = conditioners[c.uuid] || [];

      let total = 0;
      let myCount = 0;
      let theirCount = 0;

      let contextTotal = 0;
      let contextTheir = 0;

      compConditioners.forEach(cond => {
        if (cond.type !== TypeEnum.AXIS_RANGE && visibilityChecker(cond.condition_rules)) {
          total++;
          contextTotal++;
          if (state.myConditionerAnswers[cond.uuid]) myCount++;
          if (state.theirConditionerAnswers[cond.uuid]) {
            theirCount++;
            contextTheir++;
          }
        }
      });

      if (contextTotal > 0) {
        sMap[`context_${c.uuid}`] = Math.round((contextTheir / contextTotal) * 100);
      } else {
        sMap[`context_${c.uuid}`] = 100;
      }

      compSections.forEach(sec => {
        const secAxes = axes[sec.uuid] || [];
        let secTotal = 0;
        let secTheir = 0;

        if (visibilityChecker(sec.condition_rules)) {
          secAxes.forEach(ax => {
            if (visibilityChecker(ax.condition_rules)) {
              secTotal++;
              total++;

              const myAns = state.myAxisAnswers[ax.uuid];
              if (myAns && (myAns.value !== null || myAns.is_indifferent)) myCount++;

              const theirAns = state.theirAxisAnswers[ax.uuid];
              if (theirAns && (theirAns.value !== null || theirAns.is_indifferent)) {
                secTheir++;
                theirCount++;
              }
            }
          });
        }

        sMap[sec.uuid] = secTotal > 0 ? Math.round((secTheir / secTotal) * 100) : 100;
      });

      cMapTheir[c.uuid] = total > 0 ? Math.round((theirCount / total) * 100) : 100;
      cMapMy[c.uuid] = total > 0 ? Math.round((myCount / total) * 100) : 0;
    });

    return { progressMap: cMapTheir, sectionProgressMap: sMap, myProgressMap: cMapMy };
  }, [
    complexities,
    sections,
    axes,
    conditioners,
    state.myAxisAnswers,
    state.myConditionerAnswers,
    state.theirAxisAnswers,
    state.theirConditionerAnswers,
    visibilityChecker,
  ]);

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

  const sortedComplexities = useMemo(
    () => [...complexities].sort((a, b) => a.complexity - b.complexity),
    [complexities],
  );
  const currentSectionIndex = displaySections.findIndex(s => s.uuid === state.selectedSection);
  const currentCompIndex = sortedComplexities.findIndex(c => c.uuid === state.selectedComplexity);

  const hasNextSection = currentSectionIndex < displaySections.length - 1;
  const hasNextLevel = !hasNextSection && currentCompIndex < sortedComplexities.length - 1;
  const hasPrevSection = currentSectionIndex > 0;
  const hasPrevLevel = !hasPrevSection && currentCompIndex > 0;

  const handleNext = () => {
    if (hasNextSection) setState(prev => ({ ...prev, selectedSection: displaySections[currentSectionIndex + 1].uuid }));
    else if (hasNextLevel)
      setState(prev => ({ ...prev, selectedComplexity: sortedComplexities[currentCompIndex + 1].uuid }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    if (hasPrevSection) setState(prev => ({ ...prev, selectedSection: displaySections[currentSectionIndex - 1].uuid }));
    else if (hasPrevLevel)
      setState(prev => ({ ...prev, selectedComplexity: sortedComplexities[currentCompIndex - 1].uuid }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJumpToSection = (index: number) => {
    if (index >= 0 && index < displaySections.length) {
      setState(prev => ({ ...prev, selectedSection: displaySections[index].uuid }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const hasLocalDataForMemo = Object.keys(myLocalAnswers).length > 0;

  const myProgressMapMemo = useMemo(() => {
    const map: Record<string, number> = {};
    complexities.forEach(c => (map[c.uuid] = hasLocalDataForMemo ? myProgressMap[c.uuid] || 0 : 0));
    return map;
  }, [complexities, hasLocalDataForMemo, myProgressMap]);

  const handlers = {
    selectComplexity: (uuid: string) => setState(prev => ({ ...prev, selectedComplexity: uuid })),
    selectSection: (uuid: string) => setState(prev => ({ ...prev, selectedSection: uuid })),
    next: handleNext,
    previous: handlePrevious,
    jumpToSection: handleJumpToSection,
    saveAnswer: handleSaveAnswer,
    deleteAnswer: handleDeleteAnswer,
    saveConditioner: handleSaveConditioner,
    deleteConditioner: handleDeleteConditioner,
  };

  return {
    state: {
      ...state,
      complexities,
      displaySections,
      currentAxes,
      currentConditioners,
      progressMap,
      sectionProgressMap,
      myProgressMap: myProgressMapMemo,
      dependencyNameMap,
      isContextSelected,
      selectedComplexityObj: complexities.find(c => c.uuid === state.selectedComplexity),
      selectedProgress: 100,

      navigation: {
        showNext: hasNextSection || hasNextLevel,
        showPrevious: hasPrevSection || hasPrevLevel,
        isNextLevel: hasNextLevel,
        currentIndex: currentSectionIndex,
        totalSteps: displaySections.length,
      },
    },
    loading: {
      ...loading,
      isGlobalLoading: loading.isGlobalLoading || (!isInitialized && complexities.length === 0),
    },
    actions: handlers,
  };
}
