'use server';

import { cookies } from 'next/headers';
import { AuthService } from '@/lib/client/services/AuthService';
import { ApiError } from '@/lib/client/core/ApiError';
import { OpenAPI } from '@/lib/client/core/OpenAPI';
import { env } from '@/env';
import type { LoginSchema, RegisterSchema } from '@/lib/schemas/auth';

OpenAPI.BASE = env.NEXT_PUBLIC_API_BASE_URL;
OpenAPI.VERSION = env.NEXT_PUBLIC_API_VERSION;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

async function setAuthCookies(access: string, refresh: string) {
  const cookieStore = await cookies();

  cookieStore.set('access_token', access, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24,
  });

  cookieStore.set('refresh_token', refresh, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function loginAction(data: LoginSchema) {
  OpenAPI.BASE = env.NEXT_PUBLIC_API_BASE_URL;

  try {
    const response = await AuthService.tokenLoginCreate(data);
    await setAuthCookies(response.access, response.refresh);

    return {
      success: true,
      user: response.user,
      access: response.access,
      refresh: response.refresh,
    };
  } catch (error: unknown) {
    console.error('❌ SERVER ACTION LOGIN ERROR:', error);

    let errorMessage = 'Login failed';
    if (error instanceof ApiError) {
      errorMessage = error.body?.detail || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

export async function registerAction(data: RegisterSchema) {
  OpenAPI.BASE = env.NEXT_PUBLIC_API_BASE_URL;

  try {
    const response = await AuthService.registerCreate({
      email: data.email,
      password: data.password,
    });
    await setAuthCookies(response.access, response.refresh);

    return {
      success: true,
      user: response.user,
      access: response.access,
      refresh: response.refresh,
    };
  } catch (error: unknown) {
    console.error('❌ SERVER ACTION REGISTER ERROR:', error);
    let errorBody: unknown = null;
    if (error instanceof ApiError) {
      errorBody = error.body;
    }
    return { success: false, errorBody };
  }
}

export async function googleLoginAction(token: string) {
  OpenAPI.BASE = env.NEXT_PUBLIC_API_BASE_URL;

  try {
    const response = await AuthService.loginGoogleCreate({ token });
    await setAuthCookies(response.access, response.refresh);

    return {
      success: true,
      user: response.user,
      access: response.access,
      refresh: response.refresh,
    };
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

export async function refreshAuthTokenAction() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!refreshToken) {
    return { success: false };
  }

  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      const txt = await response.text();
      console.error('❌ REFRESH TOKEN FAILED (Status):', response.status, txt);
      await logoutAction();
      return { success: false };
    }

    const data = await response.json();
    const newAccess = data.access;
    const newRefresh = data.refresh || refreshToken;

    await setAuthCookies(newAccess, newRefresh);

    return { success: true, access: newAccess, refresh: newRefresh };
  } catch (error) {
    console.error('❌ REFRESH TOKEN ERROR (Network/Server):', error);
    await logoutAction();
    return { success: false };
  }
}
