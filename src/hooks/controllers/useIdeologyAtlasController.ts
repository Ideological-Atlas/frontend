import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAtlasStore, type AnswerData, type AnswerUpdatePayload } from '@/store/useAtlasStore';
import { IdeologiesService } from '@/lib/client/services/IdeologiesService';
import { UsersService } from '@/lib/client/services/UsersService';
import type { IdeologyDetail } from '@/lib/client/models/IdeologyDetail';
import type { IdeologyAxisDefinitionUpsertRequest } from '@/lib/client/models/IdeologyAxisDefinitionUpsertRequest';
import type { IdeologyConditionerDefinitionUpsertRequest } from '@/lib/client/models/IdeologyConditionerDefinitionUpsertRequest';
import { checkVisibility } from '@/lib/domain/atlas-logic';
import { TypeEnum } from '@/lib/client/models/TypeEnum';
import type { IdeologySection } from '@/lib/client/models/IdeologySection';
import type { AxisBreakdown } from '@/lib/client/models/AxisBreakdown';

const normalizeUuid = (uuid: string) => (uuid ? uuid.replace(/-/g, '') : '');

export function useIdeologyAtlasController(ideologyUuid: string, contextSectionLabel: string) {
  const {
    complexities,
    conditioners,
    sections,
    axes,
    isInitialized,
    fetchAllData,
    answers: myUserAnswers,
    conditionerAnswers: myUserCondAnswers,
    saveAnswer: saveUserAnswer,
    deleteAnswer: deleteUserAnswer,
    saveConditionerAnswer: saveUserCondAnswer,
    deleteConditionerAnswer: deleteUserCondAnswer,
  } = useAtlasStore();

  const { user, isAuthenticated } = useAuthStore();
  const isVerified = user?.is_verified ?? false;
  const isSuperUser = user?.is_superuser ?? false;

  const [ideologyData, setIdeologyData] = useState<IdeologyDetail | null>(null);
  const [isLoadingIdeology, setIsLoadingIdeology] = useState(true);

  // Respuestas de la Ideología (Target)
  const [axisAnswers, setAxisAnswers] = useState<Record<string, AnswerData>>({});
  const [conditionerAnswers, setConditionerAnswers] = useState<Record<string, string>>({});

  // Datos de Afinidad (Solo si logueado)
  const [axisAffinityMap, setAxisAffinityMap] = useState<
    Record<string, { affinity: number | null; my_answer: AnswerData | null }>
  >({});
  const [complexityAffinityMap, setComplexityAffinityMap] = useState<Record<string, number | null>>({});
  const [sectionAffinityMap, setSectionAffinityMap] = useState<Record<string, number | null>>({});

  const [selectedComplexity, setSelectedComplexity] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Cargar estructura global y respuestas del usuario si corresponde
  useEffect(() => {
    fetchAllData(isAuthenticated, isVerified);
  }, [isInitialized, fetchAllData, isAuthenticated, isVerified]);

  // Función para cargar afinidad (separada para llamarla independientemente)
  const refreshAffinity = useCallback(async () => {
    if (!isAuthenticated || !ideologyUuid) return;

    try {
      const affinityData = await UsersService.usersAffinityIdeologyRetrieve(ideologyUuid);

      const axMap: Record<string, { affinity: number | null; my_answer: AnswerData | null }> = {};
      const compMap: Record<string, number | null> = {};
      const secMap: Record<string, number | null> = {};

      if (affinityData.complexities) {
        affinityData.complexities.forEach(compAff => {
          if (compAff.complexity?.uuid) compMap[compAff.complexity.uuid] = compAff.affinity;
          if (compAff.sections) {
            compAff.sections.forEach(secAff => {
              if (secAff.section?.uuid) secMap[secAff.section.uuid] = secAff.affinity;
              if (secAff.axes) {
                secAff.axes.forEach((item: AxisBreakdown) => {
                  if (item.axis?.uuid) {
                    axMap[item.axis.uuid] = {
                      affinity: item.affinity,
                      my_answer: null,
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
      console.error('Error fetching affinity:', err);
    }
  }, [isAuthenticated, ideologyUuid]);

  // Cargar datos de la ideología (Siempre, logueado o no)
  const refreshIdeology = useCallback(async () => {
    if (!ideologyUuid) return;
    try {
      setIsLoadingIdeology(true);
      // Esta llamada es fundamental para obtener la estructura y respuestas de la ideología
      const data = await IdeologiesService.ideologiesRetrieve(ideologyUuid);
      setIdeologyData(data);

      const newAxisAnswers: Record<string, AnswerData> = {};
      data.axis_definitions.forEach(def => {
        newAxisAnswers[def.axis_uuid] = {
          value: def.value ?? null,
          margin_left: def.margin_left,
          margin_right: def.margin_right,
          is_indifferent: def.is_indifferent ?? false,
        };
      });

      const newCondAnswers: Record<string, string> = {};
      data.conditioner_definitions.forEach(def => {
        newCondAnswers[def.conditioner_uuid] = def.answer;
      });

      setAxisAnswers(newAxisAnswers);
      setConditionerAnswers(newCondAnswers);

      // Si además estamos logueados, pedimos la afinidad
      if (isAuthenticated) {
        refreshAffinity();
      }
    } catch (error) {
      console.error('Error fetching ideology definitions:', error);
    } finally {
      setIsLoadingIdeology(false);
    }
  }, [ideologyUuid, isAuthenticated, refreshAffinity]);

  useEffect(() => {
    refreshIdeology();
  }, [refreshIdeology]);

  useEffect(() => {
    if (complexities.length > 0 && !selectedComplexity) {
      const sorted = [...complexities].sort((a, b) => a.complexity - b.complexity);
      setSelectedComplexity(sorted[0].uuid);
    }
  }, [complexities, selectedComplexity]);

  const combinedConditionerAnswers = useMemo(() => {
    const computed: Record<string, string> = {};
    const allConditioners = Object.values(conditioners).flat();
    const normSourceAxis: Record<string, AnswerData> = {};

    // Usamos las respuestas de la ideología para calcular su estructura visible
    Object.entries(axisAnswers).forEach(([k, v]) => {
      normSourceAxis[normalizeUuid(k)] = v;
    });

    allConditioners.forEach(cond => {
      if (cond.type === TypeEnum.AXIS_RANGE && cond.source_axis_uuid) {
        const sourceUuid = normalizeUuid(cond.source_axis_uuid);
        const axisAnswer = normSourceAxis[sourceUuid];
        let result = 'false';

        if (axisAnswer) {
          if (axisAnswer.is_indifferent) {
            result = 'true';
          } else if (axisAnswer.value !== null) {
            const val = axisAnswer.value;
            const min = cond.axis_min_value ?? -Infinity;
            const max = cond.axis_max_value ?? Infinity;
            if (val > min && val <= max) result = 'true';
          }
        }
        computed[normalizeUuid(cond.uuid)] = result;
      }
    });

    const normCond: Record<string, string> = {};
    Object.entries(conditionerAnswers).forEach(([k, v]) => {
      normCond[normalizeUuid(k)] = v;
    });

    return { ...normCond, ...computed };
  }, [conditioners, axisAnswers, conditionerAnswers]);

  const visibilityChecker = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (rulesInput: any) => checkVisibility(rulesInput, combinedConditionerAnswers),
    [combinedConditionerAnswers],
  );

  const myVisibilityChecker = useMemo(() => {
    const computedVirtuals: Record<string, string> = {};
    const allConds = Object.values(conditioners).flat();
    const normMyAxis: Record<string, AnswerData> = {};

    Object.entries(myUserAnswers).forEach(([k, v]) => {
      normMyAxis[normalizeUuid(k)] = v;
    });

    allConds.forEach(cond => {
      if (cond.type === TypeEnum.AXIS_RANGE && cond.source_axis_uuid) {
        const sourceUuid = normalizeUuid(cond.source_axis_uuid);
        const ax = normMyAxis[sourceUuid];
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

    const normMyCond: Record<string, string> = {};
    Object.entries(myUserCondAnswers).forEach(([k, v]) => (normMyCond[normalizeUuid(k)] = v));
    const combined = { ...normMyCond, ...computedVirtuals };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (rules: any) => checkVisibility(rules, combined);
  }, [conditioners, myUserAnswers, myUserCondAnswers]);

  const displaySections: IdeologySection[] = useMemo(() => {
    const rawSections = selectedComplexity ? sections[selectedComplexity] || [] : [];
    const rawConditioners = selectedComplexity ? conditioners[selectedComplexity] || [] : [];
    const filteredSections = rawSections.filter(section => visibilityChecker(section.condition_rules));
    const visibleConditioners = rawConditioners.filter(
      cond => cond.type !== TypeEnum.AXIS_RANGE && visibilityChecker(cond.condition_rules),
    );

    if (visibleConditioners.length > 0) {
      const contextSection: IdeologySection = {
        uuid: `context_${selectedComplexity}`,
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

  const isContextSelected = !!selectedSection && selectedSection.startsWith('context_');

  const currentConditioners = useMemo(() => {
    const raw = selectedComplexity ? conditioners[selectedComplexity] || [] : [];
    return raw.filter(cond => cond.type !== TypeEnum.AXIS_RANGE && visibilityChecker(cond.condition_rules));
  }, [selectedComplexity, conditioners, visibilityChecker]);

  const currentAxes = useMemo(() => {
    if (!selectedSection || isContextSelected) return [];
    const rawAxes = axes[selectedSection] || [];
    return rawAxes.filter(axis => visibilityChecker(axis.condition_rules));
  }, [selectedSection, axes, visibilityChecker, isContextSelected]);

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

  const handleSaveAnswer = async (axisUuid: string, data: AnswerUpdatePayload) => {
    if (isSuperUser) {
      // ADMIN
      setAxisAnswers(prev => ({
        ...prev,
        [axisUuid]: {
          value: data.value ?? prev[axisUuid]?.value ?? null,
          margin_left: data.margin_left ?? prev[axisUuid]?.margin_left,
          margin_right: data.margin_right ?? prev[axisUuid]?.margin_right,
          is_indifferent: data.is_indifferent ?? prev[axisUuid]?.is_indifferent,
        },
      }));

      try {
        await IdeologiesService.ideologiesDefinitionsAxisCreate(
          axisUuid,
          ideologyUuid,
          data as IdeologyAxisDefinitionUpsertRequest,
        );
      } catch (e) {
        console.error('Failed to save axis definition', e);
        refreshIdeology();
      }
    } else if (isAuthenticated) {
      // USER
      try {
        await saveUserAnswer(axisUuid, data, true, isVerified);
        if (isVerified) {
          refreshAffinity();
        }
      } catch (e) {
        console.error('Failed to save user answer', e);
      }
    }
  };

  const handleDeleteAnswer = async (axisUuid: string) => {
    if (isAuthenticated && !isSuperUser) {
      try {
        await deleteUserAnswer(axisUuid, true, isVerified);
        if (isVerified) {
          refreshAffinity();
        }
      } catch (e) {
        console.error('Failed to delete user answer', e);
      }
    }
  };

  const handleSaveConditioner = async (condUuid: string, value: string) => {
    if (isSuperUser) {
      // ADMIN
      setConditionerAnswers(prev => ({ ...prev, [condUuid]: value }));
      try {
        await IdeologiesService.ideologiesDefinitionsConditionerCreate(condUuid, ideologyUuid, {
          answer: value,
        } as IdeologyConditionerDefinitionUpsertRequest);
      } catch (e) {
        console.error('Failed to save conditioner definition', e);
        refreshIdeology();
      }
    } else if (isAuthenticated) {
      // USER
      try {
        await saveUserCondAnswer(condUuid, value, true, isVerified);
      } catch (e) {
        console.error('Failed to save user conditioner answer', e);
      }
    }
  };

  const handleDeleteConditioner = async (condUuid: string) => {
    if (isAuthenticated && !isSuperUser) {
      try {
        await deleteUserCondAnswer(condUuid, true, isVerified);
      } catch (e) {
        console.error('Failed to delete user conditioner answer', e);
      }
    }
  };

  const { progressMap, sectionProgressMap } = useMemo(() => {
    const cMap: Record<string, number> = {};
    const sMap: Record<string, number> = {};

    complexities.forEach(c => {
      const compSections = sections[c.uuid] || [];
      const compConditioners = conditioners[c.uuid] || [];
      let totalItems = 0;
      let answeredItems = 0;
      let contextTotal = 0;
      let contextAnswered = 0;

      compConditioners.forEach(cond => {
        if (cond.type !== TypeEnum.AXIS_RANGE && visibilityChecker(cond.condition_rules)) {
          totalItems++;
          contextTotal++;
          if (conditionerAnswers[cond.uuid]) {
            answeredItems++;
            contextAnswered++;
          }
        }
      });

      if (contextTotal > 0) sMap[`context_${c.uuid}`] = Math.round((contextAnswered / contextTotal) * 100);

      compSections.forEach(sec => {
        let secTotal = 0;
        let secAnswered = 0;
        if (visibilityChecker(sec.condition_rules)) {
          const secAxes = axes[sec.uuid] || [];
          secAxes.forEach(axis => {
            if (visibilityChecker(axis.condition_rules)) {
              secTotal++;
              totalItems++;
              const ans = axisAnswers[axis.uuid];
              if (ans && (ans.value !== null || ans.is_indifferent)) {
                secAnswered++;
                answeredItems++;
              }
            }
          });
        }
        sMap[sec.uuid] = secTotal > 0 ? Math.round((secAnswered / secTotal) * 100) : 0;
      });
      cMap[c.uuid] = totalItems > 0 ? Math.round((answeredItems / totalItems) * 100) : 0;
    });
    return { progressMap: cMap, sectionProgressMap: sMap };
  }, [complexities, sections, axes, axisAnswers, conditioners, conditionerAnswers, visibilityChecker]);

  const myProgressMap = useMemo(() => {
    const map: Record<string, number> = {};
    if (!isAuthenticated) return map;

    complexities.forEach(c => {
      const compSections = sections[c.uuid] || [];
      let totalItems = 0;
      let answeredItems = 0;

      compSections.forEach(sec => {
        if (myVisibilityChecker(sec.condition_rules)) {
          const secAxes = axes[sec.uuid] || [];
          secAxes.forEach(axis => {
            if (myVisibilityChecker(axis.condition_rules)) {
              totalItems++;
              const ans = myUserAnswers[axis.uuid];
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
  }, [isAuthenticated, complexities, sections, axes, myUserAnswers, myVisibilityChecker]);

  const sortedComplexities = useMemo(
    () => [...complexities].sort((a, b) => a.complexity - b.complexity),
    [complexities],
  );
  const currentSectionIndex = displaySections.findIndex(s => s.uuid === selectedSection);
  const currentCompIndex = sortedComplexities.findIndex(c => c.uuid === selectedComplexity);

  const hasNextSection = currentSectionIndex < displaySections.length - 1;
  const hasNextLevel = !hasNextSection && currentCompIndex < sortedComplexities.length - 1;
  const hasPrevSection = currentSectionIndex > 0;
  const hasPrevLevel = !hasPrevSection && currentCompIndex > 0;

  const handleNext = () => {
    if (hasNextSection) setSelectedSection(displaySections[currentSectionIndex + 1].uuid);
    else if (hasNextLevel) setSelectedComplexity(sortedComplexities[currentCompIndex + 1].uuid);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    if (hasPrevSection) setSelectedSection(displaySections[currentSectionIndex - 1].uuid);
    else if (hasPrevLevel) setSelectedComplexity(sortedComplexities[currentCompIndex - 1].uuid);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJumpToSection = (index: number) => {
    if (index >= 0 && index < displaySections.length) {
      setSelectedSection(displaySections[index].uuid);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    state: {
      ideologyData,
      complexities,
      selectedComplexity,
      selectedSection,
      displaySections,
      currentConditioners,
      currentAxes,
      axisAnswers,
      conditionerAnswers,
      myUserAnswers,
      progressMap,
      myProgressMap,
      sectionProgressMap,
      axisAffinityMap,
      complexityAffinityMap,
      sectionAffinityMap,
      dependencyNameMap,
      isContextSelected,
      isSuperUser,
      selectedComplexityObj: complexities.find(c => c.uuid === selectedComplexity),
      selectedProgress: selectedComplexity ? progressMap[selectedComplexity] || 0 : 0,
      navigation: {
        showNext: hasNextSection || hasNextLevel,
        showPrevious: hasPrevSection || hasPrevLevel,
        isNextLevel: hasNextLevel,
        currentIndex: currentSectionIndex,
        totalSteps: displaySections.length,
      },
    },
    loading: {
      isGlobalLoading: (!isInitialized && complexities.length === 0) || isLoadingIdeology,
    },
    actions: {
      selectComplexity: setSelectedComplexity,
      selectSection: setSelectedSection,
      saveAnswer: handleSaveAnswer,
      deleteAnswer: handleDeleteAnswer,
      saveConditioner: handleSaveConditioner,
      deleteConditioner: handleDeleteConditioner,
      next: handleNext,
      previous: handlePrevious,
      jumpToSection: handleJumpToSection,
    },
  };
}
