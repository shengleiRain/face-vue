import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/dev': {
        target: 'http://127.0.0.1:18220', // 需要代理的地址
        changeOrigin: true, // 允许跨域
        rewrite: (path) => path.replace(/^\/dev/, '')
      }
    }
  }
})
