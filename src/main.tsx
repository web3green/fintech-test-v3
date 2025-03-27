
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { 
  updateSocialMetaTags, 
  enforceOurFavicon 
} from './utils/metaTagManager'

// Function to force cache refresh
const forceCacheRefresh = () => {
  // Add a random parameter to URL of all CSS files to bust cache
  document.querySelectorAll('link[rel="stylesheet"]').forEach(linkEl => {
    if (linkEl instanceof HTMLLinkElement && linkEl.href) {
      const url = new URL(linkEl.href);
      url.searchParams.set('_cache', Date.now().toString());
      linkEl.href = url.toString();
    }
  });
  
  // Same for scripts
  document.querySelectorAll('script[src]').forEach(scriptEl => {
    if (scriptEl instanceof HTMLScriptElement && scriptEl.src && !scriptEl.src.includes('gptengineer')) {
      const originalSrc = scriptEl.src;
      const url = new URL(originalSrc);
      url.searchParams.set('_cache', Date.now().toString());
      
      // For some scripts we may need to recreate them for guaranteed reload
      if (!originalSrc.includes('inline') && !originalSrc.includes('dynamic')) {
        const parent = scriptEl.parentNode;
        if (parent) {
          const newScript = document.createElement('script');
          newScript.src = url.toString();
          newScript.type = scriptEl.type;
          newScript.async = scriptEl.async;
          newScript.defer = scriptEl.defer;
          parent.replaceChild(newScript, scriptEl);
        }
      }
    }
  });
  
  // Hint the browser to refresh all resources
  if (window.performance && window.performance.getEntriesByType) {
    try {
      const resources = window.performance.getEntriesByType('resource');
      resources.forEach(resource => {
        if (resource.name && !resource.name.includes('gptengineer')) {
          const url = new URL(resource.name);
          const isCss = url.pathname.endsWith('.css');
          const isJs = url.pathname.endsWith('.js');
          
          if (isCss || isJs) {
            const cacheBusterUrl = `${url.origin}${url.pathname}?_cache=${Date.now()}${url.search}`;
            
            // Prefetch the resource
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = cacheBusterUrl;
            document.head.appendChild(link);
            
            // Remove after a short delay
            setTimeout(() => link.remove(), 1000);
          }
        }
      });
    } catch (e) {
      console.warn('Failed to analyze resource timing:', e);
    }
  }
  
  console.log('🔄 Cache refresh forced at:', new Date().toISOString());
};

// Function to ensure our meta tags and favicon are set
const ensureOurBranding = () => {
  // Initial update
  updateSocialMetaTags();
  
  // Enforce our favicon
  enforceOurFavicon();
};

// Initialize meta tags before React loads
document.addEventListener('DOMContentLoaded', () => {
  // Initial setup
  ensureOurBranding();
  
  // Force cache refresh
  forceCacheRefresh();
  
  // Schedule multiple updates with shorter delays and more iterations
  for (let i = 1; i <= 10; i++) {
    setTimeout(ensureOurBranding, i * 100); // Update every 100ms for 1 second
  }
  
  // Additional updates after longer delays to catch late-loading states
  setTimeout(ensureOurBranding, 2000);
  setTimeout(ensureOurBranding, 5000);
});

// Also add event listeners to update meta tags when needed
window.addEventListener('load', () => {
  ensureOurBranding();
  // Update cache after full load
  forceCacheRefresh();
  
  for (let i = 1; i <= 5; i++) {
    setTimeout(ensureOurBranding, i * 200);
  }
});

// Create an interval to check and update our branding
setInterval(ensureOurBranding, 5000); // Check every 5 seconds

// Handle page visibility event
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    console.log('⚡ Page became visible - refreshing cache and branding');
    forceCacheRefresh();
    ensureOurBranding();
  }
});

// Handle network status change
window.addEventListener('online', () => {
  console.log('🌐 Network connection restored - refreshing cache');
  forceCacheRefresh();
  ensureOurBranding();
});

// React app initialization
createRoot(document.getElementById("root")!).render(<App />);
