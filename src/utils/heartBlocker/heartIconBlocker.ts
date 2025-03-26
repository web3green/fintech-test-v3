
/**
 * Utility to block heart icons and GPTEngineer elements
 */

import { getLogoUrl } from '../favicon/faviconManager';

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
    img[src*="gptengineer"], img[src*="gpteng"], img[src*="gpt-eng"],
    a[href*="gptengineer"], a[href*="gpteng"], a[href*="gpt-eng"],
    link[href*="heart"], link[href*="Heart"], link[href*="♥"], link[href*="♡"],
    link[rel*="icon"]:not([href*="6bfd57a2-6c6a-4507-bb1d-2cde1517ebd1"]),
    svg[*|href*="heart"], svg[*|href*="Heart"],
    svg path[d*="M0 200 v-200 h200"], /* This is a heart-like SVG path */
    iframe[src*="gptengineer"], iframe[src*="gpteng"],
    [id*="heart"], [class*="heart"], [class*="Heart"],
    [aria-label*="heart"], [aria-label*="Heart"],
    [title*="heart"], [title*="Heart"] {
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
    link[href*="gptengineer"], link[href*="gpteng"], link[href*="gpt-eng"],
    link[href*="heart"], link[href*="Heart"], link[href*="♥"], link[href*="♡"] {
      display: none !important;
      visibility: hidden !important;
    }
    
    /* Target common favicon locations used by extensions */
    link[href*="favicon"], link[href$=".ico"]:not([href*="6bfd57a2-6c6a-4507-bb1d-2cde1517ebd1"]) {
      display: none !important;
      visibility: hidden !important;
    }
    
    /* Attempt to override browser defaults */
    :root, html, head {
      --favicon: url('${window.location.origin}/lovable-uploads/6bfd57a2-6c6a-4507-bb1d-2cde1517ebd1.png?t=${Date.now()}') !important;
    }
  `;
  document.head.appendChild(style);
  
  // Also directly remove any heart icon elements
  document.querySelectorAll([
    'img[src*="heart"]', 'img[src*="Heart"]', 'img[src*="gptengineer"]', 'img[src*="gpteng"]',
    'svg[*|href*="heart"]', 'svg[*|href*="Heart"]',
    'iframe[src*="gptengineer"]', 'iframe[src*="gpteng"]',
    '[id*="heart"]', '[class*="heart"]', '[class*="Heart"]',
    '[aria-label*="heart"]', '[aria-label*="Heart"]',
    '[title*="heart"]', '[title*="Heart"]'
  ].join(',')).forEach(element => {
    element.remove();
  });
  
  // Also search for SVGs that might contain heart paths
  document.querySelectorAll('svg').forEach(svg => {
    const paths = svg.querySelectorAll('path');
    let containsHeartPath = false;
    
    paths.forEach(path => {
      const d = path.getAttribute('d');
      if (d && (
        d.includes('M0 200 v-200 h200') || // Simple heart detection
        d.includes('M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z') // Material-UI heart icon
      )) {
        containsHeartPath = true;
      }
    });
    
    if (containsHeartPath) {
      // Fix TypeScript error: properly handle SVGSVGElement by checking the type first
      if (svg instanceof SVGElement) {
        svg.style.display = 'none';
        svg.style.visibility = 'hidden';
        svg.style.opacity = '0';
      }
    }
  });
  
  // Override common browser extension behaviors
  try {
    // Override any favicon-related JavaScript API
    if (window.navigator && window.navigator.setAppBadge) {
      const originalSetAppBadge = window.navigator.setAppBadge;
      window.navigator.setAppBadge = function() {
        // Do nothing - prevent badge updates
        return Promise.resolve();
      };
    }
  } catch (e) {
    console.error('Error overriding favicon APIs:', e);
  }
};

// Add a new function to scan the entire DOM for heart icons or GPTEngineer scripts
export const scanAndRemoveHeartIcons = () => {
  // Function to check if an element might be a heart icon
  const isHeartIcon = (element: Element): boolean => {
    // Check attributes
    const checkAttribute = (attr: string): boolean => {
      if (!element.hasAttribute(attr)) return false;
      const value = element.getAttribute(attr)?.toLowerCase() || '';
      return value.includes('heart') || value.includes('♥') || value.includes('♡') || 
             value.includes('gptengineer') || value.includes('gpteng') || value.includes('gpt-eng');
    };
    
    const attributes = ['src', 'href', 'id', 'class', 'aria-label', 'title', 'alt'];
    for (const attr of attributes) {
      if (checkAttribute(attr)) return true;
    }
    
    // Check tag name
    const tagName = element.tagName.toLowerCase();
    if (tagName === 'svg') {
      // Check SVG paths
      const paths = element.querySelectorAll('path');
      for (const path of paths) {
        const d = path.getAttribute('d');
        if (d && (
          d.includes('M0 200') || // Heart-like path
          d.includes('M12 21.35l-1.45-1.32C') // Material heart icon
        )) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  // Scan all elements
  const allElements = document.querySelectorAll('*');
  let removedElements = 0;
  
  allElements.forEach(element => {
    if (isHeartIcon(element)) {
      // Properly handle different element types
      if (element instanceof HTMLElement) {
        element.style.display = 'none';
        element.style.visibility = 'hidden';
        element.style.opacity = '0';
        element.style.pointerEvents = 'none';
      } else if (element instanceof SVGElement) {
        // Handle SVG elements
        element.style.display = 'none';
        element.style.visibility = 'hidden';
        element.style.opacity = '0';
      }
      removedElements++;
    }
  });
  
  // If we found any heart icons, re-scan after a short delay to catch dynamically added elements
  if (removedElements > 0) {
    console.log(`Removed ${removedElements} heart icons from DOM`);
    setTimeout(scanAndRemoveHeartIcons, 100);
  }
  
  // Also specifically target GPTEngineer elements that might be added dynamically
  document.querySelectorAll('[data-gptengineer], [data-gpteng], .gptengineer, .gpteng').forEach(el => {
    // Properly handle different element types
    if (el instanceof HTMLElement) {
      el.style.display = 'none';
      el.style.visibility = 'hidden';
      el.remove();
    } else if (el instanceof SVGElement) {
      el.style.display = 'none';
      el.style.visibility = 'hidden';
      el.remove();
    }
  });
  
  // Look for scripts related to GPTEngineer
  document.querySelectorAll('script').forEach(script => {
    if (script.src && (
      script.src.includes('gptengineer') || 
      script.src.includes('gpteng')
    )) {
      console.log('Found GPTEngineer script:', script.src);
      // We can't remove it since it's likely necessary for the app to function,
      // but we can make sure our favicon takes precedence
      enforceOurFavicon();
      blockHeartIcon();
    }
  });
};

// Import the enforceOurFavicon function to use it in the script scanning
import { enforceOurFavicon } from '../favicon/faviconManager';
