import { auth } from '@/config/firebase';
import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    User
} from 'firebase/auth';
import { api } from './api';
import { storageService } from './storage.service';
import { SyncedUser } from './types';

/**
 * Service de autenticação
 * Centraliza todas as operações relacionadas a login, registro e recuperação de senha
 */
export const authService = {
  /**
   * Realiza login do usuário e sincroniza com o backend
   * Não permite acesso ao sistema até que a sincronização seja bem-sucedida
   */
  login: async (email: string, password: string): Promise<User> => {
    // 1. Fazer login no Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    
    // 2. Sincronizar com o backend - OBRIGATÓRIO antes de permitir acesso
    try {
      const syncedUser = await api.post<SyncedUser>('/users/sync');
      console.log('Retorno da API /users/sync:', syncedUser);
      
      // 3. Salvar usuário sincronizado no AsyncStorage
      await storageService.saveSyncedUser(syncedUser);
    } catch (error: any) {
      // Se a sincronização falhar, fazer logout do Firebase
      await auth.signOut();
      
      // Relançar o erro para que a UI possa tratar
      const syncError = new Error(
        error.message || 'Erro ao sincronizar usuário com o servidor. Tente novamente.'
      );
      (syncError as any).isSyncError = true;
      throw syncError;
    }
    
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
      // Se houver erro ao criar no backend, fazer logout e relançar erro
      await auth.signOut();
      console.error('Erro ao criar usuário no backend:', error);
      const backendError = new Error(error.message || 'Erro ao sincronizar com o servidor');
      (backendError as any).isBackendError = true;
      throw backendError;
    }
    
    // Após criar o usuário, sincronizar com o backend e salvar no storage
    try {
      const syncedUser = await api.post<SyncedUser>('/users/sync');
      console.log('Retorno da API /users/sync:', syncedUser);
      await storageService.saveSyncedUser(syncedUser);
    } catch (error: any) {
      // Se a sincronização falhar, fazer logout
      await auth.signOut();
      const syncError = new Error(
        error.message || 'Erro ao sincronizar usuário com o servidor. Tente fazer login novamente.'
      );
      (syncError as any).isSyncError = true;
      throw syncError;
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

