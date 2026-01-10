/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
export type UserVerification = {
  readonly uuid: string;
  /**
   * Requerido. 150 carácteres como máximo. Únicamente letras, dígitos y @/./+/-/_
   */
  username: string;
  preferred_language?: string;
  /**
   * Campo que muestra si el usuario está verificado o no.
   */
  is_verified?: boolean;
};
