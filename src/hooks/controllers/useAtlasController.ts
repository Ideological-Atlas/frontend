import { useEffect, useMemo, useCallback, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAtlasStore, type AnswerUpdatePayload } from '@/store/useAtlasStore';
import { useAtlasVisibility } from '@/hooks/features/atlas/useAtlasVisibility';
import { useAtlasNavigation } from '@/hooks/features/atlas/useAtlasNavigation';
import { useAtlasProgress } from '@/hooks/features/atlas/useAtlasProgress';
import { useAtlasSharing } from '@/hooks/features/atlas/useAtlasSharing';
import type { IdeologySection } from '@/lib/client/models/IdeologySection';

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

  const [isIncompleteModalOpen, setIsIncompleteModalOpen] = useState(false);
  const [incompleteSections, setIncompleteSections] = useState<IdeologySection[]>([]);

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

  const sortedComplexities = useMemo(() => {
    return [...complexities].sort((a, b) => a.complexity - b.complexity);
  }, [complexities]);

  const navigationState = useMemo(() => {
    const currentSectionIndex = displaySections.findIndex(s => s.uuid === selectedSection);
    const currentCompIndex = sortedComplexities.findIndex(c => c.uuid === selectedComplexity);

    const hasNextSection = currentSectionIndex < displaySections.length - 1;
    const hasNextLevel = !hasNextSection && currentCompIndex < sortedComplexities.length - 1;
    const hasPrevSection = currentSectionIndex > 0;
    const hasPrevLevel = !hasPrevSection && currentCompIndex > 0;

    return {
      hasNextSection,
      hasNextLevel,
      hasPrevSection,
      hasPrevLevel,
      currentSectionIndex: currentSectionIndex !== -1 ? currentSectionIndex : 0,
      totalSections: displaySections.length,
      currentCompIndex,
    };
  }, [displaySections, selectedSection, sortedComplexities, selectedComplexity]);

  const forceNextLevel = useCallback(() => {
    setIsIncompleteModalOpen(false);
    setSelectedComplexity(sortedComplexities[navigationState.currentCompIndex + 1].uuid);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigationState, sortedComplexities, setSelectedComplexity]);

  const handleNext = useCallback(() => {
    if (navigationState.hasNextSection) {
      setSelectedSection(displaySections[navigationState.currentSectionIndex + 1].uuid);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (navigationState.hasNextLevel) {
      const incomplete = displaySections.filter(sec => {
        const progress = sectionProgressMap[sec.uuid] || 0;
        return progress < 100;
      });

      if (incomplete.length > 0) {
        setIncompleteSections(incomplete);
        setIsIncompleteModalOpen(true);
      } else {
        forceNextLevel();
      }
    }
  }, [navigationState, displaySections, sectionProgressMap, forceNextLevel, setSelectedSection]);

  const handlePrevious = useCallback(() => {
    if (navigationState.hasPrevSection) {
      setSelectedSection(displaySections[navigationState.currentSectionIndex - 1].uuid);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (navigationState.hasPrevLevel) {
      setSelectedComplexity(sortedComplexities[navigationState.currentCompIndex - 1].uuid);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [navigationState, displaySections, sortedComplexities, setSelectedSection, setSelectedComplexity]);

  const handleJumpToSection = useCallback(
    (indexOrUuid: number | string) => {
      let targetUuid: string | null = null;

      if (typeof indexOrUuid === 'number') {
        if (indexOrUuid >= 0 && indexOrUuid < displaySections.length) {
          targetUuid = displaySections[indexOrUuid].uuid;
        }
      } else {
        targetUuid = indexOrUuid;
      }

      if (targetUuid) {
        setSelectedSection(targetUuid);
        setIsIncompleteModalOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [displaySections, setSelectedSection],
  );

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
    next: handleNext,
    previous: handlePrevious,
    jumpToSection: handleJumpToSection,

    closeIncompleteModal: () => setIsIncompleteModalOpen(false),
    confirmNextLevel: forceNextLevel,
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
      isIncompleteModalOpen,
      incompleteSections,
      navigation: {
        showNext: navigationState.hasNextSection || navigationState.hasNextLevel,
        showPrevious: navigationState.hasPrevSection || navigationState.hasPrevLevel,
        isNextLevel: navigationState.hasNextLevel,
        currentIndex: navigationState.currentSectionIndex,
        totalSteps: navigationState.totalSections,
      },
    },
    loading: loadingState,
    actions: handlers,
  };
}
