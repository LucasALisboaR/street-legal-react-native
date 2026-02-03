📱 Guia de Configuração: Expo Development Build
Este documento descreve o fluxo de trabalho para o projeto, utilizando Development Builds em vez do Expo Go, permitindo o uso de módulos nativos personalizados e uma paridade real com o ambiente de produção.

1. Inicialização do Projeto
Bash
# Criar o projeto
npx create-expo-app@latest meu-projeto
cd meu-projeto

# Instalar o cliente de desenvolvimento (Obrigatório para Dev Builds)
npx expo install expo-dev-client
2. Configuração de Identidade (app.json)
Para builds nativos, é necessário definir identificadores únicos. No app.json, configure os campos ios.bundleIdentifier e android.package.

JSON
{
  "expo": {
    "name": "Nome do App",
    "slug": "nome-do-app",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.seuusuario.nomeapp",
      "supportsTablet": true
    },
    "android": {
      "package": "com.seuusuario.nomeapp",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    }
  }
}
3. Configuração da Nuvem (EAS)
Como o build será feito via nuvem (enquanto não estiver no Mac), utilizamos o EAS (Expo Application Services).

Instalar CLI: npm install -g eas-cli

Login: eas login

Configurar: eas build:configure (Escolha "All")

Estrutura do eas.json
Certifique-se de que o perfil de desenvolvimento está com developmentClient: true.

JSON
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "production": {}
  }
}
4. Gerando os Builds de Desenvolvimento
Execute os comandos abaixo para gerar o "app de testes" que substituirá o Expo Go no seu celular.

Android: eas build --platform android --profile development

Resultado: Gera um link para baixar um .apk.

iOS: eas build --platform ios --profile development

Requisito: Conta Apple Developer ativa. O EAS cuidará do provisionamento.

5. Fluxo de Trabalho com Mac (Local)
Quando você estiver utilizando o Mac, o processo de build pode ser feito localmente, economizando tempo e recursos da nuvem.

Instalação de Ferramentas
Instalar Xcode (App Store).

Instalar Cocoapods: sudo gem install cocoapods.

Comandos de Desenvolvimento Local
Bash
# Iniciar o prebuild (Gera as pastas /ios e /android)
npx expo prebuild

# Rodar no Simulador iOS
npx expo run:ios

# Rodar no Emulador Android
npx expo run:android
6. Adicionando Bibliotecas Nativas
Sempre que instalar uma biblioteca que altere o código nativo (ex: expo-camera, expo-location, react-native-reanimated), siga este ciclo:

Instalar: npx expo install nome-da-biblioteca

Rebuild: * Sem Mac: Gerar novo build via EAS (eas build...).

Com Mac: Rodar novamente npx expo run:ios ou android.

Desenvolver: Após o novo build estar no seu celular/simulador, basta rodar npx expo start para carregar o Javascript atualizado.