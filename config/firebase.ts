import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configurações do Firebase
const FirebaseOptions = {
  android: {
    apiKey: 'AIzaSyCPm80IyyLlcEvEhXj0rZLtPJFd6S4QG7w',
    appId: '1:863805534310:android:25655da5287420634fbda7',
    messagingSenderId: '863805534310',
    projectId: 'street-legal-64574',
    storageBucket: 'street-legal-64574.firebasestorage.app',
  },
  ios: {
    apiKey: 'AIzaSyC3_iHQhQ17fakJnwqqELQks2tTMnuKN74',
    appId: '1:863805534310:ios:a3af9d1f063a4fa94fbda7',
    messagingSenderId: '863805534310',
    projectId: 'street-legal-64574',
    storageBucket: 'street-legal-64574.firebasestorage.app',
  },
};

// Selecionar configuração baseada na plataforma
const firebaseConfig = Platform.OS === 'ios' ? FirebaseOptions.ios : FirebaseOptions.android;

// Inicializar Firebase apenas se ainda não foi inicializado
let app: FirebaseApp;
let auth: Auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  // Inicializar Auth com AsyncStorage para persistência
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error: any) {
    // Se já foi inicializado, usar getAuth
    if (error.code === 'auth/already-initialized') {
      auth = getAuth(app);
    } else {
      throw error;
    }
  }
} else {
  app = getApps()[0];
  auth = getAuth(app);
}

export { app, auth };

