# 📱 Anexo App — React Native (TypeScript)

## Guia de Instalação e Execução

Este projeto é uma migração fiel do aplicativo Anexo (originalmente em Flutter) para **React Native utilizando Expo e TypeScript**.

---

## 🛠️ 1. Pré-requisitos

| Ferramenta | Recomendação | Download |
|-----------|--------------|---------|
| Node.js | v18.x ou superior | [nodejs.org](https://nodejs.org) |
| Expo CLI | v5x | Instalado via `npx` |
| Android Studio | Para emulador | [developer.android.com](https://developer.android.com/studio) |

---

## 🚀 2. Passo a Passo para Rodar

### Passo 1 — Instalar dependências
Na pasta `reactnative`, execute:
```bash
npm install
```

### Passo 2 — Configurar URL da API
Abra o arquivo `src/api/apiClient.ts` e ajuste o IP se necessário:
```typescript
const API_URL = 'http://10.0.2.2:3000/api'; // Para emulador Android
// ou
const API_URL = 'http://seu-ip-local:3000/api'; // Para dispositivo físico
```

### Passo 3 — Iniciar o Metro Bundler (Expo)
```bash
npx expo start
```

### Passo 4 — Abrir no Emulador
- Pressione **`a`** no terminal para abrir no Android.
- Pressione **`i`** no terminal para abrir no iOS (se estiver no macOS).

---

## 📁 3. Estrutura do Projeto

- `src/api`: Cliente HTTP Axios com interceptores de Refresh Token.
- `src/auth`: Gerenciamento de estado (Store) e serviços de autenticação.
- `src/constants`: Temas, cores (fidelidade total ao original) e constantes.
- `src/navigation`: Roteamento com suporte a rotas protegidas.
- `src/screens`: Implementação das telas (Login, Home, Perfil, Módulos).

---

## 🔐 4. Tecnologias Utilizadas

- **React Native + Expo**: Framework principal.
- **TypeScript**: Tipagem estática para maior segurança.
- **Zustand**: Gerenciamento de estado leve e eficiente.
- **Axios**: Cliente HTTP para comunicação com o backend Node.js.
- **React Navigation**: Navegação entre telas.
- **React Native Paper**: Componentes de UI básicos.

---

## ✅ 5. Checklist de Migração

- [x] Login Funcional (JWT + Remember Me).
- [x] Dashbord Home com Cards de Módulos.
- [x] Telas de Módulos (Questionários, Avisos, Documentos, Denúncia).
- [x] Gerenciamento de Perfil e Alteração de Senha.
- [x] Lógica de Refresh Token (Fiel ao original).

---

*Gerado em 02/04/2026 — Migração Anexo v1.1.0*
