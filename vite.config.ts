import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react', 
            'react-dom', 
            'react-router-dom',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            'framer-motion'
          ],
          'forms': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod'
          ],
          'utils': [
            'date-fns',
            'clsx',
            'tailwind-merge'
          ]
        },
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    minify: mode === 'production' ? 'esbuild' : false,
    manifest: true,
    // Оптимизация размера чанков
    chunkSizeWarningLimit: 1000,
    // Улучшение производительности
    target: 'esnext',
    sourcemap: mode === 'development',
    // Оптимизация CSS
    cssCodeSplit: true,
    // Улучшение кэширования
    modulePreload: {
      polyfill: false
    }
  }
}));
