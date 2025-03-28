/// <reference types="vite/client" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { fileURLToPath, URL } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  envPrefix: ['VITE_', 'AZURE_', 'ELEVENLABS_', 'GOOGLE_'],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: ['google-generativeai', '@chakra-ui/react'],
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
    },
    allowedHosts: [
      'localhost',
      '2f9b3b4a-cce5-4f23-8845-9ac62943cb08.lovableproject.com'
    ]
  }
})
