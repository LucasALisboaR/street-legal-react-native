/**
 * Componente Text padrão que usa a fonte do sistema automaticamente
 * 
 * Use este componente ao invés de Text do React Native para ter a fonte padrão aplicada
 * 
 * Exemplo:
 * import { DefaultText } from '@/components/default-text';
 * 
 * <DefaultText>Meu texto com fonte padrão</DefaultText>
 */

import { Text, type TextProps, StyleSheet } from 'react-native';
import { DefaultFont } from '@/constants/theme';

export type DefaultTextProps = TextProps;

export function DefaultText({ style, ...props }: DefaultTextProps) {
  return (
    <Text
      style={[styles.default, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: DefaultFont, // Aplica a fonte padrão automaticamente
  },
});

