/**
 * Tipo para o usuário sincronizado retornado pela API
 */
export interface SyncedUser {
  id: string;
  name: string;
  email: string;
  externalAuthId: string;
  isOnline: boolean;
  avatarUrl: string | null;
  createdAt: string;
}

