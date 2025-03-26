
/**
 * Utility to manage meta tags for proper social media sharing
 */

// Define the image URL with both absolute and relative paths
export const getLogoUrl = (withTimestamp = true) => {
  const timestamp = withTimestamp ? `?t=${Date.now()}` : '';
  
  // Use the Lovable preview URL for the logo since it works reliably
  const logoUrl = `https://preview--fintech-simplicity.lovable.app/lovable-uploads/3655bf6b-6880-47b7-b1f7-9129d0f48bc0.png${timestamp}`;
  
  return {
    relative: logoUrl,
    absolute: logoUrl
  };
};

// Track last update time to prevent too frequent updates
let lastUpdateTimestamp = 0;
const UPDATE_INTERVAL = 5000; // 5 seconds

// Update meta tags for social sharing
export const updateSocialMetaTags = () => {
  const now = Date.now();
  
  // Prevent updating too frequently
  if (now - lastUpdateTimestamp < UPDATE_INTERVAL) {
    return null;
  }
  
  lastUpdateTimestamp = now;
  
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
  
  // Update all social media tags with the new URL
  updateMetaTag('og:image', logoUrl);
  updateMetaTag('og:image:url', logoUrl);
  updateMetaTag('og:image:secure_url', logoUrl);
  updateMetaTag('twitter:image', logoUrl);
  
  // Force no caching
  updateMetaTag('Cache-Control', 'no-cache, no-store, must-revalidate', false);
  updateMetaTag('Pragma', 'no-cache', false);
  updateMetaTag('Expires', '0', false);
  
  console.log('Meta tags updated with new URL:', logoUrl);
  
  // Update favicon links - ensure the function properly creates links if they don't exist
  const updateLinkHref = (rel: string, href: string, type = 'image/png') => {
    try {
      // First, remove any existing links to ensure clean state
      const existingLinks = document.querySelectorAll(`link[rel="${rel}"]`);
      existingLinks.forEach(link => link.remove());
      
      // Create a new link element
      const link = document.createElement('link');
      link.setAttribute('rel', rel);
      link.setAttribute('href', href);
      if (type) {
        link.setAttribute('type', type);
      }
      document.head.appendChild(link);
      
      console.log(`Updated ${rel} link with: ${href}`);
    } catch (error) {
      console.error(`Error updating ${rel} link:`, error);
    }
  };
  
  // Aggressively update favicon and apple-touch-icon with logo to replace heart icon
  updateLinkHref('icon', logoUrl);
  updateLinkHref('shortcut icon', logoUrl);
  updateLinkHref('apple-touch-icon', logoUrl, '');
  
  // For debugging and preloading
  const linkElement = document.createElement('link');
  linkElement.rel = 'prefetch';
  linkElement.href = logoUrl;
  document.head.appendChild(linkElement);
  
  return logoUrl;
};

// Function to initialize favicon immediately
export const initializeFavicon = () => {
  try {
    const { absolute: logoUrl } = getLogoUrl(false);
    
    // Remove any existing favicon links
    const existingIcons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
    existingIcons.forEach(icon => icon.remove());
    
    // Create new favicon links
    const favIcon = document.createElement('link');
    favIcon.rel = 'icon';
    favIcon.href = logoUrl;
    favIcon.type = 'image/png';
    document.head.appendChild(favIcon);
    
    const shortcutIcon = document.createElement('link');
    shortcutIcon.rel = 'shortcut icon';
    shortcutIcon.href = logoUrl;
    shortcutIcon.type = 'image/png';
    document.head.appendChild(shortcutIcon);
    
    const appleIcon = document.createElement('link');
    appleIcon.rel = 'apple-touch-icon';
    appleIcon.href = logoUrl;
    document.head.appendChild(appleIcon);
    
    console.log('Favicon initialized successfully with:', logoUrl);
  } catch (error) {
    console.error('Error initializing favicon:', error);
  }
};
