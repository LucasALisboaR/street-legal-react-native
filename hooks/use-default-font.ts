/**
 * Hook para obter a fonte padrão do sistema
 * 
 * Útil para usar em StyleSheet.create()
 * 
 * Exemplo:
 * const defaultFont = useDefaultFont();
 * 
 * const styles = StyleSheet.create({
 *   text: {
 *     fontFamily: defaultFont,
 *   }
 * });
 */

import { DefaultFont, DefaultFonts } from '@/constants/theme';

export function useDefaultFont() {
  return DefaultFont;
}

export function useDefaultFonts() {
  return DefaultFonts;
}

