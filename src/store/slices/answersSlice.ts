import type { StateCreator } from 'zustand';
import type { AtlasStore, AnswersSlice, AnswerData } from '@/types/atlas';
import { AnswersService } from '@/lib/client/services/AnswersService';
import type { UserAxisAnswerUpsertRequest } from '@/lib/client/models/UserAxisAnswerUpsertRequest';
import type { ConditionerAnswerUpsertRequest } from '@/lib/client/models/ConditionerAnswerUpsertRequest';
import { calculateCascadingDeletions, calculateGlobalCleanup } from '@/lib/domain/atlas-logic';
import { ApiError } from '@/lib/client/core/ApiError';

const safeDelete = async (promise: Promise<void>) => {
  try {
    await promise;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return;
    }
    console.error('Error deleting answer:', error);
  }
};

export const createAnswersSlice: StateCreator<AtlasStore, [], [], AnswersSlice> = (set, get) => ({
  answers: {},
  conditionerAnswers: {},
  tempCompletedAnswerUuid: null,

  setTempCompletedAnswerUuid: uuid => set({ tempCompletedAnswerUuid: uuid }),

  resetAnswers: () => {
    set({ answers: {}, conditionerAnswers: {}, tempCompletedAnswerUuid: null });
  },

  saveAnswer: async (axisUuid, payload, isAuthenticated, isVerified) => {
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
      tempCompletedAnswerUuid: null,
    });

    if (isAuthenticated && isVerified) {
      try {
        await Promise.all([
          ...condsToRemoveRemote.map(uuid => safeDelete(AnswersService.answersConditionerDeleteDestroy(uuid))),
          ...axesToRemoveRemote.map(uuid => safeDelete(AnswersService.answersAxisDeleteDestroy(uuid))),
        ]);

        await AnswersService.answersAxisCreate(axisUuid, newData as unknown as UserAxisAnswerUpsertRequest);
      } catch (error) {
        console.error(error);
      }
    }
  },

  deleteAnswer: async (axisUuid, isAuthenticated, isVerified) => {
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
      tempCompletedAnswerUuid: null,
    });

    if (isAuthenticated && isVerified) {
      try {
        await safeDelete(AnswersService.answersAxisDeleteDestroy(axisUuid));
        await Promise.all([
          ...condsToRemoveRemote.map(uuid => safeDelete(AnswersService.answersConditionerDeleteDestroy(uuid))),
          ...axesToRemoveRemote.map(uuid => safeDelete(AnswersService.answersAxisDeleteDestroy(uuid))),
        ]);
      } catch (error) {
        console.error(error);
      }
    }
  },

  saveConditionerAnswer: async (conditionerUuid, value, isAuthenticated, isVerified) => {
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
      tempCompletedAnswerUuid: null,
    });

    if (isAuthenticated && isVerified) {
      try {
        await Promise.all([
          ...condsToRemoveRemote.map(uuid => safeDelete(AnswersService.answersConditionerDeleteDestroy(uuid))),
          ...axesToRemoveRemote.map(uuid => safeDelete(AnswersService.answersAxisDeleteDestroy(uuid))),
        ]);

        await AnswersService.answersConditionerCreate(conditionerUuid, {
          answer: value,
        } as ConditionerAnswerUpsertRequest);
      } catch (error) {
        console.error(error);
      }
    }
  },

  deleteConditionerAnswer: async (conditionerUuid, isAuthenticated, isVerified) => {
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
      tempCompletedAnswerUuid: null,
    });

    if (isAuthenticated && isVerified) {
      try {
        await safeDelete(AnswersService.answersConditionerDeleteDestroy(conditionerUuid));
        await Promise.all([
          ...condsToRemoveRemote.map(uuid => safeDelete(AnswersService.answersConditionerDeleteDestroy(uuid))),
          ...axesToRemoveRemote.map(uuid => safeDelete(AnswersService.answersAxisDeleteDestroy(uuid))),
        ]);
      } catch (error) {
        console.error(error);
      }
    }
  },
});
