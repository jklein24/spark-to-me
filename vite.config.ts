import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/client',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/.well-known/lnurlpubkey': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/.well-known/uma-configuration': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/.well-known/lnurlp': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api/lnurl': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/client'),
    },
  },
}); 