import type { IdeologyDetail } from '../models/IdeologyDetail';
import type { PaginatedIdeologyListList } from '../models/PaginatedIdeologyListList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class IdeologiesService {
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
