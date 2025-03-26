
/**
 * Utility to manage meta tags for proper social media sharing
 */

// Define the image URL with both absolute and relative paths
export const getLogoUrl = (withTimestamp = true) => {
  const timestamp = withTimestamp ? `?t=${Date.now()}` : '';
  const relativeLogoPath = `/lovable-uploads/6bfd57a2-6c6a-4507-bb1d-2cde1517ebd1.png${timestamp}`;
  
  // Use window.location.origin to get the current domain dynamically
  const origin = window.location.origin;
  const absoluteUrl = `${origin}${relativeLogoPath}`;
  
  return {
    relative: relativeLogoPath,
    absolute: absoluteUrl
  };
};

// Track last update time to prevent too frequent updates
let lastUpdateTimestamp = 0;
const UPDATE_INTERVAL = 50; // Increased frequency to 50ms

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
  
  return fullUrl;
};

// Additional function to explicitly block any heart icon
export const blockHeartIcon = () => {
  // Remove any existing style tag for heart blocking to prevent duplicates
  document.querySelectorAll('style[data-heart-blocker]').forEach(style => style.remove());
  
  // Add a style tag to hide any heart icons that might be present
  const style = document.createElement('style');
  style.setAttribute('data-heart-blocker', 'true');
  
  // Super aggressive CSS to block ANY heart icon or GPTEngineer favicon
  style.textContent = `
    /* Block any heart icons */
    img[src*="heart"], img[src*="Heart"], [src*="heart-icon"], [src*="heart_icon"],
    img[src*="gptengineer"], img[src*="gpteng"],
    a[href*="gptengineer"], a[href*="gpteng"],
    link[href*="heart"], link[href*="Heart"],
    link[rel*="icon"]:not([href*="6bfd57a2-6c6a-4507-bb1d-2cde1517ebd1"]) {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      position: absolute !important;
      z-index: -9999 !important;
      width: 0 !important;
      height: 0 !important;
      max-width: 0 !important;
      max-height: 0 !important;
      overflow: hidden !important;
      pointer-events: none !important;
    }
    
    /* Hide any favicon that might be inserted by GPTEngineer */
    link[rel*="icon"]:not([href*="6bfd57a2-6c6a-4507-bb1d-2cde1517ebd1"]),
    link[href*="gptengineer"], link[href*="gpteng"],
    link[href*="heart"], link[href*="Heart"] {
      display: none !important;
      visibility: hidden !important;
    }
  `;
  document.head.appendChild(style);
  
  // Also directly remove any heart icon elements
  document.querySelectorAll('img[src*="heart"], img[src*="Heart"], img[src*="gptengineer"], img[src*="gpteng"]').forEach(img => {
    img.remove();
  });
};

// Add new function to ensure our favicon is always set as the active one
export const enforceOurFavicon = () => {
  const { absolute: logoUrl } = getLogoUrl();
  
  // Set the favicon in the document head
  const link = document.createElement('link');
  link.type = 'image/png';
  link.rel = 'shortcut icon';
  link.href = logoUrl;
  document.head.appendChild(link);
  
  // Also set it as the browser tab icon
  const link2 = document.createElement('link');
  link2.rel = 'icon';
  link2.href = logoUrl;
  document.head.appendChild(link2);
};
