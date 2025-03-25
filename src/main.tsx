
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { updateSocialMetaTags } from './utils/metaTagManager'

// Initialize meta tags before React loads
document.addEventListener('DOMContentLoaded', () => {
  // Pre-load the image to ensure it's in browser cache
  updateSocialMetaTags();
});

createRoot(document.getElementById("root")!).render(<App />);
