import { OpenAPI } from './client';
import { env } from '@/env';

export const configureOpenAPI = () => {
  OpenAPI.BASE = env.NEXT_PUBLIC_API_BASE_URL;
  OpenAPI.VERSION = env.NEXT_PUBLIC_API_VERSION;
};
