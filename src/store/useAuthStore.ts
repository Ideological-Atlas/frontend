import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { logoutAction } from '@/actions/auth';
import type { Me } from '@/lib/client/models/Me';

interface AuthState {
  user: Me | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: Me) => void;
  loginSuccess: (user: Me) => void;
  logout: () => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      setIsLoading: loading => set({ isLoading: loading }),

      setUser: user => set({ user, isAuthenticated: true }),

      loginSuccess: user => {
        set({
          isAuthenticated: true,
          user: user,
        });
      },

      logout: () => {
        logoutAction();
        set({ user: null, isAuthenticated: false });
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
