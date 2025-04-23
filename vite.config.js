import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    open: true,
    cors: true,
    hmr: {
      overlay: true,
      clientPort: 3000,
      timeout: 10000
    },
    watch: {
      usePolling: false
    }
  },
  clearScreen: false,
  logLevel: 'info',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
  base: '/',
})