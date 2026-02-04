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
   * Get or update current profile
   * Retrieve the profile information of the currently authenticated user or update their details.
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
   * Get or update current profile
   * Retrieve the profile information of the currently authenticated user or update their details.
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
   * Get or update current profile
   * Retrieve the profile information of the currently authenticated user or update their details.
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
   * Set user password
   * Allows an authenticated user (e.g., logged in via Google) to set a password so they can use standard login in the future.
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
   * Set user password
   * Allows an authenticated user (e.g., logged in via Google) to set a password so they can use standard login in the future.
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
