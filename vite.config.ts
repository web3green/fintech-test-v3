
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
      // Use explicit host and port for HMR
      host: 'localhost',
      protocol: 'ws',
      clientPort: 8080
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
