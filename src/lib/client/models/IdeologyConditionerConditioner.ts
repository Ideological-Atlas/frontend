/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type IdeologyConditionerConditioner = {
  readonly uuid: string;
  /**
   * Name of this condition rule.
   */
  name: string;
  /**
   * Description of the logic applied in this rule.
   */
  description?: string | null;
  /**
   * List of values that satisfy this condition (e.g. ['Spain']). Must match values in the source conditioner.
   */
  condition_values?: any;
  readonly source_conditioner_uuid: string;
};
