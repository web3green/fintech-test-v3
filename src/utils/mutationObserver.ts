
/**
 * Utility to watch for DOM mutations and block unwanted elements
 */
import { initializeFavicon } from './favicon/faviconManager';
import { updateSocialMetaTags } from './favicon/socialMetaUtils';
import { removeUnwantedElements } from './domBlocker';

// Setup mutation observers to monitor DOM changes
export const setupMutationObservers = () => {
  // Observer for changes in head element
  const headObserver = new MutationObserver((mutations) => {
    let unwantedIconAdded = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const addedNodes = Array.from(mutation.addedNodes);
        
        // Check for unwanted icons
        unwantedIconAdded = addedNodes.some(node => {
          if (node.nodeName === 'LINK') {
            const href = (node as HTMLLinkElement).href;
            return href && (
              href.includes('heart') || 
              href.includes('favicon.ico') ||
              href.includes('gpteng') ||
              href.includes('gptengineer') ||
              href.includes('engine')
            );
          }
          return false;
        });
      }
    });
    
    if (unwantedIconAdded) {
      console.log('Unwanted icon detected in DOM mutation, removing it');
      removeUnwantedElements();
      initializeFavicon();
    }
  });
  
  // Start observing head element
  headObserver.observe(document.head, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href', 'src']
  });
  
  // Observer for changes in body element
  const bodyObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasGptEngScript = addedNodes.some(node => {
          if (node.nodeName === 'SCRIPT') {
            const src = (node as HTMLScriptElement).src;
            return src && (
              src.includes('gpteng') || 
              src.includes('gptengineer') ||
              src.includes('engine')
            );
          }
          return false;
        });
        
        if (hasGptEngScript) {
          console.log('Detected gptengineer script in body, removing it');
          removeUnwantedElements();
        }
      }
    });
  });
  
  // Start observing body element
  bodyObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return { headObserver, bodyObserver };
};

// Setup interval checks to continuously monitor for unwanted elements
export const setupIntervalChecks = () => {
  const intervalId = setInterval(() => {
    // Check for unwanted icons
    const unwantedIcons = document.querySelectorAll(
      'link[href*="heart"], link[href*="favicon.ico"], link[href*="gpteng"], link[href*="gptengineer"]'
    );
    
    if (unwantedIcons.length > 0) {
      console.log('Found and removing unwanted icons:', unwantedIcons.length);
      unwantedIcons.forEach(icon => icon.remove());
      initializeFavicon();
    } else {
      // Periodically reinitialize favicon
      if (Date.now() % 5000 < 100) {
        initializeFavicon();
      }
    }
  }, 300);
  
  // Setup interval for periodic meta tag updates
  const metaUpdateInterval = setInterval(() => {
    initializeFavicon();
    updateSocialMetaTags();
  }, 2000);
  
  return { intervalId, metaUpdateInterval };
};
