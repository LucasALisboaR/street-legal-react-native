/**
 * Script para baixar fontes do Google Fonts automaticamente
 * 
 * Uso: node scripts/download-fonts.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// URLs alternativas das fontes (tentará múltiplas fontes)
const FONTS = {
  Inter: {
    Regular: [
      'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Regular.ttf',
      'https://raw.githubusercontent.com/rsms/inter/master/docs/font-files/Inter-Regular.ttf',
      'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
    ],
    Medium: [
      'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Medium.ttf',
      'https://raw.githubusercontent.com/rsms/inter/master/docs/font-files/Inter-Medium.ttf',
    ],
    SemiBold: [
      'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-SemiBold.ttf',
      'https://raw.githubusercontent.com/rsms/inter/master/docs/font-files/Inter-SemiBold.ttf',
    ],
    Bold: [
      'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Bold.ttf',
      'https://raw.githubusercontent.com/rsms/inter/master/docs/font-files/Inter-Bold.ttf',
    ],
    ExtraBold: [
      'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-ExtraBold.ttf',
      'https://raw.githubusercontent.com/rsms/inter/master/docs/font-files/Inter-ExtraBold.ttf',
    ],
  },
  Montserrat: {
    Regular: [
      'https://github.com/JulietaUla/Montserrat/raw/master/fonts/ttf/Montserrat-Regular.ttf',
      'https://raw.githubusercontent.com/JulietaUla/Montserrat/master/fonts/ttf/Montserrat-Regular.ttf',
    ],
    SemiBold: [
      'https://github.com/JulietaUla/Montserrat/raw/master/fonts/ttf/Montserrat-SemiBold.ttf',
      'https://raw.githubusercontent.com/JulietaUla/Montserrat/master/fonts/ttf/Montserrat-SemiBold.ttf',
    ],
    Bold: [
      'https://github.com/JulietaUla/Montserrat/raw/master/fonts/ttf/Montserrat-Bold.ttf',
      'https://raw.githubusercontent.com/JulietaUla/Montserrat/master/fonts/ttf/Montserrat-Bold.ttf',
    ],
    ExtraBold: [
      'https://github.com/JulietaUla/Montserrat/raw/master/fonts/ttf/Montserrat-ExtraBold.ttf',
      'https://raw.githubusercontent.com/JulietaUla/Montserrat/master/fonts/ttf/Montserrat-ExtraBold.ttf',
    ],
  },
};

const FONTS_DIR = path.join(__dirname, '../assets/fonts');

// Cria o diretório se não existir
if (!fs.existsSync(FONTS_DIR)) {
  fs.mkdirSync(FONTS_DIR, { recursive: true });
}

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      // Se redirecionamento, seguir
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function tryDownloadUrls(urls, filepath) {
  for (const url of urls) {
    try {
      await downloadFile(url, filepath);
      return true;
    } catch (error) {
      // Tenta próxima URL
      continue;
    }
  }
  return false;
}

async function downloadFonts() {
  console.log('📥 Baixando fontes...\n');
  
  let downloaded = 0;
  let failed = 0;
  
  for (const [family, weights] of Object.entries(FONTS)) {
    console.log(`📦 ${family}:`);
    
    for (const [weight, url] of Object.entries(weights)) {
      const filename = `${family}-${weight}.ttf`;
      const filepath = path.join(FONTS_DIR, filename);
      
      // Pula se já existe
      if (fs.existsSync(filepath)) {
        console.log(`   ✓ ${filename} (já existe)`);
        downloaded++;
        continue;
      }
      
      try {
        const urls = Array.isArray(url) ? url : [url];
        const success = await tryDownloadUrls(urls, filepath);
        
        if (success) {
          console.log(`   ✓ ${filename}`);
          downloaded++;
        } else {
          throw new Error('Todas as URLs falharam');
        }
      } catch (error) {
        console.log(`   ✗ ${filename} - Erro: ${error.message}`);
        failed++;
      }
    }
    console.log('');
  }
  
  console.log(`\n✅ Concluído!`);
  console.log(`   Baixados: ${downloaded}`);
  if (failed > 0) {
    console.log(`   Falhas: ${failed}`);
    console.log(`\n💡 Dica: Se algumas fontes falharam, baixe manualmente do Google Fonts:`);
    console.log(`   - Inter: https://fonts.google.com/specimen/Inter`);
    console.log(`   - Montserrat: https://fonts.google.com/specimen/Montserrat`);
  }
}

// Executa o download
downloadFonts().catch(console.error);

