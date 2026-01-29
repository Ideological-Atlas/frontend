import { useAuthStore } from '@/store/useAuthStore';
import { refreshAuthTokenAction, logoutAction as logoutServerAction } from '@/actions/auth';

export async function logoutAction() {
  await logoutServerAction();
  return { success: true };
}

export async function refreshAuthTokenClean() {
  try {
    const result = await refreshAuthTokenAction();

    if (result.success && result.access && result.refresh) {
      useAuthStore.getState().setTokens(result.access, result.refresh);
      return { success: true };
    }

    useAuthStore.getState().logout();
    return { success: false };
  } catch (error) {
    console.error('Error in clean refresh:', error);
    useAuthStore.getState().logout();
    return { success: false };
  }
}
