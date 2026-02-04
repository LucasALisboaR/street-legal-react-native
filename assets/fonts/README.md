# Fontes do Projeto

Esta pasta deve conter os arquivos de fonte (.ttf ou .otf) do projeto.

## Fontes Recomendadas

Para um app de carros com tema "street legal", recomendamos as seguintes fontes do Google Fonts:

### 1. Inter (Fonte Principal)
- **Uso**: Texto geral, corpo, botões
- **Download**: https://fonts.google.com/specimen/Inter
- **Arquivos necessários**:
  - `Inter-Regular.ttf`
  - `Inter-Medium.ttf`
  - `Inter-SemiBold.ttf`
  - `Inter-Bold.ttf`
  - `Inter-ExtraBold.ttf`

### 2. Montserrat (Fonte de Títulos)
- **Uso**: Títulos, cabeçalhos, destaques
- **Download**: https://fonts.google.com/specimen/Montserrat
- **Arquivos necessários**:
  - `Montserrat-Regular.ttf`
  - `Montserrat-SemiBold.ttf`
  - `Montserrat-Bold.ttf`
  - `Montserrat-ExtraBold.ttf`

## Como Baixar

### Opção 1: Script Automático (Recomendado) ⚡

Execute o comando no terminal:

```bash
npm run download-fonts
```

ou

```bash
node scripts/download-fonts.js
```

O script baixará automaticamente todas as fontes necessárias para esta pasta.

### Opção 2: Download Manual

1. Acesse o Google Fonts (links acima)
2. Selecione os pesos (weights) desejados
3. Clique em "Download family"
4. Extraia os arquivos .ttf
5. Copie os arquivos .ttf para esta pasta (`assets/fonts/`)

## Estrutura Final

Após baixar, a pasta deve ficar assim:

```
assets/fonts/
├── Inter-Regular.ttf
├── Inter-Medium.ttf
├── Inter-SemiBold.ttf
├── Inter-Bold.ttf
├── Inter-ExtraBold.ttf
├── Montserrat-Regular.ttf
├── Montserrat-SemiBold.ttf
├── Montserrat-Bold.ttf
└── Montserrat-ExtraBold.ttf
```

## Alternativas Rápidas

Se preferir usar fontes já instaladas no sistema, o projeto está configurado para usar fontes do sistema como fallback.

