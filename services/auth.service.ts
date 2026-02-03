import { auth } from '@/config/firebase';
import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    User
} from 'firebase/auth';
import { api } from './api';

/**
 * Service de autenticação
 * Centraliza todas as operações relacionadas a login, registro e recuperação de senha
 */
export const authService = {
  /**
   * Realiza login do usuário
   */
  login: async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return userCredential.user;
  },

  /**
   * Cria um novo usuário no Firebase e no backend
   */
  register: async (email: string, password: string, name: string): Promise<User> => {
    // Criar usuário no Firebase primeiro
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    
    // Criar usuário no backend (sem autenticação, pois o usuário acabou de ser criado)
    try {
      await api.post('/users', {
        name: name.trim(),
        email: email.trim(),
      }, { skipAuth: true });
    } catch (error: any) {
      // Se houver erro ao criar no backend, ainda mantemos o usuário no Firebase
      // mas relançamos o erro para que a UI possa tratar adequadamente
      console.error('Erro ao criar usuário no backend:', error);
      // Adiciona uma flag para identificar que é erro do backend
      const backendError = new Error(error.message || 'Erro ao sincronizar com o servidor');
      (backendError as any).isBackendError = true;
      throw backendError;
    }
    
    return userCredential.user;
  },

  /**
   * Envia email de recuperação de senha
   */
  forgotPassword: async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email.trim());
  },

  /**
   * Obtém o token de autenticação do usuário atual
   */
  getToken: async (): Promise<string | null> => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return null;
      }
      return await user.getIdToken();
    } catch (error) {
      console.error('Erro ao obter token:', error);
      return null;
    }
  },

  /**
   * Verifica se há um usuário autenticado
   */
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },
};

