/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type UserVerification = {
  readonly uuid: string;
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   */
  username: string;
  preferred_language?: string;
  /**
   * Field that shows if the user is verified or not.
   */
  readonly is_verified: boolean;
};
