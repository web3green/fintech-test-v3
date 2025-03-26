
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
  
  // Update favicon links
  initializeFavicon();
  
  return logoUrl;
};

// Function to directly create and inject a new favicon.ico in the DOM
// This approach intercepts browser requests for favicon.ico
const createFaviconElementFromBase64 = () => {
  // Define a base64 representation of our logo to override the default favicon.ico
  const faviconBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA/0lEQVR42mNkGGDAOOqAUQeMOmDUAaMO4D4AH2egFQAAgL7gNAOwAICvBzx+/Jjl4cOH8p8/f2YihJmZmbmYmJg3CQkJP6Fyn6H0F3Fxca+QkJCvKSkpX+Pi4r7/hYI/f/68//Tp09OJiYmvO39sEdZVNzU7evToWxkZme8gR/z8+fPPnz9/fv/69evv79+//0HB/4H4HxD/B+E/UP5/EP0fCYP4/xkYGBmA8v+A4vA4AMXRTwYsBuAK/FetWnVm7969x48cOXLi8ePHN27evHnj1q1bd+7cuXMPiO/CcBbQ9OfPn79y48aNG1euXLly+fLly5cuXbpw/vz5M2fOnDlNU1sAB1+QqgkWAlsAAAAASUVORK5CYII=';
  
  // Create a link element for the favicon
  const link = document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'icon';
  link.href = faviconBase64;
  
  // Add the favicon to the document head with highest priority
  document.head.insertBefore(link, document.head.firstChild);
  
  return link;
};

// Function to initialize favicon immediately
export const initializeFavicon = () => {
  try {
    const { absolute: logoUrl } = getLogoUrl(false);
    
    // Remove any existing favicon links - more aggressive approach
    const existingIcons = document.querySelectorAll('link[rel^="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
    console.log('Removing existing favicons:', existingIcons.length);
    existingIcons.forEach(icon => icon.remove());
    
    // First create a base64 favicon to immediately override any default
    createFaviconElementFromBase64();
    
    // Then add our normal favicon links
    const favIcon = document.createElement('link');
    favIcon.rel = 'icon';
    favIcon.href = logoUrl;
    favIcon.type = 'image/png';
    // Add higher priority by inserting at the beginning of head
    document.head.insertBefore(favIcon, document.head.firstChild);
    
    const shortcutIcon = document.createElement('link');
    shortcutIcon.rel = 'shortcut icon';
    shortcutIcon.href = logoUrl;
    shortcutIcon.type = 'image/png';
    document.head.insertBefore(shortcutIcon, document.head.firstChild);
    
    const appleIcon = document.createElement('link');
    appleIcon.rel = 'apple-touch-icon';
    appleIcon.href = logoUrl;
    document.head.insertBefore(appleIcon, document.head.firstChild);
    
    // Create a mask icon to override any default favicon
    const maskIcon = document.createElement('link');
    maskIcon.rel = 'mask-icon';
    maskIcon.href = logoUrl;
    document.head.insertBefore(maskIcon, document.head.firstChild);
    
    // Try to override favicon.ico directly with a link
    const faviconIco = document.createElement('link');
    faviconIco.rel = 'icon';
    faviconIco.href = logoUrl;
    faviconIco.type = 'image/x-icon';
    document.head.insertBefore(faviconIco, document.head.firstChild);
    
    console.log('Favicon initialized successfully with:', logoUrl);
  } catch (error) {
    console.error('Error initializing favicon:', error);
  }
};
