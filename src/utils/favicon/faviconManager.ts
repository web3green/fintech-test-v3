
/**
 * Main manager for favicon initialization and protection
 */
import { 
  createFaviconElementFromBase64,
  blockDefaultFavicon,
  removeAllUnwantedFavicons,
  createFaviconBlockingStyles 
} from './faviconUtils';
import { 
  blockUndesiredScripts,
  blockGptEngScript 
} from './scriptBlockerUtils';
import { 
  getLogoUrl, 
  updateSocialMetaTags 
} from './socialMetaUtils';

// Function for aggressively overwriting head tags to block unwanted icons
export const overrideHeadTags = () => {
  // Block unwanted scripts
  blockGptEngScript();
  blockUndesiredScripts();
  
  // Remove all unwanted icons
  removeAllUnwantedFavicons();
  
  // Block standard favicon.ico request
  blockDefaultFavicon();
  
  // Add CSS rules to block unwanted icons
  createFaviconBlockingStyles();
  
  // Create new favicon with our logo
  createFaviconElementFromBase64();
  
  // Add more icons with our logo
  const { absolute: logoUrl } = getLogoUrl(false);
  
  // Create additional icons
  const iconTypes = [
    { rel: 'icon', type: 'image/png' },
    { rel: 'shortcut icon', type: 'image/png' },
    { rel: 'apple-touch-icon' }
  ];
  
  // Create all types of icons
  iconTypes.forEach(iconType => {
    const link = document.createElement('link');
    link.rel = iconType.rel;
    link.href = logoUrl;
    if (iconType.type) {
      link.type = iconType.type;
    }
    document.head.insertBefore(link, document.head.firstChild);
  });
};

// Function to initialize favicon with extreme priority
export const initializeFavicon = () => {
  try {
    // Block heart icon and other unwanted icons with CSS rule
    createFaviconBlockingStyles();
    
    // Completely override all tags in head to block unwanted icons
    overrideHeadTags();
    
    console.log('Favicon initialized successfully');
    
    // Ensure our function is called again if something changes in DOM
    if (!window['faviconObserver']) {
      const observer = new MutationObserver((mutations) => {
        let needsUpdate = false;
        
        for (const mutation of mutations) {
          if (mutation.type === 'childList' || mutation.type === 'attributes') {
            needsUpdate = true;
            break;
          }
        }
        
        if (needsUpdate) {
          console.log('DOM changed, reinitializing favicon');
          overrideHeadTags();
        }
      });
      
      // Observe changes in head
      observer.observe(document.head, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['href', 'rel']
      });
      
      window['faviconObserver'] = observer;
    }
  } catch (error) {
    console.error('Error initializing favicon:', error);
  }
};

// Export combined functionality
export { 
  getLogoUrl, 
  updateSocialMetaTags,
  createFaviconElementFromBase64,
  blockDefaultFavicon,
  removeAllUnwantedFavicons,
  createFaviconBlockingStyles,
  blockUndesiredScripts,
  blockGptEngScript
};
