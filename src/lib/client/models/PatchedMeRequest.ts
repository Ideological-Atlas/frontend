/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { AppearanceEnum } from './AppearanceEnum';
export type PatchedMeRequest = {
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   */
  username?: string;
  first_name?: string;
  last_name?: string;
  preferred_language?: string;
  /**
   * User bio
   */
  bio?: string | null;
  appearance?: AppearanceEnum;
  is_public?: boolean;
  /**
   * Field showing whether or not the user has completed the atlas onboarding.
   */
  atlas_onboarding_completed?: boolean;
};
