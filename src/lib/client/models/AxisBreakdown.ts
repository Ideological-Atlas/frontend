/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { AnswerDetail } from './AnswerDetail';
import type { SimpleAxis } from './SimpleAxis';
export type AxisBreakdown = {
  axis: SimpleAxis | null;
  my_answer: AnswerDetail | null;
  their_answer: AnswerDetail | null;
  affinity: number;
};
