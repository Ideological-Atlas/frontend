import { useCallback, useMemo } from 'react';
import { useAtlasStore } from '@/store/useAtlasStore';
import { TypeEnum } from '@/lib/client/models/TypeEnum';
import type { AnswerData } from '@/types/atlas';
import type { IdeologyConditioner } from '@/lib/client/models/IdeologyConditioner';
import type { IdeologySectionConditioner } from '@/lib/client/models/IdeologySectionConditioner';
import type { IdeologyAxisConditioner } from '@/lib/client/models/IdeologyAxisConditioner';

interface LocalConditionerRule {
  uuid?: string;
  source_conditioner_uuid: string;
  condition_values: string | number | boolean | (string | number | boolean)[];
  conditioner?: IdeologyConditioner;
}

type ConditionRule = IdeologySectionConditioner | IdeologyAxisConditioner | LocalConditionerRule;

const normalizeUuid = (uuid: string) => (uuid ? uuid.replace(/-/g, '') : '');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseRules = (rules: any): ConditionRule[] => {
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

export function useAtlasVisibility() {
  const { conditioners, answers, conditionerAnswers } = useAtlasStore();

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

        if (axisAnswer) {
          if (axisAnswer.is_indifferent) {
            result = 'true';
          } else if (axisAnswer.value !== null) {
            const val = axisAnswer.value;
            const min = cond.axis_min_value ?? -Infinity;
            const max = cond.axis_max_value ?? Infinity;

            if (val > min && val <= max) {
              result = 'true';
            }
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (rulesInput: any) => {
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return accepted.includes(userAnswer as any);
        }
        return accepted === userAnswer;
      });
    },
    [combinedConditionerAnswers],
  );

  return {
    checkVisibility,
    combinedConditionerAnswers,
  };
}
