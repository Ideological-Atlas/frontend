/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CustomTokenObtainPairRequest } from '../models/CustomTokenObtainPairRequest';
import type { GoogleLoginRequest } from '../models/GoogleLoginRequest';
import type { GoogleLoginResponse } from '../models/GoogleLoginResponse';
import type { PatchedUserVerificationRequest } from '../models/PatchedUserVerificationRequest';
import type { RegisterRequest } from '../models/RegisterRequest';
import type { RegisterResponse } from '../models/RegisterResponse';
import type { TokenObtainPairResponse } from '../models/TokenObtainPairResponse';
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
   * Login with Google
   * Validates a Google ID Token. Registers the user if they don't exist (verified automatically) and returns JWT tokens.
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
   * Register new user
   * Creates a new user account, triggers verification email via Manager, and logs the user in automatically.
   * @param requestBody
   * @returns RegisterResponse
   * @throws ApiError
   */
  public static registerCreate(requestBody: RegisterRequest): CancelablePromise<RegisterResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/register/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Obtain Token Pair (Login)
   * Takes a set of user credentials and returns an access and refresh JSON web
   * token pair to prove the authentication of those credentials.
   * @param requestBody
   * @returns TokenObtainPairResponse
   * @throws ApiError
   */
  public static tokenLoginCreate(
    requestBody: CustomTokenObtainPairRequest,
  ): CancelablePromise<TokenObtainPairResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/token/login/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Refresh Token
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
   * Verify Token
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
   * Verify user account
   * Marks a user as verified using their secret verification token.
   * @param uuid The verification UUID sent via email
   * @param verificationUuid
   * @param requestBody
   * @returns UserVerification
   * @throws ApiError
   */
  public static usersVerifyUpdate(
    uuid: string,
    verificationUuid: string,
    requestBody: UserVerificationRequest,
  ): CancelablePromise<UserVerification> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/users/verify/{verification_uuid}/',
      path: {
        uuid: uuid,
        verification_uuid: verificationUuid,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Verify user account
   * Marks a user as verified using their secret verification token.
   * @param uuid The verification UUID sent via email
   * @param verificationUuid
   * @param requestBody
   * @returns UserVerification
   * @throws ApiError
   */
  public static usersVerifyPartialUpdate(
    uuid: string,
    verificationUuid: string,
    requestBody?: PatchedUserVerificationRequest,
  ): CancelablePromise<UserVerification> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/users/verify/{verification_uuid}/',
      path: {
        uuid: uuid,
        verification_uuid: verificationUuid,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
