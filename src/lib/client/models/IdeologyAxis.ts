/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { IdeologyConditioner } from './IdeologyConditioner';
export type IdeologyAxis = {
  readonly uuid: string;
  /**
   * Nombre interno del eje (ej: 'Libertad económica').
   */
  name: string;
  /**
   * Explicación de lo que mide este eje.
   */
  description?: string | null;
  /**
   * Etiqueta para el inicio o valor mínimo del eje (ej: 'Control total').
   */
  left_label: string;
  /**
   * Etiqueta para el final o valor máximo del eje (ej: 'Libertad total').
   */
  right_label: string;
  readonly conditioned_by: IdeologyConditioner;
};
