
/**
 * Utility to manage Hot Module Replacement (HMR)
 */

import { createRoot } from 'react-dom/client';
import App from '../App';

// Setup HMR for Vite
export const setupHMR = (root: ReturnType<typeof createRoot>) => {
  if (import.meta.hot) {
    try {
      console.log('Setting up HMR handlers - environment ready');
      
      // Debug HMR configuration
      console.log('HMR Config:', {
        name: JSON.parse('__HMR_CONFIG_NAME__'),
        protocol: JSON.parse('__HMR_PROTOCOL__'),
        host: JSON.parse('__HMR_HOST__'),
        port: JSON.parse('__HMR_PORT__')
      });
      
      // Correctly configured HMR acceptance for App component
      import.meta.hot.accept('../App.tsx', () => {
        console.log('🔄 Hot Module Replacement: Updating App component');
        try {
          // Render the updated App component
          // Instead of JSX, we'll use createElement
          root.render(App());
        } catch (error) {
          console.error('❌ Error during HMR update:', error);
        }
      });
      
      // Accept global HMR
      import.meta.hot.accept();
      
      // Add listener for HMR errors
      import.meta.hot.on('error', (error) => {
        console.error('❌ HMR Error:', error);
        // On critical errors, refresh the page
        if (error && error.message && error.message.includes('syntax')) {
          console.log('Critical HMR error detected, refreshing page...');
          window.location.reload();
        }
      });
    } catch (err) {
      console.error('HMR setup failed:', err);
      // Fallback - if HMR fails, refresh the page
      window.location.reload();
    }
  }
};
