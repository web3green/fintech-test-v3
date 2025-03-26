
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { updateSocialMetaTags } from './utils/metaTagManager'

// Initialize meta tags before React loads
document.addEventListener('DOMContentLoaded', () => {
  // Initial update
  updateSocialMetaTags();
  
  // Schedule multiple updates with shorter delays and more iterations
  for (let i = 1; i <= 10; i++) {
    setTimeout(updateSocialMetaTags, i * 200); // Update every 200ms
  }
});

createRoot(document.getElementById("root")!).render(<App />);
