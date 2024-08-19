import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Inspect from 'vite-plugin-inspect'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
    // Inspect()
  ],
  server: {
    proxy: {
      // for api calls
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      // for handling and setting up users 
      '/users': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      // for handling topics that the user has already picked out
      '/wolfTopics': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      // for the user viewing their own profiles
      '/profile': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      // for users creating a new post
      '/newPost': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      
      // for updating the user feed
      '/update': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
      }

    }
  },
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
