import { AuthService } from '@/lib/client/services/AuthService';
import { ApiError } from '@/lib/client/core/ApiError';
import { env } from '@/env';
import { useAuthStore } from '@/store/useAuthStore';
import type { LoginSchema, RegisterSchema } from '@/lib/schemas/auth';

export async function loginAction(data: LoginSchema) {
  try {
    const response = await AuthService.tokenLoginCreate(data);
    return {
      success: true,
      user: response.user,
      access: response.access,
      refresh: response.refresh,
    };
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
    return {
      success: true,
      user: response.user,
      access: response.access,
      refresh: response.refresh,
    };
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
  return { success: true };
}

export async function refreshAuthTokenAction() {
  const { refreshToken, setTokens, logout } = useAuthStore.getState();

  if (!refreshToken) {
    return { success: false };
  }

  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      logout();
      return { success: false };
    }

    const data = await response.json();
    const newAccess = data.access;
    const newRefresh = data.refresh || refreshToken;

    setTokens(newAccess, newRefresh);

    return { success: true };
  } catch (error) {
    console.error('Error refreshing token:', error);
    logout();
    return { success: false };
  }
}
