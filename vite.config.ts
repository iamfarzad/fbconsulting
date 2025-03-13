import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
})
