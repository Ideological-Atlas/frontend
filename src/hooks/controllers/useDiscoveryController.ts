import { useState, useEffect, useMemo, useCallback } from 'react';
import { IdeologiesService } from '@/lib/client/services/IdeologiesService';
import { UsersService } from '@/lib/client/services/UsersService';
import type { IdeologyList } from '@/lib/client/models/IdeologyList';
import type { IdeologyAffinity } from '@/lib/client/models/IdeologyAffinity';
import confetti from 'canvas-confetti';

export function useDiscoveryController() {
  const [ideologies, setIdeologies] = useState<IdeologyList[]>([]);
  const [affinities, setAffinities] = useState<Record<string, IdeologyAffinity>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
  const [winner, setWinner] = useState<IdeologyList | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculamos el nivel de complejidad global más alto encontrado entre todas las afinidades cargadas
  const globalMaxComplexityLevel = useMemo(() => {
    let maxLevel = 0; // Por defecto nivel 0 (Moral)

    Object.values(affinities).forEach(affinityData => {
      affinityData.complexities?.forEach(c => {
        // Si hay afinidad en este nivel (no es null), es un candidato
        if (c.affinity !== null && c.affinity !== undefined) {
          const level = c.complexity?.complexity ?? 0;
          if (level > maxLevel) {
            maxLevel = level;
          }
        }
      });
    });

    return maxLevel;
  }, [affinities]);

  // Helper que devuelve la afinidad de una ideología ESPECÍFICAMENTE en el nivel global máximo
  const getRelevantScore = useCallback(
    (affinityData?: IdeologyAffinity) => {
      if (!affinityData || !affinityData.complexities) return 0;

      const targetLevelData = affinityData.complexities.find(
        c => (c.complexity?.complexity ?? 0) === globalMaxComplexityLevel,
      );

      return targetLevelData?.affinity ?? 0;
    },
    [globalMaxComplexityLevel],
  );

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const response = await IdeologiesService.ideologiesList(undefined, 100);
        if (!mounted) return;

        setIdeologies(response.results);
        setIsGlobalLoading(false);

        const initialLoading: Record<string, boolean> = {};
        response.results.forEach(ideology => {
          initialLoading[ideology.uuid] = true;
        });
        setLoadingMap(initialLoading);

        let completedCount = 0;
        const total = response.results.length;

        // Necesitamos una referencia local para saber cuándo terminamos
        // ya que el estado 'affinities' no se actualiza inmediatamente dentro del loop
        let currentAffinitiesRef: Record<string, IdeologyAffinity> = {};

        response.results.forEach(ideology => {
          UsersService.usersAffinityIdeologyRetrieve(ideology.uuid)
            .then(affinityData => {
              if (!mounted) return;

              setAffinities(prev => {
                const next = { ...prev, [ideology.uuid]: affinityData };
                currentAffinitiesRef = next; // Actualizamos ref local
                return next;
              });

              setLoadingMap(prev => ({ ...prev, [ideology.uuid]: false }));
              completedCount++;

              if (completedCount === total) {
                setTimeout(() => finishDiscovery(response.results, currentAffinitiesRef), 500);
              }
            })
            .catch(err => {
              console.error(`Error fetching affinity for ${ideology.name}`, err);
              if (!mounted) return;
              setLoadingMap(prev => ({ ...prev, [ideology.uuid]: false }));
              completedCount++;

              if (completedCount === total) {
                setTimeout(() => finishDiscovery(response.results, currentAffinitiesRef), 500);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finishDiscovery = (allIdeologies: IdeologyList[], finalAffinities: Record<string, IdeologyAffinity>) => {
    // 1. Calcular el Max Level GLOBAL usando las afinidades finales
    let maxLevel = 0;
    Object.values(finalAffinities).forEach(affinityData => {
      affinityData.complexities?.forEach(c => {
        if (c.affinity !== null && c.affinity !== undefined) {
          const level = c.complexity?.complexity ?? 0;
          if (level > maxLevel) maxLevel = level;
        }
      });
    });

    // 2. Ordenar usando ese nivel
    const sorted = [...allIdeologies].sort((a, b) => {
      const affA = finalAffinities[a.uuid];
      const affB = finalAffinities[b.uuid];

      const scoreA = affA?.complexities?.find(c => (c.complexity?.complexity ?? 0) === maxLevel)?.affinity ?? 0;
      const scoreB = affB?.complexities?.find(c => (c.complexity?.complexity ?? 0) === maxLevel)?.affinity ?? 0;

      return scoreB - scoreA;
    });

    const top = sorted[0];
    const topAffinityData = finalAffinities[top.uuid];
    const topScore =
      topAffinityData?.complexities?.find(c => (c.complexity?.complexity ?? 0) === maxLevel)?.affinity ?? 0;

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
