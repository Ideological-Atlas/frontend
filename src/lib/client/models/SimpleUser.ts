/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type SimpleUser = {
  readonly uuid: string;
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   */
  username: string;
  /**
   * User bio
   */
  bio?: string | null;
};
