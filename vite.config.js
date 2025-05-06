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
    },
  },
});