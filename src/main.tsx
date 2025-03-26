
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { updateSocialMetaTags } from './utils/favicon/socialMetaUtils'
import { initializeFavicon } from './utils/favicon/faviconManager'
import { blockGptEngineerScripts, blockNetworkRequests } from './utils/scriptBlocker'
import { injectBlockingStyles, removeUnwantedElements, blockFutureScripts } from './utils/domBlocker'
import { setupMutationObservers, setupIntervalChecks } from './utils/mutationObserver'

// Execute blocking IMMEDIATELY
blockGptEngineerScripts();

// Inject blocking styles early
injectBlockingStyles();

// Block network requests to unwanted domains
blockNetworkRequests();

// Override unwanted favicons as soon as possible
const overrideUnwantedFavicons = () => {
  console.log('Aggressively overriding unwanted favicons...');
  
  // Initialize favicon immediately
  initializeFavicon();
  
  // Update meta tags
  updateSocialMetaTags();
  
  // Force browser to show our favicon through repeated initialization
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      initializeFavicon();
      updateSocialMetaTags();
    }, i * 50); // Very frequent updates (every 50ms)
  }
  
  // Remove all unwanted icons and scripts
  removeUnwantedElements();
};

// Call before any other code
overrideUnwantedFavicons();

// Intercept cached favicon.ico before loading anything else
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, aggressively updating favicon...');
  
  // Create a dummy favicon link to redirect browser requests
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA/0lEQVR42mNkGGDAOOqAUQeMOmDUAaMO4D4AH2egFQAAgL7gNAOwAICvBzx+/Jjl4cOH8p8/f2YihJmZmbmYmJg3CQkJP6Fyn6H0F3Fxca+QkJCvKSkpX+Pi4r7/hYI/f/68//Tp09OJiYmvO39sEdZVNzU7evToWxkZme8gR/z8+fPPnz9/fv/69evv79+//0HB/4H4HxD/B+E/UP5/EP0fCYP4/xkYGBmA8v+A4vA4AMXRTwYsBuAK/FetWnVm7969x48cOXLi8ePHN27evHnj1q1bd+7cuXMPiO/CcBbQ9OfPn79y48aNG1euXLly+fLly5cuXbpw/vz5M2fOnDlNU1sAB1+QqgkWAlsAAAAASUVORK5CYII=';
  document.head.insertBefore(link, document.head.firstChild);
  
  // Override with our real favicon
  overrideUnwantedFavicons();
  
  // Block future script additions
  blockFutureScripts();
});

// Setup continuous monitoring when window fully loads
window.addEventListener('load', () => {
  console.log('Window loaded, setting up continuous monitoring');
  
  // Initial aggressive override
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      overrideUnwantedFavicons();
    }, i * 100);
  }
  
  // Setup mutation observers
  const observers = setupMutationObservers();
  
  // Setup interval checks
  const intervals = setupIntervalChecks();
  
  // Cleanup function (not actually used in this context but good practice)
  const cleanup = () => {
    observers.headObserver.disconnect();
    observers.bodyObserver.disconnect();
    clearInterval(intervals.intervalId);
    clearInterval(intervals.metaUpdateInterval);
  };
});

// Handle page restoration from cache
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    console.log('Page restored from cache, reinitializing favicon');
    overrideUnwantedFavicons();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
