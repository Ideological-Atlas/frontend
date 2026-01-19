/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TypeEnum } from './TypeEnum';
export type IdeologyConditioner = {
  readonly uuid: string;
  /**
   * The name of the conditioner or variable.
   */
  name: string;
  /**
   * Detailed explanation of what this conditioner measures or defines within an ideology.
   */
  description?: string | null;
  /**
   * Defines the format of the data expected for this conditioner.
   *
   * * `boolean` - Boolean (Yes/No)
   * * `categorical` - Categorical (Selection)
   * * `scale` - Scale (Numeric Range)
   * * `numeric` - Numeric Value
   * * `text` - Free Text
   * * `axis_range` - Derived from Axis Range
   */
  type?: TypeEnum;
  /**
   * List of valid options if the type is 'Categorical'. Format: ['Option A', 'Option B']. For 'Derived from Axis Range', this is auto-set to ['true', 'false'].
   */
  accepted_values?: any;
  readonly condition_rules: Array<Record<string, any>>;
  readonly source_axis_uuid: string | null;
  /**
   * Condition is met if user value >= this.
   */
  axis_min_value?: number | null;
  /**
   * Condition is met if user value <= this.
   */
  axis_max_value?: number | null;
};
