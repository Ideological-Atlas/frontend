/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CompletedAnswer } from '../models/CompletedAnswer';
import type { ConditionerAnswerRead } from '../models/ConditionerAnswerRead';
import type { ConditionerAnswerUpsertRequest } from '../models/ConditionerAnswerUpsertRequest';
import type { PaginatedConditionerAnswerReadList } from '../models/PaginatedConditionerAnswerReadList';
import type { PaginatedUserAxisAnswerReadList } from '../models/PaginatedUserAxisAnswerReadList';
import type { UserAxisAnswerRead } from '../models/UserAxisAnswerRead';
import type { UserAxisAnswerUpsertRequest } from '../models/UserAxisAnswerUpsertRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AnswersService {
  /**
   * List user axis answers by section
   * Returns the user's axis answers filtered by a specific ideology section.
   * @param sectionUuid UUID of the Ideology Section
   * @param limit Number of results to return per page.
   * @param offset The initial index from which to return the results.
   * @returns PaginatedUserAxisAnswerReadList
   * @throws ApiError
   */
  public static answersAxisListList(
    sectionUuid: string,
    limit?: number,
    offset?: number,
  ): CancelablePromise<PaginatedUserAxisAnswerReadList> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/answers/axis/{section_uuid}/list/',
      path: {
        section_uuid: sectionUuid,
      },
      query: {
        limit: limit,
        offset: offset,
      },
    });
  }
  /**
   * Upsert axis answer
   * Creates or updates the user's answer for a specific axis defined by UUID in URL. Allows marking answer as indifferent (null value).
   * @param uuid UUID of the Axis to answer
   * @param requestBody
   * @returns UserAxisAnswerRead
   * @throws ApiError
   */
  public static answersAxisCreate(
    uuid: string,
    requestBody?: UserAxisAnswerUpsertRequest,
  ): CancelablePromise<UserAxisAnswerRead> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/answers/axis/{uuid}/',
      path: {
        uuid: uuid,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Delete axis answer
   * Deletes the user's answer for the specific axis defined by UUID in URL.
   * @param uuid UUID of the Axis whose answer you want to delete
   * @returns void
   * @throws ApiError
   */
  public static answersAxisDeleteDestroy(uuid: string): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/answers/axis/{uuid}/delete/',
      path: {
        uuid: uuid,
      },
    });
  }
  /**
   * Generate completed answer snapshot
   * Triggers the calculation of the user's current results, saves it as a CompletedAnswer, and returns the structured data.
   * @returns CompletedAnswer
   * @throws ApiError
   */
  public static answersCompletedGenerateCreate(): CancelablePromise<CompletedAnswer> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/answers/completed/generate/',
    });
  }
  /**
   * Get latest completed answer
   * Returns the latest completed answer for the authenticated user as a single object. Returns 404 if no answer exists.
   * @returns CompletedAnswer
   * @throws ApiError
   */
  public static answersCompletedLatestRetrieve(): CancelablePromise<CompletedAnswer> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/answers/completed/latest/',
      errors: {
        404: `No response body`,
      },
    });
  }
  /**
   * List user conditioner answers by complexity
   * Returns the user's conditioner answers filtered by abstraction complexity (via sections or axes).
   * @param complexityUuid UUID of the Abstraction Complexity
   * @param limit Number of results to return per page.
   * @param offset The initial index from which to return the results.
   * @returns PaginatedConditionerAnswerReadList
   * @throws ApiError
   */
  public static answersConditionerListList(
    complexityUuid: string,
    limit?: number,
    offset?: number,
  ): CancelablePromise<PaginatedConditionerAnswerReadList> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/answers/conditioner/{complexity_uuid}/list/',
      path: {
        complexity_uuid: complexityUuid,
      },
      query: {
        limit: limit,
        offset: offset,
      },
    });
  }
  /**
   * Upsert conditioner answer
   * Creates or updates the user's answer for a specific conditioner defined by UUID in URL.
   * @param uuid UUID of the Conditioner to answer
   * @param requestBody
   * @returns ConditionerAnswerRead
   * @throws ApiError
   */
  public static answersConditionerCreate(
    uuid: string,
    requestBody: ConditionerAnswerUpsertRequest,
  ): CancelablePromise<ConditionerAnswerRead> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/answers/conditioner/{uuid}/',
      path: {
        uuid: uuid,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Delete conditioner answer
   * Deletes the user's answer for the specific conditioner defined by UUID in URL.
   * @param uuid UUID of the Conditioner whose answer you want to delete
   * @returns void
   * @throws ApiError
   */
  public static answersConditionerDeleteDestroy(uuid: string): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/answers/conditioner/{uuid}/delete/',
      path: {
        uuid: uuid,
      },
    });
  }
}
