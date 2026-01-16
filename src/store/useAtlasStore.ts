import { create } from 'zustand';
import type { AtlasStore } from '@/types/atlas';
import { createStructureSlice } from './slices/structureSlice';
import { createAnswersSlice } from './slices/answersSlice';

export type { AnswerData, AnswerUpdatePayload } from '@/types/atlas';

export const useAtlasStore = create<AtlasStore>((...a) => ({
  ...createStructureSlice(...a),
  ...createAnswersSlice(...a),
  reset: () => {
    const [, get] = a;
    get().resetStructure();
    get().resetAnswers();
  },
}));
