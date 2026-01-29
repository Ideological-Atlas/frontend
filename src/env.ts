import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
  },
  client: {
    NEXT_PUBLIC_LANG: z.enum(['es', 'en']).default('es'),
    NEXT_PUBLIC_API_BASE_URL: z.string().url(),
    NEXT_PUBLIC_API_VERSION: z.string().default('v1'),
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().min(1),
    NEXT_PUBLIC_HERO_IMAGE_URL: z.string().url(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_LANG: process.env.NEXT_PUBLIC_LANG,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_API_VERSION: process.env.NEXT_PUBLIC_API_VERSION,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_HERO_IMAGE_URL: process.env.NEXT_PUBLIC_HERO_IMAGE_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
