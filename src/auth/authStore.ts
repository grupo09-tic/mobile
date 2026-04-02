import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, LoginCredentials, UserFromApi } from './authService';

const parsePermissions = (user: UserFromApi): string[] => {
  if (!user?.perfilUsuario?.permissao) return [];
  return user.perfilUsuario.permissao.flatMap((rotinaItem) =>
    rotinaItem.permissoes
      .filter((acaoItem) => acaoItem.permissao === 1)
      .map((acaoItem) => `${rotinaItem.rotina}.${acaoItem.acao}`),
  );
};

interface AuthState {
  user: UserFromApi | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
}

interface ResetPasswordForm {
  token: string;
  password: string;
  confirmPassword: string;
}

interface UpdatePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (credentials: ResetPasswordForm) => Promise<void>;
  updatePassword: (credentials: UpdatePasswordForm) => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      permissions: [],

      hasPermission: (permission: string) => get().permissions.includes(permission),

      login: async (credentials) => {
        await authService.login(credentials);
        const fullUser = await authService.getCurrentUser();
        if (fullUser) {
          set({
            user: fullUser,
            isAuthenticated: true,
            permissions: parsePermissions(fullUser),
          });
        } else {
          await get().logout();
          throw new Error('Falha ao carregar dados do usuário.');
        }
      },

      initializeAuth: async () => {
        try {
          const forceLogout = await AsyncStorage.getItem('force_logout');
          if (forceLogout === 'true') {
            await AsyncStorage.removeItem('force_logout');
            await get().logout();
            set({ isLoading: false });
            return;
          }

          const token = await authService.getAccessToken();
          if (!token) {
            set({ user: null, isAuthenticated: false, permissions: [], isLoading: false });
            return;
          }
          const response = await authService.getCurrentUser();
          if (response) {
            set({
              user: response,
              isAuthenticated: true,
              permissions: parsePermissions(response),
            });
          } else {
            await get().logout();
          }
        } catch (error) {
          set({ user: null, isAuthenticated: false, permissions: [] });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        await authService.logout();
        set({ user: null, isAuthenticated: false, permissions: [] });
      },

      forgotPassword: async (email) => {
        await authService.forgotPassword(email);
      },

      resetPassword: async (creds) => {
        const mapped = {
          refreshToken: creds.token,
          senha: creds.password,
          confirmacaoSenha: creds.confirmPassword,
        };
        await authService.resetPassword(mapped);
      },

      updatePassword: async (creds) => {
        await authService.updatePassword({
          senhaAtual: creds.currentPassword,
          novaSenha: creds.newPassword,
          confirmacaoNovaSenha: creds.confirmNewPassword,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
