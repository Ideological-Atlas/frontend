import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { logoutAction } from '@/lib/client/auth/clean-actions';
import type { Me } from '@/lib/client/models/Me';

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
        set({ accessToken: access, refreshToken: refresh });
      },
      loginSuccess: (user, access, refresh) => {
        set({
          isAuthenticated: true,
          user: user,
          accessToken: access,
          refreshToken: refresh,
        });
      },
      logout: async () => {
        await logoutAction();
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
