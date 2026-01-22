/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { ComplexityAffinity } from './ComplexityAffinity';
import type { PublicUser } from './PublicUser';
export type Affinity = {
  readonly target_user: PublicUser | null;
  /**
   * Overall affinity percentage.
   */
  total_affinity: number;
  /**
   * Affinity grouped by abstraction level.
   */
  complexities: Array<ComplexityAffinity>;
};
