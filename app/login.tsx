import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/auth/button';
import { AuthInput } from '@/components/auth/input';
import { Logo } from '@/components/auth/logo';
import { BrandColors } from '@/constants/theme';
import { authService } from '@/services/auth.service';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      await authService.login(email, password);
      // Só redireciona se a sincronização foi bem-sucedida
      router.replace('/(tabs)');
    } catch (error: any) {
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      
      // Erros de sincronização
      if (error.isSyncError) {
        errorMessage = error.message || 'Erro ao sincronizar com o servidor. Tente novamente.';
      }
      // Erros do Firebase
      else if (error.code === 'auth/invalid-email') {
        errorMessage = 'E-mail inválido';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Credenciais inválidas';
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Logo />

            <View style={styles.form}>
              <AuthInput
                icon="mail-outline"
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loading}
              />

              <AuthInput
                icon="lock-closed-outline"
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                editable={!loading}
              />

              <TouchableOpacity
                onPress={() => router.push('/forget-password')}
                style={styles.forgotPassword}
                disabled={loading}
              >
                <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
              </TouchableOpacity>

              <AuthButton
                title="ENTRAR"
                icon="log-in-outline"
                onPress={handleLogin}
                loading={loading}
                variant="secondary"
                disabled={!email.trim() || !password.trim() || loading}
              />

              <View style={styles.createAccountContainer}>
                <Text style={styles.createAccountText}>Não tem uma conta? </Text>
                <Link href="/new-user" asChild>
                  <TouchableOpacity disabled={loading}>
                    <Text style={styles.createAccountLink}>Criar conta</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={BrandColors.orange} />
          <Text style={styles.loadingText}>Sincronizando...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.darkGray,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    width: '100%',
  },
  form: {
    width: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 8,
  },
  forgotPasswordText: {
    color: BrandColors.orange,
    fontSize: 14,
    fontWeight: '500',
  },
  createAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  createAccountText: {
    color: BrandColors.lightGray,
    fontSize: 14,
  },
  createAccountLink: {
    color: BrandColors.orange,
    fontSize: 14,
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    color: BrandColors.white,
    fontSize: 16,
    fontWeight: '500',
  },
});

