# Fontes Padrão do Sistema

O projeto agora tem fontes padrão configuradas que são aplicadas automaticamente em todo o app.

## Fontes Padrão Configuradas

### Por Tipo de Texto

- **Texto Geral (body)**: `Inter-Regular`
- **Texto Negrito (bodyBold)**: `Inter-SemiBold`
- **Títulos (heading)**: `Montserrat-Bold`
- **Títulos Grandes (headingLarge)**: `Montserrat-ExtraBold`
- **Subtítulos (subtitle)**: `Inter-Medium`

## Como Usar

### 1. Usando o Componente DefaultText (Recomendado)

```typescript
import { DefaultText } from '@/components/default-text';

<DefaultText>Este texto usa a fonte padrão automaticamente</DefaultText>
```

### 2. Usando ThemedText (já configurado)

```typescript
import { ThemedText } from '@/components/themed-text';

<ThemedText type="default">Texto normal</ThemedText>
<ThemedText type="title">Título grande</ThemedText>
<ThemedText type="subtitle">Subtítulo</ThemedText>
```

### 3. Usando DefaultFonts no StyleSheet

```typescript
import { StyleSheet } from 'react-native';
import { DefaultFonts } from '@/constants/theme';

const styles = StyleSheet.create({
  text: {
    fontFamily: DefaultFonts.body, // Inter-Regular
  },
  title: {
    fontFamily: DefaultFonts.heading, // Montserrat-Bold
  },
});
```

### 4. Usando o Hook useDefaultFont

```typescript
import { useDefaultFont, useDefaultFonts } from '@/hooks/use-default-font';

function MyComponent() {
  const defaultFont = useDefaultFont();
  const fonts = useDefaultFonts();
  
  return (
    <Text style={{ fontFamily: defaultFont }}>
      Texto com fonte padrão
    </Text>
  );
}
```

### 5. Com Gluestack UI Text

```typescript
import { Text } from '@gluestack-ui/themed';
import { DefaultFonts } from '@/constants/theme';

<Text fontFamily={DefaultFonts.body}>
  Texto com fonte padrão
</Text>
```

## Alterando a Fonte Padrão

Para mudar a fonte padrão de todo o sistema, edite o arquivo `constants/theme.ts`:

```typescript
// Fonte padrão do sistema
export const DefaultFont = CustomFonts.inter.regular; // Altere aqui

// Ou altere por tipo
export const DefaultFonts = {
  body: CustomFonts.inter.regular,        // Altere aqui
  bodyBold: CustomFonts.inter.semiBold,    // Altere aqui
  heading: CustomFonts.montserrat.bold,   // Altere aqui
  // ...
};
```

## Vantagens

✅ **Consistência**: Todas as fontes seguem o mesmo padrão  
✅ **Fácil manutenção**: Mude em um lugar, aplica em todo o app  
✅ **Type-safe**: TypeScript garante que você use as fontes corretas  
✅ **Fallback automático**: Se a fonte não carregar, usa fonte do sistema

