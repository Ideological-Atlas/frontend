/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { Me } from '../models/Me';
import type { MeRequest } from '../models/MeRequest';
import type { PatchedMeRequest } from '../models/PatchedMeRequest';
import type { PatchedUserVerificationRequest } from '../models/PatchedUserVerificationRequest';
import type { Register } from '../models/Register';
import type { RegisterRequest } from '../models/RegisterRequest';
import type { UserVerification } from '../models/UserVerification';
import type { UserVerificationRequest } from '../models/UserVerificationRequest';
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
   * Registrar nuevo usuario
   * Crea una nueva cuenta de usuario e inicia el proceso de verificación por correo.
   * @param requestBody
   * @returns Register
   * @throws ApiError
   */
  public static registerCreate(requestBody: RegisterRequest): CancelablePromise<Register> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/register/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Verificar cuenta de usuario
   * Marca a un usuario como verificado usando su UUID único.
   * @param uuid El UUID del usuario a verificar
   * @param requestBody
   * @returns UserVerification
   * @throws ApiError
   */
  public static usersVerifyUpdate(
    uuid: string,
    requestBody: UserVerificationRequest,
  ): CancelablePromise<UserVerification> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/users/verify/{uuid}',
      path: {
        uuid: uuid,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Verificar cuenta de usuario
   * Marca a un usuario como verificado usando su UUID único.
   * @param uuid El UUID del usuario a verificar
   * @param requestBody
   * @returns UserVerification
   * @throws ApiError
   */
  public static usersVerifyPartialUpdate(
    uuid: string,
    requestBody?: PatchedUserVerificationRequest,
  ): CancelablePromise<UserVerification> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/users/verify/{uuid}',
      path: {
        uuid: uuid,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
