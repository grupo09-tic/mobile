export const financeiroEndpoints = {
  getContracheques: (ano: string, mes: string) => `/financeiro/contracheques?ano=${ano}&mes=${mes}`,
  downloadContracheque: (id: string) => `/financeiro/contracheques/${id}/download`,
};
