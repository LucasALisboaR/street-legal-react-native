# Configuração de Variáveis de Ambiente

Este projeto utiliza variáveis de ambiente para configurações sensíveis.

## Como configurar

1. Copie o arquivo `.envExemplo` para `.env`:
   ```bash
   cp .envExemplo .env
   ```

2. Preencha o arquivo `.env` com suas chaves reais:
   - **EXPO_PUBLIC_API_URL**: URL do backend (já configurado)
   - **EXPO_PUBLIC_FIREBASE_***: Chaves de configuração do Firebase
   - **EXPO_PUBLIC_MAPBOX_TOKEN**: Token do Mapbox

## Importante

- O arquivo `.env` está no `.gitignore` e **não será commitado** no repositório
- Nunca compartilhe suas chaves reais publicamente
- Use o arquivo `.envExemplo` como referência para outros desenvolvedores

## Variáveis disponíveis

### Backend
- `EXPO_PUBLIC_API_URL`: URL base da API do backend

### Firebase
- `EXPO_PUBLIC_FIREBASE_API_KEY_ANDROID`: Chave da API Firebase para Android
- `EXPO_PUBLIC_FIREBASE_API_KEY_IOS`: Chave da API Firebase para iOS
- `EXPO_PUBLIC_FIREBASE_APP_ID_ANDROID`: ID do app Firebase para Android
- `EXPO_PUBLIC_FIREBASE_APP_ID_IOS`: ID do app Firebase para iOS
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: ID do remetente de mensagens
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`: ID do projeto Firebase
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`: Bucket de armazenamento Firebase

### Mapbox
- `EXPO_PUBLIC_MAPBOX_TOKEN`: Token de acesso do Mapbox

## Nota sobre Expo

No Expo, variáveis de ambiente que começam com `EXPO_PUBLIC_` são expostas ao código do cliente. Isso é necessário para que as variáveis sejam acessíveis no app React Native.

