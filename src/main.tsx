
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { updateSocialMetaTags } from './utils/metaTagManager'

// Initialize meta tags before React loads
document.addEventListener('DOMContentLoaded', () => {
  // Update meta tags once when the page loads
  updateSocialMetaTags();
  
  // Attempt one more update after a delay to ensure socials get the tags
  setTimeout(updateSocialMetaTags, 1500);
});

createRoot(document.getElementById("root")!).render(<App />);
