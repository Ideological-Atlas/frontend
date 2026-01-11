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
  public static loginGoogleCreate(requestBody: GoogleLoginRequest): CancelablePromise<GoogleLoginResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/login/google/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  public static registerCreate(requestBody: RegisterRequest): CancelablePromise<Register> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/register/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  public static tokenLoginCreate(requestBody: TokenObtainPairRequest): CancelablePromise<TokenObtainPair> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/token/login/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  public static tokenRefreshCreate(requestBody: TokenRefreshRequest): CancelablePromise<TokenRefresh> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/token/refresh/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  public static tokenVerifyCreate(requestBody: TokenVerifyRequest): CancelablePromise<unknown> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/token/verify/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
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
