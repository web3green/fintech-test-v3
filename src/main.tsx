import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { clearBrowserCache } from './utils/cacheCleanup'
import { SWRConfig } from 'swr';
import { HelmetProvider } from 'react-helmet-async';

// Очистка кеша перед запуском
clearBrowserCache().catch(err => console.warn('Не удалось очистить кеш:', err));

/// --- SWR Cache Provider for sessionStorage (Improved) ---
function sessionStorageProvider(): Map<string, any> {
  if (typeof window === 'undefined') {
    console.warn('sessionStorage provider: window is undefined, falling back to Map.');
    return new Map();
  }

  const SWR_CACHE_KEY = 'swr-cache';

  // Function to safely get data from sessionStorage
  const getSessionCache = (): Map<string, any> => {
    try {
      const data = sessionStorage.getItem(SWR_CACHE_KEY);
      return new Map(JSON.parse(data || '[]'));
    } catch (e) {
      console.error("Error reading SWR cache from sessionStorage:", e);
      return new Map(); // Return empty map on error
    }
  };

  // Function to safely set data to sessionStorage
  const setSessionCache = (cacheMap: Map<string, any>) => {
    try {
      const appCache = JSON.stringify(Array.from(cacheMap.entries()));
      sessionStorage.setItem(SWR_CACHE_KEY, appCache);
    } catch (e) {
      console.error("Error writing SWR cache to sessionStorage:", e);
      // Handle potential quota exceeded errors or other issues
      if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
         console.warn("SessionStorage quota exceeded. Clearing cache.");
         // Attempt to clear cache to potentially resolve the issue
         try {
            sessionStorage.removeItem(SWR_CACHE_KEY);
         } catch (clearError) {
            console.error("Failed to clear sessionStorage:", clearError);
         }
      }
    }
  };

  // Initialize map from sessionStorage
  const map = getSessionCache();

  // Persist on unload as a final safety measure
  window.addEventListener('beforeunload', () => {
    setSessionCache(map);
  });

  return {
    // Read from the in-memory map (which was loaded from storage)
    get: (key) => map.get(key),
    // Write to the in-memory map AND persist to sessionStorage
    set: (key, value) => {
      map.set(key, value);
      setSessionCache(map); // Persist immediately on set
    },
    // Delete from the in-memory map AND persist the change to sessionStorage
    delete: (key) => {
      map.delete(key);
      setSessionCache(map); // Persist immediately on delete
    },
    // Standard Map methods required by SWR, operating on the in-memory map
    keys: () => map.keys(),
    values: () => map.values(),
    entries: () => map.entries(),
    has: (key) => map.has(key),
    // Clear both the in-memory map and sessionStorage
    clear: () => {
      map.clear();
      try {
        sessionStorage.removeItem(SWR_CACHE_KEY);
      } catch (e) {
        console.error("Error clearing SWR cache from sessionStorage:", e);
      }
    },
    get size() { return map.size; },
    [Symbol.iterator]: map[Symbol.iterator].bind(map)
  } as Map<string, any>;
}

/// React app initialization
ReactDOM.createRoot(document.getElementById('root')!).render( // <--- Открывающая скобка render
  <SWRConfig value={{ provider: sessionStorageProvider }}>
    <HelmetProvider>
  <React.StrictMode>
    <App />
      </React.StrictMode>
    </HelmetProvider>
  </SWRConfig>
) //