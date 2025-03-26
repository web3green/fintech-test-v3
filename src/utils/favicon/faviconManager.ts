
/**
 * Utility to manage favicon and icon-related functionality
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

// Add new function to ensure our favicon is always set as the active one
export const enforceOurFavicon = () => {
  const { absolute: logoUrl } = getLogoUrl();
  const timestamp = Date.now();
  
  // First remove ALL existing favicon links
  document.querySelectorAll('link[rel*="icon"]').forEach(link => {
    link.remove();
  });
  
  // Create completely new favicon elements
  const types = ['shortcut icon', 'icon', 'apple-touch-icon'];
  types.forEach(type => {
    const link = document.createElement('link');
    link.type = 'image/png';
    link.rel = type;
    link.href = `${logoUrl}?t=${timestamp}`;
    document.head.appendChild(link);
  });
  
  // Set the favicon directly on the head
  const headIcon = document.createElement('link');
  headIcon.id = 'primary-favicon';
  headIcon.rel = 'icon';
  headIcon.type = 'image/png';
  headIcon.href = `${logoUrl}?t=${timestamp}`;
  document.head.insertBefore(headIcon, document.head.firstChild);
  
  // Set shortcut icon
  const shortcutIcon = document.createElement('link');
  shortcutIcon.id = 'primary-shortcut-icon';
  shortcutIcon.rel = 'shortcut icon';
  shortcutIcon.type = 'image/png';
  shortcutIcon.href = `${logoUrl}?t=${timestamp}`;
  document.head.insertBefore(shortcutIcon, document.head.firstChild);
  
  // Also inject a direct base64 encoded favicon
  try {
    // Create an in-memory favicon
    const linkEl = document.createElement('link');
    linkEl.id = 'direct-favicon';
    linkEl.rel = 'icon';
    linkEl.type = 'image/png';
    linkEl.href = logoUrl;
    document.head.appendChild(linkEl);
    
    // Attempt to override document.head behavior to prevent other scripts from changing the favicon
    const originalAppendChild = document.head.appendChild;
    document.head.appendChild = function(node) {
      // Fix TypeScript errors with type checking
      if (node instanceof HTMLLinkElement && node.rel && node.rel.toLowerCase().includes('icon')) {
        if (!node.href.includes('6bfd57a2-6c6a-4507-bb1d-2cde1517ebd1')) {
          console.log('Blocked attempt to add non-FinTechAssist favicon');
          return document.createElement('link'); // Return dummy node
        }
      }
      return originalAppendChild.call(this, node);
    };
    
    // Also override insertBefore for similar protection
    const originalInsertBefore = document.head.insertBefore;
    document.head.insertBefore = function(node, reference) {
      // Fix TypeScript errors with type checking
      if (node instanceof HTMLLinkElement && node.rel && node.rel.toLowerCase().includes('icon')) {
        if (!node.href.includes('6bfd57a2-6c6a-4507-bb1d-2cde1517ebd1')) {
          console.log('Blocked attempt to insert non-FinTechAssist favicon');
          return document.createElement('link'); // Return dummy node
        }
      }
      return originalInsertBefore.call(this, node, reference);
    };
  } catch (e) {
    console.error('Error setting direct favicon:', e);
  }
  
  console.log('Favicon aggressively enforced:', logoUrl);
};
