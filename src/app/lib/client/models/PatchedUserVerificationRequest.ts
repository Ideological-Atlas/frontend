/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
export type PatchedUserVerificationRequest = {
  /**
   * Requerido. 150 carácteres como máximo. Únicamente letras, dígitos y @/./+/-/_
   */
  username?: string;
  preferred_language?: string;
  /**
   * Campo que muestra si el usuario está verificado o no.
   */
  is_verified?: boolean;
};
