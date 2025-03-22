/// <reference types="vite/client" />
import { defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig(({ mode }: UserConfig) => ({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Add env variable prefixes for Vite to expose them
  envPrefix: ['VITE_', 'AZURE_', 'ELEVENLABS_', 'GOOGLE_'],
  // Server configuration
  server: {
    port: 8080,
    host: '::',
    strictPort: true,
    hmr: {
      clientPort: 443,
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'copilot-vendor': ['@copilotkit/react-core', '@copilotkit/react-textarea'],
          'gemini-vendor': ['@google/generative-ai']
        }
      }
    }
  }
}))
