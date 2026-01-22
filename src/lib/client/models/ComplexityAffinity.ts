/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { SectionAffinity } from './SectionAffinity';
import type { SimpleComplexity } from './SimpleComplexity';
export type ComplexityAffinity = {
  complexity: SimpleComplexity | null;
  affinity: number;
  sections: Array<SectionAffinity>;
};
