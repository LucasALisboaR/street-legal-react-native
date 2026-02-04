import { Redirect, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BrandColors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { storageService } from '@/services/storage.service';
import { auth } from '@/config/firebase';

export default function TabLayout() {
  const { isAuthenticated, loading } = useAuth();
  const [checkingSync, setCheckingSync] = useState(true);

  useEffect(() => {
    const checkSyncedUser = async () => {
      if (isAuthenticated && !loading) {
        const syncedUser = await storageService.getSyncedUser();
        // Se o usuário está autenticado mas não tem usuário sincronizado, fazer logout
        if (!syncedUser) {
          await auth.signOut();
        }
      }
      setCheckingSync(false);
    };

    checkSyncedUser();
  }, [isAuthenticated, loading]);

  if (loading || checkingSync) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: BrandColors.orange,
        tabBarInactiveTintColor: BrandColors.lightGray,
        tabBarActiveBackgroundColor: 'rgba(255, 69, 0, 0.15)',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: BrandColors.darkGray,
          borderTopWidth: 0,
          height: 80,
          paddingHorizontal: 16,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: -2,
        },
        tabBarItemStyle: {
          borderRadius: 999,
          marginHorizontal: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="location.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="teams"
        options={{
          title: 'Equipes',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.2.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Eventos',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
