
/**
 * Utility functions for favicon management
 */

// Our exact company logo as base64 string - embedded to avoid network requests
// This is a square blue icon matching our brand
export const OUR_LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA/0lEQVR42mNkGGDAOOqAUQeMOmDUAaMO4D4AH2egFQAAgL7gNAOwAICvBzx+/Jjl4cOH8p8/f2YihJmZmbmYmJg3CQkJP6Fyn6H0F3Fxca+QkJCvKSkpX+Pi4r7/hYI/f/68//Tp09OJiYmvO39sEdZVNzU7evToWxkZme8gR/z8+fPPnz9/fv/69evv79+//0HB/4H4HxD/B+E/UP5/EP0fCYP4/xkYGBmA8v+A4vA4AMXRTwYsBuAK/FetWnVm7969x48cOXLi8ePHN27evHnj1q1bd+7cuXMPiO/CcBbQ9OfPn79y48aNG1euXLly+fLly5cuXbpw/vz5M2fOnDlNU1sAB1+QqgkWAlsAAAAASUVORK5CYII=';

// Function to create and insert a new favicon element using base64 logo
export const createFaviconElementFromBase64 = () => {
  // Create a link element for favicon using our embedded base64 logo
  const link = document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'icon';
  link.href = OUR_LOGO_BASE64;
  
  // Add favicon to document head with highest priority
  document.head.insertBefore(link, document.head.firstChild);
  
  return link;
};

// Create an empty image to block standard favicon.ico request
export const blockDefaultFavicon = () => {
  // Create an empty favicon to prevent browser requesting favicon.ico
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = 'data:,';
  document.head.insertBefore(link, document.head.firstChild);
};

// Mass removal of all favicon.ico and heart icons
export const removeAllUnwantedFavicons = () => {
  const links = document.querySelectorAll('link');
  links.forEach(link => {
    const href = link.href || '';
    const rel = link.rel || '';
    
    if (rel.includes('icon') || rel === 'shortcut icon' || rel === 'apple-touch-icon') {
      if (href.includes('heart') || 
          href.includes('favicon.ico') ||
          href.includes('gpteng') || 
          href.includes('gptengineer') ||
          href.includes('engine') ||
          !href.includes(OUR_LOGO_BASE64.substring(0, 30))) {
        console.log('Removing unwanted favicon:', href);
        link.remove();
      }
    }
  });
};

// Create CSS styles to block heart icon and other unwanted icons
export const createFaviconBlockingStyles = () => {
  // Check if our style already exists
  if (document.getElementById('favicon-blocker')) {
    return;
  }
  
  // Add CSS to block heart icon and other unwanted icons
  const style = document.createElement('style');
  style.id = 'favicon-blocker';
  style.textContent = `
    /* Block all unwanted icons */
    [rel="icon"][href*="heart"],
    [rel="icon"][href*="favicon.ico"],
    [rel*="icon"][href*="heart"],
    [rel*="icon"][href*="favicon.ico"],
    [rel="icon"][href*="gptengineer"],
    [rel*="icon"][href*="gptengineer"],
    [rel="icon"][href*="gpteng"],
    [rel*="icon"][href*="gpteng"],
    [rel="icon"][href*="engine"],
    [rel*="icon"][href*="engine"] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      position: absolute !important;
      left: -9999px !important;
      top: -9999px !important;
    }
    
    /* Allow only our icons */
    [rel="icon"][href^="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA"],
    [rel="shortcut icon"][href^="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA"],
    [rel="apple-touch-icon"][href^="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA"] {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      position: static !important;
    }
  `;
  document.head.appendChild(style);
};
