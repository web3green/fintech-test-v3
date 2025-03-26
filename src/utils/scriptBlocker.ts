
/**
 * Utility to block unwanted scripts and favicons from being loaded
 */

// Block gptengineer scripts ASAP
export const blockGptEngineerScripts = () => {
  // Patch document.createElement to prevent GPTEng scripts from loading
  const originalCreateElement = Document.prototype.createElement;
  Document.prototype.createElement = function(tagName) {
    const element = originalCreateElement.call(this, tagName);
    if (tagName.toLowerCase() === 'script') {
      const originalSetAttribute = element.setAttribute;
      element.setAttribute = function(name, value) {
        if (name === 'src' && (
          value.includes('gpteng') || 
          value.includes('gptengineer') ||
          value.includes('engine')
        )) {
          console.log('Blocked loading of gptengineer script:', value);
          return element;
        }
        return originalSetAttribute.call(this, name, value);
      };
    }
    return element;
  };
  
  // Also intercept appendChild to prevent heart favicon
  const originalAppendChild = Node.prototype.appendChild;
  Node.prototype.appendChild = function(child) {
    if (child.nodeName === 'LINK') {
      // Fix TS error by properly casting to HTMLLinkElement
      // First cast to unknown, then to HTMLLinkElement
      const linkElement = child as unknown as HTMLLinkElement;
      const href = linkElement.href || '';
      if (href.includes('heart') || 
          href.includes('favicon.ico') ||
          href.includes('gpteng') ||
          href.includes('gptengineer') ||
          href.includes('engine')) {
        console.log('Blocked appending of unwanted favicon:', href);
        return child; // Don't actually append
      }
    }
    if (child.nodeName === 'SCRIPT') {
      // Fix TS error by properly casting to HTMLScriptElement
      // First cast to unknown, then to HTMLScriptElement
      const scriptElement = child as unknown as HTMLScriptElement;
      const src = scriptElement.src || '';
      if (src.includes('gpteng') || 
          src.includes('gptengineer') ||
          src.includes('engine')) {
        console.log('Blocked appending of gptengineer script:', src);
        return child; // Don't actually append
      }
    }
    return originalAppendChild.call(this, child);
  };
};

// Block fetch and XHR requests to unwanted domains
export const blockNetworkRequests = () => {
  // Block all requests to gptengineer.co or related domains
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    if (url && (
      url.includes('gpteng') || 
      url.includes('gptengineer') ||
      url.includes('engine')
    )) {
      console.log('Blocked fetch request to:', url);
      return Promise.reject(new Error('Request blocked'));
    }
    return originalFetch.apply(this, arguments);
  };

  const originalXMLHttpRequest = window.XMLHttpRequest;
  window.XMLHttpRequest = function() {
    const xhr = new originalXMLHttpRequest();
    const originalOpen = xhr.open;
    xhr.open = function(method, url, ...args) {
      if (url && typeof url === 'string' && (
        url.includes('gpteng') || 
        url.includes('gptengineer') ||
        url.includes('engine')
      )) {
        console.log('Blocked XHR request to:', url);
        throw new Error('Request blocked');
      }
      return originalOpen.call(this, method, url, ...args);
    };
    return xhr;
  } as any;
};
