import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';

import { auth } from '@/config/firebase';
import { storageService } from '@/services/storage.service';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      
      // Se o usuário sair, limpar o storage
      if (!user) {
        await storageService.removeSyncedUser();
      }
    });

    return unsubscribe;
  }, []);

  return { user, loading, isAuthenticated: !!user };
}

export async function useSignOut() {
  await storageService.removeSyncedUser();
  return auth.signOut();
}