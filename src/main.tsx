
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { updateSocialMetaTags } from './utils/metaTagManager'

// Initialize meta tags before React loads
document.addEventListener('DOMContentLoaded', () => {
  // Принудительное обновление метатегов при загрузке страницы
  updateSocialMetaTags();
  
  // Попытка обновления метатегов через несколько секунд (иногда социальные сети делают запрос позже)
  setTimeout(updateSocialMetaTags, 500);
  setTimeout(updateSocialMetaTags, 1500);
});

createRoot(document.getElementById("root")!).render(<App />);
