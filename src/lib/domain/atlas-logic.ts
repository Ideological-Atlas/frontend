import type { IdeologySectionConditioner } from '@/lib/client/models/IdeologySectionConditioner';
import type { IdeologyAxisConditioner } from '@/lib/client/models/IdeologyAxisConditioner';
import type { IdeologyConditionerConditioner } from '@/lib/client/models/IdeologyConditionerConditioner';
import type { IdeologyConditioner } from '@/lib/client/models/IdeologyConditioner';
import type { IdeologySection } from '@/lib/client/models/IdeologySection';
import type { IdeologyAxis } from '@/lib/client/models/IdeologyAxis';

type ConditionRule = IdeologySectionConditioner | IdeologyAxisConditioner | IdeologyConditionerConditioner;

const normalizeUuid = (uuid: string) => (uuid ? uuid.replace(/-/g, '') : '');

export const checkVisibility = (rules: ConditionRule[], currentAnswers: Record<string, string>): boolean => {
  if (!rules || rules.length === 0) return true;

  return rules.every(rule => {
    let rawSourceUuid: string | undefined;

    if ('source_conditioner_uuid' in rule) {
      rawSourceUuid = rule.source_conditioner_uuid;
    } else if ('conditioner' in rule) {
      rawSourceUuid = rule.conditioner.uuid;
    }

    if (!rawSourceUuid) return true;

    const sourceUuid = normalizeUuid(rawSourceUuid);
    const userAnswer = currentAnswers[sourceUuid];

    if (!userAnswer) return false;

    const accepted = rule.condition_values;
    if (Array.isArray(accepted)) {
      return accepted.includes(userAnswer);
    }
    return accepted === userAnswer;
  });
};

export interface CascadeResult<T> {
  nextCondAnswers: Record<string, string>;
  nextAxisAnswers: Record<string, T>;
  condsToRemoveRemote: string[];
  axesToRemoveRemote: string[];
}

export const calculateCascadingDeletions = <T>(
  targetConditionerUuid: string,
  currentCondAnswers: Record<string, string>,
  currentAxisAnswers: Record<string, T>,
  allConditioners: IdeologyConditioner[],
  allSections: IdeologySection[],
  axesMap: Record<string, IdeologyAxis[]>,
): CascadeResult<T> => {
  const nextCondAnswers = { ...currentCondAnswers };
  const nextAxisAnswers = { ...currentAxisAnswers };

  delete nextCondAnswers[targetConditionerUuid];

  const condsToRemoveRemote: string[] = [];
  const axesToRemoveRemote: string[] = [];

  let changed = true;

  while (changed) {
    changed = false;

    for (const cond of allConditioners) {
      if (nextCondAnswers[cond.uuid]) {
        if (!checkVisibility(cond.condition_rules, nextCondAnswers)) {
          delete nextCondAnswers[cond.uuid];
          condsToRemoveRemote.push(cond.uuid);
          changed = true;
        }
      }
    }

    for (const sec of allSections) {
      const isSectionVisible = checkVisibility(sec.condition_rules, nextCondAnswers);
      const sectionAxes = axesMap[sec.uuid] || [];

      for (const axis of sectionAxes) {
        if (nextAxisAnswers[axis.uuid]) {
          const isAxisVisible = isSectionVisible && checkVisibility(axis.condition_rules, nextCondAnswers);

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
