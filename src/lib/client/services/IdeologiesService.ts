/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { IdeologyAxisDefinition } from '../models/IdeologyAxisDefinition';
import type { IdeologyAxisDefinitionUpsertRequest } from '../models/IdeologyAxisDefinitionUpsertRequest';
import type { IdeologyConditionerDefinition } from '../models/IdeologyConditionerDefinition';
import type { IdeologyConditionerDefinitionUpsertRequest } from '../models/IdeologyConditionerDefinitionUpsertRequest';
import type { IdeologyDetail } from '../models/IdeologyDetail';
import type { PaginatedIdeologyAxisDefinitionList } from '../models/PaginatedIdeologyAxisDefinitionList';
import type { PaginatedIdeologyConditionerDefinitionList } from '../models/PaginatedIdeologyConditionerDefinitionList';
import type { PaginatedIdeologyListList } from '../models/PaginatedIdeologyListList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class IdeologiesService {
  /**
   * List all ideologies
   * Returns a paginated list of ideologies. Supports filtering by related entities and text search.
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
}
