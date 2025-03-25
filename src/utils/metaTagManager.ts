
/**
 * Utility to manage meta tags for proper social media sharing
 */

// Define the image URL with both absolute and relative paths
export const getLogoUrl = (withTimestamp = true) => {
  const timestamp = withTimestamp ? `?t=${Date.now()}` : '';
  const relativeLogoPath = `/lovable-uploads/8f51558f-dcfd-4921-b6e4-112532ad0723.png${timestamp}`;
  
  // Use window.location.origin to get the current domain dynamically
  return {
    relative: relativeLogoPath,
    absolute: `${window.location.origin}${relativeLogoPath}`
  };
};

// Update meta tags for social sharing
export const updateSocialMetaTags = () => {
  const { absolute: logoUrl } = getLogoUrl();
  
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
  
  // Update all social media tags
  updateMetaTag('og:image', logoUrl);
  updateMetaTag('og:image:url', logoUrl);
  updateMetaTag('og:image:secure_url', logoUrl);
  updateMetaTag('twitter:image', logoUrl, false);
  
  // Force no caching
  updateMetaTag('Cache-Control', 'no-cache, no-store, must-revalidate', false);
  updateMetaTag('Pragma', 'no-cache', false);
  updateMetaTag('Expires', '0', false);
  
  console.log('Meta tags updated with dynamic URL:', logoUrl);
  
  // For debugging
  const linkElement = document.createElement('link');
  linkElement.rel = 'prefetch';
  linkElement.href = logoUrl;
  document.head.appendChild(linkElement);
  
  return logoUrl;
};
