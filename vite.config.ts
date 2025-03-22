
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { componentTagger } from "lovable-tagger"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
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
    },
    allowedHosts: [
      '2f9b3b4a-cce5-4f23-8845-9ac62943cb08.lovableproject.com',
      'lovable.app',
      '*.lovable.app',
      '*.lovable.dev',
      '*.lovableproject.com'
    ],
  }
}))
