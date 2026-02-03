## Setup Inicial

1. **Pré-requisitos:**
   - Node.js 18+
   - Android Studio (para Android SDK)
   - JDK 17

2. **Instalar dependências:**
   npm install
   3. **Gerar código nativo:**
  
   npx expo prebuild
   4. **Verificar configurações:**
   - `android/local.properties` deve ter o caminho do Android SDK
   - `android/gradle.properties` linha 16: ajustar caminho do JDK se necessário

5. **Rodar:**
  npx expo prebuild
   npx expo run:android
   
