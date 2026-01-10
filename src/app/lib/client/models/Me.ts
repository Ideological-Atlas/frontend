/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { AuthProviderEnum } from './AuthProviderEnum';
export type Me = {
  readonly uuid: string;
  /**
   * Requerido. 150 carácteres como máximo. Únicamente letras, dígitos y @/./+/-/_
   */
  username: string;
  readonly email: string;
  first_name?: string;
  last_name?: string;
  /**
   * Campo que muestra si el usuario está verificado o no.
   */
  readonly is_verified: boolean;
  preferred_language?: string;
  /**
   * El proveedor utilizado para la autenticación/registro del usuario.
   *
   * * `internal` - Interno
   * * `google` - Google
   */
  readonly auth_provider: AuthProviderEnum;
};
