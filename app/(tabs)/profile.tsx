import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

import { AuthButton } from '@/components/auth/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSignOut as signOut } from '@/hooks/use-auth';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Confirmar Logout',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await signOut();
              router.replace('/login');
            } catch {
              Alert.alert('Erro', 'Não foi possível fazer logout. Tente novamente.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Perfil</ThemedText>
      <ThemedText>Em breve.</ThemedText>
      <AuthButton
        title="Sair"
        icon="log-out-outline"
        variant="secondary"
        loading={loading}
        onPress={handleLogout}
        style={styles.logoutButton}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 20,
  },
  logoutButton: {
    marginTop: 32,
    width: '100%',
    maxWidth: 300,
  },
});
