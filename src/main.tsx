
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { updateSocialMetaTags, blockHeartIcon, enforceOurFavicon } from './utils/metaTagManager'

// Function to ensure our meta tags and favicon are set
const ensureOurBranding = () => {
  // Block any heart icons
  blockHeartIcon();
  
  // Initial update
  updateSocialMetaTags();
  
  // Enforce our favicon
  enforceOurFavicon();
};

// Initialize meta tags before React loads
document.addEventListener('DOMContentLoaded', () => {
  // Initial setup
  ensureOurBranding();
  
  // Schedule multiple updates with shorter delays and more iterations
  for (let i = 1; i <= 30; i++) {
    setTimeout(ensureOurBranding, i * 50); // Update every 50ms for 1.5 seconds
  }
  
  // Additional updates after longer delays to catch late-loading states
  setTimeout(ensureOurBranding, 1000);
  setTimeout(ensureOurBranding, 2000);
  setTimeout(ensureOurBranding, 3000);
  setTimeout(ensureOurBranding, 5000);
});

// Also add event listeners to update meta tags when needed
window.addEventListener('load', () => {
  ensureOurBranding();
  setTimeout(ensureOurBranding, 500);
  setTimeout(ensureOurBranding, 1000);
});

// Create an interval to continuously check and update our branding
setInterval(ensureOurBranding, 2000);

createRoot(document.getElementById("root")!).render(<App />);
