import type { StateCreator } from 'zustand';
import type { AtlasStore, AnswersSlice, AnswerData } from '@/types/atlas';
import { AnswersService } from '@/lib/client/services/AnswersService';
import type { UserAxisAnswerUpsertRequest } from '@/lib/client/models/UserAxisAnswerUpsertRequest';
import type { ConditionerAnswerUpsertRequest } from '@/lib/client/models/ConditionerAnswerUpsertRequest';
import { calculateCascadingDeletions, calculateGlobalCleanup } from '@/lib/domain/atlas-logic';

export const createAnswersSlice: StateCreator<AtlasStore, [], [], AnswersSlice> = (set, get) => ({
  answers: {},
  conditionerAnswers: {},

  resetAnswers: () => {
    set({ answers: {}, conditionerAnswers: {} });
  },

  saveAnswer: async (axisUuid, payload, isAuthenticated) => {
    let newData: AnswerData;

    if (payload.is_indifferent) {
      newData = {
        value: null,
        margin_left: null,
        margin_right: null,
        is_indifferent: true,
      };
    } else {
      const current = get().answers[axisUuid] || { value: 0, margin_left: 10, margin_right: 10 };
      newData = {
        value: payload.value ?? current.value ?? 0,
        margin_left: payload.margin_left ?? current.margin_left ?? 10,
        margin_right: payload.margin_right ?? current.margin_right ?? 10,
        is_indifferent: false,
      };
    }

    const { conditioners, sections, axes, conditionerAnswers, answers } = get();
    const allConditioners = Object.values(conditioners).flat();
    const allSections = Object.values(sections).flat();

    const proposedAnswers = { ...answers, [axisUuid]: newData };

    const { nextCondAnswers, nextAxisAnswers, condsToRemoveRemote, axesToRemoveRemote } = calculateGlobalCleanup(
      proposedAnswers,
      conditionerAnswers,
      allConditioners,
      allSections,
      axes,
    );

    set({
      answers: nextAxisAnswers,
      conditionerAnswers: nextCondAnswers,
    });

    if (isAuthenticated) {
      try {
        const promises = [
          AnswersService.answersAxisCreate(axisUuid, newData as unknown as UserAxisAnswerUpsertRequest),
          ...condsToRemoveRemote.map(uuid => AnswersService.answersConditionerDeleteDestroy(uuid)),
          ...axesToRemoveRemote.map(uuid => AnswersService.answersAxisDeleteDestroy(uuid)),
        ];
        await Promise.all(promises);
      } catch (error) {
        console.error(error);
      }
    }
  },

  deleteAnswer: async (axisUuid, isAuthenticated) => {
    const { conditioners, sections, axes, conditionerAnswers, answers } = get();
    const allConditioners = Object.values(conditioners).flat();
    const allSections = Object.values(sections).flat();

    const proposedAnswers = { ...answers };
    delete proposedAnswers[axisUuid];

    const { nextCondAnswers, nextAxisAnswers, condsToRemoveRemote, axesToRemoveRemote } = calculateGlobalCleanup(
      proposedAnswers,
      conditionerAnswers,
      allConditioners,
      allSections,
      axes,
    );

    set({
      answers: nextAxisAnswers,
      conditionerAnswers: nextCondAnswers,
    });

    if (isAuthenticated) {
      try {
        await AnswersService.answersAxisDeleteDestroy(axisUuid);
        await Promise.all([
          ...condsToRemoveRemote.map(uuid => AnswersService.answersConditionerDeleteDestroy(uuid)),
          ...axesToRemoveRemote.map(uuid => AnswersService.answersAxisDeleteDestroy(uuid)),
        ]);
      } catch (error) {
        console.error(error);
      }
    }
  },

  saveConditionerAnswer: async (conditionerUuid, value, isAuthenticated) => {
    const { conditioners, sections, axes, conditionerAnswers, answers } = get();
    const allConditioners = Object.values(conditioners).flat();
    const allSections = Object.values(sections).flat();

    const proposedCondAnswers = { ...conditionerAnswers, [conditionerUuid]: value };

    const { nextCondAnswers, nextAxisAnswers, condsToRemoveRemote, axesToRemoveRemote } = calculateGlobalCleanup(
      answers,
      proposedCondAnswers,
      allConditioners,
      allSections,
      axes,
    );

    set({
      conditionerAnswers: nextCondAnswers,
      answers: nextAxisAnswers,
    });

    if (isAuthenticated) {
      try {
        const promises = [
          AnswersService.answersConditionerCreate(conditionerUuid, {
            answer: value,
          } as ConditionerAnswerUpsertRequest),
          ...condsToRemoveRemote.map(uuid => AnswersService.answersConditionerDeleteDestroy(uuid)),
          ...axesToRemoveRemote.map(uuid => AnswersService.answersAxisDeleteDestroy(uuid)),
        ];
        await Promise.all(promises);
      } catch (error) {
        console.error(error);
      }
    }
  },

  deleteConditionerAnswer: async (conditionerUuid, isAuthenticated) => {
    const { conditioners, sections, axes, conditionerAnswers, answers } = get();
    const allConditioners = Object.values(conditioners).flat();
    const allSections = Object.values(sections).flat();

    const { nextCondAnswers, nextAxisAnswers, condsToRemoveRemote, axesToRemoveRemote } = calculateCascadingDeletions(
      conditionerUuid,
      conditionerAnswers,
      answers,
      allConditioners,
      allSections,
      axes,
    );

    set({
      conditionerAnswers: nextCondAnswers,
      answers: nextAxisAnswers,
    });

    if (isAuthenticated) {
      try {
        await AnswersService.answersConditionerDeleteDestroy(conditionerUuid);
        await Promise.all([
          ...condsToRemoveRemote.map(uuid => AnswersService.answersConditionerDeleteDestroy(uuid)),
          ...axesToRemoveRemote.map(uuid => AnswersService.answersAxisDeleteDestroy(uuid)),
        ]);
      } catch (error) {
        console.error(error);
      }
    }
  },
});
