
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { updateSocialMetaTags } from './utils/metaTagManager'

// Initialize meta tags before React loads
document.addEventListener('DOMContentLoaded', () => {
  // Update meta tags multiple times to ensure they're picked up by social media platforms
  updateSocialMetaTags();
  
  // Schedule multiple updates with increasing delays
  setTimeout(updateSocialMetaTags, 500);
  setTimeout(updateSocialMetaTags, 1000);
  setTimeout(updateSocialMetaTags, 1500);
  setTimeout(updateSocialMetaTags, 2000);
});

createRoot(document.getElementById("root")!).render(<App />);
