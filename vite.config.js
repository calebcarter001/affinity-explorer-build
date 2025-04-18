import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enables Fast Refresh
      fastRefresh: true,
    })
  ],
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    open: true,
    watch: {
      usePolling: true,
      interval: 100
    },
    hmr: {
      overlay: true
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
}) 