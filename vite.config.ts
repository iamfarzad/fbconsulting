/// <reference types="vite/client" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
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
  },
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
