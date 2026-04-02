# 📱 Anexo App — Solução Corporativa Móvel

![Anexo Logo](assets/logo_anexo.png)

**Anexo App** é uma aplicação móvel moderna desenvolvida em **React Native (TypeScript)**, projetada para oferecer uma experiência de comunicação e gestão corporativa fluida e segura. Este projeto representa a evolução tecnológica do antigo aplicativo Brisa, migrado de Flutter para garantir maior performance e manutenibilidade.

---

## 🚀 Funcionalidades Principais

- **🔐 Autenticação Segura**: Sistema de login com persistência de sessão (Remember Me) e renovação automática de tokens (Refresh Token).
- **📊 Dashboard Interativo**: Visão geral dos módulos da empresa com indicadores de pendências em tempo real.
- **📋 Gestão de Módulos**:
  - **Questionários**: Responda pesquisas e avaliações internas.
  - **Avisos**: Mural de comunicados importantes com notificações.
  - **Documentos**: Visualização de holerites e arquivos corporativos.
  - **Denúncia Anônima**: Canal seguro e criptografado para relatos de irregularidades.
- **👤 Perfil do Usuário**: Gestão de dados pessoais e alteração de senha segura.

---

## 🛠️ Tecnologias Utilizadas

O projeto utiliza o que há de mais moderno no ecossistema mobile:

- **Framework**: [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/) (Tipagem Estática)
- **Estado**: [Zustand](https://github.com/pmndrs/zustand) (Leve e eficiente)
- **API**: [Axios](https://axios-http.com/) com Interceptadores
- **Navegação**: [React Navigation](https://reactnavigation.org/)
- **UI**: [Material icons](https://icons.expo.fyi/) e Componentes Customizados Premium

---

## ⚙️ Pré-requisitos

Antes de começar, você precisará ter instalado:
- [Node.js](https://nodejs.org/) (v18+)
- [Git](https://git-scm.com/)
- Emulador Android (Android Studio) ou iOS (Xcode)

---

## 📥 Instalação e Execução

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/grupo09-tic/mobile
   cd mobile/reactnative
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento (Metro):**
   ```bash
   npx expo start
   ```

4. **Abra o aplicativo:**
   - Pressione `a` para Android.
   - Pressione `i` para iOS.
   - Ou utilize o app **Expo Go** no seu celular físico escaneando o QR Code.

---

## 📁 Estrutura de Pastas

```text
reactnative/
├── assets/          # Imagens, fontes e recursos estáticos
├── src/
│   ├── api/         # Configurações e interceptores da API
│   ├── auth/        # Lógica de autenticação e estado global
│   ├── constants/   # Temas, cores e definições de permissão
│   ├── navigation/  # Estrutura de rotas e navegação
│   └── screens/     # Telas da aplicação (Home, Login, etc)
├── App.tsx          # Entrada principal da aplicação
└── app.json         # Configurações do Expo
```

---

## 📄 Licença

Este projeto é de propriedade da **Anexo Tecnologia**. Todos os direitos reservados.

---
*Gerado em 02/04/2026 — Versão 1.1.0*
