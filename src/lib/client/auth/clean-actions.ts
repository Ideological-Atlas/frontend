import { useAuthStore } from '@/store/useAuthStore';
import { env } from '@/env';

/**
 * Logout action that doesn't depend on AuthService to avoid circular dependencies.
 */
export async function logoutAction() {
  // Aquí podrías limpiar cookies del servidor si fuera necesario en el futuro
  return { success: true };
}

/**
 * Refreshes the auth token using fetch directly to avoid circular dependency with AuthService/request.ts
 */
export async function refreshAuthTokenClean() {
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
    // Si el backend rota el refresh token, úsalo; si no, mantén el viejo
    const newRefresh = data.refresh || refreshToken;

    setTokens(newAccess, newRefresh);

    return { success: true };
  } catch (error) {
    console.error('Error refreshing token:', error);
    logout();
    return { success: false };
  }
}
