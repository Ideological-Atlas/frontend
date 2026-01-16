/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { PaginatedIdeologyAbstractionComplexityList } from '../models/PaginatedIdeologyAbstractionComplexityList';
import type { PaginatedIdeologyAxisList } from '../models/PaginatedIdeologyAxisList';
import type { PaginatedIdeologyConditionerList } from '../models/PaginatedIdeologyConditionerList';
import type { PaginatedIdeologySectionList } from '../models/PaginatedIdeologySectionList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StructureService {
  /**
   * List all abstraction complexities
   * Returns a list of all available complexity levels for the test.
   * @param limit Number of results to return per page.
   * @param offset The initial index from which to return the results.
   * @returns PaginatedIdeologyAbstractionComplexityList
   * @throws ApiError
   */
  public static structureComplexitiesList(
    limit?: number,
    offset?: number,
  ): CancelablePromise<PaginatedIdeologyAbstractionComplexityList> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/structure/complexities/',
      query: {
        limit: limit,
        offset: offset,
      },
    });
  }
  /**
   * List all relevant conditioners by complexity
   * Returns ALL conditioners relevant for a complexity level. This includes conditioners attached to sections, axes, AND recursive dependencies (conditioners required by other conditioners).
   * @param complexityUuid UUID of the Abstraction Complexity
   * @param limit Number of results to return per page.
   * @param offset The initial index from which to return the results.
   * @returns PaginatedIdeologyConditionerList
   * @throws ApiError
   */
  public static structureConditionersAggregatedList(
    complexityUuid: string,
    limit?: number,
    offset?: number,
  ): CancelablePromise<PaginatedIdeologyConditionerList> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/structure/conditioners/{complexity_uuid}/aggregated/',
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
   * List sections by complexity
   * Returns all sections associated with a specific abstraction complexity UUID.
   * @param complexityUuid UUID of the Abstraction Complexity
   * @param limit Number of results to return per page.
   * @param offset The initial index from which to return the results.
   * @returns PaginatedIdeologySectionList
   * @throws ApiError
   */
  public static structureSectionsList(
    complexityUuid: string,
    limit?: number,
    offset?: number,
  ): CancelablePromise<PaginatedIdeologySectionList> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/structure/sections/{complexity_uuid}/',
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
   * List axes by section
   * Returns all axes (including their conditioners) for a specific section UUID.
   * @param sectionUuid UUID of the Ideology Section
   * @param limit Number of results to return per page.
   * @param offset The initial index from which to return the results.
   * @returns PaginatedIdeologyAxisList
   * @throws ApiError
   */
  public static structureSectionsAxesList(
    sectionUuid: string,
    limit?: number,
    offset?: number,
  ): CancelablePromise<PaginatedIdeologyAxisList> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/structure/sections/{section_uuid}/axes/',
      path: {
        section_uuid: sectionUuid,
      },
      query: {
        limit: limit,
        offset: offset,
      },
    });
  }
}
