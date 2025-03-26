
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { 
  updateSocialMetaTags, 
  blockHeartIcon, 
  enforceOurFavicon, 
  scanAndRemoveHeartIcons 
} from './utils/metaTagManager'

// Function to ensure our meta tags and favicon are set
const ensureOurBranding = () => {
  // Block any heart icons
  blockHeartIcon();
  
  // Initial update
  updateSocialMetaTags();
  
  // Enforce our favicon
  enforceOurFavicon();
  
  // Scan DOM for heart icons
  scanAndRemoveHeartIcons();
};

// Initialize meta tags before React loads
document.addEventListener('DOMContentLoaded', () => {
  // Initial setup
  ensureOurBranding();
  
  // Schedule multiple updates with shorter delays and more iterations
  for (let i = 1; i <= 50; i++) {
    setTimeout(ensureOurBranding, i * 20); // Update every 20ms for 1 second
  }
  
  // Additional updates after longer delays to catch late-loading states
  setTimeout(ensureOurBranding, 1000);
  setTimeout(ensureOurBranding, 2000);
  setTimeout(ensureOurBranding, 3000);
  setTimeout(ensureOurBranding, 5000);
  setTimeout(ensureOurBranding, 10000);
});

// Also add event listeners to update meta tags when needed
window.addEventListener('load', () => {
  ensureOurBranding();
  for (let i = 1; i <= 20; i++) {
    setTimeout(ensureOurBranding, i * 50);
  }
});

// Create an interval to continuously check and update our branding
setInterval(ensureOurBranding, 1000); // Check every second

// React app initialization
createRoot(document.getElementById("root")!).render(<App />);
