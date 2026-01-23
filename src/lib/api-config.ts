import { OpenAPI } from './client';
import { env } from '@/env';
import { useAuthStore } from '@/store/useAuthStore';

export const configureOpenAPI = () => {
  OpenAPI.BASE = env.NEXT_PUBLIC_API_BASE_URL;
  OpenAPI.VERSION = env.NEXT_PUBLIC_API_VERSION;

  OpenAPI.TOKEN = async () => {
    const token = useAuthStore.getState().accessToken;
    return token || '';
  };
};

configureOpenAPI();
