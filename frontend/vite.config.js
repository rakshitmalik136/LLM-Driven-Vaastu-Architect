import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSourceLocator } from '@metagptx/vite-plugin-source-locator'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteSourceLocator({
    prefix: 'mgx'
  }), react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'page-restore-1.preview.emergentagent.com',
      '.emergentagent.com',
      '.preview.emergentagent.com'
    ]
  }
})
