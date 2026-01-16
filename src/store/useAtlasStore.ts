import { create } from 'zustand';
import { StructureService } from '@/lib/client/services/StructureService';
import { AnswersService } from '@/lib/client/services/AnswersService';
import type { IdeologyAbstractionComplexity } from '@/lib/client/models/IdeologyAbstractionComplexity';
import type { IdeologyConditioner } from '@/lib/client/models/IdeologyConditioner';
import type { IdeologySection } from '@/lib/client/models/IdeologySection';
import type { IdeologyAxis } from '@/lib/client/models/IdeologyAxis';
import type { AxisAnswerUpsertRequest } from '@/lib/client/models/AxisAnswerUpsertRequest';
import type { ConditionerAnswerUpsertRequest } from '@/lib/client/models/ConditionerAnswerUpsertRequest';

export interface AnswerData {
  value: number | null;
  margin_left?: number | null;
  margin_right?: number | null;
  is_indifferent?: boolean;
}

export interface AnswerUpdatePayload {
  value?: number | null;
  margin_left?: number | null;
  margin_right?: number | null;
  is_indifferent?: boolean;
}

interface AtlasState {
  complexities: IdeologyAbstractionComplexity[];
  conditioners: Record<string, IdeologyConditioner[]>;
  sections: Record<string, IdeologySection[]>;
  axes: Record<string, IdeologyAxis[]>;

  answers: Record<string, AnswerData>;
  conditionerAnswers: Record<string, string>;

  isInitialized: boolean;

  fetchAllData: (isAuthenticated: boolean) => Promise<void>;
  saveAnswer: (axisUuid: string, data: AnswerUpdatePayload, isAuthenticated: boolean) => Promise<void>;
  deleteAnswer: (axisUuid: string, isAuthenticated: boolean) => Promise<void>;
  saveConditionerAnswer: (conditionerUuid: string, value: string, isAuthenticated: boolean) => Promise<void>;
  reset: () => void;
}

export const useAtlasStore = create<AtlasState>((set, get) => ({
  complexities: [],
  conditioners: {},
  sections: {},
  axes: {},
  answers: {},
  conditionerAnswers: {},
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
            StructureService.structureConditionersAggregatedList(comp.uuid, 100),
            StructureService.structureSectionsList(comp.uuid, 100),
          ]);

          set(state => ({
            conditioners: { ...state.conditioners, [comp.uuid]: condRes.results },
            sections: { ...state.sections, [comp.uuid]: secRes.results },
          }));

          if (isAuthenticated) {
            try {
              const condAnswersRes = await AnswersService.answersConditionerListList(comp.uuid, 100);
              set(state => {
                const newCondAnswers = { ...state.conditionerAnswers };
                condAnswersRes.results.forEach(ans => {
                  newCondAnswers[ans.conditioner_uuid] = ans.answer;
                });
                return { conditionerAnswers: newCondAnswers };
              });
            } catch (err) {
              console.error(`Error loading conditioner answers for complexity ${comp.uuid}`, err);
            }
          }

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

  saveAnswer: async (axisUuid, payload, isAuthenticated) => {
    if (payload.is_indifferent) {
      const indifferentData: AnswerData = {
        value: null,
        margin_left: null,
        margin_right: null,
        is_indifferent: true,
      };

      set(state => ({
        answers: { ...state.answers, [axisUuid]: indifferentData },
      }));

      if (isAuthenticated) {
        try {
          await AnswersService.answersAxisCreate(axisUuid, {
            value: null,
            margin_left: null,
            margin_right: null,
            is_indifferent: true,
          });
        } catch (error) {
          console.error('Failed to save indifferent answer remotely:', error);
        }
      }
      return;
    }

    const current = get().answers[axisUuid] || { value: 0, margin_left: 10, margin_right: 10 };
    const baseValue = current.value ?? 0;
    const baseMarginLeft = current.margin_left ?? 10;
    const baseMarginRight = current.margin_right ?? 10;

    const newData: AnswerData = {
      value: payload.value ?? baseValue,
      margin_left: payload.margin_left ?? baseMarginLeft,
      margin_right: payload.margin_right ?? baseMarginRight,
      is_indifferent: false,
    };

    set(state => ({
      answers: { ...state.answers, [axisUuid]: newData },
    }));

    if (isAuthenticated) {
      try {
        await AnswersService.answersAxisCreate(axisUuid, {
          value: newData.value,
          margin_left: newData.margin_left,
          margin_right: newData.margin_right,
          is_indifferent: false,
        } as unknown as AxisAnswerUpsertRequest);
      } catch (error) {
        console.error('Failed to save answer remotely:', error);
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
        console.error('Failed to delete answer remotely:', error);
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
        console.error('Failed to save conditioner answer remotely:', error);
      }
    }
  },

  reset: () => {
    set({ isInitialized: false, answers: {}, conditionerAnswers: {} });
  },
}));
