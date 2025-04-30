import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite' 
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      // Ensure Vite resolves Firebase imports correctly
      'firebase/app': 'firebase/app',
      'firebase/auth': 'firebase/auth',
      'firebase/firestore': 'firebase/firestore',
    },
  },
  optimizeDeps: {
    include: [
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
    ],
  },
  build: {
    rollupOptions: {
      // Prevent Rollup from externalizing Firebase
      external: [],
    },},
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})

