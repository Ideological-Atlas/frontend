import type { IdeologySectionConditioner } from '@/lib/client/models/IdeologySectionConditioner';
import type { IdeologyAxisConditioner } from '@/lib/client/models/IdeologyAxisConditioner';
import type { IdeologyConditioner } from '@/lib/client/models/IdeologyConditioner';
import type { IdeologySection } from '@/lib/client/models/IdeologySection';
import type { IdeologyAxis } from '@/lib/client/models/IdeologyAxis';
import { TypeEnum } from '@/lib/client/models/TypeEnum';
import type { AnswerData } from '@/types/atlas';

interface LocalConditionerRule {
  uuid?: string;
  source_conditioner_uuid: string;
  condition_values: string | number | boolean | (string | number | boolean)[];
  conditioner?: IdeologyConditioner;
}

type ConditionRule = IdeologySectionConditioner | IdeologyAxisConditioner | LocalConditionerRule;

const normalizeUuid = (uuid: string) => (uuid ? uuid.replace(/-/g, '') : '');

const parseRules = (rules: string | unknown[]): ConditionRule[] => {
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

export const checkVisibility = (
  rulesInput: string | ConditionRule[],
  currentAnswers: Record<string, string>,
): boolean => {
  const rules = parseRules(rulesInput);
  if (!rules || rules.length === 0) return true;

  return rules.every(rule => {
    let rawSourceUuid: string | undefined;

    if ('source_conditioner_uuid' in rule && rule.source_conditioner_uuid) {
      rawSourceUuid = rule.source_conditioner_uuid;
    } else if ('conditioner' in rule) {
      rawSourceUuid = rule.conditioner?.uuid;
    }

    if (!rawSourceUuid) return true;

    const sourceUuid = normalizeUuid(rawSourceUuid);
    const userAnswer = currentAnswers[sourceUuid];

    if (!userAnswer) return false;

    let accepted = rule.condition_values;

    const nestedConditioner = rule.conditioner;
    const isAxisRange = nestedConditioner?.type === TypeEnum.AXIS_RANGE;
    const hasNoValues = !accepted || (Array.isArray(accepted) && accepted.length === 0);

    if (hasNoValues && isAxisRange) {
      accepted = ['true'];
    }

    if (Array.isArray(accepted)) {
      return accepted.includes(userAnswer);
    }
    return accepted === userAnswer;
  });
};

export interface CascadeResult {
  nextCondAnswers: Record<string, string>;
  nextAxisAnswers: Record<string, AnswerData>;
  condsToRemoveRemote: string[];
  axesToRemoveRemote: string[];
}

const computeVirtualConditioners = (
  answers: Record<string, AnswerData>,
  allConditioners: IdeologyConditioner[],
): Record<string, string> => {
  const computed: Record<string, string> = {};
  const normalizedAnswers: Record<string, AnswerData> = {};

  Object.entries(answers).forEach(([key, value]) => {
    normalizedAnswers[normalizeUuid(key)] = value;
  });

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
};

export const calculateGlobalCleanup = (
  proposedAxisAnswers: Record<string, AnswerData>,
  proposedCondAnswers: Record<string, string>,
  allConditioners: IdeologyConditioner[],
  allSections: IdeologySection[],
  axesMap: Record<string, IdeologyAxis[]>,
): CascadeResult => {
  const nextCondAnswers = { ...proposedCondAnswers };
  const nextAxisAnswers = { ...proposedAxisAnswers };
  const condsToRemoveRemote: string[] = [];
  const axesToRemoveRemote: string[] = [];

  let changed = true;

  while (changed) {
    changed = false;

    const normalizedCondAnswers = {};
    Object.entries(nextCondAnswers).forEach(([k, v]) => {
      // @ts-expect-error - implicit any
      normalizedCondAnswers[normalizeUuid(k)] = v;
    });

    const virtuals = computeVirtualConditioners(nextAxisAnswers, allConditioners);
    const combinedAnswers = { ...normalizedCondAnswers, ...virtuals };

    for (const cond of allConditioners) {
      if (nextCondAnswers[cond.uuid]) {
        if (!checkVisibility(cond.condition_rules as unknown as ConditionRule[], combinedAnswers)) {
          delete nextCondAnswers[cond.uuid];
          condsToRemoveRemote.push(cond.uuid);
          changed = true;
        }
      }
    }

    for (const sec of allSections) {
      const isSectionVisible = checkVisibility(sec.condition_rules, combinedAnswers);
      const sectionAxes = axesMap[sec.uuid] || [];

      for (const axis of sectionAxes) {
        if (nextAxisAnswers[axis.uuid]) {
          const isAxisVisible = isSectionVisible && checkVisibility(axis.condition_rules, combinedAnswers);

          if (!isAxisVisible) {
            delete nextAxisAnswers[axis.uuid];
            axesToRemoveRemote.push(axis.uuid);
            changed = true;
          }
        }
      }
    }
  }

  return {
    nextCondAnswers,
    nextAxisAnswers,
    condsToRemoveRemote,
    axesToRemoveRemote,
  };
};

export const calculateCascadingDeletions = (
  targetConditionerUuid: string,
  currentCondAnswers: Record<string, string>,
  currentAxisAnswers: Record<string, AnswerData>,
  allConditioners: IdeologyConditioner[],
  allSections: IdeologySection[],
  axesMap: Record<string, IdeologyAxis[]>,
): CascadeResult => {
  const proposedCondAnswers = { ...currentCondAnswers };
  delete proposedCondAnswers[targetConditionerUuid];

  return calculateGlobalCleanup(currentAxisAnswers, proposedCondAnswers, allConditioners, allSections, axesMap);
};
