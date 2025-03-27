
/**
 * Meta Tag Manager - Main export file
 * 
 * This file exports all functions from the refactored utility modules
 * for backwards compatibility with existing code.
 */

// Export favicon management functions
export { 
  getLogoUrl,
  enforceOurFavicon
} from './favicon/faviconManager';

// Export social meta tag management functions
export {
  updateSocialMetaTags
} from './metaTags/socialMetaTags';

// Define placeholder functions for the removed heartIconBlocker.ts
export const blockHeartIcon = () => {
  // Placeholder function - does nothing now
  console.log('blockHeartIcon function has been removed');
};

export const scanAndRemoveHeartIcons = () => {
  // Placeholder function - does nothing now
  console.log('scanAndRemoveHeartIcons function has been removed');
};
