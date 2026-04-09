export interface ModuleItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  colorName: 'moduleBlue' | 'modulePurple' | 'moduleGreen' | 'moduleOrange' | 'moduleRed' | 'primary';
  route: string;
}

export const ALL_MODULES: ModuleItem[] = [
  {
    id: 'home',
    title: 'Home',
    subtitle: 'Página inicial',
    icon: 'home-variant',
    colorName: 'primary',
    route: 'Home',
  },
  {
    id: 'questionarios',
    title: 'Questionários',
    subtitle: 'Responda pesquisas e avaliações',
    icon: 'clipboard-text-outline',
    colorName: 'moduleBlue',
    route: 'Questionarios',
  },
  {
    id: 'avisos',
    title: 'Avisos',
    subtitle: 'Fique por dentro das novidades',
    icon: 'bullhorn-outline',
    colorName: 'modulePurple',
    route: 'Avisos',
  },
  {
    id: 'documentos',
    title: 'Documentos',
    subtitle: 'Acesse seus arquivos importantes',
    icon: 'file-document-outline',
    colorName: 'moduleGreen',
    route: 'Documentos',
  },
  {
    id: 'financeiro',
    title: 'Informes Financeiros',
    subtitle: 'Veja seus contracheques e informes',
    icon: 'finance',
    colorName: 'primary',
    route: 'InformesFinanceiros',
  },
  {
    id: 'denuncia',
    title: 'Denúncia Anônima',
    subtitle: 'Relate ocorrências com segurança',
    icon: 'shield-outline',
    colorName: 'moduleRed',
    route: 'Denuncia',
  },
  {
    id: 'profile',
    title: 'Meu Perfil',
    subtitle: 'Gerencie sua conta',
    icon: 'account-outline',
    colorName: 'primary',
    route: 'Profile',
  },
];
