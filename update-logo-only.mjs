// Node.js скрипт для обновления только логотипа, без изменения фавикона
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем __dirname эквивалент для ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Проверка аргументов командной строки
if (process.argv.length < 3) {
  console.error('Использование: node update-logo-only.mjs путь/к/логотипу.png');
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

try {
  console.log('Начинаю обновление логотипа...');
  
  // 1. Читаем содержимое PNG файла и кодируем в base64
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');
  const logoDataUrl = `data:image/png;base64,${logoBase64}`;
  
  // Сохраняем base64 в текстовый файл для удобства
  fs.writeFileSync(path.join(__dirname, 'new_logo_base64.txt'), logoDataUrl, 'utf8');
  console.log(`Base64 версия логотипа сохранена в: new_logo_base64.txt`);
  
  // 2. Обновляем PNG логотип
  console.log('\n=== Обновление логотипа PNG ===');
  
  // Копируем PNG-файл в публичную директорию, используя имя файла logo1.png
  const publicLogoPath = path.join(__dirname, 'public', 'logo1.png');
  fs.copyFileSync(logoPath, publicLogoPath);
  console.log(`Логотип скопирован в: ${publicLogoPath}`);
  
  // Также копируем в директорию assets/images/
  const imagesDir = path.join(__dirname, 'public', 'assets', 'images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  fs.copyFileSync(logoPath, path.join(imagesDir, 'logo1.png'));
  console.log(`Логотип скопирован в: ${path.join(imagesDir, 'logo1.png')}`);
  
  // 3. Обновляем ссылки на логотип в HTML
  const indexHtmlPath = path.join(__dirname, 'index.html');
  
  if (fs.existsSync(indexHtmlPath)) {
    let htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
    
    // Обновляем мета-теги с логотипом
    let updatedHtml = htmlContent.replace(
      /<meta property="og:image" content=".*?">/g,
      `<meta property="og:image" content="/logo1.png">`
    ).replace(
      /<meta name="twitter:image" content=".*?">/g,
      `<meta name="twitter:image" content="/logo1.png">`
    );
    
    // Обновляем глобальную переменную GLOBAL_LOGO_SVG
    updatedHtml = updatedHtml.replace(
      /window\.GLOBAL_LOGO_SVG = ["']data:image\/svg\+xml;base64,[^"']*["'];/g,
      `window.GLOBAL_LOGO_SVG = "${logoDataUrl}";`
    );
    
    // Сохраняем обновленный HTML
    fs.writeFileSync(indexHtmlPath, updatedHtml, 'utf8');
    console.log(`Обновлен файл ${indexHtmlPath} с мета-тегами и глобальной переменной логотипа`);
  } else {
    console.warn(`Файл ${indexHtmlPath} не найден`);
  }
  
  // 4. Обновляем emergency.html если существует
  const emergencyHtmlPath = path.join(__dirname, 'public', 'emergency.html');
  
  if (fs.existsSync(emergencyHtmlPath)) {
    let emergencyContent = fs.readFileSync(emergencyHtmlPath, 'utf8');
    
    // Обновляем логотип в аварийной странице и меняем SVG на PNG
    const updatedEmergency = emergencyContent.replace(
      /logoImg\.src = ['"]data:image\/svg\+xml;base64,[^'"]*['"];/g,
      `logoImg.src = "${logoDataUrl}";`
    ).replace(
      /<img src="[^"]*" alt="Логотип" id="logo-svg" \/>/g,
      `<img src="logo1.png" alt="Логотип" id="logo-svg" />`
    ).replace(
      /Видите ли вы логотип выше\? Если да, значит SVG файл загружается корректно\./g,
      `Видите ли вы логотип выше? Если да, значит PNG файл загружается корректно.`
    ).replace(
      /Ошибка загрузки SVG логотипа/g,
      `Ошибка загрузки PNG логотипа`
    );
    
    fs.writeFileSync(emergencyHtmlPath, updatedEmergency, 'utf8');
    console.log(`Обновлен файл ${emergencyHtmlPath} с логотипом`);
  } else {
    console.warn(`Файл ${emergencyHtmlPath} не найден`);
  }
  
  // 5. Обновляем logoBase64.ts для использования PNG
  const logoBase64Path = path.join(__dirname, 'src', 'utils', 'logoBase64.ts');
  
  if (fs.existsSync(logoBase64Path)) {
    let logoBase64Content = fs.readFileSync(logoBase64Path, 'utf8');
    
    // Обновляем константу LOGO_BASE64
    const updatedLogoBase64 = logoBase64Content.replace(
      /export const LOGO_BASE64 = ["']data:image\/svg\+xml;base64,[^"']*["'];/g,
      `export const LOGO_BASE64 = "${logoDataUrl}";`
    );
    
    fs.writeFileSync(logoBase64Path, updatedLogoBase64, 'utf8');
    console.log(`Обновлен файл ${logoBase64Path} с константой LOGO_BASE64`);
  } else {
    console.warn(`Файл ${logoBase64Path} не найден`);
  }
  
  // 6. Обновляем logoManager.ts для использования PNG в качестве логотипа
  const logoManagerPath = path.join(__dirname, 'src', 'utils', 'logoManager.ts');
  
  if (fs.existsSync(logoManagerPath)) {
    let logoManagerContent = fs.readFileSync(logoManagerPath, 'utf8');
    
    // Обновляем тип файла с SVG на PNG только для link.type в setFavicon
    const updatedLogoManager = logoManagerContent.replace(
      /link\.type = ['"]image\/svg\+xml['"];/g,
      `link.type = 'image/png';`
    );
    
    fs.writeFileSync(logoManagerPath, updatedLogoManager, 'utf8');
    console.log(`Обновлен файл ${logoManagerPath} для использования PNG-логотипа`);
  } else {
    console.warn(`Файл ${logoManagerPath} не найден`);
  }
  
  // 7. Обновляем main.tsx для глобальной переменной
  const mainTsxPath = path.join(__dirname, 'src', 'main.tsx');
  
  if (fs.existsSync(mainTsxPath)) {
    let mainTsxContent = fs.readFileSync(mainTsxPath, 'utf8');
    
    // Обновляем глобальную переменную в main.tsx
    const updatedMainTsx = mainTsxContent.replace(
      /window\.GLOBAL_LOGO_SVG = ["']data:image\/svg\+xml;base64,[^"']*["'];/g,
      `window.GLOBAL_LOGO_SVG = "${logoDataUrl}";`
    );
    
    fs.writeFileSync(mainTsxPath, updatedMainTsx, 'utf8');
    console.log(`Обновлен файл ${mainTsxPath} с глобальной переменной логотипа`);
  } else {
    console.warn(`Файл ${mainTsxPath} не найден`);
  }
  
  // 8. Обновляем Logo.tsx и FooterLogo.tsx для резервного логотипа
  const logoComponentPath = path.join(__dirname, 'src', 'components', 'Logo.tsx');
  
  if (fs.existsSync(logoComponentPath)) {
    let logoComponentContent = fs.readFileSync(logoComponentPath, 'utf8');
    
    // Обновляем резервный логотип FALLBACK_SVG_LOGO в Logo.tsx
    const updatedLogoComponent = logoComponentContent.replace(
      /const FALLBACK_SVG_LOGO = ["']data:image\/svg\+xml;base64,[^"']*["'];/g,
      `const FALLBACK_SVG_LOGO = "${logoDataUrl}";`
    );
    
    fs.writeFileSync(logoComponentPath, updatedLogoComponent, 'utf8');
    console.log(`Обновлен файл ${logoComponentPath} с резервным логотипом`);
  } else {
    console.warn(`Файл ${logoComponentPath} не найден`);
  }
  
  const footerLogoPath = path.join(__dirname, 'src', 'components', 'footer', 'FooterLogo.tsx');
  
  if (fs.existsSync(footerLogoPath)) {
    let footerLogoContent = fs.readFileSync(footerLogoPath, 'utf8');
    
    // Обновляем резервный логотип FALLBACK_SVG_LOGO в FooterLogo.tsx
    const updatedFooterLogo = footerLogoContent.replace(
      /const FALLBACK_SVG_LOGO = ["']data:image\/svg\+xml;base64,[^"']*["'];/g,
      `const FALLBACK_SVG_LOGO = "${logoDataUrl}";`
    );
    
    fs.writeFileSync(footerLogoPath, updatedFooterLogo, 'utf8');
    console.log(`Обновлен файл ${footerLogoPath} с резервным логотипом`);
  } else {
    console.warn(`Файл ${footerLogoPath} не найден`);
  }
  
  // 9. Копируем логотип в директорию сборки, если она существует
  const distDir = path.join(__dirname, 'dist');
  if (fs.existsSync(distDir)) {
    fs.copyFileSync(logoPath, path.join(distDir, 'logo1.png'));
    console.log(`Логотип скопирован в директорию сборки: ${path.join(distDir, 'logo1.png')}`);
    
    // Также копируем в assets/images/ в dist, если существует
    const distImagesDir = path.join(distDir, 'assets', 'images');
    if (!fs.existsSync(distImagesDir)) {
      fs.mkdirSync(distImagesDir, { recursive: true });
    }
    fs.copyFileSync(logoPath, path.join(distImagesDir, 'logo1.png'));
    console.log(`Логотип скопирован в: ${path.join(distImagesDir, 'logo1.png')}`);
  }
  
  console.log('\nЛоготип успешно обновлен во всех местах использования!');
  console.log('Формат изменен с SVG на PNG, использовано имя файла logo1.png.');
  console.log('Пожалуйста, перезапустите сервер разработки или выполните сборку проекта:');
  console.log('npm run dev');
  console.log('ИЛИ');
  console.log('npm run build');
  
} catch (error) {
  console.error('Произошла ошибка при обновлении логотипа:', error);
  process.exit(1);
} 