import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '@/lib/api-client';
import type { User } from '@shared/types';
type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};
type AuthActions = {
  login: (credentials: Pick<User, 'name' | 'password'>) => Promise<void>;
  logout: () => void;
};
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (credentials) => {
        const user = await api<User>('/api/login', {
          method: 'POST',
          body: JSON.stringify(credentials),
        });
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);