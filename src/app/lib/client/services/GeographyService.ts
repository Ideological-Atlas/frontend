/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { PaginatedCountryList } from '../models/PaginatedCountryList';
import type { PaginatedRegionList } from '../models/PaginatedRegionList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GeographyService {
  /**
   * Listar todos los países
   * Listar los países disponibles en la base de datos.
   * @param limit Número de resultados a devolver por página.
   * @param offset El índice inicial a partir del cual devolver los resultados.
   * @param search Buscar por nombre
   * @returns PaginatedCountryList
   * @throws ApiError
   */
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
  /**
   * Listar regiones
   * Listar regiones, opcionalmente filtradas por país.
   * @param countryId Filtrar por ID de país
   * @param limit Número de resultados a devolver por página.
   * @param offset El índice inicial a partir del cual devolver los resultados.
   * @param search Buscar por nombre
   * @returns PaginatedRegionList
   * @throws ApiError
   */
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
