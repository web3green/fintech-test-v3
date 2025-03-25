
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Принудительная загрузка всех метаданных при инициализации приложения
document.addEventListener('DOMContentLoaded', () => {
  // Удаляем все существующие OG метатеги изображений
  document.querySelectorAll('meta[property^="og:image"]').forEach(tag => {
    if (tag.getAttribute('property') !== 'og:image:alt' && 
        tag.getAttribute('property') !== 'og:image:width' && 
        tag.getAttribute('property') !== 'og:image:height') {
      tag.remove();
    }
  });
  
  // Удаляем все существующие Twitter метатеги изображений
  document.querySelectorAll('meta[property^="twitter:image"]').forEach(tag => {
    tag.remove();
  });
  
  // Создаем новые метатеги с правильными URL
  const metaTagsToAdd = [
    {property: 'og:image', content: 'https://test.mcaweb.xyz/lovable-uploads/8f51558f-dcfd-4921-b6e4-112532ad0723.png'},
    {property: 'og:image:url', content: 'https://test.mcaweb.xyz/lovable-uploads/8f51558f-dcfd-4921-b6e4-112532ad0723.png'},
    {property: 'og:image:secure_url', content: 'https://test.mcaweb.xyz/lovable-uploads/8f51558f-dcfd-4921-b6e4-112532ad0723.png'},
    {property: 'twitter:image', content: 'https://test.mcaweb.xyz/lovable-uploads/8f51558f-dcfd-4921-b6e4-112532ad0723.png'}
  ];
  
  metaTagsToAdd.forEach(({property, content}) => {
    const meta = document.createElement('meta');
    meta.setAttribute('property', property);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  });
  
  // Выводим в консоль для отладки
  console.log("Метатеги обновлены:", document.querySelectorAll('meta[property^="og:image"], meta[property^="twitter:image"]'));
});

createRoot(document.getElementById("root")!).render(<App />);
