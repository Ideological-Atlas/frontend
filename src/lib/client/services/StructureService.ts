import type { PaginatedIdeologyAbstractionComplexityList } from '../models/PaginatedIdeologyAbstractionComplexityList';
import type { PaginatedIdeologyAxisList } from '../models/PaginatedIdeologyAxisList';
import type { PaginatedIdeologyConditionerList } from '../models/PaginatedIdeologyConditionerList';
import type { PaginatedIdeologySectionList } from '../models/PaginatedIdeologySectionList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StructureService {
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
  public static structureConditionersList(
    complexityUuid: string,
    limit?: number,
    offset?: number,
  ): CancelablePromise<PaginatedIdeologyConditionerList> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/structure/conditioners/{complexity_uuid}/',
      path: {
        complexity_uuid: complexityUuid,
      },
      query: {
        limit: limit,
        offset: offset,
      },
    });
  }
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
