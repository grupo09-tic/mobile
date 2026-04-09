import { ApiClient } from './apiClient';
import { financeiroEndpoints } from './financeiro.endpoints';

export interface Contracheque {
  id: string;
  titulo: string;
  data: string;
  tamanho: string;
  url: string;
}

const apiClient = new ApiClient();

export const financeiroService = {
  getContracheques: async (ano: string, mes: string): Promise<Contracheque[]> => {
    try {
      const response = await apiClient.client.get(financeiroEndpoints.getContracheques(ano, mes));
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar contracheques:', error);
      throw error;
    }
  },

  getDownloadUrl: (id: string): string => {
    // Retorna a URL completa para download
    const baseURL = apiClient.client.defaults.baseURL;
    return `${baseURL}${financeiroEndpoints.downloadContracheque(id)}`;
  },
};
