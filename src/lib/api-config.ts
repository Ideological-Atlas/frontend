import { OpenAPI } from './client';

export const configureOpenAPI = () => {
  OpenAPI.BASE = '';
  OpenAPI.VERSION = '';
  OpenAPI.TOKEN = undefined;
};

configureOpenAPI();
