import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Talks to XAMPP's own Apache (this project lives at htdocs/chanzeywe,
      // and this machine's Apache runs on 8082 because IIS already holds
      // port 80). No separate `php -S` process to remember to start —
      // starting XAMPP is enough. If Apache is reachable at a different
      // port/path on your machine, update the target below to match.
      '/api': {
        target: 'http://localhost:8082/chanzeywe',
        changeOrigin: true,
      },
    },
  },
})
