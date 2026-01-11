import { OpenAPI } from './client';
import { env } from '@/env';
import Cookies from 'js-cookie';

export const configureOpenAPI = () => {
  OpenAPI.BASE = env.NEXT_PUBLIC_API_BASE_URL;
  OpenAPI.VERSION = env.NEXT_PUBLIC_API_VERSION;

  OpenAPI.TOKEN = async () => {
    return Cookies.get('access_token') || '';
  };
};

configureOpenAPI();
