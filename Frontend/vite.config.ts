import { fileURLToPath, URL } from 'node:url'

import { defineConfig, searchForWorkspaceRoot } from 'vite'
import vue from '@vitejs/plugin-vue'
//import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

const definitionsDirectory = fileURLToPath(new URL('../Backend/Memory/Definitions', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    //vueDevTools(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@definitions': definitionsDirectory,
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd()), definitionsDirectory]
    },
    proxy: {
      '/gamehub': {
        target: 'http://localhost:5000',
        ws: true,
        changeOrigin: true
      }
    }
  }
})
