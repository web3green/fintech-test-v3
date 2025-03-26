
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
const UPDATE_INTERVAL = 1000; // 1 second for more frequent updates

// Update meta tags for social sharing
export const updateSocialMetaTags = () => {
  const now = Date.now();
  
  // Allow more frequent updates for debugging
  if (now - lastUpdateTimestamp < UPDATE_INTERVAL) {
    return null;
  }
  
  lastUpdateTimestamp = now;
  
  const { absolute: logoUrl } = getLogoUrl();
  const origin = window.location.origin;
  // Always use the full URL with origin
  const fullUrl = `${origin}/lovable-uploads/6bfd57a2-6c6a-4507-bb1d-2cde1517ebd1.png?t=${Date.now()}`;
  
  // Helper function to create or update meta tags
  const updateMetaTag = (selector: string, value: string, isProperty = true) => {
    let meta = isProperty 
      ? document.querySelector(`meta[property="${selector}"]`)
      : document.querySelector(`meta[name="${selector}"]`);
      
    if (!meta) {
      meta = document.createElement('meta');
      if (isProperty) {
        meta.setAttribute('property', selector);
      } else {
        meta.setAttribute('name', selector);
      }
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', value);
  };
  
  // Update all social media tags with absolute URL that includes domain
  updateMetaTag('og:image', fullUrl);
  updateMetaTag('og:image:url', fullUrl);
  updateMetaTag('og:image:secure_url', fullUrl);
  updateMetaTag('twitter:image', fullUrl);
  
  // Force no caching
  updateMetaTag('Cache-Control', 'no-cache, no-store, must-revalidate', false);
  updateMetaTag('Pragma', 'no-cache', false);
  updateMetaTag('Expires', '0', false);
  
  console.log('Meta tags updated with absolute URL:', fullUrl);
  
  // Update favicon links to ensure they're always fresh
  const updateFavicon = (rel: string) => {
    const links = document.querySelectorAll(`link[rel="${rel}"]`);
    
    // Remove existing favicon links
    links.forEach(link => link.remove());
    
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
  
  // For debugging and preloading
  const linkElement = document.createElement('link');
  linkElement.rel = 'prefetch';
  linkElement.href = fullUrl;
  document.head.appendChild(linkElement);
  
  return fullUrl;
};
