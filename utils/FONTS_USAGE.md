# Como Usar as Fontes Customizadas

## Configuração Inicial

1. **Baixe as fontes** do Google Fonts:
   - Inter: https://fonts.google.com/specimen/Inter
   - Montserrat: https://fonts.google.com/specimen/Montserrat

2. **Coloque os arquivos** na pasta `assets/fonts/`

3. **Descomente as fontes** no arquivo `utils/fonts.ts`

## Uso no Código

### Com React Native Text (StyleSheet)

```typescript
import { Text, StyleSheet } from 'react-native';
import { CustomFonts } from '@/constants/theme';

const styles = StyleSheet.create({
  title: {
    fontFamily: CustomFonts.montserrat.bold,
    fontSize: 24,
  },
  body: {
    fontFamily: CustomFonts.inter.regular,
    fontSize: 16,
  },
});
```

### Com Gluestack UI Text

```typescript
import { Text } from '@gluestack-ui/themed';
import { CustomFonts } from '@/constants/theme';

<Text 
  fontFamily={CustomFonts.montserrat.bold}
  fontSize="$2xl"
>
  Título do Carro
</Text>
```

### Com StyleSheet direto

```typescript
<Text style={{ fontFamily: CustomFonts.inter.semiBold }}>
  Texto em negrito
</Text>
```

## Fontes Disponíveis

### Inter (Texto Geral)
- `CustomFonts.inter.regular` - Texto normal
- `CustomFonts.inter.medium` - Texto médio
- `CustomFonts.inter.semiBold` - Texto semi-negrito
- `CustomFonts.inter.bold` - Texto negrito
- `CustomFonts.inter.extraBold` - Texto extra-negrito

### Montserrat (Títulos)
- `CustomFonts.montserrat.regular` - Título normal
- `CustomFonts.montserrat.semiBold` - Título semi-negrito
- `CustomFonts.montserrat.bold` - Título negrito
- `CustomFonts.montserrat.extraBold` - Título extra-negrito

## Exemplo Prático

```typescript
import { Text, StyleSheet } from 'react-native';
import { CustomFonts } from '@/constants/theme';

export function CarCard({ car }) {
  return (
    <>
      <Text style={styles.brand}>{car.brand}</Text>
      <Text style={styles.model}>{car.model}</Text>
      <Text style={styles.year}>{car.year}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  brand: {
    fontFamily: CustomFonts.montserrat.bold,
    fontSize: 18,
    textTransform: 'uppercase',
  },
  model: {
    fontFamily: CustomFonts.montserrat.extraBold,
    fontSize: 24,
    textTransform: 'uppercase',
  },
  year: {
    fontFamily: CustomFonts.inter.regular,
    fontSize: 14,
  },
});
```

## Fallback

Se as fontes customizadas não estiverem disponíveis, o app usará automaticamente as fontes do sistema.

