import type { IdeologyAbstractionComplexity } from '@/lib/client/models/IdeologyAbstractionComplexity';
import type { IdeologyConditioner } from '@/lib/client/models/IdeologyConditioner';
import type { IdeologySection } from '@/lib/client/models/IdeologySection';
import type { IdeologyAxis } from '@/lib/client/models/IdeologyAxis';

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

export interface AtlasState {
  complexities: IdeologyAbstractionComplexity[];
  conditioners: Record<string, IdeologyConditioner[]>;
  sections: Record<string, IdeologySection[]>;
  axes: Record<string, IdeologyAxis[]>;
  answers: Record<string, AnswerData>;
  conditionerAnswers: Record<string, string>;
  isInitialized: boolean;
}

export interface StructureSlice {
  complexities: IdeologyAbstractionComplexity[];
  conditioners: Record<string, IdeologyConditioner[]>;
  sections: Record<string, IdeologySection[]>;
  axes: Record<string, IdeologyAxis[]>;
  isInitialized: boolean;
  fetchAllData: (isAuthenticated: boolean) => Promise<void>;
  resetStructure: () => void;
}

export interface AnswersSlice {
  answers: Record<string, AnswerData>;
  conditionerAnswers: Record<string, string>;
  saveAnswer: (axisUuid: string, data: AnswerUpdatePayload, isAuthenticated: boolean) => Promise<void>;
  deleteAnswer: (axisUuid: string, isAuthenticated: boolean) => Promise<void>;
  saveConditionerAnswer: (conditionerUuid: string, value: string, isAuthenticated: boolean) => Promise<void>;
  deleteConditionerAnswer: (conditionerUuid: string, isAuthenticated: boolean) => Promise<void>;
  resetAnswers: () => void;
}

export interface AtlasStore extends StructureSlice, AnswersSlice {
  reset: () => void;
}
