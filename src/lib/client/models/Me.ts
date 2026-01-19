/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { AppearanceEnum } from './AppearanceEnum';
import type { AuthProviderEnum } from './AuthProviderEnum';
export type Me = {
  readonly uuid: string;
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   */
  username: string;
  readonly email: string;
  first_name?: string;
  last_name?: string;
  /**
   * Field that shows if the user is verified or not.
   */
  readonly is_verified: boolean;
  preferred_language?: string;
  /**
   * The provider used for the user authentication/registration.
   *
   * * `internal` - Internal
   * * `google` - Google
   */
  readonly auth_provider: AuthProviderEnum;
  /**
   * User bio
   */
  bio?: string | null;
  appearance?: AppearanceEnum;
  is_public?: boolean;
};
