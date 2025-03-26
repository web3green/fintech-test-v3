
/**
 * Utility to manage meta tags for proper social media sharing
 */

import { getLogoUrl } from '../favicon/faviconManager';

// Track last update time to prevent too frequent updates
let lastUpdateTimestamp = 0;
const UPDATE_INTERVAL = 20; // Increased frequency to 20ms

// Update meta tags for social sharing
export const updateSocialMetaTags = () => {
  // Force update every time without throttling
  lastUpdateTimestamp = Date.now();
  
  const { absolute: logoUrl } = getLogoUrl();
  const origin = window.location.origin;
  // Always use the full URL with origin
  const fullUrl = `${origin}/lovable-uploads/6bfd57a2-6c6a-4507-bb1d-2cde1517ebd1.png?t=${Date.now()}`;
  
  // Aggressively remove ALL existing meta tags that might reference images
  document.querySelectorAll('meta[property*="image"], meta[name*="image"]').forEach(tag => tag.remove());
  
  // Helper function to create or update meta tags
  const updateMetaTag = (selector: string, value: string, isProperty = true) => {
    // Remove all existing tags first to prevent duplicates
    document.querySelectorAll(`meta[${isProperty ? 'property' : 'name'}="${selector}"]`).forEach(tag => tag.remove());
    
    const meta = document.createElement('meta');
    if (isProperty) {
      meta.setAttribute('property', selector);
    } else {
      meta.setAttribute('name', selector);
    }
    meta.setAttribute('content', value);
    document.head.appendChild(meta);
  };
  
  // Update all social media tags with absolute URL that includes domain
  updateMetaTag('og:image', fullUrl);
  updateMetaTag('og:image:url', fullUrl);
  updateMetaTag('og:image:secure_url', fullUrl);
  updateMetaTag('twitter:image', fullUrl);
  updateMetaTag('twitter:card', 'summary_large_image');
  
  // Explicitly set more meta tags to ensure our image is used
  updateMetaTag('og:image:width', '1200');
  updateMetaTag('og:image:height', '630');
  updateMetaTag('og:image:alt', 'FinTechAssist Logo');
  updateMetaTag('og:image:type', 'image/png');
  
  // Force no caching
  updateMetaTag('Cache-Control', 'no-cache, no-store, must-revalidate', false);
  updateMetaTag('Pragma', 'no-cache', false);
  updateMetaTag('Expires', '0', false);

  // SUPER AGGRESSIVE FAVICON HANDLING
  // First remove ALL favicon links, regardless of what they are
  document.querySelectorAll('link[rel*="icon"]').forEach(link => {
    link.remove();
  });
  
  // Update favicon links to ensure they're always fresh
  const updateFavicon = (rel: string) => {
    // Create new favicon link
    const linkElement = document.createElement('link');
    linkElement.rel = rel;
    linkElement.href = `${origin}/lovable-uploads/6bfd57a2-6c6a-4507-bb1d-2cde1517ebd1.png?t=${Date.now()}`;
    document.head.appendChild(linkElement);
  };
  
  // Update all favicon related links
  updateFavicon('icon');
  updateFavicon('shortcut icon');
  updateFavicon('apple-touch-icon');
  
  // Also set as preloaded image and prefetch
  // First remove any existing preload/prefetch links
  document.querySelectorAll('link[rel="preload"], link[rel="prefetch"]').forEach(link => {
    link.remove();
  });
  
  const prefetchLink = document.createElement('link');
  prefetchLink.rel = 'prefetch';
  prefetchLink.href = fullUrl;
  document.head.appendChild(prefetchLink);
  
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preload';
  preloadLink.as = 'image';
  preloadLink.href = fullUrl;
  document.head.appendChild(preloadLink);

  // Also explicitly override the document title to ensure consistent branding
  if (document.title.indexOf('FinTech') === -1) {
    document.title = 'FinTechAssist: Финансовые решения для бизнеса';
  }
  
  return fullUrl;
};
