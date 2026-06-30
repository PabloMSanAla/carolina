import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const adminRedirectPlugin = () => ({
  name: 'admin-redirect',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = req.url.split('?')[0]
      if (url === '/admin' || url === '/admin/' || url === '/carolina/admin' || url === '/carolina/admin/') {
        req.url = '/carolina/admin/index.html'
      }
      next()
    })
  }
})

export default defineConfig({
  plugins: [react(), adminRedirectPlugin()],
  base: '/carolina/',
  build: {
    target: 'es2022',
  },
})

