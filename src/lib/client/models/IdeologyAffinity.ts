/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { ComplexityAffinity } from './ComplexityAffinity';
import type { TargetIdeology } from './TargetIdeology';
export type IdeologyAffinity = {
  readonly target_ideology: TargetIdeology | null;
  /**
   * Overall affinity percentage. Null if no common axes.
   */
  total_affinity: number | null;
  /**
   * Affinity grouped by abstraction level.
   */
  complexities: Array<ComplexityAffinity>;
};
