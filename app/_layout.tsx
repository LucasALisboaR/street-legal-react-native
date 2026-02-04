import { config } from '@gluestack-ui/config';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { BrandColors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { customFonts } from '@/utils/fonts';

// Previne que a splash screen desapareça automaticamente
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { loading } = useAuth();

  // Carrega as fontes customizadas (se disponíveis)
  const hasCustomFonts = Object.keys(customFonts).length > 0;
  const [fontsLoaded, fontError] = useFonts(customFonts);

  useEffect(() => {
    if (!hasCustomFonts || fontsLoaded || fontError) {
      // Esconde a splash screen quando:
      // - Não há fontes customizadas para carregar, OU
      // - As fontes carregaram, OU
      // - Houve erro ao carregar fontes
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, hasCustomFonts]);

  // Mostra loading enquanto carrega fontes (se houver) ou autenticação
  const isLoading = (hasCustomFonts && !fontsLoaded && !fontError) || loading;
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: BrandColors.darkGray }}>
        <ActivityIndicator size="large" color={BrandColors.orange} />
      </View>
    );
  }

  return (
    <GluestackUIProvider config={config}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="forget-password" options={{ headerShown: false }} />
          <Stack.Screen name="new-user" options={{ headerShown: false }} />
          <Stack.Screen name="new-event" options={{ headerShown: false }} />
          <Stack.Screen name="create-car" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
