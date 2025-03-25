
/**
 * Utility to manage meta tags for proper social media sharing
 */

// Define the image URL with both absolute and relative paths
export const getLogoUrl = (withTimestamp = true) => {
  const timestamp = withTimestamp ? `?t=${Date.now()}` : '';
  const relativeLogoPath = `/lovable-uploads/8f51558f-dcfd-4921-b6e4-112532ad0723.png${timestamp}`;
  
  // Use window.location.origin to get the current domain dynamically
  const origin = window.location.origin;
  const absoluteUrl = `${origin}${relativeLogoPath}`;
  
  return {
    relative: relativeLogoPath,
    absolute: absoluteUrl
  };
};

// Update meta tags for social sharing
export const updateSocialMetaTags = () => {
  const { absolute: logoUrl } = getLogoUrl();
  const origin = window.location.origin;
  const fullUrl = `${origin}/lovable-uploads/8f51558f-dcfd-4921-b6e4-112532ad0723.png`;
  
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
  
  // For debugging and preloading
  const linkElement = document.createElement('link');
  linkElement.rel = 'prefetch';
  linkElement.href = fullUrl;
  document.head.appendChild(linkElement);
  
  return fullUrl;
};
