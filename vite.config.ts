
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // Add env variable prefixes for Vite to expose them
  envPrefix: ['VITE_', 'AZURE_', 'ELEVENLABS_'],
  // Server configuration
  server: {
    port: 8080,
    host: '::',
  }
})
