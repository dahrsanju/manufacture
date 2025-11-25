import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthResponse, UserCompany } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  companyId: string | null;
  companies: UserCompany[];
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (auth: AuthResponse) => void;
  setCompany: (companyId: string) => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: Partial<User>) => void;
  clearAuth: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      companyId: null,
      companies: [],
      permissions: [],
      isAuthenticated: false,
      isLoading: false,

      setAuth: (auth) => {
        const defaultCompany = auth.companies.find((c) => c.isDefault) || auth.companies[0];
        set({
          user: auth.user,
          accessToken: auth.accessToken,
          refreshToken: auth.refreshToken,
          companies: auth.companies,
          permissions: auth.permissions,
          companyId: defaultCompany?.companyId || null,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      setCompany: (companyId) => {
        const company = get().companies.find((c) => c.companyId === companyId);
        if (company) {
          set({
            companyId,
            permissions: company.permissions,
          });
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          companyId: null,
          companies: [],
          permissions: [],
          isAuthenticated: false,
          isLoading: false,
        }),

      hasPermission: (permission) => {
        const { permissions } = get();
        return permissions.includes('all') || permissions.includes(permission);
      },

      hasRole: (role) => {
        const { companies, companyId } = get();
        const currentCompany = companies.find((c) => c.companyId === companyId);
        return currentCompany?.role === role;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        companyId: state.companyId,
        companies: state.companies,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
