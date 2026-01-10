/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GoogleLoginRequest } from '../models/GoogleLoginRequest';
import type { GoogleLoginResponse } from '../models/GoogleLoginResponse';
import type { PatchedUserVerificationRequest } from '../models/PatchedUserVerificationRequest';
import type { Register } from '../models/Register';
import type { RegisterRequest } from '../models/RegisterRequest';
import type { TokenObtainPair } from '../models/TokenObtainPair';
import type { TokenObtainPairRequest } from '../models/TokenObtainPairRequest';
import type { TokenRefresh } from '../models/TokenRefresh';
import type { TokenRefreshRequest } from '../models/TokenRefreshRequest';
import type { TokenVerifyRequest } from '../models/TokenVerifyRequest';
import type { UserVerification } from '../models/UserVerification';
import type { UserVerificationRequest } from '../models/UserVerificationRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
  /**
   * Iniciar sesión con Google
   * Valida un token de ID de Google. Registra al usuario si no existe (verificado automáticamente) y devuelve tokens JWT.
   * @param requestBody
   * @returns GoogleLoginResponse
   * @throws ApiError
   */
  public static loginGoogleCreate(requestBody: GoogleLoginRequest): CancelablePromise<GoogleLoginResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/login/google/',
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
   * Obtener par de tokens (Iniciar sesión)
   * Takes a set of user credentials and returns an access and refresh JSON web
   * token pair to prove the authentication of those credentials.
   * @param requestBody
   * @returns TokenObtainPair
   * @throws ApiError
   */
  public static tokenLoginCreate(requestBody: TokenObtainPairRequest): CancelablePromise<TokenObtainPair> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/token/login/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Refrescar token
   * Takes a refresh type JSON web token and returns an access type JSON web
   * token if the refresh token is valid.
   * @param requestBody
   * @returns TokenRefresh
   * @throws ApiError
   */
  public static tokenRefreshCreate(requestBody: TokenRefreshRequest): CancelablePromise<TokenRefresh> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/token/refresh/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Verificar token
   * Takes a token and indicates if it is valid.  This view provides no
   * information about a token's fitness for a particular use.
   * @param requestBody
   * @returns any No response body
   * @throws ApiError
   */
  public static tokenVerifyCreate(requestBody: TokenVerifyRequest): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/token/verify/',
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
