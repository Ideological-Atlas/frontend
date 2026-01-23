import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { logoutAction } from '@/actions/auth';
import type { Me } from '@/lib/client/models/Me';
import Cookies from 'js-cookie';

interface AuthState {
  user: Me | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: Me) => void;
  setTokens: (access: string, refresh: string) => void;
  loginSuccess: (user: Me, access: string, refresh: string) => void;
  logout: () => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      setIsLoading: loading => set({ isLoading: loading }),

      setUser: user => set({ user, isAuthenticated: true }),

      setTokens: (access, refresh) => {
        Cookies.set('access_token', access, { expires: 1, sameSite: 'Strict' });
        Cookies.set('refresh_token', refresh, { expires: 7, sameSite: 'Strict' });

        set({ accessToken: access, refreshToken: refresh });
      },

      loginSuccess: (user, access, refresh) => {
        Cookies.set('access_token', access, { expires: 1, sameSite: 'Strict' });
        Cookies.set('refresh_token', refresh, { expires: 7, sameSite: 'Strict' });

        set({
          isAuthenticated: true,
          user: user,
          accessToken: access,
          refreshToken: refresh,
        });
      },

      logout: () => {
        logoutAction();
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');

        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
