'use server';

import { cookies } from 'next/headers';
import { AuthService } from '@/lib/client/services/AuthService';
import { OpenAPI } from '@/lib/client/core/OpenAPI';
import { ApiError } from '@/lib/client/core/ApiError';
import { env } from '@/env';
import type { LoginSchema, RegisterSchema } from '@/lib/schemas/auth';

OpenAPI.BASE = env.NEXT_PUBLIC_API_BASE_URL;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

async function setAuthCookies(access: string, refresh: string) {
  const cookieStore = await cookies();

  cookieStore.set('access_token', access, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 30,
  });

  cookieStore.set('refresh_token', refresh, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function loginAction(data: LoginSchema) {
  try {
    const response = await AuthService.tokenLoginCreate(data);
    await setAuthCookies(response.access, response.refresh);
    return { success: true, user: response.user };
  } catch (error: unknown) {
    let errorMessage = 'Login failed';
    if (error instanceof ApiError) {
      errorMessage = error.body?.detail || errorMessage;
    }
    return { success: false, error: errorMessage };
  }
}

export async function registerAction(data: RegisterSchema) {
  try {
    const response = await AuthService.registerCreate({
      email: data.email,
      password: data.password,
    });
    await setAuthCookies(response.access, response.refresh);
    return { success: true, user: response.user };
  } catch (error: unknown) {
    let errorBody: unknown = null;
    if (error instanceof ApiError) {
      errorBody = error.body;
    }
    return { success: false, errorBody };
  }
}

export async function googleLoginAction(token: string) {
  try {
    const response = await AuthService.loginGoogleCreate({ token });
    await setAuthCookies(response.access, response.refresh);
    return { success: true, user: response.user };
  } catch {
    return { success: false, error: 'Google login failed' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
  return { success: true };
}
