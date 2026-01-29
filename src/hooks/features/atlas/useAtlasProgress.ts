import { useMemo } from 'react';
import { useAtlasStore } from '@/store/useAtlasStore';
import { TypeEnum } from '@/lib/client/models/TypeEnum';

interface UseAtlasProgressProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checkVisibility: (rules: any) => boolean;
}

export function useAtlasProgress({ checkVisibility }: UseAtlasProgressProps) {
  const { complexities, sections, axes, conditioners, conditionerAnswers, answers } = useAtlasStore();

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
        if (cond.type !== TypeEnum.AXIS_RANGE && checkVisibility(cond.condition_rules)) {
          totalItems++;
          contextTotal++;
          if (conditionerAnswers[cond.uuid]) {
            answeredItems++;
            contextAnswered++;
          }
        }
      });

      if (contextTotal > 0) {
        sMap[`context_${c.uuid}`] = Math.round((contextAnswered / contextTotal) * 100);
      }

      compSections.forEach(sec => {
        let secTotal = 0;
        let secAnswered = 0;

        if (checkVisibility(sec.condition_rules)) {
          const secAxes = axes[sec.uuid] || [];
          secAxes.forEach(axis => {
            if (checkVisibility(axis.condition_rules)) {
              secTotal++;
              totalItems++;
              if (answers[axis.uuid]) {
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
  }, [complexities, sections, axes, answers, conditioners, conditionerAnswers, checkVisibility]);

  return { progressMap, sectionProgressMap };
}
