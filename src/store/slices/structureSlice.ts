import type { StateCreator } from 'zustand';
import type { AtlasStore, StructureSlice } from '@/types/atlas';
import { StructureService } from '@/lib/client/services/StructureService';
import { AnswersService } from '@/lib/client/services/AnswersService';

export const createStructureSlice: StateCreator<AtlasStore, [], [], StructureSlice> = (set, get) => ({
  complexities: [],
  conditioners: {},
  sections: {},
  axes: {},
  isInitialized: false,

  resetStructure: () => {
    set({
      complexities: [],
      conditioners: {},
      sections: {},
      axes: {},
      isInitialized: false,
    });
  },

  fetchAllData: async isAuthenticated => {
    if (get().isInitialized) return;

    try {
      const compsResponse = await StructureService.structureComplexitiesList(100);
      const complexities = compsResponse.results;

      set({ complexities, isInitialized: true });

      await Promise.all(
        complexities.map(async comp => {
          try {
            const [condRes, secRes] = await Promise.all([
              StructureService.structureConditionersAggregatedList(comp.uuid, 100),
              StructureService.structureSectionsList(comp.uuid, 100),
            ]);

            set(state => ({
              conditioners: { ...state.conditioners, [comp.uuid]: condRes.results },
              sections: { ...state.sections, [comp.uuid]: secRes.results },
            }));

            if (isAuthenticated) {
              const condAnswersRes = await AnswersService.answersConditionerListList(comp.uuid, 100);
              set(state => {
                const newCondAnswers = { ...state.conditionerAnswers };
                condAnswersRes.results.forEach(ans => {
                  newCondAnswers[ans.conditioner_uuid] = ans.answer;
                });
                return { conditionerAnswers: newCondAnswers };
              });
            }

            await Promise.all(
              secRes.results.map(async sec => {
                const axesPromise = StructureService.structureSectionsAxesList(sec.uuid, 100);
                const answersPromise = isAuthenticated
                  ? AnswersService.answersAxisListList(sec.uuid, 100)
                  : Promise.resolve({ results: [] });

                const [axesRes, answersRes] = await Promise.all([axesPromise, answersPromise]);

                set(state => {
                  const newAnswers = { ...state.answers };
                  if (isAuthenticated) {
                    answersRes.results.forEach(ans => {
                      newAnswers[ans.axis_uuid] = {
                        value: ans.value ?? null,
                        margin_left: ans.margin_left,
                        margin_right: ans.margin_right,
                        is_indifferent: ans.is_indifferent,
                      };
                    });
                  }
                  return {
                    axes: { ...state.axes, [sec.uuid]: axesRes.results },
                    answers: newAnswers,
                  };
                });
              }),
            );
          } catch (err) {
            console.error(err);
          }
        }),
      );
    } catch (error) {
      console.error(error);
    }
  },
});
