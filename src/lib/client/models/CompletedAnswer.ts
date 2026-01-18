/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SimpleUser } from './SimpleUser';
export type CompletedAnswer = {
  readonly uuid: string;
  readonly created: string;
  /**
   * Structured JSON containing the full set of answers provided by the user.
   */
  readonly answers: any;
  readonly completed_by: SimpleUser;
};
