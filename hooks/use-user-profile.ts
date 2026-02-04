import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { storageService } from '@/services/storage.service';
import { UserProfile, userService } from '@/services/user.service';

const PROFILE_CACHE_KEY = '@street_legal:user_profile_cache';
const PROFILE_CACHE_TTL_MS = 5 * 60 * 1000;

interface UserProfileCache {
  profile: UserProfile;
  timestamp: number;
}

let memoryCache: UserProfileCache | null = null;

async function readStorageCache(): Promise<UserProfileCache | null> {
  const cached = await AsyncStorage.getItem(PROFILE_CACHE_KEY);
  if (!cached) {
    return null;
  }
  try {
    return JSON.parse(cached) as UserProfileCache;
  } catch {
    return null;
  }
}

async function persistCache(cache: UserProfileCache): Promise<void> {
  memoryCache = cache;
  await AsyncStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(cache));
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(memoryCache?.profile ?? null);
  const [loading, setLoading] = useState(!memoryCache?.profile);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const cacheAge = useMemo(() => {
    if (!memoryCache) {
      return null;
    }
    return Date.now() - memoryCache.timestamp;
  }, [profile]);

  const hydrateFromStorage = useCallback(async () => {
    const stored = await readStorageCache();
    if (stored?.profile) {
      memoryCache = stored;
      setProfile(stored.profile);
      setLoading(false);
    }
    return stored;
  }, []);

  const refreshProfile = useCallback(
    async ({ silent = false } = {}) => {
      if (!userId) {
        return;
      }
      if (!silent) {
        setRefreshing(true);
      }
      setError(null);
      try {
        const response = await userService.getUser(userId);
        const nextCache = { profile: response, timestamp: Date.now() };
        setProfile(response);
        setLoading(false);
        await persistCache(nextCache);
        const syncedUser = await storageService.getSyncedUser();
        if (syncedUser) {
          await storageService.saveSyncedUser({
            ...syncedUser,
            name: response.name,
            avatarUrl: response.avatarUrl ?? syncedUser.avatarUrl ?? null,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar perfil');
      } finally {
        if (!silent) {
          setRefreshing(false);
        }
      }
    },
    [userId]
  );

  const forceRefresh = useCallback(async () => {
    await refreshProfile({ silent: false });
  }, [refreshProfile]);

  useEffect(() => {
    const loadUser = async () => {
      const syncedUser = await storageService.getSyncedUser();
      setUserId(syncedUser?.id ?? null);
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }
    let isMounted = true;

    const loadCache = async () => {
      const stored = await hydrateFromStorage();
      if (!isMounted) {
        return;
      }
      if (!stored?.profile) {
        await refreshProfile({ silent: false });
        return;
      }
      const shouldRevalidate =
        !stored.timestamp || Date.now() - stored.timestamp > PROFILE_CACHE_TTL_MS;
      if (shouldRevalidate) {
        await refreshProfile({ silent: true });
      }
    };

    loadCache();

    return () => {
      isMounted = false;
    };
  }, [userId, hydrateFromStorage, refreshProfile]);

  const updateNameBio = useCallback(
    async (payload: { name: string; bio: string }) => {
      if (!userId) {
        throw new Error('Usuário não encontrado');
      }
      await userService.updateUser(userId, payload);
      await refreshProfile({ silent: false });
    },
    [refreshProfile, userId]
  );

  const updateAvatar = useCallback(
    async (file: FormData) => {
      if (!userId) {
        throw new Error('Usuário não encontrado');
      }
      const response = await userService.updateAvatar(userId, file);
      // Atualiza o perfil imediatamente com a resposta do servidor
      if (response) {
        const nextCache = { profile: response, timestamp: Date.now() };
        setProfile(response);
        memoryCache = nextCache;
        await persistCache(nextCache);
        // Atualiza também o usuário sincronizado
        const syncedUser = await storageService.getSyncedUser();
        if (syncedUser) {
          await storageService.saveSyncedUser({
            ...syncedUser,
            avatarUrl: response.avatarUrl ?? syncedUser.avatarUrl ?? null,
          });
        }
      }
      // Força um refresh para garantir que está sincronizado
      await refreshProfile({ silent: true });
    },
    [refreshProfile, userId]
  );

  const updateBanner = useCallback(
    async (file: FormData) => {
      if (!userId) {
        throw new Error('Usuário não encontrado');
      }
      const response = await userService.updateBanner(userId, file);
      // Atualiza o perfil imediatamente com a resposta do servidor
      if (response) {
        const nextCache = { profile: response, timestamp: Date.now() };
        setProfile(response);
        memoryCache = nextCache;
        await persistCache(nextCache);
      }
      // Força um refresh para garantir que está sincronizado
      await refreshProfile({ silent: true });
    },
    [refreshProfile, userId]
  );

  return {
    profile,
    loading,
    error,
    refreshing,
    cacheAge,
    refreshProfile: forceRefresh,
    updateNameBio,
    updateAvatar,
    updateBanner,
  };
}
