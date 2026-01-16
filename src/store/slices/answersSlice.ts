import type { StateCreator } from 'zustand';
import type { AtlasStore, AnswersSlice, AnswerData } from '@/types/atlas';
import { AnswersService } from '@/lib/client/services/AnswersService';
import type { AxisAnswerUpsertRequest } from '@/lib/client/models/AxisAnswerUpsertRequest';
import type { ConditionerAnswerUpsertRequest } from '@/lib/client/models/ConditionerAnswerUpsertRequest';
import { calculateCascadingDeletions } from '@/lib/domain/atlas-logic';

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

    set(state => ({
      answers: { ...state.answers, [axisUuid]: newData },
    }));

    if (isAuthenticated) {
      try {
        await AnswersService.answersAxisCreate(axisUuid, newData as unknown as AxisAnswerUpsertRequest);
      } catch (error) {
        console.error(error);
      }
    }
  },

  deleteAnswer: async (axisUuid, isAuthenticated) => {
    set(state => {
      const newAnswers = { ...state.answers };
      delete newAnswers[axisUuid];
      return { answers: newAnswers };
    });

    if (isAuthenticated) {
      try {
        await AnswersService.answersAxisDeleteDestroy(axisUuid);
      } catch (error) {
        console.error(error);
      }
    }
  },

  saveConditionerAnswer: async (conditionerUuid, value, isAuthenticated) => {
    set(state => ({
      conditionerAnswers: { ...state.conditionerAnswers, [conditionerUuid]: value },
    }));

    if (isAuthenticated) {
      try {
        await AnswersService.answersConditionerCreate(conditionerUuid, {
          answer: value,
        } as ConditionerAnswerUpsertRequest);
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
