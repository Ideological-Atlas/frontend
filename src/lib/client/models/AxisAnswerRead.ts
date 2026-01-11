/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type AxisAnswerRead = {
  readonly uuid: string;
  readonly axis_uuid: string;
  /**
   * The position on the axis. Must be between -100 (Extreme Left) and 100 (Extreme Right).
   */
  value: number;
};
