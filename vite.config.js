import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      port: 6500,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, "")
        },
        '/css-api': {
          target: env.VITE_API_CSS_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/css-api/, "")
        }
      }
    }
  }
})
