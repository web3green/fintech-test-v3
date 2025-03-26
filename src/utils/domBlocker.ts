
/**
 * Utility to manipulate DOM to block unwanted elements
 */

// Inject CSS to block unwanted favicon elements
export const injectBlockingStyles = () => {
  document.head.insertAdjacentHTML('afterbegin', `
    <link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA/0lEQVR42mNkGGDAOOqAUQeMOmDUAaMO4D4AH2egFQAAgL7gNAOwAICvBzx+/Jjl4cOH8p8/f2YihJmZmbmYmJg3CQkJP6Fyn6H0F3Fxca+QkJCvKSkpX+Pi4r7/hYI/f/68//Tp09OJiYmvO39sEdZVNzU7evToWxkZme8gR/z8+fPPnz9/fv/69evv79+//0HB/4H4HxD/B+E/UP5/EP0fCYP4/xkYGBmA8v+A4vA4AMXRTwYsBuAK/FetWnVm7969x48cOXLi8ePHN27evHnj1q1bd+7cuXMPiO/CcBbQ9OfPn79y48aNG1euXLly+fLly5cuXbpw/vz5M2fOnDlNU1sAB1+QqgkWAlsAAAAASUVORK5CYII=" />
    <style>
      /* Block heart icon and other unwanted favicons */
      [rel="icon"][href*="heart"], 
      [rel*="icon"][href*="heart"],
      [rel="icon"][href*="favicon.ico"],
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
      
      /* Prevent any icons we don't explicitly allow */
      head > link[rel="icon"]:not([href^="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA"]) {
        display: none !important;
      }
    </style>
  `);
};

// Function to remove unwanted elements from DOM
export const removeUnwantedElements = () => {
  // Remove unwanted icons
  const links = document.querySelectorAll('link');
  links.forEach(link => {
    const href = link.href || '';
    if (href.includes('heart') || 
        href.includes('favicon.ico') || 
        href.includes('gpteng') || 
        href.includes('gptengineer') ||
        href.includes('engine')) {
      console.log('Removing unwanted icon with URL:', href);
      link.remove();
    }
  });
  
  // Remove unwanted scripts
  const scripts = document.querySelectorAll('script');
  scripts.forEach(script => {
    const src = script.src || '';
    if (src.includes('gpteng') || 
        src.includes('gptengineer') ||
        src.includes('engine')) {
      console.log('Removing script from gptengineer:', src);
      script.remove();
    }
  });
};

// Block future script additions from unwanted sources
export const blockFutureScripts = () => {
  const blockScript = document.createElement('script');
  blockScript.textContent = `
    (function() {
      const originalCreateElement = document.createElement;
      document.createElement = function(tagName) {
        const element = originalCreateElement.call(document, tagName);
        if (tagName.toLowerCase() === 'script') {
          const originalSetAttribute = element.setAttribute;
          element.setAttribute = function(name, value) {
            if (name === 'src' && (
              value.includes('gpteng') || 
              value.includes('gptengineer') ||
              value.includes('engine')
            )) {
              console.log('Blocked loading of gptengineer script:', value);
              return;
            }
            return originalSetAttribute.call(this, name, value);
          };
        }
        return element;
      };
    })();
  `;
  document.head.appendChild(blockScript);
};
