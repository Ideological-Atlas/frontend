/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type ConditionerAnswerRead = {
  readonly uuid: string;
  readonly conditioner_uuid: string;
  /**
   * El valor elegido. Debe coincidir con uno de los 'valores aceptados' definidos en el condicionador.
   */
  answer: string;
};
