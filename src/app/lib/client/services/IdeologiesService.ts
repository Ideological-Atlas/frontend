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
   * Listar todas las ideologías
   * Devuelve una lista paginada de ideologías. Admite filtrado por entidades relacionadas y búsqueda de texto.
   * @param country Filtrar por ID de país (Entero)
   * @param limit Número de resultados a devolver por página.
   * @param offset El índice inicial a partir del cual devolver los resultados.
   * @param region Filtrar por ID de región (Entero)
   * @param religion Filtrar por UUID de religión
   * @param search Buscar por nombre o descripciones
   * @param tag Filtrar por UUID de etiqueta
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
   * Obtener detalles de la ideología
   * Devuelve detalles de una ideología específica incluyendo sus valores de definición (ejes y condicionadores).
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
