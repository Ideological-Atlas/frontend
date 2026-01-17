import { cookies } from 'next/headers';
import { OpenAPI } from '@/lib/client/core/OpenAPI';
import { env } from '@/env';

export async function setupServerApi() {
  OpenAPI.BASE = env.NEXT_PUBLIC_API_BASE_URL;
  OpenAPI.VERSION = env.NEXT_PUBLIC_API_VERSION;

  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (token) {
    OpenAPI.TOKEN = token;
  } else {
    OpenAPI.TOKEN = undefined;
  }
}
