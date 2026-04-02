// Endpoints de autenticação – idênticos ao web
export const authEndpoints = {
  login: '/auth/login',
  logout: '/auth/logout',
  me: '/auth/me',
  refreshToken: '/auth/refresh-token',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/change-password',
  updatePassword: '/usuario/update-password',
};

// Função para criar endpoints dinâmicos para qualquer recurso
export const createResourceEndpoints = (resource: string) => ({
  list: `/${resource}`,
  getById: (id: string | number) => `/${resource}/${id}`,
  create: `/${resource}`,
  update: (id: string | number) => `/${resource}/${id}`,
  delete: (id: string | number) => `/${resource}/${id}`,
});
