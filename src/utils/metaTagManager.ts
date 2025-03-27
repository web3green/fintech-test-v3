
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

// Export heart icon blocking functions
export {
  blockHeartIcon,
  scanAndRemoveHeartIcons
} from './heartBlocker/heartIconBlocker';
