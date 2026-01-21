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
  isAnswersInitialized: false,

  resetStructure: () => {
    set({
      complexities: [],
      conditioners: {},
      sections: {},
      axes: {},
      isInitialized: false,
      isAnswersInitialized: false,
    });
  },

  fetchAllData: async isAuthenticated => {
    const { isInitialized, isAnswersInitialized } = get();

    if (isInitialized && (!isAuthenticated || isAnswersInitialized)) {
      return;
    }

    const shouldFetchStructure = !isInitialized;
    const shouldFetchAnswers = isAuthenticated;
    try {
      let currentComplexities = get().complexities;

      if (shouldFetchStructure) {
        const compsResponse = await StructureService.structureComplexitiesList(100);
        currentComplexities = compsResponse.results;
        set({ complexities: currentComplexities });
      }

      await Promise.all(
        currentComplexities.map(async comp => {
          try {
            if (shouldFetchStructure) {
              const [condRes, secRes] = await Promise.all([
                StructureService.structureConditionersAggregatedList(comp.uuid, 100),
                StructureService.structureSectionsList(comp.uuid, 100),
              ]);

              set(state => ({
                conditioners: { ...state.conditioners, [comp.uuid]: condRes.results },
                sections: { ...state.sections, [comp.uuid]: secRes.results },
              }));
            }

            if (shouldFetchAnswers) {
              const condAnswersRes = await AnswersService.answersConditionerListList(comp.uuid, 100);
              set(state => {
                const newCondAnswers = { ...state.conditionerAnswers };
                condAnswersRes.results.forEach(ans => {
                  newCondAnswers[ans.conditioner_uuid] = ans.answer;
                });
                return { conditionerAnswers: newCondAnswers };
              });
            }

            const compSections = get().sections[comp.uuid] || [];

            await Promise.all(
              compSections.map(async sec => {
                if (shouldFetchStructure) {
                  const axesRes = await StructureService.structureSectionsAxesList(sec.uuid, 100);
                  set(state => ({
                    axes: { ...state.axes, [sec.uuid]: axesRes.results },
                  }));
                }

                if (shouldFetchAnswers) {
                  const answersRes = await AnswersService.answersAxisListList(sec.uuid, 100);
                  set(state => {
                    const newAnswers = { ...state.answers };
                    if (answersRes.results) {
                      answersRes.results.forEach(ans => {
                        newAnswers[ans.axis_uuid] = {
                          value: ans.value ?? null,
                          margin_left: ans.margin_left,
                          margin_right: ans.margin_right,
                          is_indifferent: ans.is_indifferent,
                        };
                      });
                    }
                    return { answers: newAnswers };
                  });
                }
              }),
            );
          } catch (err) {
            console.error('Error fetching deep structure:', err);
          }
        }),
      );

      if (shouldFetchStructure) set({ isInitialized: true });
      if (shouldFetchAnswers) set({ isAnswersInitialized: true });
    } catch (error) {
      console.error('Error fetching complexities:', error);
    }
  },

  initializeStructure: data => {
    set({
      complexities: data.complexities,
      conditioners: data.conditioners,
      sections: data.sections,
      axes: data.axes,
      answers: { ...get().answers, ...data.answers },
      conditionerAnswers: { ...get().conditionerAnswers, ...data.conditionerAnswers },
      isInitialized: true,
      isAnswersInitialized: true,
    });
  },
});
