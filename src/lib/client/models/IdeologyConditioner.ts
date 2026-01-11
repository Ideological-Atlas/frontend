/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TypeEnum } from './TypeEnum';
export type IdeologyConditioner = {
  readonly uuid: string;
  /**
   * El nombre del condicionador o variable.
   */
  name: string;
  /**
   * Explicación detallada de lo que este condicionador mide o define dentro de una ideología.
   */
  description?: string | null;
  /**
   * Define el formato de los datos esperados para este condicionador.
   *
   * * `boolean` - Booleano (Sí/No)
   * * `categorical` - Categórico (Selección)
   * * `scale` - Escala (Rango numérico)
   * * `numeric` - Valor numérico
   * * `text` - Texto libre
   */
  type?: TypeEnum;
  /**
   * Lista de opciones válidas si el tipo es 'Categórico'. Formato: ['Opción A', 'Opción B'].
   */
  accepted_values?: any;
};
