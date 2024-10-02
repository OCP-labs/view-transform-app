import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 6500,
    proxy: {
      '/cms-api': {
        target: 'https://us.api.opentext.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/cms-api/, "")
      },
      '/css-api': {
        target: 'https://css.us.api.opentext.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/css-api/, "")
      }
    }
  }
})
