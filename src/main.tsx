
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { updateSocialMetaTags, initializeFavicon } from './utils/metaTagManager'

// Function to aggressively override heart favicon
const overrideHeartFavicon = () => {
  console.log('Aggressively overriding heart favicon...');
  
  // Initialize favicon immediately
  initializeFavicon();
  
  // Update meta tags
  updateSocialMetaTags();
  
  // Force browser to show our favicon by repeatedly initializing
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      initializeFavicon();
      updateSocialMetaTags();
    }, i * 500);
  }
};

// Call before any other code
overrideHeartFavicon();

// Initialize again when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, aggressively updating favicon...');
  overrideHeartFavicon();
});

// Set up interval for periodic updates to ensure favicon stays updated
window.addEventListener('load', () => {
  console.log('Window loaded, setting up continuous monitoring');
  setInterval(() => {
    // Check if heart favicon has returned and replace it
    const icons = document.querySelectorAll('link[rel^="icon"]');
    let foundHeart = false;
    
    icons.forEach(icon => {
      const href = icon.getAttribute('href');
      if (href && (href.includes('heart') || href.includes('favicon.ico'))) {
        console.log('Found heart icon, removing:', href);
        icon.remove();
        foundHeart = true;
      }
    });
    
    if (foundHeart || Date.now() % 10000 < 100) {
      overrideHeartFavicon();
    } else {
      initializeFavicon();
    }
  }, 2000); // Check every 2 seconds
});

// Additional mechanism to override cached favicon
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    console.log('Page restored from cache, reinitializing favicon');
    overrideHeartFavicon();
  }
});

createRoot(document.getElementById("root")!).render(<App />);

