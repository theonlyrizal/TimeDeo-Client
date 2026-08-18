import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Client calls /api/*.php; Vite forwards to the PHP built-in server
      // (XAMPP php.exe) on :8000. Keeps calls same-origin (no CORS) in dev.
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
        // Rewrite the Set-Cookie domain so the session cookie sticks to the
        // dev origin (localhost:5173) when proxied to the PHP server.
        cookieDomainRewrite: '',
      },
    },
  },
})
