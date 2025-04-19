import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  root: process.cwd(),
  build: {
    outDir: 'dist',
  },
  server: {
    allowedHosts: ['hyttestyring.holter.io'],
  }
});