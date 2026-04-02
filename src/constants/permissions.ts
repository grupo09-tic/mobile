export const PERMISSIONS = {
  CIDADE: {
    CREATE: 'Cidade.Criar',
    UPDATE: 'Cidade.Editar',
    DELETE: 'Cidade.Excluir',
    LIST:   'Cidade.Listar',
    VIEW:   'Cidade.Visualizar',
  },
  CLIENTE: {
    CREATE: 'Cliente.Criar',
    UPDATE: 'Cliente.Editar',
    DELETE: 'Cliente.Excluir',
    LIST:   'Cliente.Listar',
    VIEW:   'Cliente.Visualizar',
    EXPORT: 'Cliente.Exportar',
  },
  LOG: {
    LIST: 'Log.Listar',
  },
  LOG_SESSAO: {
    LIST: 'Log de Sessão.Listar',
  },
  PERFIL_USUARIO: {
    CLONE:  'Perfil de Usuário.Clonar',
    CREATE: 'Perfil de Usuário.Criar',
    UPDATE: 'Perfil de Usuário.Editar',
    DELETE: 'Perfil de Usuário.Excluir',
    LIST:   'Perfil de Usuário.Listar',
    VIEW:   'Perfil de Usuário.Visualizar',
  },
  USUARIO: {
    CHANGE_PASSWORD: 'Usuário.Alterar Senha',
    CLONE:  'Usuário.Clonar',
    CREATE: 'Usuário.Criar',
    UPDATE: 'Usuário.Editar',
    DELETE: 'Usuário.Excluir',
    LIST:   'Usuário.Listar',
    VIEW:   'Usuário.Visualizar',
  },
  API_KEY: {
    CREATE: 'Api Keys.Criar',
    DELETE: 'Api Keys.Excluir',
    LIST:   'Api Keys.Listar',
    VIEW:   'Api Keys.Visualizar',
  },
  HOME: {
    VIEW: 'Home.Visualizar',
  },
} as const;
