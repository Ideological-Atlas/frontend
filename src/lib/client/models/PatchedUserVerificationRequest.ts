/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { AppearanceEnum } from './AppearanceEnum';
export type PatchedUserVerificationRequest = {
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   */
  username?: string;
  /**
   * User bio
   */
  bio?: string | null;
  appearance?: AppearanceEnum;
  is_public?: boolean;
};
