import { OpenAPI } from './client';
import { env } from '@/env';

export const configureOpenAPI = () => {
  // Establece la URL base desde las variables de entorno
  OpenAPI.BASE = env.NEXT_PUBLIC_API_BASE_URL;
  // Establece la versión si existe
  OpenAPI.VERSION = env.NEXT_PUBLIC_API_VERSION;
};
