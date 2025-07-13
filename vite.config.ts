import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

export default defineConfig({
  plugins: [react(), VitePWA()],
  publicDir: 'public',
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    open: true,
  },
});
