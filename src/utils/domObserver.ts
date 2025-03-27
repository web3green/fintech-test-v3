
/**
 * Utility to observe DOM changes and react to them
 */

import { ensureOurBranding } from './brandingManager';

// Наблюдение за изменениями DOM
export const observeDOM = () => {
  const observer = new MutationObserver(mutations => {
    let shouldRefresh = false;
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldRefresh = true;
      }
    });
    
    if (shouldRefresh) {
      console.log('🔄 Обнаружены изменения в DOM, обновляем кеш');
      ensureOurBranding();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'href', 'style', 'class']
  });
  
  return observer;
};
