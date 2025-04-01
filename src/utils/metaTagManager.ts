/**
 * Meta Tag Manager - Main export file
 * 
 * This file exports all functions from the refactored utility modules
 * for backwards compatibility with existing code.
 */

// Export logo management functions
export { 
  getLogoUrl,
  setFavicon
} from './logoManager';

// Export social meta tag management functions
export {
  updateSocialMetaTags
} from './metaTags/socialMetaTags';
