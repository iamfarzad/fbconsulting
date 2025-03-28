
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Use dynamic import for ESM modules in development
const loadTagger = async () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      const { componentTagger } = await import("lovable-tagger");
      return componentTagger();
    } catch (e) {
      console.warn('Failed to load lovable-tagger:', e);
      return null;
    }
  }
  return null;
};

export default defineConfig(async ({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: 'all', // This allows any host to connect, including lovableproject.com
  },
  plugins: [
    react(),
    // Only include tagger in development and only if it loaded successfully
    mode === 'development' && await loadTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Keep essential environment variables
  envPrefix: ['VITE_', 'AZURE_', 'ELEVENLABS_', 'GOOGLE_'],
  build: {
    sourcemap: true,
  }
}));
