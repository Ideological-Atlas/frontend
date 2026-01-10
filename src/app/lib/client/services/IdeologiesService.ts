/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { IdeologyDetail } from '../models/IdeologyDetail';
import type { PaginatedIdeologyListList } from '../models/PaginatedIdeologyListList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class IdeologiesService {
  /**
   * List all ideologies
   * Returns a paginated list of ideologies. Supports filtering by related entities and text search.
   * @param country Filter by Country ID (Integer)
   * @param limit Número de resultados a devolver por página.
   * @param offset El índice inicial a partir del cual devolver los resultados.
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
