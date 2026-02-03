# Arquitetura e Documentação do Projeto - Street Legal React Native

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Projeto](#arquitetura-do-projeto)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Boas Práticas](#boas-práticas)
5. [Sistema de Cores](#sistema-de-cores)
6. [Firebase Authentication](#firebase-authentication)
7. [Componentes de Autenticação](#componentes-de-autenticação)
8. [Navegação](#navegação)

---

## 🎯 Visão Geral

O **Street Legal React Native** é um aplicativo mobile desenvolvido com **React Native** e **Expo**, utilizando **Expo Router** para navegação baseada em arquivos. O projeto implementa autenticação de usuários através do **Firebase Authentication** e segue uma arquitetura modular e escalável.

### Tecnologias Principais

- **React Native** (v0.81.5)
- **Expo** (v54.0.33)
- **Expo Router** (v6.0.23) - Navegação baseada em arquivos
- **Firebase** (v11.0.0) - Autenticação
- **TypeScript** (v5.9.2)
- **React Navigation** - Navegação nativa

---

## 🏗️ Arquitetura do Projeto

### Padrão Arquitetural

O projeto segue uma arquitetura **baseada em componentes** com separação clara de responsabilidades:

```
┌─────────────────────────────────────┐
│         App Layer (Routes)          │
│  (app/, app/(tabs)/, app/modal.tsx) │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Component Layer                │
│  (components/, components/auth/)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Service Layer                  │
│  (config/firebase.ts)               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Constants Layer                │
│  (constants/theme.ts)               │
└─────────────────────────────────────┘
```

### Princípios de Design

1. **Separação de Responsabilidades**: Cada camada tem uma responsabilidade específica
2. **Reutilização de Componentes**: Componentes genéricos e reutilizáveis
3. **Type Safety**: TypeScript em todo o projeto
4. **Consistência Visual**: Sistema de design unificado com cores e componentes padronizados

---

## 📁 Estrutura de Pastas

```
street-legal-react-native/
├── app/                          # Rotas do Expo Router
│   ├── _layout.tsx              # Layout raiz
│   ├── (tabs)/                  # Grupo de rotas com tabs
│   │   ├── _layout.tsx          # Layout das tabs
│   │   ├── index.tsx            # Tela inicial
│   │   └── explore.tsx          # Tela de exploração
│   ├── login.tsx                # Tela de login
│   ├── forget-password.tsx      # Tela de recuperar senha
│   ├── new-user.tsx             # Tela de criar conta
│   └── modal.tsx                # Modal de exemplo
│
├── components/                   # Componentes reutilizáveis
│   ├── auth/                    # Componentes de autenticação
│   │   ├── input.tsx            # Input customizado
│   │   ├── button.tsx           # Botão customizado
│   │   └── logo.tsx             # Logo da marca
│   ├── themed-text.tsx          # Texto com tema
│   ├── themed-view.tsx           # View com tema
│   └── ui/                      # Componentes UI
│
├── config/                      # Configurações
│   └── firebase.ts              # Configuração do Firebase
│
├── constants/                    # Constantes
│   └── theme.ts                 # Cores e temas
│
├── hooks/                       # Custom hooks
│   ├── use-color-scheme.ts      # Hook de tema
│   └── use-theme-color.ts       # Hook de cor do tema
│
└── assets/                      # Recursos estáticos
    └── images/                  # Imagens
```

---

## ✅ Boas Práticas

### 1. **Organização de Código**

- **Separação por Feature**: Componentes relacionados agrupados em pastas
- **Nomenclatura Consistente**: 
  - Componentes: PascalCase (`AuthInput.tsx`)
  - Arquivos de configuração: kebab-case (`firebase.ts`)
  - Hooks: camelCase com prefixo `use` (`useColorScheme.ts`)

### 2. **TypeScript**

- **Tipagem Forte**: Todos os componentes e funções tipados
- **Interfaces Explícitas**: Props de componentes sempre tipadas
- **Type Safety**: Evitar uso de `any` quando possível

```typescript
// ✅ Bom
interface AuthInputProps extends TextInputProps {
  icon?: keyof typeof Ionicons.glyphMap;
  secureTextEntry?: boolean;
  error?: boolean;
}

// ❌ Evitar
const AuthInput = (props: any) => { ... }
```

### 3. **Componentes Reutilizáveis**

- **Single Responsibility**: Cada componente tem uma responsabilidade única
- **Props Flexíveis**: Componentes aceitam props para customização
- **Composição**: Preferir composição sobre herança

### 4. **Gerenciamento de Estado**

- **Estado Local**: Use `useState` para estado local do componente
- **Estado Global**: Para estado compartilhado, considere Context API ou Redux
- **Firebase Auth State**: Gerenciado pelo Firebase SDK

### 5. **Tratamento de Erros**

- **Try-Catch**: Sempre envolver operações assíncronas
- **Mensagens Amigáveis**: Traduzir códigos de erro do Firebase para mensagens amigáveis
- **Feedback Visual**: Usar Alert ou Toast para feedback ao usuário

```typescript
try {
  await signInWithEmailAndPassword(auth, email, password);
} catch (error: any) {
  let errorMessage = 'Erro ao fazer login. Tente novamente.';
  if (error.code === 'auth/invalid-email') {
    errorMessage = 'E-mail inválido';
  }
  Alert.alert('Erro', errorMessage);
}
```

### 6. **Performance**

- **Lazy Loading**: Usar `React.lazy` para componentes pesados
- **Memoização**: Usar `React.memo` para componentes que renderizam frequentemente
- **Otimização de Imagens**: Usar `expo-image` para melhor performance

### 7. **Acessibilidade**

- **Labels Semânticos**: Usar `accessibilityLabel` em elementos interativos
- **Contraste de Cores**: Garantir contraste adequado para leitura
- **Navegação por Teclado**: Suportar navegação via teclado

### 8. **Segurança**

- **Credenciais**: Nunca commitar credenciais no código (usar variáveis de ambiente)
- **Validação**: Validar inputs no cliente e servidor
- **Autenticação**: Usar Firebase Auth para gerenciamento seguro de autenticação

---

## 🎨 Sistema de Cores

### Paleta de Cores - GEARHEAD BR

O projeto utiliza uma paleta de cores inspirada no design da marca **GEARHEAD BR**, com foco em um tema escuro moderno e acentos vibrantes.

#### Cores Principais

```typescript
export const BrandColors = {
  orange: '#FF4500',        // Laranja neon - Cor principal de destaque
  white: '#FFFFFF',         // Branco - Texto principal
  darkGray: '#151718',      // Cinza escuro - Background principal
  lightGray: '#9BA1A6',     // Cinza claro - Texto secundário
  mediumGray: '#2A2A2A',    // Cinza médio - Botões e elementos secundários
  placeholderGray: '#9BA1A6', // Cinza placeholder - Placeholder dos inputs
};
```

#### Uso das Cores

| Cor | Uso | Exemplo |
|-----|-----|---------|
| **#FF4500** (Orange) | Links, acentos, logo, botões de ação secundários | "Criar conta", "Esqueci minha senha" |
| **#FFFFFF** (White) | Texto principal, ícones principais | Títulos, textos de botões |
| **#151718** (Dark Gray) | Background principal | Fundo das telas |
| **#9BA1A6** (Light Gray) | Texto secundário, placeholders | Subtítulos, textos informativos |
| **#2A2A2A** (Medium Gray) | Botões, inputs, elementos interativos | Background de inputs e botões |

#### Aplicação nas Telas

**Tela de Login:**
- Background: `#151718` (Dark Gray)
- Logo: Acento laranja com glow effect
- Inputs: Background `#2A2A2A` (Medium Gray)
- Links: `#FF4500` (Orange)
- Texto principal: `#FFFFFF` (White)

**Tela de Recuperar Senha:**
- Título: `#FF4500` (Orange) com acento branco
- Ícone: Círculo laranja com glow
- Mesma estrutura de cores da tela de login

**Tela de Criar Conta:**
- Título: `#FFFFFF` (White) com acento laranja
- Checkbox: Borda laranja, check laranja
- Links de termos: `#FF4500` (Orange)

---

## 🔐 Firebase Authentication

### Configuração

O Firebase está configurado em `config/firebase.ts` com suporte para Android e iOS:

```typescript
const FirebaseOptions = {
  android: {
    apiKey: '...',
    appId: '...',
    messagingSenderId: '...',
    projectId: 'street-legal-64574',
    storageBucket: '...',
  },
  ios: {
    apiKey: '...',
    appId: '...',
    messagingSenderId: '...',
    projectId: 'street-legal-64574',
    storageBucket: '...',
    iosBundleId: 'street.legal',
  },
};
```

### Funcionalidades Implementadas

1. **Login com Email e Senha**
   - Validação de campos
   - Tratamento de erros específicos
   - Redirecionamento após login bem-sucedido

2. **Criação de Conta**
   - Validação de senha (mínimo 6 caracteres)
   - Confirmação de senha
   - Aceite de termos obrigatório

3. **Recuperação de Senha**
   - Envio de email de recuperação
   - Feedback ao usuário

### Tratamento de Erros

O projeto implementa tratamento específico para os principais erros do Firebase:

- `auth/invalid-email`: E-mail inválido
- `auth/user-not-found`: Usuário não encontrado
- `auth/wrong-password`: Senha incorreta
- `auth/email-already-in-use`: E-mail já em uso
- `auth/weak-password`: Senha muito fraca

---

## 🧩 Componentes de Autenticação

### AuthInput

Componente de input customizado com suporte a ícones e visibilidade de senha.

**Props:**
- `icon`: Ícone do Ionicons (opcional)
- `secureTextEntry`: Campo de senha
- `error`: Estado de erro (opcional)

**Características:**
- Ícone à esquerda
- Toggle de visibilidade para senhas
- Estilo consistente com o design system

### AuthButton

Botão customizado com suporte a ícones e estados de loading.

**Props:**
- `title`: Texto do botão
- `icon`: Ícone do Ionicons (opcional)
- `loading`: Estado de carregamento
- `variant`: 'primary' ou 'secondary'

**Características:**
- Texto em uppercase
- Indicador de loading
- Desabilitado durante operações assíncronas

### Logo

Componente do logo da marca GEARHEAD BR.

**Características:**
- Círculo com borda laranja e glow effect
- Ícone de velocímetro
- Texto "GH" centralizado
- Nome da marca com acento laranja

---

## 🧭 Navegação

### Expo Router

O projeto utiliza **Expo Router** para navegação baseada em arquivos:

- **Rotas de Autenticação**: `app/login.tsx`, `app/forget-password.tsx`, `app/new-user.tsx`
- **Rotas Principais**: `app/(tabs)/index.tsx`, `app/(tabs)/explore.tsx`
- **Grupos de Rotas**: `(tabs)` agrupa rotas com navegação por tabs

### Navegação entre Telas

```typescript
import { router } from 'expo-router';

// Navegar para outra tela
router.push('/login');
router.replace('/(tabs)'); // Substitui a tela atual

// Voltar
router.back();
```

### Links

```typescript
import { Link } from 'expo-router';

<Link href="/new-user" asChild>
  <TouchableOpacity>
    <Text>Criar conta</Text>
  </TouchableOpacity>
</Link>
```

---

## 📝 Convenções de Código

### Nomenclatura

- **Componentes**: PascalCase (`AuthInput`, `LoginScreen`)
- **Arquivos**: kebab-case para rotas (`login.tsx`), PascalCase para componentes (`AuthInput.tsx`)
- **Variáveis/Funções**: camelCase (`handleLogin`, `email`)
- **Constantes**: UPPER_SNAKE_CASE (`BRAND_COLORS`)

### Estrutura de Componentes

```typescript
// 1. Imports
import React from 'react';
import { ... } from 'react-native';

// 2. Types/Interfaces
interface ComponentProps {
  // ...
}

// 3. Componente
export default function Component({ ... }: ComponentProps) {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Handlers
  const handleAction = () => { ... };
  
  // 6. Render
  return ( ... );
}

// 7. Styles
const styles = StyleSheet.create({ ... });
```

---

## 🚀 Próximos Passos

### Melhorias Sugeridas

1. **Context API**: Implementar contexto de autenticação para gerenciar estado do usuário
2. **Validação**: Adicionar biblioteca de validação (ex: Yup, Zod)
3. **Loading States**: Melhorar feedback visual durante operações
4. **Persistência**: Implementar persistência de sessão
5. **Testes**: Adicionar testes unitários e de integração
6. **Internacionalização**: Suporte a múltiplos idiomas
7. **Acessibilidade**: Melhorar labels e navegação por teclado

---

## 📚 Recursos Adicionais

- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Última atualização**: Dezembro 2024
**Versão do Projeto**: 1.0.0

