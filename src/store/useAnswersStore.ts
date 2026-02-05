import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AnswersService } from '@/lib/client/services/AnswersService';

interface AnswersState {
  anonymousAnswerUuid: string | null;
  setAnonymousUuid: (uuid: string) => void;
  getOrCreateAnonymousUuid: () => Promise<string>;
}

export const useAnswersStore = create<AnswersState>()(
  persist(
    (set, get) => ({
      anonymousAnswerUuid: null,
      setAnonymousUuid: uuid => set({ anonymousAnswerUuid: uuid }),
      getOrCreateAnonymousUuid: async () => {
        const currentUuid = get().anonymousAnswerUuid;
        if (currentUuid) return currentUuid;

        const response = await AnswersService.answersCompletedGenerateCreate({});
        const newUuid = response.uuid;
        set({ anonymousAnswerUuid: newUuid });
        return newUuid;
      },
    }),
    {
      name: 'answers-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
