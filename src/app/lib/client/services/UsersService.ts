/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { Me } from '../models/Me';
import type { MeRequest } from '../models/MeRequest';
import type { PatchedMeRequest } from '../models/PatchedMeRequest';
import type { PatchedUserSetPasswordRequest } from '../models/PatchedUserSetPasswordRequest';
import type { UserSetPasswordRequest } from '../models/UserSetPasswordRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
  /**
   * Obtener o actualizar perfil actual
   * Recupera la información del perfil del usuario autenticado o actualiza sus detalles.
   * @returns Me
   * @throws ApiError
   */
  public static meRetrieve(): CancelablePromise<Me> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/me/',
    });
  }
  /**
   * Obtener o actualizar perfil actual
   * Recupera la información del perfil del usuario autenticado o actualiza sus detalles.
   * @param requestBody
   * @returns Me
   * @throws ApiError
   */
  public static meUpdate(requestBody: MeRequest): CancelablePromise<Me> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/me/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Obtener o actualizar perfil actual
   * Recupera la información del perfil del usuario autenticado o actualiza sus detalles.
   * @param requestBody
   * @returns Me
   * @throws ApiError
   */
  public static mePartialUpdate(requestBody?: PatchedMeRequest): CancelablePromise<Me> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/me/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Establecer contraseña de usuario
   * Permite a un usuario autenticado (ej. conectado vía Google) establecer una contraseña para usar el inicio de sesión estándar en el futuro.
   * @param requestBody
   * @returns Me
   * @throws ApiError
   */
  public static mePasswordUpdate(requestBody: UserSetPasswordRequest): CancelablePromise<Me> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/me/password/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Establecer contraseña de usuario
   * Permite a un usuario autenticado (ej. conectado vía Google) establecer una contraseña para usar el inicio de sesión estándar en el futuro.
   * @param requestBody
   * @returns Me
   * @throws ApiError
   */
  public static mePasswordPartialUpdate(requestBody?: PatchedUserSetPasswordRequest): CancelablePromise<Me> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/me/password/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
