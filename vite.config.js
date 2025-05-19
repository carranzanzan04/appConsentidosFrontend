import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/MicroServicioLogin': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/MicroServicioCategorias': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/MicroservicioServicios': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/MicroServicioMascotas': {
        target: 'http://localhost:7000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/MicroServicioMascotas/, ''),
      },
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});