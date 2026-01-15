/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { IdeologySectionConditioner } from './IdeologySectionConditioner';
export type IdeologySection = {
  readonly uuid: string;
  /**
   * The title of the thematic section (e.g., 'Economics', 'Social Structure').
   */
  name: string;
  /**
   * A summary of the topics and concepts covered in this section.
   */
  description?: string | null;
  /**
   * Visual representation for this section. SVG or PNG formats are recommended.
   */
  icon?: string | null;
  readonly condition_rules: Array<IdeologySectionConditioner>;
};
