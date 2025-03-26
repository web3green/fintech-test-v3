
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { updateSocialMetaTags, blockHeartIcon } from './utils/metaTagManager'

// Initialize meta tags before React loads
document.addEventListener('DOMContentLoaded', () => {
  // Block any heart icons
  blockHeartIcon();
  
  // Initial update
  updateSocialMetaTags();
  
  // Schedule multiple updates with shorter delays and more iterations
  for (let i = 1; i <= 20; i++) {
    setTimeout(updateSocialMetaTags, i * 100); // Update every 100ms
  }
  
  // Additional updates after longer delays to catch late-loading states
  setTimeout(updateSocialMetaTags, 1000);
  setTimeout(updateSocialMetaTags, 2000);
  setTimeout(updateSocialMetaTags, 5000);
});

// Also add event listeners to update meta tags when needed
window.addEventListener('load', () => {
  updateSocialMetaTags();
  setTimeout(updateSocialMetaTags, 500);
});

createRoot(document.getElementById("root")!).render(<App />);
