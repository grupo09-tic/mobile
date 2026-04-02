import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authEndpoints } from '../auth/auth.endpoints';

// Substitui import.meta.env do Vite – usa variável de ambiente do Expo
// Para rodar no emulador Android (AVD), use: http://10.0.2.2:3000/api
// Para rodar em dispositivo físico, use o seu IP local: http://192.168.x.x:3000/api
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3000/api';
const TOKEN_KEY = 'auth_token';
const REMEMBER_ME_KEY = 'remember_me';

// Flag para evitar múltiplos refreshes simultâneos
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

export class ApiClient {
  public client: AxiosInstance;

  constructor(config: AxiosRequestConfig = {}) {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      withCredentials: false, // Mobile não usa cookies
      headers: { 'Content-Type': 'application/json' },
      ...config,
    });

    // Interceptor: injeta token no header
    this.client.interceptors.request.use(
      async (reqConfig) => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (token && reqConfig.headers) {
          reqConfig.headers.Authorization = `Bearer ${token}`;
        }
        return reqConfig;
      },
      (error) => Promise.reject(error),
    );

    // Interceptor: trata 401 com refresh automático
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);

        const isLoginRequest = originalRequest.url?.includes('auth/login');
        const isRefreshRequest = originalRequest.url === authEndpoints.refreshToken;

        // --- Refresh de token ---
        if (error.response?.status === 401 && !isRefreshRequest && !isLoginRequest) {
          if (isRefreshing) {
            // Encadeia outros requests enquanto o refresh está acontecendo
            return new Promise((resolve) => {
              subscribeTokenRefresh((newToken) => {
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                resolve(this.client(originalRequest));
              });
            });
          }

          isRefreshing = true;

          try {
            const rememberMe = await AsyncStorage.getItem(REMEMBER_ME_KEY);
            const response = await this.client.post(
              authEndpoints.refreshToken,
              {},
              { headers: { 'x-remember-me': rememberMe === 'true' ? 'true' : 'false' } },
            );
            const { token: newAccessToken } = response.data.data;
            await AsyncStorage.setItem(TOKEN_KEY, newAccessToken);
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            onTokenRefreshed(newAccessToken);
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh falhou – limpa token e sinaliza logout via AsyncStorage
            await AsyncStorage.removeItem(TOKEN_KEY);
            await AsyncStorage.setItem('force_logout', 'true');
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        // Erro de Login (401)
        if (error.response?.status === 401 && isLoginRequest) {
          const data = error.response.data;
          const message = data?.error?.message || data?.message || 'E-mail ou senha incorretos.';
          const authError = Object.assign(new Error(message), { code: data?.code });
          return Promise.reject(authError);
        }

        // Sem resposta
        if (!error.response) {
          return Promise.reject(new Error('O servidor não respondeu. Verifique sua conexão.'));
        }

        // 422 – dados inválidos
        if (error.response?.status === 422) {
          const msg = error.response.data.error?.message || 'Dados inválidos.';
          return Promise.reject(new Error(msg));
        }

        return Promise.reject(error);
      },
    );
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, { ...config, data });
    return response.data;
  }
}

export const apiClient = new ApiClient();
