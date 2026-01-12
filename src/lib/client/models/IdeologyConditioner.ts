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
   */
  type?: TypeEnum;
  /**
   * List of valid options if the type is 'Categorical'. Format: ['Option A', 'Option B'].
   */
  accepted_values?: any;
};
