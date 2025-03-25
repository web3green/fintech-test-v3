
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Принудительная загрузка всех метаданных при инициализации приложения
document.addEventListener('DOMContentLoaded', () => {
  // Устанавливаем мета-теги программно, чтобы гарантировать их присутствие
  const metaTags = document.getElementsByTagName('meta');
  for (let i = 0; i < metaTags.length; i++) {
    if (metaTags[i].getAttribute('property') === 'og:image' || 
        metaTags[i].getAttribute('property') === 'twitter:image') {
      // Перезаписываем атрибут, чтобы вызвать обновление кэша
      const currentValue = metaTags[i].getAttribute('content');
      if (currentValue) {
        metaTags[i].setAttribute('content', currentValue + '?v=' + new Date().getTime());
      }
    }
  }
  
  // Дополнительно создаем метатег для прояснения ссылки
  const linkPreviewMeta = document.createElement('meta');
  linkPreviewMeta.setAttribute('property', 'og:image:secure_url');
  linkPreviewMeta.setAttribute('content', 'https://test.mcaweb.xyz/lovable-uploads/8f51558f-dcfd-4921-b6e4-112532ad0723.png?nocache=' + new Date().getTime());
  document.head.appendChild(linkPreviewMeta);
});

createRoot(document.getElementById("root")!).render(<App />);
