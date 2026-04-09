import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../api/apiClient';
import { authEndpoints } from './auth.endpoints';

export interface PermissionItem {
  acao: string;
  permissao: number;
}

export interface RoutinePermission {
  rotina: string;
  permissoes: PermissionItem[];
}

export interface UserFromApi {
  id: number;
  nome: string;
  email: string;
  avatar: string | null;
  ultimoAcesso: string | Date | null;
  cpf: string | null;
  departamento: string | null;
  cargo: string | null;
  telefone: string | null;
  dataAdmissao: string | Date | null;
  perfilUsuario: {
    id: number | string;
    nome: string;
    permissao: RoutinePermission[];
  };
  ativo?: boolean;
}

export interface LoginResponseData {
  usuario: UserFromApi;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface LoginCredentials {
  email: string;
  senha: string;
  rememberMe?: boolean;
}

export interface ResetPasswordCredentials {
  refreshToken: string;
  senha: string;
  confirmacaoSenha: string;
}

export interface UpdatePasswordCredentials {
  senhaAtual: string;
  novaSenha: string;
  confirmacaoNovaSenha: string;
}

const TOKEN_KEY = 'auth_token';
const REMEMBER_ME_KEY = 'remember_me';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponseData> {
    const response = await apiClient.post<ApiResponse<LoginResponseData>>(
      authEndpoints.login,
      credentials,
    );
    const loginData = response.data;
    const { token: accessToken } = loginData;

    if (accessToken) {
      await this.setToken(accessToken);
    }

    if (credentials.rememberMe) {
      await AsyncStorage.setItem(REMEMBER_ME_KEY, 'true');
    } else {
      await AsyncStorage.removeItem(REMEMBER_ME_KEY);
    }

    return loginData;
  },

  async getCurrentUser(): Promise<UserFromApi | null> {
    try {
      const response = await apiClient.get<ApiResponse<UserFromApi>>(authEndpoints.me);
      return response.data;
    } catch (error) {
      console.error('[AuthService] Error fetching current user:', error);
      return null;
    }
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post(authEndpoints.forgotPassword, { email });
  },

  async resetPassword(credentials: ResetPasswordCredentials): Promise<void> {
    await apiClient.post(authEndpoints.resetPassword, credentials);
  },

  async updatePassword(credentials: UpdatePasswordCredentials): Promise<void> {
    await apiClient.patch(authEndpoints.updatePassword, credentials);
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(authEndpoints.logout);
    } catch (error) {
      console.error('[AuthService] Logout API error:', error);
    } finally {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(REMEMBER_ME_KEY);
    }
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return !!token;
  },

  async getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
  },

  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },
};
