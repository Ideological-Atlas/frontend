import { create } from 'zustand';
import { StructureService } from '@/lib/client/services/StructureService';
import { AnswersService } from '@/lib/client/services/AnswersService';
import type { IdeologyAbstractionComplexity } from '@/lib/client/models/IdeologyAbstractionComplexity';
import type { IdeologyConditioner } from '@/lib/client/models/IdeologyConditioner';
import type { IdeologySection } from '@/lib/client/models/IdeologySection';
import type { IdeologyAxis } from '@/lib/client/models/IdeologyAxis';

interface AtlasState {
  complexities: IdeologyAbstractionComplexity[];
  conditioners: Record<string, IdeologyConditioner[]>;
  sections: Record<string, IdeologySection[]>;
  axes: Record<string, IdeologyAxis[]>;
  answers: Record<string, number>;

  isInitialized: boolean;

  fetchAllData: (isAuthenticated: boolean) => Promise<void>;
  saveAnswer: (axisUuid: string, value: number, isAuthenticated: boolean) => Promise<void>;
  reset: () => void;
}

export const useAtlasStore = create<AtlasState>((set, get) => ({
  complexities: [],
  conditioners: {},
  sections: {},
  axes: {},
  answers: {},
  isInitialized: false,

  fetchAllData: async isAuthenticated => {
    if (get().isInitialized) return;

    try {
      const compsResponse = await StructureService.structureComplexitiesList(100);
      const complexities = compsResponse.results;

      set({ complexities, isInitialized: true });

      for (const comp of complexities) {
        try {
          const [condRes, secRes] = await Promise.all([
            StructureService.structureConditionersList(comp.uuid, 100),
            StructureService.structureSectionsList(comp.uuid, 100),
          ]);

          set(state => ({
            conditioners: { ...state.conditioners, [comp.uuid]: condRes.results },
            sections: { ...state.sections, [comp.uuid]: secRes.results },
          }));

          for (const sec of secRes.results) {
            try {
              const axesPromise = StructureService.structureSectionsAxesList(sec.uuid, 100);
              const answersPromise = isAuthenticated
                ? AnswersService.answersAxisListList(sec.uuid, 100)
                : Promise.resolve({ results: [] });

              const [axesRes, answersRes] = await Promise.all([axesPromise, answersPromise]);

              set(state => {
                const newAnswers = { ...state.answers };
                if (isAuthenticated) {
                  answersRes.results.forEach(ans => {
                    newAnswers[ans.axis_uuid] = ans.value;
                  });
                }
                return {
                  axes: { ...state.axes, [sec.uuid]: axesRes.results },
                  answers: newAnswers,
                };
              });
            } catch (err) {
              console.error(`Error loading axes/answers for section ${sec.uuid}`, err);
            }
          }
        } catch (err) {
          console.error(`Error loading structure for complexity ${comp.uuid}`, err);
        }
      }
    } catch (error) {
      console.error('Error fetching initial complexities:', error);
    }
  },

  saveAnswer: async (axisUuid, value, isAuthenticated) => {
    set(state => ({
      answers: { ...state.answers, [axisUuid]: value },
    }));

    if (isAuthenticated) {
      try {
        await AnswersService.answersAxisCreate(axisUuid, { value });
      } catch (error) {
        console.error('Failed to save answer remotely:', error);
      }
    }
  },

  reset: () => {
    set({ isInitialized: false, answers: {} });
  },
}));
