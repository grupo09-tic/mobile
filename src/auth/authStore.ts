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
        // BYPASS DE LOGIN PARA TESTES
        const fakeUser: UserFromApi = {
          id: 1,
          nome: 'Usuário Teste',
          email: credentials.email,
          avatar: null,
          ultimoAcesso: new Date().toISOString(),
          perfilUsuario: {
            id: 1,
            nome: 'Administrador',
            permissao: []
          },
          ativo: true
        };
        
        set({
          user: fakeUser,
          isAuthenticated: true,
          permissions: [],
        });
      },

      initializeAuth: async () => {
        // BYPASS: Se já houver um usuário no Zustand (via persist), mantemos ele logado
        set({ isLoading: false });
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
