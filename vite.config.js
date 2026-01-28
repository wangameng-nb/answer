import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/answer/',
  server: {
    proxy: {
      '/api/tongyi': {
        target: 'https://dashscope.aliyuncs.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tongyi/, '/api/v1/services/aigc/text-generation/generation')
      }
    }
  }
})
