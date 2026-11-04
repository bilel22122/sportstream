import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api-proxy': {
        target: 'https://api.ppv.st',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy/, '/api'),
        secure: true,
      },
    },
  },
});
