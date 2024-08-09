import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Inspect from 'vite-plugin-inspect'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Inspect()
  ],
  optimizeDeps: {
    // exclude: ['crypto', 'util']
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/users': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    }
  },
  base: 'http://localhost:3000/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        user: 'user.html',
        home: 'home.html',
      }
    }
  },
})
