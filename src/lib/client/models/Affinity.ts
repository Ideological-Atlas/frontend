/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { SimpleUser } from './SimpleUser';
export type Affinity = {
  readonly target_user: SimpleUser;
  /**
   * Calculated affinity percentage (0-100).
   */
  affinity: number;
};
