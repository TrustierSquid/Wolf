import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
