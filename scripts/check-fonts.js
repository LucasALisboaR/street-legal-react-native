/**
 * Script para verificar se as fontes estão carregadas corretamente
 * 
 * Uso: node scripts/check-fonts.js
 */

const fs = require('fs');
const path = require('path');

const FONTS_DIR = path.join(__dirname, '../assets/fonts');
const REQUIRED_FONTS = [
  'Inter-Regular.ttf',
  'Inter-Medium.ttf',
  'Inter-SemiBold.ttf',
  'Inter-Bold.ttf',
  'Inter-ExtraBold.ttf',
  'Montserrat-Regular.ttf',
  'Montserrat-SemiBold.ttf',
  'Montserrat-Bold.ttf',
  'Montserrat-ExtraBold.ttf',
];

console.log('🔍 Verificando fontes...\n');

if (!fs.existsSync(FONTS_DIR)) {
  console.log('❌ Pasta assets/fonts não existe!');
  process.exit(1);
}

const files = fs.readdirSync(FONTS_DIR);
const fontFiles = files.filter(f => f.endsWith('.ttf'));

console.log(`📁 Fontes encontradas: ${fontFiles.length}\n`);

let missing = [];
let found = [];

REQUIRED_FONTS.forEach(font => {
  if (fontFiles.includes(font)) {
    const filePath = path.join(FONTS_DIR, font);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`✅ ${font} (${sizeKB} KB)`);
    found.push(font);
  } else {
    console.log(`❌ ${font} - FALTANDO`);
    missing.push(font);
  }
});

console.log(`\n📊 Resumo:`);
console.log(`   ✅ Encontradas: ${found.length}/${REQUIRED_FONTS.length}`);
console.log(`   ❌ Faltando: ${missing.length}/${REQUIRED_FONTS.length}`);

if (missing.length > 0) {
  console.log(`\n💡 Execute: npm run download-fonts`);
  process.exit(1);
} else {
  console.log(`\n✅ Todas as fontes estão presentes!`);
  console.log(`\n💡 Verifique se as fontes estão ativadas em utils/fonts.ts`);
}

