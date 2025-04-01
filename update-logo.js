// Node.js скрипт для замены логотипа в проекте
const fs = require('fs');
const path = require('path');

// Проверка аргументов командной строки
if (process.argv.length < 3) {
  console.error('Использование: node update-logo.js путь/к/логотипу.svg');
  process.exit(1);
}

// Путь к SVG файлу логотипа
const logoPath = process.argv[2];

// Проверка существования файла
if (!fs.existsSync(logoPath)) {
  console.error(`Файл не найден: ${logoPath}`);
  process.exit(1);
}

// Проверка что это SVG файл
if (!logoPath.toLowerCase().endsWith('.svg')) {
  console.error('Файл должен быть в формате SVG');
  process.exit(1);
}

// Чтение SVG файла
try {
  const svgContent = fs.readFileSync(logoPath, 'utf8');
  
  // Кодирование SVG в base64
  const base64Logo = Buffer.from(svgContent).toString('base64');
  const dataUrl = `data:image/svg+xml;base64,${base64Logo}`;
  
  console.log('SVG успешно закодирован в base64');
  
  // Пути к файлам, которые нужно изменить
  const filesToUpdate = [
    path.join(__dirname, 'src', 'utils', 'logoBase64.ts'),
    path.join(__dirname, 'src', 'main.tsx'),
    path.join(__dirname, 'src', 'components', 'Logo.tsx'),
    path.join(__dirname, 'src', 'components', 'footer', 'FooterLogo.tsx'),
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'public', 'emergency.html')
  ];
  
  // Счетчик успешно обновленных файлов
  let updatedFiles = 0;
  
  // Обновление каждого файла
  filesToUpdate.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      let isUpdated = false;
      
      // Разные шаблоны замены для разных файлов
      if (filePath.endsWith('logoBase64.ts')) {
        // Для logoBase64.ts заменяем строку LOGO_BASE64
        const newContent = content.replace(
          /(export const LOGO_BASE64 = ").+?(")/,
          `$1${dataUrl}$2`
        );
        
        // Также заменяем ALTERNATIVE_LOGO, если он есть
        content = newContent.replace(
          /(export const ALTERNATIVE_LOGO = ).+?(;)/,
          `$1LOGO_BASE64$2`
        );
        
        isUpdated = true;
      } 
      else if (filePath.endsWith('main.tsx')) {
        // Для main.tsx заменяем window.GLOBAL_LOGO_SVG
        const newContent = content.replace(
          /(window\.GLOBAL_LOGO_SVG = ").+?(")/,
          `$1${dataUrl}$2`
        );
        
        if (newContent !== content) {
          content = newContent;
          isUpdated = true;
        }
      }
      else if (filePath.endsWith('Logo.tsx') || filePath.endsWith('FooterLogo.tsx')) {
        // Для Logo.tsx и FooterLogo.tsx заменяем FALLBACK_SVG_LOGO
        const newContent = content.replace(
          /(const FALLBACK_SVG_LOGO = ").+?(")/,
          `$1${dataUrl}$2`
        );
        
        if (newContent !== content) {
          content = newContent;
          isUpdated = true;
        }
      }
      else if (filePath.endsWith('index.html')) {
        // Для index.html заменяем window.GLOBAL_LOGO_SVG в скрипте
        const newContent = content.replace(
          /(window\.GLOBAL_LOGO_SVG = ").+?(")/,
          `$1${dataUrl}$2`
        );
        
        if (newContent !== content) {
          content = newContent;
          isUpdated = true;
        }
      }
      else if (filePath.endsWith('emergency.html')) {
        // Для emergency.html заменяем встроенный логотип
        const newContent = content.replace(
          /(logoImg\.src = ').+?(')/,
          `$1${dataUrl}$2`
        );
        
        if (newContent !== content) {
          content = newContent;
          isUpdated = true;
        }
      }
      
      // Сохраняем обновленный файл только если он изменился
      if (isUpdated) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Обновлен файл: ${filePath}`);
        updatedFiles++;
      } else {
        console.warn(`Файл не был изменен: ${filePath}`);
      }
    } else {
      console.warn(`Файл не найден, пропускаем: ${filePath}`);
    }
  });
  
  // Создаем и сохраняем логотип в различных форматах и директориях
  
  // 1. Сохраняем SVG-логотип в public/
  fs.copyFileSync(logoPath, path.join(__dirname, 'public', 'logo.svg'));
  console.log(`Логотип скопирован в: ${path.join(__dirname, 'public', 'logo.svg')}`);
  
  // 2. Сохраняем SVG-логотип в public/assets/images/
  const imagesDir = path.join(__dirname, 'public', 'assets', 'images');
  if (fs.existsSync(imagesDir)) {
    fs.copyFileSync(logoPath, path.join(imagesDir, 'logo.svg'));
    console.log(`Логотип скопирован в: ${path.join(imagesDir, 'logo.svg')}`);
    
    // Если есть существующий файл с пробелами в имени, обновляем его тоже
    const spaceFilePath = path.join(imagesDir, 'logo 7.38.02 PM.svg');
    if (fs.existsSync(spaceFilePath)) {
      fs.copyFileSync(logoPath, spaceFilePath);
      console.log(`Логотип скопирован в: ${spaceFilePath}`);
    }
  } else {
    // Если директория не существует, создаем ее
    fs.mkdirSync(imagesDir, { recursive: true });
    fs.copyFileSync(logoPath, path.join(imagesDir, 'logo.svg'));
    console.log(`Создана директория и логотип скопирован в: ${path.join(imagesDir, 'logo.svg')}`);
  }
  
  console.log(`\nОбновлено файлов: ${updatedFiles} из ${filesToUpdate.length}`);
  console.log('Логотип успешно обновлен! Пожалуйста, перезапустите сервер разработки или выполните сборку проекта.');
  
  // Также сохраняем base64 строку в отдельный файл для удобства
  fs.writeFileSync(path.join(__dirname, 'new_logo_base64.txt'), dataUrl, 'utf8');
  console.log(`Base64-строка логотипа сохранена в: ${path.join(__dirname, 'new_logo_base64.txt')}`);
  
  // Предупреждение для пользователя
  console.log('\n⚠️ ВАЖНО: Обратите внимание, что PNG-версия логотипа для социальных сетей не была автоматически обновлена.');
  console.log('Если вам нужно обновить PNG-логотип, пожалуйста, создайте его отдельно и замените файл:');
  console.log(path.join(__dirname, 'public', 'assets', 'images', 'logo.png'));
  
} catch (error) {
  console.error('Произошла ошибка при обработке файла:', error);
  process.exit(1);
} 