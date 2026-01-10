import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: 'https://dev.server.team9-toy-project.p-e.kr',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  base: '/23-5-team9-web/'
})
