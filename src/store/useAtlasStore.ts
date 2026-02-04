import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AtlasStore } from '@/types/atlas';
import { createStructureSlice } from './slices/structureSlice';
import { createAnswersSlice } from './slices/answersSlice';

export type { AnswerData, AnswerUpdatePayload } from '@/types/atlas';

export const useAtlasStore = create<AtlasStore>()(
  persist(
    (...a) => ({
      ...createStructureSlice(...a),
      ...createAnswersSlice(...a),
      reset: () => {
        const [, get] = a;
        get().resetStructure();
        get().resetAnswers();
      },
    }),
    {
      name: 'atlas-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        answers: state.answers,
        conditionerAnswers: state.conditionerAnswers,
        tempCompletedAnswerUuid: state.tempCompletedAnswerUuid,
      }),
    },
  ),
);
