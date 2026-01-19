/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { AxisAnswerInputRequest } from './AxisAnswerInputRequest';
import type { ConditionerAnswerInputRequest } from './ConditionerAnswerInputRequest';
export type CompletedAnswerRequest = {
  axis?: Array<AxisAnswerInputRequest>;
  conditioners?: Array<ConditionerAnswerInputRequest>;
};
