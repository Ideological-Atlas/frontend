import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import type { Me } from '@/lib/client/models/Me';

interface AuthState {
  user: Me | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAccessToken: (token: string) => void;
  setUser: (user: Me) => void;
  login: (data: { access: string; refresh: string; user?: Me }) => void;
  logout: () => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      setAccessToken: token => set({ accessToken: token }),
      setUser: user => set({ user, isAuthenticated: true }),
      setIsLoading: loading => set({ isLoading: loading }),
      login: ({ access, refresh, user }) => {
        Cookies.set('access_token', access, { secure: true, sameSite: 'strict' });
        Cookies.set('refresh_token', refresh, { expires: 7, secure: true, sameSite: 'strict' });
        set({
          accessToken: access,
          isAuthenticated: true,
          user: user || null,
        });
      },
      logout: () => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
