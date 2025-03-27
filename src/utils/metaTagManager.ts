
/**
 * Meta Tag Manager - Main export file
 * 
 * This file exports functions from the utility modules
 * for managing favicons and meta tags.
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
