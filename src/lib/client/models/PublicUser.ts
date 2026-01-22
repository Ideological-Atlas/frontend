/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type PublicUser = {
  readonly uuid: string;
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   */
  readonly username: string;
  /**
   * User bio
   */
  readonly bio: string | null;
  readonly is_public: boolean;
};
