import type { AxisAnswerRead } from '../models/AxisAnswerRead';
import type { AxisAnswerUpsertRequest } from '../models/AxisAnswerUpsertRequest';
import type { CompletedAnswer } from '../models/CompletedAnswer';
import type { ConditionerAnswerRead } from '../models/ConditionerAnswerRead';
import type { ConditionerAnswerUpsertRequest } from '../models/ConditionerAnswerUpsertRequest';
import type { PaginatedAxisAnswerReadList } from '../models/PaginatedAxisAnswerReadList';
import type { PaginatedConditionerAnswerReadList } from '../models/PaginatedConditionerAnswerReadList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AnswersService {
  public static answersAxisListList(
    sectionUuid: string,
    limit?: number,
    offset?: number,
  ): CancelablePromise<PaginatedAxisAnswerReadList> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/answers/axis/{section_uuid}/list/',
      path: {
        section_uuid: sectionUuid,
      },
      query: {
        limit: limit,
        offset: offset,
      },
    });
  }
  public static answersAxisCreate(
    uuid: string,
    requestBody: AxisAnswerUpsertRequest,
  ): CancelablePromise<AxisAnswerRead> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/answers/axis/{uuid}/',
      path: {
        uuid: uuid,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  public static answersCompletedGenerateCreate(): CancelablePromise<CompletedAnswer> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/answers/completed/generate/',
    });
  }
  public static answersCompletedLatestRetrieve(): CancelablePromise<CompletedAnswer> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/answers/completed/latest/',
      errors: {
        404: `No response body`,
      },
    });
  }
  public static answersConditionerListList(
    complexityUuid: string,
    limit?: number,
    offset?: number,
  ): CancelablePromise<PaginatedConditionerAnswerReadList> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/answers/conditioner/{complexity_uuid}/list/',
      path: {
        complexity_uuid: complexityUuid,
      },
      query: {
        limit: limit,
        offset: offset,
      },
    });
  }
  public static answersConditionerCreate(
    uuid: string,
    requestBody: ConditionerAnswerUpsertRequest,
  ): CancelablePromise<ConditionerAnswerRead> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/answers/conditioner/{uuid}/',
      path: {
        uuid: uuid,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
