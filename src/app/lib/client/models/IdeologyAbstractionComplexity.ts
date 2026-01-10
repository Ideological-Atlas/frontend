/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type IdeologyAbstractionComplexity = {
  readonly uuid: string;
  /**
   * La etiqueta para este nivel de abstracción (ej: 'Concreto', 'Teórico', 'Metafísico').
   */
  name: string;
  /**
   * Explicación detallada de las características que definen este nivel de complejidad.
   */
  description?: string | null;
  /**
   * Un valor numérico utilizado para clasificar y ordenar los niveles de abstracción (ej: 1 para el más bajo, 10 para el más alto).
   */
  complexity: number;
};
