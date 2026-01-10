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
   * Listar todas las complejidades de abstracción
   * Devuelve una lista de todos los niveles de complejidad disponibles para el test.
   * @param limit Número de resultados a devolver por página.
   * @param offset El índice inicial a partir del cual devolver los resultados.
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
   * Listar condicionadores por complejidad
   * Devuelve todos los condicionadores ideológicos asociados con un UUID de complejidad de abstracción específico.
   * @param complexityUuid UUID of the Abstraction Complexity
   * @param limit Número de resultados a devolver por página.
   * @param offset El índice inicial a partir del cual devolver los resultados.
   * @returns PaginatedIdeologyConditionerList
   * @throws ApiError
   */
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
  /**
   * Listar secciones por complejidad
   * Devuelve todas las secciones asociadas con un UUID de complejidad de abstracción específico.
   * @param complexityUuid UUID of the Abstraction Complexity
   * @param limit Número de resultados a devolver por página.
   * @param offset El índice inicial a partir del cual devolver los resultados.
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
   * Listar ejes por sección
   * Devuelve todos los ejes (incluyendo sus condicionadores) para un UUID de sección específico.
   * @param sectionUuid UUID of the Ideology Section
   * @param limit Número de resultados a devolver por página.
   * @param offset El índice inicial a partir del cual devolver los resultados.
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
