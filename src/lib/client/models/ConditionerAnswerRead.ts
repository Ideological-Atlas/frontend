/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type ConditionerAnswerRead = {
  readonly uuid: string;
  readonly conditioner_uuid: string;
  /**
   * The value chosen. Must match one of the 'accepted_values' defined in the conditioner.
   */
  answer: string;
};
