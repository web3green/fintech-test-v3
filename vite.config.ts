
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      // Use more reliable WebSocket protocol with explicit configuration
      protocol: 'ws',
      host: 'localhost',
      port: 8080,
      clientPort: 8080,
      timeout: 120000,
      overlay: true
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Make sure all environment variables are properly stringified
    __HMR_CONFIG_NAME__: JSON.stringify("vite"),
    __HMR_PROTOCOL__: JSON.stringify("ws"),
    __HMR_HOST__: JSON.stringify("localhost"),
    __HMR_PORT__: JSON.stringify(8080),
  },
  build: {
    sourcemap: true,
    // Disable module preload which can cause caching issues
    modulePreload: false,
    // Force aggressive cache busting
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        },
        // Add timestamps to chunk files to prevent caching
        entryFileNames: `assets/[name].[hash]-${Date.now()}.js`,
        chunkFileNames: `assets/[name].[hash]-${Date.now()}.js`,
        assetFileNames: `assets/[name].[hash]-${Date.now()}.[ext]`
      }
    }
  },
  // Explicitly define HMR configuration
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  },
  // Force disable caching for development
  cacheDir: mode === 'development' ? `./.vite-cache-${Date.now()}` : undefined,
}));
