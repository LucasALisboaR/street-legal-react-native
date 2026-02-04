import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { DefaultFonts } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: DefaultFonts.body, // Fonte padrão para texto
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: DefaultFonts.bodyBold, // Fonte padrão para texto em negrito
  },
  title: {
    fontSize: 32,
    lineHeight: 32,
    fontFamily: DefaultFonts.headingLarge, // Fonte padrão para títulos grandes
  },
  subtitle: {
    fontSize: 20,
    fontFamily: DefaultFonts.heading, // Fonte padrão para subtítulos
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
    fontFamily: DefaultFonts.body, // Fonte padrão para links
  },
});
