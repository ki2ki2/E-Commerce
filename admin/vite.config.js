import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // vite.config.js
  server: {
    port: 4000, // Specify your port here
    host: '0.0.0.0', // Bind to 0.0.0.0 to allow external access
  },
})

