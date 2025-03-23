/// <reference types="vite/client" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // Keep essential environment variables
  envPrefix: ['VITE_', 'AZURE_', 'ELEVENLABS_', 'GOOGLE_'],
  build: {
    sourcemap: true,
    rollupOptions: {
      external: ['google-generativeai'],
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'copilot-vendor': ['@copilotkit/react-core', '@copilotkit/react-textarea']
        }
      }
    }
  }
})
