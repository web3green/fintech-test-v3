
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { updateSocialMetaTags, initializeFavicon } from './utils/metaTagManager'

// Initialize favicon immediately even before DOM is fully loaded
initializeFavicon();

// Initialize meta tags before React loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, updating meta tags...');
  
  // Update meta tags immediately when the page loads
  updateSocialMetaTags();
  
  // Attempt additional updates at different times to ensure the logo is loaded
  setTimeout(() => updateSocialMetaTags(), 500);
  setTimeout(() => updateSocialMetaTags(), 1500);
  setTimeout(() => updateSocialMetaTags(), 3000);
});

// Set up interval for periodic updates to ensure favicon stays updated
window.addEventListener('load', () => {
  setInterval(() => {
    updateSocialMetaTags();
  }, 10000); // Check every 10 seconds
});

createRoot(document.getElementById("root")!).render(<App />);
