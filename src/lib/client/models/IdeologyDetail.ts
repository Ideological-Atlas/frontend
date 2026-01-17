/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { IdeologyAxisDefinition } from './IdeologyAxisDefinition';
import type { IdeologyConditionerDefinition } from './IdeologyConditionerDefinition';
export type IdeologyDetail = {
  readonly uuid: string;
  /**
   * Ideology Name
   */
  name: string;
  /**
   * Ideology Description from the point of view of a supporter
   */
  description_supporter?: string | null;
  /**
   * Ideology Description the point of view of a detractor
   */
  description_detractor?: string | null;
  /**
   * Ideology Description the point of view of a neutral
   */
  description_neutral?: string | null;
  /**
   * Ideology Flag Image
   */
  flag?: string | null;
  /**
   * Ideology Background Image
   */
  background?: string | null;
  /**
   * Ideology Color Image
   */
  color?: string | null;
  readonly axis_definitions: Array<IdeologyAxisDefinition>;
  readonly conditioner_definitions: Array<IdeologyConditionerDefinition>;
};
