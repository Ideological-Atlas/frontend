import { useState, useEffect, useMemo, useCallback } from 'react';
import { IdeologiesService } from '@/lib/client/services/IdeologiesService';
import { AnswersService } from '@/lib/client/services/AnswersService';
import { useAuthStore } from '@/store/useAuthStore';
import { useAtlasStore } from '@/store/useAtlasStore';
import type { IdeologyList } from '@/lib/client/models/IdeologyList';
import type { IdeologyAffinity } from '@/lib/client/models/IdeologyAffinity';
import confetti from 'canvas-confetti';

export function useDiscoveryController() {
  const { isAuthenticated, user } = useAuthStore();
  const { answers, conditionerAnswers } = useAtlasStore();

  const [ideologies, setIdeologies] = useState<IdeologyList[]>([]);
  const [affinities, setAffinities] = useState<Record<string, IdeologyAffinity>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
  const [winner, setWinner] = useState<IdeologyList | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getRelevantScore = useCallback((affinityData?: IdeologyAffinity) => {
    if (!affinityData) return 0;

    if (affinityData.total_affinity !== null && affinityData.total_affinity !== undefined) {
      return affinityData.total_affinity;
    }

    if (affinityData.complexities && affinityData.complexities.length > 0) {
      const sortedByComplexity = [...affinityData.complexities].sort((a, b) => {
        const levelA = a.complexity?.complexity ?? -1;
        const levelB = b.complexity?.complexity ?? -1;
        return levelB - levelA;
      });

      const bestMatch = sortedByComplexity.find(c => c.affinity !== null && c.affinity !== undefined);

      if (bestMatch) {
        return bestMatch.affinity ?? 0;
      }
    }

    return 0;
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const ideologiesResponse = await IdeologiesService.ideologiesList(undefined, 100);
        if (!mounted) return;

        setIdeologies(ideologiesResponse.results);
        setIsGlobalLoading(false);

        const initialLoading: Record<string, boolean> = {};
        ideologiesResponse.results.forEach(ideology => {
          initialLoading[ideology.uuid] = true;
        });
        setLoadingMap(initialLoading);

        let completedAnswerUuid: string | undefined = undefined;

        if (!isAuthenticated || (user && !user.is_verified)) {
          try {
            const axisList = Object.entries(answers).map(([uuid, data]) => ({
              uuid,
              value: data.value,
              margin_left: data.margin_left ?? 0,
              margin_right: data.margin_right ?? 0,
            }));

            const conditionersList = Object.entries(conditionerAnswers).map(([uuid, value]) => ({
              uuid,
              value,
            }));

            if (axisList.length > 0 || conditionersList.length > 0) {
              const snapshot = await AnswersService.answersCompletedGenerateCreate({
                axis: axisList,
                conditioners: conditionersList,
              });
              completedAnswerUuid = snapshot.uuid;
            }
          } catch (e) {
            console.error('Failed to generate anonymous snapshot', e);
          }
        }

        let completedCount = 0;
        const total = ideologiesResponse.results.length;
        let currentAffinitiesRef: Record<string, IdeologyAffinity> = {};

        ideologiesResponse.results.forEach(ideology => {
          IdeologiesService.ideologiesAffinityRetrieve(ideology.uuid, completedAnswerUuid)
            .then(affinityData => {
              if (!mounted) return;

              setAffinities(prev => {
                const next = { ...prev, [ideology.uuid]: affinityData };
                currentAffinitiesRef = next;
                return next;
              });

              setLoadingMap(prev => ({ ...prev, [ideology.uuid]: false }));
              completedCount++;

              if (completedCount === total) {
                setTimeout(() => finishDiscovery(ideologiesResponse.results, currentAffinitiesRef), 500);
              }
            })
            .catch(err => {
              console.error(`Error fetching affinity for ${ideology.name}`, err);
              if (!mounted) return;
              setLoadingMap(prev => ({ ...prev, [ideology.uuid]: false }));
              completedCount++;

              if (completedCount === total) {
                setTimeout(() => finishDiscovery(ideologiesResponse.results, currentAffinitiesRef), 500);
              }
            });
        });
      } catch (error) {
        console.error(error);
        setIsGlobalLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const finishDiscovery = (allIdeologies: IdeologyList[], finalAffinities: Record<string, IdeologyAffinity>) => {
    const sorted = [...allIdeologies].sort((a, b) => {
      const scoreA = getRelevantScore(finalAffinities[a.uuid]);
      const scoreB = getRelevantScore(finalAffinities[b.uuid]);
      return scoreB - scoreA;
    });

    const top = sorted[0];
    const topScore = getRelevantScore(finalAffinities[top.uuid]);

    if (top && topScore > 0) {
      setWinner(top);
      setIsModalOpen(true);
      triggerConfetti(top.color || undefined);
    }
  };

  const triggerConfetti = (customColor?: string) => {
    const duration = 3000;
    const end = Date.now() + duration;

    const baseColors = ['#16a34a', '#3476d8', '#f1f5f9'];
    const colors = customColor ? [customColor, ...baseColors] : baseColors;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const sortedIdeologies = useMemo(() => {
    return [...ideologies].sort((a, b) => {
      const scoreA = getRelevantScore(affinities[a.uuid]);
      const scoreB = getRelevantScore(affinities[b.uuid]);

      const loadA = loadingMap[a.uuid];
      const loadB = loadingMap[b.uuid];

      if (loadA && !loadB) return 1;
      if (!loadA && loadB) return -1;

      return scoreB - scoreA;
    });
  }, [ideologies, affinities, loadingMap, getRelevantScore]);

  return {
    state: {
      ideologies: sortedIdeologies,
      affinities,
      loadingMap,
      isGlobalLoading,
      winner,
      isModalOpen,
      getRelevantScore,
    },
    actions: {
      closeModal: () => setIsModalOpen(false),
    },
  };
}
