import { useEffect, useMemo } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAtlasStore, type AnswerUpdatePayload } from '@/store/useAtlasStore';
import { useAtlasVisibility } from '@/hooks/features/atlas/useAtlasVisibility';
import { useAtlasNavigation } from '@/hooks/features/atlas/useAtlasNavigation';
import { useAtlasProgress } from '@/hooks/features/atlas/useAtlasProgress';
import { useAtlasSharing } from '@/hooks/features/atlas/useAtlasSharing';

const normalizeUuid = (uuid: string) => (uuid ? uuid.replace(/-/g, '') : '');

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

  const { checkVisibility } = useAtlasVisibility();

  const {
    selectedComplexity,
    setSelectedComplexity,
    selectedSection,
    setSelectedSection,
    displaySections,
    currentConditioners,
    currentAxes,
    isContextSelected,
  } = useAtlasNavigation({ checkVisibility, contextSectionLabel });

  const { progressMap, sectionProgressMap } = useAtlasProgress({ checkVisibility });

  const { isShareModalOpen, shareUrl, isGeneratingShare, handleShare, closeShareModal } = useAtlasSharing();

  useEffect(() => {
    if (!isInitialized) {
      fetchAllData(isAuthenticated);
    }
  }, [isInitialized, isAuthenticated, fetchAllData]);

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
    selectComplexity: setSelectedComplexity,
    selectSection: setSelectedSection,
    share: handleShare,
    closeShareModal,
  };

  const loadingState = {
    isGlobalLoading: !isInitialized && complexities.length === 0,
    isSectionLoading: selectedComplexity ? !sections[selectedComplexity] : true,
    isAxesLoading: selectedSection && !isContextSelected ? !axes[selectedSection] : false,
    isGeneratingShare,
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
      sectionProgressMap,
      selectedComplexityObj,
      selectedProgress,
      dependencyNameMap,
      isContextSelected,
      isShareModalOpen,
      shareUrl,
    },
    loading: loadingState,
    actions: handlers,
  };
}
