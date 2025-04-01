// Node.js скрипт для одновременного обновления логотипа и фавикона
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Проверка аргументов командной строки
if (process.argv.length < 3) {
  console.error('Использование: node update-both-logos.js путь/к/логотипу.png [путь/к/фавикону.ico]');
  console.error('Если фавикон не указан, будет использован PNG-логотип в качестве фавикона');
  process.exit(1);
}

// Путь к PNG файлу логотипа
const logoPath = process.argv[2];

// Проверка существования файла логотипа
if (!fs.existsSync(logoPath)) {
  console.error(`Файл логотипа не найден: ${logoPath}`);
  process.exit(1);
}

// Проверка что логотип это PNG файл
if (!logoPath.toLowerCase().endsWith('.png')) {
  console.error('Файл логотипа должен быть в формате PNG');
  process.exit(1);
}

// Путь к файлу фавикона (опционально)
const faviconPath = process.argv.length > 3 ? process.argv[3] : null;

// Если указан фавикон, проверяем его существование и формат
if (faviconPath) {
  if (!fs.existsSync(faviconPath)) {
    console.error(`Файл фавикона не найден: ${faviconPath}`);
    process.exit(1);
  }
  
  if (!faviconPath.toLowerCase().endsWith('.ico')) {
    console.error('Файл фавикона должен быть в формате ICO');
    process.exit(1);
  }
}

try {
  console.log('Начинаю обновление логотипа и фавикона...');
  
  // 1. Обновляем PNG логотип
  console.log('\n=== Обновление логотипа PNG ===');
  
  // Копируем PNG-файл в публичную директорию
  const publicLogoPath = path.join(__dirname, 'public', 'logo.png');
  fs.copyFileSync(logoPath, publicLogoPath);
  console.log(`Логотип скопирован в: ${publicLogoPath}`);
  
  // Обновляем ссылки на логотип в HTML
  const indexHtmlPath = path.join(__dirname, 'index.html');
  
  if (fs.existsSync(indexHtmlPath)) {
    let htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
    
    // Обновляем мета-теги с логотипом
    const updatedHtml = htmlContent.replace(
      /<meta property="og:image" content=".*?">/g,
      `<meta property="og:image" content="/logo.png">`
    ).replace(
      /<meta name="twitter:image" content=".*?">/g,
      `<meta name="twitter:image" content="/logo.png">`
    );
    
    // Сохраняем обновленный HTML
    fs.writeFileSync(indexHtmlPath, updatedHtml, 'utf8');
    console.log(`Обновлены мета-теги с логотипом в ${indexHtmlPath}`);
  } else {
    console.warn(`Файл ${indexHtmlPath} не найден`);
  }
  
  // Обновляем logoManager.ts для использования PNG
  const logoManagerPath = path.join(__dirname, 'src', 'utils', 'logoManager.ts');
  
  if (fs.existsSync(logoManagerPath)) {
    // Читаем содержимое PNG файла и кодируем в base64
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');
    const logoDataUrl = `data:image/png;base64,${logoBase64}`;
    
    let logoManagerContent = fs.readFileSync(logoManagerPath, 'utf8');
    
    // Обновляем константу LOGO_BASE64
    const updatedLogoManager = logoManagerContent.replace(
      /const LOGO_BASE64 = ["'].*?["'];/,
      `const LOGO_BASE64 = "${logoDataUrl}";`
    );
    
    fs.writeFileSync(logoManagerPath, updatedLogoManager, 'utf8');
    console.log(`Обновлен файл ${logoManagerPath} с PNG-логотипом в формате base64`);
  } else {
    console.warn(`Файл ${logoManagerPath} не найден`);
  }
  
  // 2. Если указан фавикон, обновляем его
  if (faviconPath) {
    console.log('\n=== Обновление фавикона ICO ===');
    
    // Копируем ICO-файл в корень public
    fs.copyFileSync(faviconPath, path.join(__dirname, 'public', 'favicon.ico'));
    console.log(`Фавикон скопирован в: ${path.join(__dirname, 'public', 'favicon.ico')}`);
    
    // Обновляем ссылки на фавикон в HTML
    const indexHtmlPath = path.join(__dirname, 'index.html');
    
    if (fs.existsSync(indexHtmlPath)) {
      let htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
      
      // Заменяем ссылки на фавикон
      const updatedHtml = htmlContent.replace(
        /<link rel="icon".*?>/g,
        '<link rel="icon" type="image/x-icon" href="/favicon.ico" />'
      ).replace(
        /<link rel="apple-touch-icon".*?>/g,
        '<link rel="apple-touch-icon" href="/favicon.ico" />'
      );
      
      // Сохраняем обновленный HTML
      fs.writeFileSync(indexHtmlPath, updatedHtml, 'utf8');
      console.log(`Обновлены ссылки на фавикон в ${indexHtmlPath}`);
    } else {
      console.warn(`Файл ${indexHtmlPath} не найден`);
    }
    
    // Также обновляем favicon.ico в директории сборки, если существует
    const distFaviconPath = path.join(__dirname, 'dist', 'favicon.ico');
    const distDir = path.join(__dirname, 'dist');
    
    if (fs.existsSync(distDir)) {
      fs.copyFileSync(faviconPath, distFaviconPath);
      console.log(`Фавикон скопирован в директорию сборки: ${distFaviconPath}`);
    }
    
    // Обновляем функцию setFavicon для использования ICO
    if (fs.existsSync(logoManagerPath)) {
      let logoManagerContent = fs.readFileSync(logoManagerPath, 'utf8');
      
      // Для ICO-фавикона
      const updatedLogoManager = logoManagerContent.replace(
        /link\.type = ['"]image\/svg\+xml['"];/,
        'link.type = \'image/x-icon\';'
      ).replace(
        /link\.href = LOGO_BASE64;/,
        'link.href = \'/favicon.ico\';'
      );
      
      fs.writeFileSync(logoManagerPath, updatedLogoManager, 'utf8');
      console.log(`Обновлен файл ${logoManagerPath} для использования ICO фавикона`);
    }
  } else {
    console.log('\nФавикон не указан, используется PNG-логотип в качестве фавикона.');
    
    // Если фавикон не указан, создаем его из PNG
    if (fs.existsSync(logoManagerPath)) {
      let logoManagerContent = fs.readFileSync(logoManagerPath, 'utf8');
      
      // Для использования PNG как фавикона через base64
      const updatedLogoManager = logoManagerContent.replace(
        /link\.type = ['"]image\/x-icon['"];/,
        'link.type = \'image/png\';'
      ).replace(
        /link\.href = ['"]\/favicon\.ico['"];/,
        'link.href = LOGO_BASE64;'
      );
      
      fs.writeFileSync(logoManagerPath, updatedLogoManager, 'utf8');
      console.log(`Обновлен файл ${logoManagerPath} для использования PNG-логотипа как фавикона`);
    }
  }
  
  // 3. Копируем логотип в директорию сборки, если она существует
  const distDir = path.join(__dirname, 'dist');
  if (fs.existsSync(distDir)) {
    fs.copyFileSync(logoPath, path.join(distDir, 'logo.png'));
    console.log(`Логотип скопирован в директорию сборки: ${path.join(distDir, 'logo.png')}`);
  }
  
  console.log('\nЛоготип и фавикон успешно обновлены!');
  console.log('Пожалуйста, перезапустите сервер разработки или выполните сборку проекта:');
  console.log('npm run dev');
  console.log('ИЛИ');
  console.log('npm run build');
  
} catch (error) {
  console.error('Произошла ошибка при обновлении логотипа и фавикона:', error);
  process.exit(1);
} 