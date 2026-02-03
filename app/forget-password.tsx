import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/auth/button';
import { AuthInput } from '@/components/auth/input';
import { BrandColors } from '@/constants/theme';
import { auth } from '@/config/firebase';

export default function ForgetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendResetLink = async () => {
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, informe seu e-mail');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert(
        'Link enviado',
        'Verifique seu e-mail para redefinir sua senha',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      let errorMessage = 'Erro ao enviar link. Tente novamente.';
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'E-mail inválido';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado';
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
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={BrandColors.white} />
            </TouchableOpacity>

            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Ionicons name="lock-closed-outline" size={40} color={BrandColors.orange} />
                <View style={styles.iconRefresh}>
                  <Ionicons name="refresh" size={24} color={BrandColors.orange} />
                </View>
              </View>
            </View>

            <Text style={styles.title}>
              RECUPERAR <Text style={styles.titleAccent}>SENHA</Text>
            </Text>

            <Text style={styles.description}>
              Digite seu e-mail e enviaremos um link para redefinir sua senha
            </Text>

            <View style={styles.form}>
              <AuthInput
                icon="mail-outline"
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <AuthButton
                title="ENVIAR LINK"
                icon="paper-plane-outline"
                onPress={handleSendResetLink}
                loading={loading}
              />

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Lembrou a senha? </Text>
                <Link href="/login" asChild>
                  <TouchableOpacity>
                    <Text style={styles.loginLink}>Entrar</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 32,
    padding: 8,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: BrandColors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconRefresh: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: BrandColors.darkGray,
    borderRadius: 20,
    padding: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: BrandColors.orange,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
  },
  titleAccent: {
    color: BrandColors.white,
  },
  description: {
    fontSize: 14,
    color: BrandColors.lightGray,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  form: {
    width: '100%',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    color: BrandColors.lightGray,
    fontSize: 14,
  },
  loginLink: {
    color: BrandColors.orange,
    fontSize: 14,
    fontWeight: '600',
  },
});

