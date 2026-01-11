import type { PaginatedCountryList } from '../models/PaginatedCountryList';
import type { PaginatedRegionList } from '../models/PaginatedRegionList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GeographyService {
  public static geographyCountriesList(
    limit?: number,
    offset?: number,
    search?: string,
  ): CancelablePromise<PaginatedCountryList> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/geography/countries/',
      query: {
        limit: limit,
        offset: offset,
        search: search,
      },
    });
  }
  public static geographyRegionsList(
    countryId?: number,
    limit?: number,
    offset?: number,
    search?: string,
  ): CancelablePromise<PaginatedRegionList> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/geography/regions/',
      query: {
        country_id: countryId,
        limit: limit,
        offset: offset,
        search: search,
      },
    });
  }
}
