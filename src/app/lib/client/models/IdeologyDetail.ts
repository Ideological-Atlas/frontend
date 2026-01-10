/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { AxisAnswerRead } from './AxisAnswerRead';
import type { ConditionerAnswerRead } from './ConditionerAnswerRead';
export type IdeologyDetail = {
  readonly uuid: string;
  /**
   * Nombre de la ideología
   */
  name: string;
  /**
   * Descripción de la ideología desde el punto de vista de un partidario
   */
  description_supporter?: string | null;
  /**
   * Descripción de la ideología desde el punto de vista de un detractor
   */
  description_detractor?: string | null;
  /**
   * Descripción de la ideología desde el punto de vista neutral
   */
  description_neutral?: string | null;
  /**
   * Imagen de la bandera de la ideología
   */
  flag?: string | null;
  /**
   * Imagen de fondo de la ideología
   */
  background?: string | null;
  /**
   * Color de la ideología
   */
  color?: string | null;
  readonly axis_definitions: Array<AxisAnswerRead>;
  readonly conditioner_definitions: Array<ConditionerAnswerRead>;
};
