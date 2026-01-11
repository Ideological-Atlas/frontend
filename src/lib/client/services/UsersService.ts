import type { Me } from '../models/Me';
import type { MeRequest } from '../models/MeRequest';
import type { PatchedMeRequest } from '../models/PatchedMeRequest';
import type { PatchedUserSetPasswordRequest } from '../models/PatchedUserSetPasswordRequest';
import type { UserSetPasswordRequest } from '../models/UserSetPasswordRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
  public static meRetrieve(): CancelablePromise<Me> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/me/',
    });
  }
  public static meUpdate(requestBody: MeRequest): CancelablePromise<Me> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/me/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  public static mePartialUpdate(requestBody?: PatchedMeRequest): CancelablePromise<Me> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/me/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  public static mePasswordUpdate(requestBody: UserSetPasswordRequest): CancelablePromise<Me> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/me/password/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  public static mePasswordPartialUpdate(requestBody?: PatchedUserSetPasswordRequest): CancelablePromise<Me> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/me/password/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
