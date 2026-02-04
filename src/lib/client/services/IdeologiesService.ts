/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { IdeologyAffinity } from '../models/IdeologyAffinity';
import type { IdeologyAxisDefinition } from '../models/IdeologyAxisDefinition';
import type { IdeologyAxisDefinitionUpsertRequest } from '../models/IdeologyAxisDefinitionUpsertRequest';
import type { IdeologyConditionerDefinition } from '../models/IdeologyConditionerDefinition';
import type { IdeologyConditionerDefinitionUpsertRequest } from '../models/IdeologyConditionerDefinitionUpsertRequest';
import type { IdeologyDetail } from '../models/IdeologyDetail';
import type { PaginatedIdeologyAxisDefinitionList } from '../models/PaginatedIdeologyAxisDefinitionList';
import type { PaginatedIdeologyConditionerDefinitionList } from '../models/PaginatedIdeologyConditionerDefinitionList';
import type { PaginatedIdeologyListList } from '../models/PaginatedIdeologyListList';
import type { PaginatedReligionList } from '../models/PaginatedReligionList';
import type { PaginatedTagList } from '../models/PaginatedTagList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class IdeologiesService {
  /**
   * List all ideologies
   * Returns a paginated list of ideologies with at least 15 axis definitions. Supports filtering by related entities and text search.
   * @param country Filter by Country ID (Integer)
   * @param limit Number of results to return per page.
   * @param offset The initial index from which to return the results.
   * @param region Filter by Region ID (Integer)
   * @param religion Filter by Religion UUID
   * @param search Search by name or descriptions
   * @param tag Filter by Tag UUID
   * @returns PaginatedIdeologyListList
   * @throws ApiError
   */
  public static ideologiesList(
    country?: number,
    limit?: number,
    offset?: number,
    region?: number,
    religion?: string,
    search?: string,
    tag?: string,
  ): CancelablePromise<PaginatedIdeologyListList> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/ideologies/',
      query: {
        country: country,
        limit: limit,
        offset: offset,
        region: region,
        religion: religion,
        search: search,
        tag: tag,
      },
    });
  }
  /**
   * Calculate affinity with an Ideology
   * Calculates the ideological affinity (0-100%) between a source (Authenticated User or CompletedAnswer UUID) and a target Ideology.
   * @param ideologyUuid UUID of the target Ideology
   * @param sourceAnswerUuid UUID of the source CompletedAnswer (required if anonymous)
   * @returns IdeologyAffinity
   * @throws ApiError
   */
  public static ideologiesAffinityRetrieve(
    ideologyUuid: string,
    sourceAnswerUuid?: string,
  ): CancelablePromise<IdeologyAffinity> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/ideologies/{ideology_uuid}/affinity/',
      path: {
        ideology_uuid: ideologyUuid,
      },
      query: {
        source_answer_uuid: sourceAnswerUuid,
      },
    });
  }
  /**
   * List axis definitions by ideology
   * Returns the axis definitions for a specific ideology.
   * @param ideologyUuid UUID of the Ideology
   * @param limit Number of results to return per page.
   * @param offset The initial index from which to return the results.
   * @returns PaginatedIdeologyAxisDefinitionList
   * @throws ApiError
   */
  public static ideologiesDefinitionsAxisList(
    ideologyUuid: string,
    limit?: number,
    offset?: number,
  ): CancelablePromise<PaginatedIdeologyAxisDefinitionList> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/ideologies/{ideology_uuid}/definitions/axis/',
      path: {
        ideology_uuid: ideologyUuid,
      },
      query: {
        limit: limit,
        offset: offset,
      },
    });
  }
  /**
   * Upsert ideology axis definition
   * Creates or updates the definition for a specific ideology and axis. Requires admin permissions.
   * @param axisUuid UUID of the Axis
   * @param ideologyUuid UUID of the Ideology
   * @param requestBody
   * @returns IdeologyAxisDefinition
   * @throws ApiError
   */
  public static ideologiesDefinitionsAxisCreate(
    axisUuid: string,
    ideologyUuid: string,
    requestBody?: IdeologyAxisDefinitionUpsertRequest,
  ): CancelablePromise<IdeologyAxisDefinition> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/ideologies/{ideology_uuid}/definitions/axis/{axis_uuid}/',
      path: {
        axis_uuid: axisUuid,
        ideology_uuid: ideologyUuid,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Delete ideology axis definition
   * Deletes the definition for a specific ideology and axis. Requires admin permissions.
   * @param axisUuid UUID of the Axis
   * @param ideologyUuid UUID of the Ideology
   * @returns void
   * @throws ApiError
   */
  public static ideologiesDefinitionsAxisDeleteDestroy(
    axisUuid: string,
    ideologyUuid: string,
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/ideologies/{ideology_uuid}/definitions/axis/{axis_uuid}/delete/',
      path: {
        axis_uuid: axisUuid,
        ideology_uuid: ideologyUuid,
      },
    });
  }
  /**
   * List conditioner definitions by ideology
   * Returns the conditioner definitions for a specific ideology.
   * @param ideologyUuid UUID of the Ideology
   * @param limit Number of results to return per page.
   * @param offset The initial index from which to return the results.
   * @returns PaginatedIdeologyConditionerDefinitionList
   * @throws ApiError
   */
  public static ideologiesDefinitionsConditionerList(
    ideologyUuid: string,
    limit?: number,
    offset?: number,
  ): CancelablePromise<PaginatedIdeologyConditionerDefinitionList> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/ideologies/{ideology_uuid}/definitions/conditioner/',
      path: {
        ideology_uuid: ideologyUuid,
      },
      query: {
        limit: limit,
        offset: offset,
      },
    });
  }
  /**
   * Upsert ideology conditioner definition
   * Creates or updates the conditioner definition for a specific ideology. Requires admin permissions.
   * @param conditionerUuid UUID of the Conditioner
   * @param ideologyUuid UUID of the Ideology
   * @param requestBody
   * @returns IdeologyConditionerDefinition
   * @throws ApiError
   */
  public static ideologiesDefinitionsConditionerCreate(
    conditionerUuid: string,
    ideologyUuid: string,
    requestBody: IdeologyConditionerDefinitionUpsertRequest,
  ): CancelablePromise<IdeologyConditionerDefinition> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/ideologies/{ideology_uuid}/definitions/conditioner/{conditioner_uuid}/',
      path: {
        conditioner_uuid: conditionerUuid,
        ideology_uuid: ideologyUuid,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Delete ideology conditioner definition
   * Deletes the conditioner definition for a specific ideology. Requires admin permissions.
   * @param conditionerUuid UUID of the Conditioner
   * @param ideologyUuid UUID of the Ideology
   * @returns void
   * @throws ApiError
   */
  public static ideologiesDefinitionsConditionerDeleteDestroy(
    conditionerUuid: string,
    ideologyUuid: string,
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/ideologies/{ideology_uuid}/definitions/conditioner/{conditioner_uuid}/delete/',
      path: {
        conditioner_uuid: conditionerUuid,
        ideology_uuid: ideologyUuid,
      },
    });
  }
  /**
   * Get ideology details
   * Returns details of a specific ideology including its definition values (axis and conditioners).
   * @param uuid
   * @returns IdeologyDetail
   * @throws ApiError
   */
  public static ideologiesRetrieve(uuid: string): CancelablePromise<IdeologyDetail> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/ideologies/{uuid}/',
      path: {
        uuid: uuid,
      },
    });
  }
  /**
   * List all religions
   * Returns a list of all available religions.
   * @param limit Number of results to return per page.
   * @param offset The initial index from which to return the results.
   * @param search Search by name
   * @returns PaginatedReligionList
   * @throws ApiError
   */
  public static ideologiesReligionsList(
    limit?: number,
    offset?: number,
    search?: string,
  ): CancelablePromise<PaginatedReligionList> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/ideologies/religions/',
      query: {
        limit: limit,
        offset: offset,
        search: search,
      },
    });
  }
  /**
   * List all tags
   * Returns a list of all available tags.
   * @param limit Number of results to return per page.
   * @param offset The initial index from which to return the results.
   * @param search Search by name
   * @returns PaginatedTagList
   * @throws ApiError
   */
  public static ideologiesTagsList(
    limit?: number,
    offset?: number,
    search?: string,
  ): CancelablePromise<PaginatedTagList> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/ideologies/tags/',
      query: {
        limit: limit,
        offset: offset,
        search: search,
      },
    });
  }
}
