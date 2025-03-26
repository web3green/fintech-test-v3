
/**
 * Utility functions for blocking unwanted scripts
 */

// Search for and block all unwanted scripts
export const blockUndesiredScripts = () => {
  const scripts = document.querySelectorAll('script');
  scripts.forEach(script => {
    const src = script.src || '';
    if (src.includes('gpteng') || src.includes('gptengineer') || src.includes('engine')) {
      console.log('Blocking undesired script:', src);
      script.remove();
    }
  });
};

// Block gpteng.co script
export const blockGptEngScript = () => {
  // Find script from gpteng.co
  const scripts = document.querySelectorAll('script');
  scripts.forEach(script => {
    if (script.src && (
      script.src.includes('gpteng.co') || 
      script.src.includes('gptengineer') ||
      script.src.includes('engine')
    )) {
      console.log('Found and blocking GPTEngineer script:', script.src);
      
      // Remove script
      script.remove();
      
      // Also block all potential future scripts from the same domain
      const scriptBlocking = document.createElement('script');
      scriptBlocking.textContent = `
        // Block all scripts from gptengineer
        const originalCreateElement = document.createElement;
        document.createElement = function(tagName) {
          const element = originalCreateElement.call(document, tagName);
          if (tagName.toLowerCase() === 'script') {
            const originalSetAttribute = element.setAttribute;
            element.setAttribute = function(name, value) {
              if (name === 'src' && (
                value.includes('gpteng.co') || 
                value.includes('gptengineer') ||
                value.includes('engine')
              )) {
                console.log('Blocking script:', value);
                return;
              }
              return originalSetAttribute.call(this, name, value);
            };
          }
          return element;
        };
      `;
      document.head.appendChild(scriptBlocking);
    }
  });
};
