import AsyncStorage from '@react-native-async-storage/async-storage';
import { SyncedUser } from './types';

const USER_STORAGE_KEY = '@street_legal:synced_user';

/**
 * Service para gerenciar o armazenamento local
 */
export const storageService = {
  /**
   * Salva o usuário sincronizado no AsyncStorage
   */
  saveSyncedUser: async (user: SyncedUser): Promise<void> => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao salvar usuário no storage:', error);
      throw error;
    }
  },

  /**
   * Obtém o usuário sincronizado do AsyncStorage
   */
  getSyncedUser: async (): Promise<SyncedUser | null> => {
    try {
      const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (!userData) {
        return null;
      }
      return JSON.parse(userData) as SyncedUser;
    } catch (error) {
      console.error('Erro ao obter usuário do storage:', error);
      return null;
    }
  },

  /**
   * Remove o usuário sincronizado do AsyncStorage
   */
  removeSyncedUser: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao remover usuário do storage:', error);
      throw error;
    }
  },
};

