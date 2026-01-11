/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type IdeologyAbstractionComplexity = {
  readonly uuid: string;
  /**
   * The label for this level of abstraction (e.g., 'Concrete', 'Theoretical', 'Metaphysical').
   */
  name: string;
  /**
   * Detailed explanation of the characteristics that define this complexity level.
   */
  description?: string | null;
  /**
   * A numerical value used to rank and order the levels of abstraction (e.g., 1 for lowest, 10 for highest).
   */
  complexity: number;
};
