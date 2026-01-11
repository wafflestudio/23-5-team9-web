
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vercel 배포 시에는 보통 '/'를 사용합니다.
  base: '/23-5-team9-web/',
  server: {
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: 'https://dev.server.team9-toy-project.p-e.kr',
        changeOrigin: true,
      },
    },
  },
})
