// Node.js скрипт для замены фавикона в проекте
const fs = require('fs');
const path = require('path');

// Проверка аргументов командной строки
if (process.argv.length < 3) {
  console.error('Использование: node update-favicon.js путь/к/фавикону.ico');
  process.exit(1);
}

// Путь к ICO файлу фавикона
const faviconPath = process.argv[2];

// Проверка существования файла
if (!fs.existsSync(faviconPath)) {
  console.error(`Файл не найден: ${faviconPath}`);
  process.exit(1);
}

// Проверка что это ICO файл
if (!faviconPath.toLowerCase().endsWith('.ico')) {
  console.error('Файл должен быть в формате ICO');
  process.exit(1);
}

try {
  console.log('Начинаю обновление фавикона...');
  
  // 1. Копируем ICO-файл в нужные директории
  
  // Копируем в корень public
  fs.copyFileSync(faviconPath, path.join(__dirname, 'public', 'favicon.ico'));
  console.log(`Фавикон скопирован в: ${path.join(__dirname, 'public', 'favicon.ico')}`);
  
  // 2. Обновляем ссылки на фавикон в HTML
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
  
  // 3. Изменяем logoManager.ts для поддержки ICO
  const logoManagerPath = path.join(__dirname, 'src', 'utils', 'logoManager.ts');
  
  if (fs.existsSync(logoManagerPath)) {
    let logoManagerContent = fs.readFileSync(logoManagerPath, 'utf8');
    
    // Изменяем функцию setFavicon, чтобы она использовала ICO
    const updatedLogoManager = logoManagerContent.replace(
      /link\.type = ['"]image\/svg\+xml['"];/,
      'link.type = \'image/x-icon\';'
    ).replace(
      /link\.href = LOGO_BASE64;/,
      'link.href = \'/favicon.ico\';'
    );
    
    fs.writeFileSync(logoManagerPath, updatedLogoManager, 'utf8');
    console.log(`Обновлен файл ${logoManagerPath} для использования ICO фавикона`);
  } else {
    console.warn(`Файл ${logoManagerPath} не найден`);
  }
  
  // 4. Также обновляем favicon.ico в директории сборки, если существует
  const distFaviconPath = path.join(__dirname, 'dist', 'favicon.ico');
  const distDir = path.join(__dirname, 'dist');
  
  if (fs.existsSync(distDir)) {
    fs.copyFileSync(faviconPath, distFaviconPath);
    console.log(`Фавикон скопирован в директорию сборки: ${distFaviconPath}`);
  }
  
  console.log('\nФавикон успешно обновлен!');
  console.log('Пожалуйста, перезапустите сервер разработки или выполните сборку проекта:');
  console.log('npm run dev');
  console.log('ИЛИ');
  console.log('npm run build');
  
  console.log('\nПримечание: Этот скрипт изменил способ загрузки фавикона с SVG на ICO.');
  console.log('Если вы хотите вернуться к SVG, используйте скрипт update-logo.js или восстановите файлы из системы контроля версий.');
  
} catch (error) {
  console.error('Произошла ошибка при обновлении фавикона:', error);
  process.exit(1);
} 