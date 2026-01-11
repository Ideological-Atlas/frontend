/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { IdeologyConditioner } from './IdeologyConditioner';
export type IdeologyAxis = {
  readonly uuid: string;
  /**
   * Internal name of the axis (e.g., 'Economic Freedom').
   */
  name: string;
  /**
   * Explanation of what this axis measures.
   */
  description?: string | null;
  /**
   * Label for the start or minimum value of the axis (e.g., 'Total Control').
   */
  left_label: string;
  /**
   * Label for the end or maximum value of the axis (e.g., 'Total Liberty').
   */
  right_label: string;
  readonly conditioned_by: IdeologyConditioner;
};
